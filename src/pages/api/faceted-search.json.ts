import type { APIRoute } from 'astro';
import type { Locales } from '../../../__generated/sdk';
import { getOptimizelySdk } from '../../graphql/getSdk';
import type { ContentPayload } from '../../graphql/shared/ContentPayload';
import { localeToSdkLocale } from '../../lib/locale-helpers';

export const GET: APIRoute = async ({ url }) => {
	try {
		// Parse query parameters
		const searchTerm = url.searchParams.get('q') || null;
		const locale = url.searchParams.get('locale') || 'en';
		const domain = url.searchParams.get('domain') || url.origin;
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const sortOrder = url.searchParams.get('sort') || 'relevance';
		const useSemanticSearch = url.searchParams.get('useSemanticSearch') === 'true';
		// SemanticWeight is already converted to decimal (0.0-1.0) from percentage by client
		const semanticWeight = parseFloat(url.searchParams.get('semanticWeight') || '0.3');

		// Parse array parameters
		const authorFilters = url.searchParams.getAll('authors[]');
		const typeFilters = url.searchParams.getAll('types[]');

		// Map sort order to GraphQL orderBy
		const baseSortOrderMap: Record<string, any> = {
			'relevance': { _ranking: 'RELEVANCE' },
			'semantic': { _ranking: 'SEMANTIC' },
			'date_desc': { _metadata: { published: 'DESC' } },
			'date_asc': { _metadata: { published: 'ASC' } },
			'title_asc': { Heading: 'ASC' },
			'title_desc': { Heading: 'DESC' }
		};

		// Build orderBy with optional semantic weight
		let orderBy = baseSortOrderMap[sortOrder] || baseSortOrderMap['relevance'];

		// Apply semantic weight if enabled, search term exists, and not already using pure semantic
		if (useSemanticSearch && searchTerm && orderBy._ranking !== 'SEMANTIC') {
			orderBy = { ...orderBy, _semanticWeight: semanticWeight };
		}

		// Create content payload
		const contentPayload: ContentPayload = {
			ctx: 'view',
			key: '',
			ver: '',
			loc: localeToSdkLocale(locale) as Locales,
			preview_token: '',
			types: [],
		};

		// Fetch results from GraphQL
		const sdk = getOptimizelySdk(contentPayload);
		const searchResults = await sdk.facetedSearch({
			searchTerm: searchTerm,
			locale: [contentPayload.loc as Locales],
			domain: domain,
			limit: limit,
			offset: offset,
			orderBy: orderBy,
			authorFilters: authorFilters.length > 0 ? authorFilters : null,
			typeFilters: typeFilters.length > 0 ? typeFilters : null,
		});

		// Extract data
		const items = searchResults.ArticlePage?.items || [];
		const total = searchResults.ArticlePage?.total || 0;
		const facetsData = searchResults.ArticlePage?.facets;

		// Process facets
		const authorFacets = facetsData?.Author?.filter((f: any) => f?.name) || [];
		const typeFacets = facetsData?._metadata?.types?.filter((f: any) => f?.name) || [];

		const facets = {
			authors: authorFacets.map((f: any) => ({ name: f.name, count: f.count })),
			types: typeFacets.map((f: any) => ({ name: f.name, count: f.count })),
		};

		return new Response(
			JSON.stringify({
				items,
				total,
				facets,
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'public, max-age=60, s-maxage=60',
				}
			}
		);
	} catch (error) {
		console.error('Faceted search API error:', error);
		return new Response(
			JSON.stringify({
				error: 'Failed to perform faceted search',
				details: error instanceof Error ? error.message : 'Unknown error'
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
};
