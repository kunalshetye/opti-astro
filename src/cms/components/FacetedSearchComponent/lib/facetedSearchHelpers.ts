/**
 * Server-side helper functions for faceted search
 * Shared between the Astro component and API endpoint
 */

/**
 * Sort order mappings for ArticlePage content type
 */
export const articlePageSortOrderMap: Record<string, any> = {
	relevance: { _ranking: 'RELEVANCE' },
	semantic: { _ranking: 'SEMANTIC' },
	date_desc: { _metadata: { published: 'DESC' } },
	date_asc: { _metadata: { published: 'ASC' } },
	title_asc: { Heading: 'ASC' },
	title_desc: { Heading: 'DESC' },
};

/**
 * Sort order mappings for Experience content type (no Heading field)
 */
export const experienceSortOrderMap: Record<string, any> = {
	relevance: { _ranking: 'RELEVANCE' },
	semantic: { _ranking: 'SEMANTIC' },
	date_desc: { _metadata: { published: 'DESC' } },
	date_asc: { _metadata: { published: 'ASC' } },
	title_asc: { _metadata: { displayName: 'ASC' } },
	title_desc: { _metadata: { displayName: 'DESC' } },
};

/**
 * Apply semantic weight to orderBy if enabled
 */
export function applySemanticWeight(
	orderBy: any,
	searchTerm: string | null,
	useSemanticSearch: boolean,
	semanticWeight: number
): any {
	// Only apply semantic weight if enabled, search term exists, and not already using pure semantic
	if (useSemanticSearch && searchTerm && orderBy._ranking !== 'SEMANTIC') {
		return { ...orderBy, _semanticWeight: semanticWeight };
	}
	return orderBy;
}

/**
 * Get sort orderBy objects for both ArticlePage and Experience
 */
export function getSortOrderBy(
	sortOrder: string,
	searchTerm: string | null,
	useSemanticSearch: boolean,
	semanticWeight: number
): { articlePageOrderBy: any; experienceOrderBy: any } {
	const baseArticleOrderBy = articlePageSortOrderMap[sortOrder] || articlePageSortOrderMap['relevance'];
	const baseExperienceOrderBy = experienceSortOrderMap[sortOrder] || experienceSortOrderMap['relevance'];

	return {
		articlePageOrderBy: applySemanticWeight(baseArticleOrderBy, searchTerm, useSemanticSearch, semanticWeight),
		experienceOrderBy: applySemanticWeight(baseExperienceOrderBy, searchTerm, useSemanticSearch, semanticWeight),
	};
}

/**
 * Merge and sort results from ArticlePage and Experience queries
 */
export function mergeAndSortResults(
	articleItems: any[],
	experienceItems: any[],
	sortOrder: string,
	domain: string
): any[] {
	// Add type discriminator
	const articleItemsWithType = articleItems.map((item: any) => ({ ...item, __contentType: 'ArticlePage' }));
	const experienceItemsWithType = experienceItems.map((item: any) => ({ ...item, __contentType: 'Experience' }));

	// Combine items
	let items = [...articleItemsWithType, ...experienceItemsWithType];

	// Client-side sorting for merged results
	if (sortOrder === 'date_desc') {
		items.sort((a, b) => {
			const dateA = new Date(a._metadata?.published || 0).getTime();
			const dateB = new Date(b._metadata?.published || 0).getTime();
			return dateB - dateA;
		});
	} else if (sortOrder === 'date_asc') {
		items.sort((a, b) => {
			const dateA = new Date(a._metadata?.published || 0).getTime();
			const dateB = new Date(b._metadata?.published || 0).getTime();
			return dateA - dateB;
		});
	} else if (sortOrder === 'title_asc') {
		items.sort((a, b) => {
			const titleA = (a.Heading || a._metadata?.displayName || '').toLowerCase();
			const titleB = (b.Heading || b._metadata?.displayName || '').toLowerCase();
			return titleA.localeCompare(titleB);
		});
	} else if (sortOrder === 'title_desc') {
		items.sort((a, b) => {
			const titleA = (a.Heading || a._metadata?.displayName || '').toLowerCase();
			const titleB = (b.Heading || b._metadata?.displayName || '').toLowerCase();
			return titleB.localeCompare(titleA);
		});
	}

	// Pinned Results:
	//// for any results with score 20000+, push to top (for pinned results/best bets)
	//// filter out any pinned results for different domain
	const pinned = items
		.filter(item => item._score >= 20000 && item._metadata?.url?.base === domain)
		.sort((a, b) => b._score - a._score);

	const rest = items.filter(item => item._score < 20000);
	items = [...pinned, ...rest];

	return items;
}

/**
 * Merge facets from ArticlePage and Experience queries
 */
export function mergeFacets(
	articleFacets: any,
	experienceFacets: any
): {
	authors: Array<{ name: string; count: number }>;
	types: Array<{ name: string; count: number }>;
} {
	// Process author facets (only from ArticlePage)
	const authorFacets = articleFacets?.Author?.filter((f: any) => f?.name) || [];

	// Merge type facets from both queries
	const articleTypeFacets = articleFacets?._metadata?.types?.filter((f: any) => f?.name) || [];
	const experienceTypeFacets = experienceFacets?._metadata?.types?.filter((f: any) => f?.name) || [];

	// Combine type facets and merge counts for duplicate types
	const typeFacetsMap = new Map<string, number>();
	[...articleTypeFacets, ...experienceTypeFacets].forEach((f: any) => {
		if (f?.name) {
			typeFacetsMap.set(f.name, (typeFacetsMap.get(f.name) || 0) + (f.count || 0));
		}
	});

	const typeFacets = Array.from(typeFacetsMap.entries()).map(([name, count]) => ({ name, count }));

	return {
		authors: authorFacets.map((f: any) => ({ name: f.name, count: f.count })),
		types: typeFacets,
	};
}
