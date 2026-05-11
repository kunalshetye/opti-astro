import type { APIRoute } from 'astro';

export const prerender = false;

const CMS_REST_API = 'https://api.cms.optimizely.com';
const TOKEN_URL = `${CMS_REST_API}/oauth/token`;

// Server-side token cache — persists for the lifetime of the Node process
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getOAuthToken(clientId: string, clientSecret: string): Promise<string> {
  const now = Date.now();

  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.token;
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OAuth token request failed: ${response.status} ${response.statusText} — ${body}`);
  }

  const data = await response.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return tokenCache.token;
}

function findPreviewUrl(response: any, baseUrl: string | null): string | null {
  const items: any[] = Array.isArray(response) ? response : (response?.items ?? []);
  if (items.length === 0) return null;

  const withUrl = items.filter((p) => p.url);

  if (baseUrl) {
    const normalizedBase = baseUrl.replace(/\/$/, '');
    const match = withUrl.find((p) => {
      try {
        return new URL(p.url).origin === normalizedBase;
      } catch {
        return p.url.startsWith(normalizedBase);
      }
    });
    if (match) return match.url;
  }

  // Fallback: first item that has a URL
  return withUrl[0]?.url ?? null;
}

export const GET: APIRoute = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const key = params.get('key');
  const version = params.get('version');
  const baseUrl = params.get('baseUrl');

  if (!key || !version) {
    return new Response(
      JSON.stringify({ success: false, error: 'key and version parameters are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const clientId = import.meta.env.OPTIMIZELY_CLIENT_ID;
    const clientSecret = import.meta.env.OPTIMIZELY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing CMS API credentials' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = await getOAuthToken(clientId, clientSecret);

    const previewEndpoint = `${CMS_REST_API}/v1/content/${encodeURIComponent(key)}/versions/${encodeURIComponent(version)}/previews`;
    const previewResponse = await fetch(previewEndpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!previewResponse.ok) {
      const body = await previewResponse.text();
      throw new Error(`Preview API failed: ${previewResponse.status} ${previewResponse.statusText} — ${body}`);
    }

    const previews = await previewResponse.json();
    const previewUrl = findPreviewUrl(previews, baseUrl);

    if (!previewUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'No preview URL found for this content' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true, previewUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in content-preview API:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
