/**
 * Shared Sitemap Endpoint Handler
 *
 * This function is used by both /sitemap.xml and /[locale]/sitemap.xml
 * to avoid code duplication.
 */

import type { APIContext } from 'astro';
import type { Locales } from '../../__generated/sdk';
import { getOptimizelySdk } from '../graphql/getSdk';
import { localeToSdkLocale } from './locale-helpers';
import { fetchPagesForSitemap, generateSitemapXml } from './sitemap-helpers';

export async function handleSitemapRequest(context: APIContext): Promise<Response> {
    const { url, currentLocale, params } = context;

    try {
        // Get locale from context or params (for [locale] route)
        const locale = currentLocale || params?.locale || 'en';
        const sdkLocale = localeToSdkLocale(locale) as Locales;

        // Get domain from environment or request
        const domain = import.meta.env.SITEMAP_BASE_URL || url.origin;

        // Fetch all pages from GraphQL with pagination
        // Filter by domain to only include pages for this domain
        const pages = await fetchPagesForSitemap(
            getOptimizelySdk,
            sdkLocale,
            domain // Filter by domain
        );

        // Generate sitemap XML
        const xml = generateSitemapXml(pages, domain);

        // Return XML response with caching headers
        // CDN and browsers will handle caching
        return new Response(xml, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                // Cache for 1 hour in browser and CDN
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
                // Optionally add stale-while-revalidate for better UX
                // 'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            }
        });
    } catch (error) {
        console.error('Error generating sitemap:', error);

        // Return error response
        return new Response(
            `<?xml version="1.0" encoding="UTF-8"?>
<error>Unable to generate sitemap</error>`,
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8'
                }
            }
        );
    }
}
