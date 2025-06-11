import type { APIRoute } from 'astro';
import type { Locales } from '../../../__generated/sdk';
import { getOptimizelySdk } from '../../graphql/getSdk';
import type { ContentPayload } from '../../graphql/shared/ContentPayload';

interface SearchResult {
    id: string;
    type: 'page' | 'document';
    title: string;
    subtitle?: string;
    image?: string;
    url?: string;
}

export const GET: APIRoute = async ({ url, currentLocale, request }) => {
    try {
        const query = url.searchParams.get('q')?.toLowerCase() || '';
        const useSemanticSearch = url.searchParams.get('semantic') === 'true';
        const semanticWeight = parseFloat(url.searchParams.get('semanticWeight') || '0.3');

        if (!query) {
            return new Response(
                JSON.stringify({ results: [] }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }

        // Get current domain from request headers (same as Layout.astro does)
        const host = url.origin || '';

        // Get graph results
        const contentPayload: ContentPayload = {
            ctx: 'view',
            key: '',
            ver: '',
            loc: currentLocale as Locales || 'en',
            preview_token: '',
            types: [],
        };

        const sdk = getOptimizelySdk(contentPayload);
        let graphResults: SearchResult[] = [];

        try {
            const searchResponse = await sdk.searchContent({
                searchTerm: query,
                locale: [contentPayload.loc as Locales],
                domain: host,
                useSemanticSearch: useSemanticSearch,
                semanticWeight: semanticWeight
            });

            // Transform _Page results (includes experiences since they're also pages)
            const pageData = useSemanticSearch ? searchResponse.semanticPages : searchResponse.regularPages;
            if (pageData?.items) {
                const pageResults = pageData.items
                    .filter(item => item?._metadata)
                    .map(item => {
                        const seoSettings = (item as any)?.SeoSettings;
                        const result = {
                            id: item?._metadata?.key || '',
                            type: 'page' as const,
                            title: item?._metadata?.displayName || (item as any).Heading || 'Untitled Page',
                            subtitle: (item as any)?.SubHeading || seoSettings?.MetaDescription || item?._metadata?.types?.[0] || undefined,
                            url: item?._metadata?.url?.default || item?._metadata?.url?.hierarchical || '#',
                            image: (item as any)?.PromoImage?.url?.default || seoSettings?.SharingImage?.url?.default || undefined
                        };
                        // Remove only optional undefined fields, never remove required fields (id, type, title)
                        if (result.subtitle === undefined) delete result.subtitle;
                        if (result.image === undefined) delete result.image;
                        return result;
                    });
                graphResults.push(...pageResults);
            }
        } catch (error) {
            console.error('Error fetching graph results:', error);
        }

        return new Response(
            JSON.stringify({ results: graphResults }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to perform search' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
} 