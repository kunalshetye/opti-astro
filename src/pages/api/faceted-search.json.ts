import type { APIRoute } from 'astro';
import type { Locales } from '../../../__generated/sdk';
import { getOptimizelySdk } from '../../graphql/getSdk';
import type { ContentPayload } from '../../graphql/shared/ContentPayload';
import { localeToSdkLocale } from '../../lib/locale-helpers';
import { getSortOrderBy, mergeAndSortResults, mergeFacets } from '../../cms/components/FacetedSearchComponent/lib/facetedSearchHelpers';

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

		// Build orderBy with optional semantic weight using shared helper
		const { articlePageOrderBy: orderBy, experienceOrderBy: orderByExperience } = getSortOrderBy(
			sortOrder,
			searchTerm,
			useSemanticSearch,
			semanticWeight
		);

		// Create content payload
		const contentPayload: ContentPayload = {
			ctx: 'view',
			key: '',
			ver: '',
			loc: localeToSdkLocale(locale) as Locales,
			preview_token: '',
			types: [],
		};

		// Fetch results from GraphQL with a buffer to account for merging
		// We fetch 3x the limit from each query to ensure we have enough results after merging
		const fetchLimit = Math.max(limit * 3, 60);
		const sdk = getOptimizelySdk(contentPayload);
		const searchResults = await sdk.facetedSearch({
			searchTerm: searchTerm,
			locale: [contentPayload.loc as Locales],
			domain: domain,
			limit: fetchLimit,
			offset: 0, // Always fetch from start, we'll slice after merging
			orderBy: orderBy,
			orderByExperience: orderByExperience,
			authorFilters: authorFilters.length > 0 ? authorFilters : null,
			typeFilters: typeFilters.length > 0 ? typeFilters : null,
		});

		// Extract data
		const articleItems = searchResults.ArticlePage?.items || [];
		const articleTotal = searchResults.ArticlePage?.total || 0;
		const articleFacets = searchResults.ArticlePage?.facets;

		// If author filters are applied, skip Experience results (no authors on Experiences)
		const experienceItems = authorFilters.length > 0 ? [] : searchResults._Experience?.items || [];
		const experienceTotal = authorFilters.length > 0 ? 0 : searchResults._Experience?.total || 0;
		const experienceFacets = searchResults._Experience?.facets;

		// Merge and sort ALL results using shared helper
		const allMergedItems = mergeAndSortResults(articleItems, experienceItems, sortOrder, domain);

		// Apply pagination to merged results
		const items = allMergedItems.slice(offset, offset + limit);

		// Combine totals - this represents the total number of items available across both types
		const total = articleTotal + experienceTotal;

		// Merge facets using shared helper
		const facets = mergeFacets(articleFacets, experienceFacets);

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
