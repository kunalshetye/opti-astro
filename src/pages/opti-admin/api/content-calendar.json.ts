import type { APIRoute } from 'astro';

export const prerender = false;

export interface CalendarPage {
  key: string;
  version: string;
  displayName: string;
  url: string;
  baseUrl: string;
  locale: string;
  date: string | null;
}

export interface ContentCalendarResponse {
  success: boolean;
  scheduled: CalendarPage[];
  expiring: CalendarPage[];
  expiryScannedPages: number;
  expiryCapped: boolean;
  error?: string;
}

const QUERY_SCHEDULED = `
  query GetScheduledPages($skip: Int) {
    _Page(
      where: { _metadata: { status: { eq: "Scheduled" } } }
      limit: 100
      skip: $skip
    ) {
      total
      items {
        _metadata {
          displayName
          key
          locale
          published
          version
          url {
            base
            default
          }
        }
      }
    }
  }
`;

const QUERY_EXPIRING = `
  query GetExpiringPages($skip: Int) {
    _Page(limit: 100, skip: $skip, orderBy: { _metadata: { lastModified: DESC } }) {
      total
      items {
        _metadata {
          displayName
          key
          locale
          url {
            base
            default
          }
          version
          ... on InstanceMetadata {
            expired
          }
        }
      }
    }
  }
`;

async function graphqlFetch(
  gateway: string,
  authHeader: string,
  query: string,
  variables?: Record<string, unknown>
) {
  const response = await fetch(`${gateway}/content/v2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText} — ${body}`);
  }

  return response.json();
}

export const GET: APIRoute = async () => {
  try {
    const gateway = import.meta.env.OPTIMIZELY_GRAPH_GATEWAY;
    const appKey = import.meta.env.OPTIMIZELY_GRAPH_APP_KEY;
    const secret = import.meta.env.OPTIMIZELY_GRAPH_SECRET;

    if (!gateway || !appKey || !secret) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing Optimizely Graph configuration' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = `Basic ${btoa(`${appKey}:${secret}`)}`;
    const now = new Date().toISOString();

    // --- Scheduled to publish ---
    const scheduled: CalendarPage[] = [];
    const scheduledSeen = new Set<string>();

    function collectScheduledItems(items: any[]) {
      for (const item of items) {
        const meta = item._metadata;
        const key: string = meta?.key ?? '';
        const version: string = meta?.version ?? '';
        const locale: string = meta?.locale ?? '';
        if (!key) continue;
        const id = `${key}__${locale}__${version}`;
        if (scheduledSeen.has(id)) continue;
        scheduledSeen.add(id);
        const publishedDate: string | null = meta?.published ?? null;
        scheduled.push({
          key,
          version,
          displayName: meta?.displayName ?? 'Untitled',
          url: meta?.url?.default ?? '',
          baseUrl: meta?.url?.base ?? '',
          locale,
          date: publishedDate && publishedDate > now ? publishedDate : null,
        });
      }
    }

    const firstScheduledResult = await graphqlFetch(gateway, authHeader, QUERY_SCHEDULED, { skip: 0 });
    if (firstScheduledResult.errors) {
      throw new Error(firstScheduledResult.errors[0]?.message ?? 'GraphQL query failed for scheduled pages');
    }
    const scheduledTotal: number = firstScheduledResult.data?._Page?.total ?? 0;
    collectScheduledItems(firstScheduledResult.data?._Page?.items ?? []);

    for (let skip = 100; skip < scheduledTotal; skip += 100) {
      const result = await graphqlFetch(gateway, authHeader, QUERY_SCHEDULED, { skip });
      if (result.errors) {
        throw new Error(result.errors[0]?.message ?? 'GraphQL query failed for scheduled pages');
      }
      collectScheduledItems(result.data?._Page?.items ?? []);
    }

    scheduled.sort((a, b) => {
      if (!a.date && !b.date) return a.displayName.localeCompare(b.displayName);
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });

    // --- Scheduled to expire ---
    const expiring: CalendarPage[] = [];
    const expiringSeen = new Set<string>();
    const MAX_SCAN = 1000;
    let expiryCapped = false;

    function collectExpiringItems(items: any[]) {
      for (const item of items) {
        const meta = item._metadata;
        const expired: string | null = meta?.expired ?? null;
        if (expired && expired > now) {
          const key: string = meta?.key ?? '';
          const locale: string = meta?.locale ?? '';
          const id = `${key}__${locale}`;
          if (key && !expiringSeen.has(id)) {
            expiringSeen.add(id);
            expiring.push({
              key,
              version: meta?.version ?? '',
              displayName: meta?.displayName ?? 'Untitled',
              url: meta?.url?.default ?? '',
              baseUrl: meta?.url?.base ?? '',
              locale,
              date: expired,
            });
          }
        }
      }
    }

    // First fetch to get total count
    const firstExpiryResult = await graphqlFetch(gateway, authHeader, QUERY_EXPIRING, { skip: 0 });
    if (firstExpiryResult.errors) {
      throw new Error(firstExpiryResult.errors[0]?.message ?? 'GraphQL query failed for expiring pages');
    }
    const expiryTotal: number = firstExpiryResult.data?._Page?.total ?? 0;
    const toScan = Math.min(expiryTotal, MAX_SCAN);
    collectExpiringItems(firstExpiryResult.data?._Page?.items ?? []);

    if (expiryTotal > MAX_SCAN) expiryCapped = true;

    // Remaining batches
    for (let skip = 100; skip < toScan; skip += 100) {
      const result = await graphqlFetch(gateway, authHeader, QUERY_EXPIRING, { skip });
      if (result.errors) {
        throw new Error(result.errors[0]?.message ?? 'GraphQL query failed for expiring pages');
      }
      collectExpiringItems(result.data?._Page?.items ?? []);
    }

    const scannedCount = toScan;

    expiring.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));

    return new Response(
      JSON.stringify({
        success: true,
        scheduled,
        expiring,
        expiryScannedPages: scannedCount,
        expiryCapped,
      } satisfies ContentCalendarResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in content-calendar API:', error);
    return new Response(
      JSON.stringify({
        success: false,
        scheduled: [],
        expiring: [],
        expiryScannedPages: 0,
        expiryCapped: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } satisfies ContentCalendarResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
