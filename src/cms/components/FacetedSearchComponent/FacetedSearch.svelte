<script lang="ts">
	import { onMount } from 'svelte';
	import queryString from 'query-string';
	import FacetedSearchSidebar from './FacetedSearchSidebar.svelte';
	import FacetedSearchControls from './FacetedSearchControls.svelte';
	import SearchResultCard from './SearchResultCard.svelte';
	import SearchPagination from './SearchPagination.svelte';

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

	// Derived values
	let activeFilterCount = $derived(
		selectedAuthors.length + selectedTypes.length + (searchTerm ? 1 : 0)
	);
	let totalPages = $derived(Math.ceil(total / config.resultsPerPage));
	let offset = $derived((currentPage - 1) * config.resultsPerPage);

	// Read URL parameters on mount
	onMount(() => {
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

		if (activeFilterCount > 0 || currentPage > 1 || sortOrder !== config.defaultSortOrder) {
			fetchResults();
		}
	});

	// Update URL when filters change
	$effect(() => {
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

	// Event handlers
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

	function handleSortChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		sortOrder = target.value;
		currentPage = 1;
		fetchResults();
	}

	function toggleFacet(type: 'author' | 'type', value: string) {
		if (type === 'author') {
			selectedAuthors = selectedAuthors.includes(value)
				? selectedAuthors.filter(a => a !== value)
				: [...selectedAuthors, value];
		} else {
			selectedTypes = selectedTypes.includes(value)
				? selectedTypes.filter(t => t !== value)
				: [...selectedTypes, value];
		}
		currentPage = 1;
		fetchResults();
	}

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

	function clearAllFilters() {
		searchTerm = '';
		selectedAuthors = [];
		selectedTypes = [];
		currentPage = 1;
		sortOrder = config.defaultSortOrder;
		fetchResults();
	}

	function goToPage(page: number) {
		if (page < 1 || page > totalPages) return;
		currentPage = page;
		fetchResults();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Fetch results from API
	async function fetchResults() {
		isLoading = true;

		try {
			const params = new URLSearchParams({
				locale: config.locale,
				domain: config.domain,
				limit: config.resultsPerPage.toString(),
				offset: offset.toString(),
				sort: sortOrder,
				useSemanticSearch: config.useSemanticSearch.toString(),
				semanticWeight: config.semanticWeight.toString()
			});

			if (searchTerm) params.append('q', searchTerm);

			selectedAuthors.forEach(author => params.append('authors[]', author));
			selectedTypes.forEach(type => params.append('types[]', type));

			const response = await fetch(`/api/faceted-search.json?${params.toString()}`);

			if (!response.ok) {
				throw new Error(`API request failed: ${response.status}`);
			}

			const data = await response.json();

			results = data.items || [];
			facets = data.facets || { authors: [], types: [] };
			total = data.total || 0;
		} catch (error) {
			console.error('Error fetching results:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="faceted-search-container">
	<div class="grid lg:grid-cols-4 gap-6">
		<!-- Sidebar with Facets -->
		<FacetedSearchSidebar
			{facets}
			{selectedAuthors}
			{selectedTypes}
			{searchTerm}
			{activeFilterCount}
			showAuthorFacet={config.showAuthorFacet}
			showTypeFacet={config.showTypeFacet}
			{isEditMode}
			onClearAll={clearAllFilters}
			onRemoveFilter={removeFilter}
			onToggleFacet={toggleFacet}
		/>

		<!-- Main Content Area -->
		<main class="lg:col-span-3">
			<!-- Search Bar and Controls -->
			<FacetedSearchControls
				{searchTerm}
				{sortOrder}
				{isLoading}
				{total}
				{offset}
				resultsPerPage={config.resultsPerPage}
				showSearchInput={config.showSearchInput}
				searchPlaceholder={config.searchPlaceholder}
				{isEditMode}
				onSearchInput={handleSearchInput}
				onSortChange={handleSortChange}
			/>

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
						<SearchResultCard {result} locale={config.locale} />
					{/each}
				</div>

				<!-- Pagination -->
				<SearchPagination
					{currentPage}
					{totalPages}
					{isEditMode}
					onPageChange={goToPage}
				/>
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
