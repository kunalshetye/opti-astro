<script lang="ts">
	import { onMount } from 'svelte';
	import queryString from 'query-string';
	import FacetedSearchSidebar from './FacetedSearchSidebar.svelte';
	import FacetedSearchControls from './FacetedSearchControls.svelte';
	import SearchResultCard from './SearchResultCard.svelte';
	import SearchPagination from './SearchPagination.svelte';
	import SkeletonCard from './SkeletonCard.svelte';

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
			gridColumns: number;
			defaultViewMode: string;
			defaultFiltersState: string;
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
		isModal?: boolean;
		compact?: boolean;
		onResultClick?: (result: any) => void;
		persistState?: boolean;
	}

	let {
		initialResults,
		initialFacets,
		initialTotal,
		config,
		baseUrl,
		isEditMode = false,
		isModal = false,
		compact = false,
		onResultClick,
		persistState = false
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
	let viewMode = $state<'list' | 'grid'>(
		(config.defaultViewMode === 'list' || config.defaultViewMode === 'grid')
			? config.defaultViewMode
			: 'list'
	);
	let filtersVisible = $state<boolean>(
		config.defaultFiltersState === 'show'
	);

	// Derived values
	let activeFilterCount = $derived(
		selectedAuthors.length + selectedTypes.length + (searchTerm ? 1 : 0)
	);
	let totalPages = $derived(Math.ceil(total / config.resultsPerPage));
	let offset = $derived((currentPage - 1) * config.resultsPerPage);

	// Calculate dynamic min-height based on view mode and results per page
	let minHeight = $derived.by(() => {
		if (viewMode === 'grid') {
			// Grid: variable columns on desktop, ~400px per card
			// Add extra space for gaps (24px between cards)
			const rows = Math.ceil(config.resultsPerPage / config.gridColumns);
			return rows * 400 + (rows - 1) * 24; // card height + gap
		} else {
			// List: 1 column, ~220px per card
			// Add extra space for gaps (24px between cards)
			return config.resultsPerPage * 220 + (config.resultsPerPage - 1) * 24;
		}
	});

	// Get grid column class based on configuration
	let gridColsClass = $derived(
		config.gridColumns === 3 ? 'md:grid-cols-3' :
		config.gridColumns === 4 ? 'md:grid-cols-4' :
		'md:grid-cols-2'
	);

	// LocalStorage helpers for modal state persistence
	const STORAGE_KEY = 'faceted-search-modal-state';

	function saveStateToLocalStorage() {
		if (!isModal || !persistState) return;
		try {
			const state = {
				searchTerm,
				selectedAuthors,
				selectedTypes,
				sortOrder,
				viewMode,
				filtersVisible,
				timestamp: Date.now()
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch (error) {
			console.error('Error saving search state:', error);
		}
	}

	function loadStateFromLocalStorage() {
		if (!isModal || !persistState) return false;
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (!stored) return false;

			const state = JSON.parse(stored);
			// Only restore if less than 24 hours old
			if (Date.now() - state.timestamp > 24 * 60 * 60 * 1000) {
				localStorage.removeItem(STORAGE_KEY);
				return false;
			}

			searchTerm = state.searchTerm || '';
			selectedAuthors = state.selectedAuthors || [];
			selectedTypes = state.selectedTypes || [];
			sortOrder = state.sortOrder || config.defaultSortOrder;
			viewMode = state.viewMode || config.defaultViewMode;
			filtersVisible = state.filtersVisible !== undefined ? state.filtersVisible : config.defaultFiltersState === 'show';

			return true;
		} catch (error) {
			console.error('Error loading search state:', error);
			return false;
		}
	}

	// Read URL parameters on mount (or localStorage for modal mode)
	onMount(() => {
		if (isEditMode) return;

		// In modal mode with persistState, try loading from localStorage first
		if (isModal && persistState) {
			const restored = loadStateFromLocalStorage();
			// Always fetch results in modal mode to show initial content
			fetchResults();
			return;
		}

		const params = queryString.parse(window.location.search);

		// Override viewMode if URL param is present
		if (params.view && typeof params.view === 'string' && (params.view === 'list' || params.view === 'grid')) {
			viewMode = params.view;
		}

		// Override filtersVisible if URL param is present
		if (params.filters && typeof params.filters === 'string') {
			filtersVisible = params.filters === 'show';
		}

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

	// Update URL when filters or view mode change (disabled in modal mode)
	$effect(() => {
		if (isEditMode) return;
		if (isModal) return; // Don't update URL in modal mode
		if (typeof window === 'undefined') return;

		const params: any = {};

		if (searchTerm) params.q = searchTerm;
		if (selectedAuthors.length > 0) params.authors = selectedAuthors;
		if (selectedTypes.length > 0) params.types = selectedTypes;
		if (sortOrder !== config.defaultSortOrder) params.sort = sortOrder;
		if (currentPage > 1) params.page = currentPage;
		// Add view param if different from default
		const defaultView = (config.defaultViewMode === 'list' || config.defaultViewMode === 'grid')
			? config.defaultViewMode
			: 'list';
		if (viewMode !== defaultView) params.view = viewMode;
		// Add filters param if different from default
		const defaultFiltersVisible = config.defaultFiltersState === 'show';
		if (filtersVisible !== defaultFiltersVisible) params.filters = filtersVisible ? 'show' : 'hide';

		const query = queryString.stringify(params, { arrayFormat: 'bracket' });
		const newUrl = query ? `${baseUrl}?${query}` : baseUrl;

		window.history.pushState({}, '', newUrl);
	});

	// Save state to localStorage in modal mode when state changes
	$effect(() => {
		if (!isModal || !persistState) return;
		// Track changes to state
		searchTerm;
		selectedAuthors;
		selectedTypes;
		sortOrder;
		viewMode;
		filtersVisible;
		// Save to localStorage
		saveStateToLocalStorage();
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

	function handleViewModeChange(mode: 'list' | 'grid') {
		viewMode = mode;
	}

	function toggleFilters() {
		filtersVisible = !filtersVisible;
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

<div class="faceted-search-container" class:compact-mode={compact}>
	<div class="grid" class:gap-6={!compact} class:gap-3={compact} class:lg:grid-cols-4={filtersVisible} class:lg:grid-cols-1={!filtersVisible}>
		<!-- Sidebar with Facets -->
		{#if filtersVisible}
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
		{/if}

		<!-- Main Content Area -->
		<main class:lg:col-span-3={filtersVisible} class:lg:col-span-1={!filtersVisible}>
			<!-- Search Bar and Controls -->
			<FacetedSearchControls
				{searchTerm}
				{sortOrder}
				{viewMode}
				{filtersVisible}
				{isLoading}
				{total}
				{offset}
				resultsPerPage={config.resultsPerPage}
				showSearchInput={config.showSearchInput}
				searchPlaceholder={config.searchPlaceholder}
				{isEditMode}
				onSearchInput={handleSearchInput}
				onSortChange={handleSortChange}
				onViewModeChange={handleViewModeChange}
				onToggleFilters={toggleFilters}
			/>

			<!-- Results Container with dynamic min-height to prevent jumping -->
			<div class="results-container" class:max-h-96={compact} class:overflow-y-auto={compact} style={!compact ? `min-height: ${minHeight}px;` : ''}>
				<!-- Loading State with Skeleton Cards -->
				{#if isLoading}
					<div class:space-y-6={viewMode === 'list'} class:grid={viewMode === 'grid'} class:grid-cols-1={viewMode === 'grid'} class={viewMode === 'grid' ? gridColsClass : ''} class:gap-6={viewMode === 'grid'}>
						{#each Array(config.resultsPerPage) as _, index}
							<SkeletonCard {viewMode} />
						{/each}
					</div>
				{/if}

				<!-- Results -->
				{#if !isLoading && results.length > 0}
					<div class:space-y-6={viewMode === 'list'} class:grid={viewMode === 'grid'} class:grid-cols-1={viewMode === 'grid'} class={viewMode === 'grid' ? gridColsClass : ''} class:gap-6={viewMode === 'grid'}>
						{#each results as result}
							<SearchResultCard {result} locale={config.locale} {viewMode} onClick={onResultClick} />
						{/each}
					</div>
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
			</div>

			<!-- Pagination - Always visible, disabled during loading -->
			{#if totalPages > 1}
				<div class:opacity-50={isLoading} class:pointer-events-none={isLoading}>
					<SearchPagination
						{currentPage}
						{totalPages}
						isEditMode={isEditMode || isLoading}
						onPageChange={goToPage}
					/>
				</div>
			{/if}

		</main>
	</div>
</div>

<style>
	.faceted-search-container {
		container-type: inline-size;
	}

	.faceted-search-container.compact-mode {
		font-size: 0.9rem;
	}

	.compact-mode .results-container {
		scrollbar-width: thin;
		scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
	}

	.compact-mode .results-container::-webkit-scrollbar {
		width: 6px;
	}

	.compact-mode .results-container::-webkit-scrollbar-track {
		background: transparent;
	}

	.compact-mode .results-container::-webkit-scrollbar-thumb {
		background-color: rgba(155, 155, 155, 0.5);
		border-radius: 3px;
	}
</style>
