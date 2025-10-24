<script lang="ts">
	import { onMount } from 'svelte';
	import queryString from 'query-string';

	// Props
	interface Props {
		initialResults: any[];
		initialFacets: {
			authors: Array<{ name: string; count: number }>;
			types: Array<{ name: string; count: number }>;
		};
		initialTotal: number;
		config: {
			resultsPerPage: number;
			defaultSortOrder: string;
			showSearchInput: boolean;
			showAuthorFacet: boolean;
			showTypeFacet: boolean;
			searchPlaceholder?: string;
			noResultsMessage?: string;
			locale: string;
			domain: string;
			useSemanticSearch: boolean;
			semanticWeight: number;
		};
		baseUrl: string;
		isEditMode?: boolean;
	}

	let {
		initialResults,
		initialFacets,
		initialTotal,
		config,
		baseUrl,
		isEditMode = false
	}: Props = $props();

	// State
	let results = $state(initialResults);
	let facets = $state(initialFacets);
	let total = $state(initialTotal);
	let searchTerm = $state('');
	let selectedAuthors = $state<string[]>([]);
	let selectedTypes = $state<string[]>([]);
	let sortOrder = $state(config.defaultSortOrder || 'relevance');
	let currentPage = $state(1);
	let isLoading = $state(false);
	let searchTimeout: number | null = $state(null);
	let expandedFacets = $state({
		authors: true,
		types: true
	});

	// Derived values
	let activeFilterCount = $derived(
		selectedAuthors.length + selectedTypes.length + (searchTerm ? 1 : 0)
	);
	let totalPages = $derived(Math.ceil(total / config.resultsPerPage));
	let offset = $derived((currentPage - 1) * config.resultsPerPage);

	// Sort options
	const sortOptions = [
		{ value: 'relevance', label: 'Relevance' },
		{ value: 'semantic', label: 'Semantic (AI-powered)' },
		{ value: 'date_desc', label: 'Newest First' },
		{ value: 'date_asc', label: 'Oldest First' },
		{ value: 'title_asc', label: 'Title A-Z' },
		{ value: 'title_desc', label: 'Title Z-A' }
	];

	// Read URL parameters on mount
	onMount(() => {
		// Skip in edit mode - just show initial results
		if (isEditMode) return;

		const params = queryString.parse(window.location.search);

		if (params.q && typeof params.q === 'string') {
			searchTerm = params.q;
		}
		if (params.authors) {
			selectedAuthors = Array.isArray(params.authors) ? params.authors : [params.authors];
		}
		if (params.types) {
			selectedTypes = Array.isArray(params.types) ? params.types : [params.types];
		}
		if (params.sort && typeof params.sort === 'string') {
			sortOrder = params.sort;
		}
		if (params.page && typeof params.page === 'string') {
			currentPage = parseInt(params.page) || 1;
		}

		// If we have URL params, fetch results
		if (activeFilterCount > 0 || currentPage > 1 || sortOrder !== config.defaultSortOrder) {
			fetchResults();
		}
	});

	// Update URL when filters change
	$effect(() => {
		// Skip in edit mode
		if (isEditMode) return;
		if (typeof window === 'undefined') return;

		const params: any = {};

		if (searchTerm) params.q = searchTerm;
		if (selectedAuthors.length > 0) params.authors = selectedAuthors;
		if (selectedTypes.length > 0) params.types = selectedTypes;
		if (sortOrder !== config.defaultSortOrder) params.sort = sortOrder;
		if (currentPage > 1) params.page = currentPage;

		const query = queryString.stringify(params, { arrayFormat: 'bracket' });
		const newUrl = query ? `${baseUrl}?${query}` : baseUrl;

		window.history.pushState({}, '', newUrl);
	});

	// Debounced search
	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;

		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		searchTimeout = window.setTimeout(() => {
			currentPage = 1;
			fetchResults();
		}, 500);
	}

	// Toggle facet selection
	function toggleFacet(type: 'author' | 'type', value: string) {
		if (type === 'author') {
			if (selectedAuthors.includes(value)) {
				selectedAuthors = selectedAuthors.filter(a => a !== value);
			} else {
				selectedAuthors = [...selectedAuthors, value];
			}
		} else {
			if (selectedTypes.includes(value)) {
				selectedTypes = selectedTypes.filter(t => t !== value);
			} else {
				selectedTypes = [...selectedTypes, value];
			}
		}
		currentPage = 1;
		fetchResults();
	}

	// Remove single filter
	function removeFilter(type: 'author' | 'type' | 'search', value?: string) {
		if (type === 'search') {
			searchTerm = '';
		} else if (type === 'author' && value) {
			selectedAuthors = selectedAuthors.filter(a => a !== value);
		} else if (type === 'type' && value) {
			selectedTypes = selectedTypes.filter(t => t !== value);
		}
		currentPage = 1;
		fetchResults();
	}

	// Clear all filters
	function clearAllFilters() {
		searchTerm = '';
		selectedAuthors = [];
		selectedTypes = [];
		currentPage = 1;
		sortOrder = config.defaultSortOrder;
		fetchResults();
	}

	// Change sort order
	function handleSortChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		sortOrder = target.value;
		currentPage = 1;
		fetchResults();
	}

	// Change page
	function goToPage(page: number) {
		if (page < 1 || page > totalPages) return;
		currentPage = page;
		fetchResults();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Toggle facet expansion
	function toggleFacetExpansion(facetName: 'authors' | 'types') {
		expandedFacets[facetName] = !expandedFacets[facetName];
	}

	// Fetch results from API
	async function fetchResults() {
		isLoading = true;

		try {
			// Build query parameters
			const params = new URLSearchParams({
				locale: config.locale,
				domain: config.domain,
				limit: config.resultsPerPage.toString(),
				offset: offset.toString(),
				sort: sortOrder,
				useSemanticSearch: config.useSemanticSearch.toString(),
				semanticWeight: config.semanticWeight.toString()
			});

			// Add search term if present
			if (searchTerm) {
				params.append('q', searchTerm);
			}

			// Add author filters
			selectedAuthors.forEach(author => {
				params.append('authors[]', author);
			});

			// Add type filters
			selectedTypes.forEach(type => {
				params.append('types[]', type);
			});

			// Fetch from API
			const response = await fetch(`/api/faceted-search.json?${params.toString()}`);

			if (!response.ok) {
				throw new Error(`API request failed: ${response.status}`);
			}

			const data = await response.json();

			// Update state with new results
			results = data.items || [];
			facets = data.facets || { authors: [], types: [] };
			total = data.total || 0;

		} catch (error) {
			console.error('Error fetching results:', error);
			// Keep existing results on error
		} finally {
			isLoading = false;
		}
	}

	// Format date
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString(config.locale, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Truncate HTML content
	function getExcerpt(html: string, maxLength: number = 200): string {
		const text = html?.replace(/<[^>]*>/g, '') || '';
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	}
</script>

<div class="faceted-search-container">
	<div class="grid lg:grid-cols-4 gap-6">
		<!-- Sidebar with Facets -->
		<aside class="lg:col-span-1">
			<div class="sticky top-4">
				<div class="bg-base-100 rounded-lg shadow-md p-4">
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-semibold text-lg">Filters</h3>
						{#if activeFilterCount > 0}
							<button
								class="btn btn-sm btn-ghost"
								onclick={clearAllFilters}
								disabled={isEditMode}
							>
								Clear all
							</button>
						{/if}
					</div>

					<!-- Active Filters -->
					{#if activeFilterCount > 0}
						<div class="mb-4 pb-4 border-b border-base-300">
							<p class="text-sm text-base-content/70 mb-2">
								Active filters ({activeFilterCount})
							</p>
							<div class="flex flex-wrap gap-2">
								{#if searchTerm}
									<button
										class="badge badge-primary gap-2"
										onclick={() => removeFilter('search')}
										disabled={isEditMode}
									>
										{searchTerm}
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								{/if}
								{#each selectedAuthors as author}
									<button
										class="badge badge-secondary gap-2"
										onclick={() => removeFilter('author', author)}
										disabled={isEditMode}
									>
										{author}
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								{/each}
								{#each selectedTypes as type}
									<button
										class="badge badge-accent gap-2"
										onclick={() => removeFilter('type', type)}
										disabled={isEditMode}
									>
										{type}
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Author Facet -->
					{#if config.showAuthorFacet && facets.authors.length > 0}
						<div class="mb-4">
							<button
								class="flex items-center justify-between w-full text-left font-medium mb-2"
								onclick={() => toggleFacetExpansion('authors')}
							>
								<span>Author</span>
								<svg
									class="w-4 h-4 transition-transform"
									class:rotate-180={!expandedFacets.authors}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>
							{#if expandedFacets.authors}
								<div class="space-y-2">
									{#each facets.authors as author}
										<label class="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded">
											<input
												type="checkbox"
												class="checkbox checkbox-sm"
												checked={selectedAuthors.includes(author.name)}
												onchange={() => toggleFacet('author', author.name)}
												disabled={isEditMode}
											/>
											<span class="flex-1 text-sm">{author.name}</span>
											<span class="text-xs text-base-content/50">({author.count})</span>
										</label>
									{/each}
								</div>
							{/if}
						</div>
					{/if}

					<!-- Content Type Facet -->
					{#if config.showTypeFacet && facets.types.length > 0}
						<div class="mb-4">
							<button
								class="flex items-center justify-between w-full text-left font-medium mb-2"
								onclick={() => toggleFacetExpansion('types')}
							>
								<span>Content Type</span>
								<svg
									class="w-4 h-4 transition-transform"
									class:rotate-180={!expandedFacets.types}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>
							{#if expandedFacets.types}
								<div class="space-y-2">
									{#each facets.types as type}
										<label class="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded">
											<input
												type="checkbox"
												class="checkbox checkbox-sm"
												checked={selectedTypes.includes(type.name)}
												onchange={() => toggleFacet('type', type.name)}
												disabled={isEditMode}
											/>
											<span class="flex-1 text-sm">{type.name}</span>
											<span class="text-xs text-base-content/50">({type.count})</span>
										</label>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</aside>

		<!-- Main Content Area -->
		<main class="lg:col-span-3">
			<!-- Search Bar and Controls -->
			<div class="bg-base-100 rounded-lg shadow-md p-4 mb-6">
				<div class="flex flex-col md:flex-row gap-4">
					{#if config.showSearchInput}
						<div class="flex-1">
							<input
								type="text"
								class="input input-bordered w-full"
								placeholder={config.searchPlaceholder || 'Search...'}
								value={searchTerm}
								oninput={handleSearchInput}
								disabled={isEditMode}
							/>
						</div>
					{/if}
					<div class="flex items-center gap-4">
						<select
							class="select select-bordered"
							value={sortOrder}
							onchange={handleSortChange}
							disabled={isEditMode}
						>
							{#each sortOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>

			<!-- Results Count -->
			<div class="mb-4">
				<p class="text-sm text-base-content/70">
					{#if isLoading}
						Loading...
					{:else}
						Showing {total > 0 ? offset + 1 : 0}–{Math.min(offset + config.resultsPerPage, total)} of {total} results
					{/if}
				</p>
			</div>

			<!-- Loading State -->
			{#if isLoading}
				<div class="flex justify-center items-center py-12">
					<span class="loading loading-spinner loading-lg"></span>
				</div>
			{/if}

			<!-- Results -->
			{#if !isLoading && results.length > 0}
				<div class="space-y-6">
					{#each results as result}
						<article class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
							<div class="card-body">
								<h2 class="card-title">
									<a href={result._metadata.url.hierarchical} class="hover:text-primary">
										{result.Heading || result._metadata.displayName}
									</a>
								</h2>
								{#if result.SubHeading}
									<p class="text-base-content/70">{result.SubHeading}</p>
								{/if}
								<div class="flex items-center gap-4 text-sm text-base-content/60">
									{#if result.Author}
										<span>By {result.Author}</span>
									{/if}
									{#if result._metadata.published}
										<span>{formatDate(result._metadata.published)}</span>
									{/if}
								</div>
								{#if result.Body?.html}
									<p class="text-sm">{getExcerpt(result.Body.html)}</p>
								{/if}
								<div class="card-actions justify-end">
									<a href={result._metadata.url.hierarchical} class="btn btn-primary btn-sm">
										Read more
									</a>
								</div>
							</div>
						</article>
					{/each}
				</div>

				<!-- Pagination -->
				{#if totalPages > 1}
					<div class="flex justify-center mt-8">
						<div class="join">
							<button
								class="join-item btn"
								disabled={currentPage === 1 || isEditMode}
								onclick={() => goToPage(currentPage - 1)}
							>
								«
							</button>
							{#each Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
								if (totalPages <= 7) return i + 1;
								if (currentPage <= 4) return i + 1;
								if (currentPage >= totalPages - 3) return totalPages - 6 + i;
								return currentPage - 3 + i;
							}) as page}
								<button
									class="join-item btn"
									class:btn-active={page === currentPage}
									onclick={() => goToPage(page)}
									disabled={isEditMode}
								>
									{page}
								</button>
							{/each}
							<button
								class="join-item btn"
								disabled={currentPage === totalPages || isEditMode}
								onclick={() => goToPage(currentPage + 1)}
							>
								»
							</button>
						</div>
					</div>
				{/if}
			{/if}

			<!-- No Results -->
			{#if !isLoading && results.length === 0}
				<div class="text-center py-12">
					<svg class="w-16 h-16 mx-auto text-base-content/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<p class="text-lg text-base-content/70">
						{config.noResultsMessage || 'No results found'}
					</p>
					{#if activeFilterCount > 0}
						<button class="btn btn-primary mt-4" onclick={clearAllFilters} disabled={isEditMode}>
							Clear all filters
						</button>
					{/if}
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	.faceted-search-container {
		container-type: inline-size;
	}
</style>
