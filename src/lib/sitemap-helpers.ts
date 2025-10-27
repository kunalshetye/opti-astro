/**
 * Sitemap Helper Utilities
 *
 * Functions for fetching pages from GraphQL and generating sitemap XML.
 */

import type { Locales } from '../../__generated/sdk';
import type { ContentPayload } from '../graphql/shared/ContentPayload';

export interface SitemapPage {
    url: string;
    lastModified?: string;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
    pageType: string;
}

/**
 * Fetch all pages and experiences for sitemap from GraphQL
 */
export async function fetchPagesForSitemap(
    getOptimizelySdk: (payload: ContentPayload) => any,
    locale: Locales,
    domain?: string
): Promise<SitemapPage[]> {
    const contentPayload: ContentPayload = {
        key: '',
        loc: locale,
        ver: '',
        ctx: 'view',
        preview_token: '',
        types: []
    };

    const sdk = getOptimizelySdk(contentPayload);

    const pages: SitemapPage[] = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;
    const pageSize = 100; // Fetch 100 pages at a time

    // Paginate through all pages using cursor-based pagination
    while (hasMore) {
        // Fetch all pages and experiences via _Page query
        // Note: site filter is optional - if undefined, returns pages from all domains
        const response: any = await sdk.getAllPagesForSitemap({
            loc: [locale],
            site: domain || undefined,
            status: 'Published',
            limit: pageSize,
            cursor: cursor
        });

        // Process all pages (includes ArticlePage, LandingPage, BlankExperience, MockupPage, etc.)
        if (response._Page?.items) {
            for (const item of response._Page.items) {
                // Skip if no URL
                if (!item._metadata?.url?.default) {
                    continue;
                }

                // Check if page should be excluded from indexing
                // Indexing field = true means NOINDEX (exclude from sitemap)
                // isNoIndex = true means the page should NOT be indexed
                const isNoIndex = !!item.SeoSettings?.Indexing;

                // Skip pages with Indexing = true (noindex)
                if (isNoIndex) {
                    continue;
                }

                // Determine page type from types array
                const pageType = getPageType(item._metadata.types);

                pages.push({
                    url: item._metadata.url.default,
                    lastModified: item._metadata.lastModified || item._metadata.published,
                    changeFrequency: getChangeFrequency(pageType),
                    priority: getPagePriority(pageType),
                    pageType
                });
            }
        }

        // Check if there are more pages to fetch
        cursor = response._Page?.cursor;
        hasMore = !!cursor && (response._Page?.items?.length || 0) >= pageSize;
    }

    return pages;
}

/**
 * Extract the primary page type from types array
 */
function getPageType(types?: string[]): string {
    if (!types || types.length === 0) {
        return 'Page';
    }

    // Assumption: Interface types start with 'I' (e.g., 'IPageData').
    // This is a naming convention and may not always hold.
    // For a more robust solution, maintain a list of known interface types or use metadata if available.
    const concreteTypes = types.filter(
        type => !type.startsWith('_') && !isInterfaceType(type)
    );

    return concreteTypes[0] || types[0] || 'Page';
}

/**
 * Returns true if the type name is considered an interface type.
 * Assumes interface types start with 'I' (e.g., 'IPageData').
 * Update this function if your codebase uses a different convention.
 */
function isInterfaceType(type: string): boolean {
    return type.startsWith('I');
}

/**
 * Get priority value based on page type
 * Landing pages and experiences have higher priority than article pages
 */
export function getPagePriority(pageType: string): number {
    const priorityMap: Record<string, number> = {
        LandingPage: 0.8,
        BlankExperience: 0.8,
        ArticlePage: 0.6,
        MockupPage: 0.4,
        FolderPage: 0.3
    };

    return priorityMap[pageType] || 0.5;
}

/**
 * Get change frequency based on page type
 * Articles change more frequently than landing pages
 */
export function getChangeFrequency(
    pageType: string
): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
    const frequencyMap: Record<string, SitemapPage['changeFrequency']> = {
        ArticlePage: 'weekly',
        LandingPage: 'monthly',
        BlankExperience: 'monthly',
        MockupPage: 'yearly',
        FolderPage: 'yearly'
    };

    return frequencyMap[pageType] || 'monthly';
}

/**
 * Generate sitemap XML from pages
 */
export function generateSitemapXml(pages: SitemapPage[], domain: string): string {
    // Ensure domain doesn't end with slash
    const baseDomain = domain.replace(/\/$/, '');

    const urlEntries = pages
        .map(page => {
            // Ensure URL starts with slash
            const url = page.url.startsWith('/') ? page.url : `/${page.url}`;

            // Format last modified date to W3C Datetime format (ISO 8601)
            const lastmod = page.lastModified
                ? new Date(page.lastModified).toISOString()
                : '';

            return `  <url>
    <loc>${escapeXml(baseDomain + url)}</loc>${
                lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
            }
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Escape special XML characters
 */
function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
