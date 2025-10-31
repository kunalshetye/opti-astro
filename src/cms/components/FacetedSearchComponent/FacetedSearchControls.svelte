<script lang="ts">
    interface Props {
        searchTerm: string;
        sortOrder: string;
        viewMode: 'list' | 'grid';
        filtersVisible: boolean;
        isLoading: boolean;
        total: number;
        offset: number;
        resultsPerPage: number;
        showSearchInput: boolean;
        searchPlaceholder?: string;
        isEditMode?: boolean;
        onSearchInput: (event: Event) => void;
        onSortChange: (event: Event) => void;
        onViewModeChange: (mode: 'list' | 'grid') => void;
        onToggleFilters: () => void;
    }

    let {
        searchTerm,
        sortOrder,
        viewMode,
        filtersVisible,
        isLoading,
        total,
        offset,
        resultsPerPage,
        showSearchInput,
        searchPlaceholder = 'Search...',
        isEditMode = false,
        onSearchInput,
        onSortChange,
        onViewModeChange,
		onToggleFilters
    }: Props = $props();

    const sortOptions = [
        { value: 'relevance', label: 'Relevance' },
        { value: 'semantic', label: 'Semantic (AI-powered)' },
        { value: 'date_desc', label: 'Newest First' },
        { value: 'date_asc', label: 'Oldest First' },
        { value: 'title_asc', label: 'Title A-Z' },
		{ value: 'title_desc', label: 'Title Z-A' }
    ];

    // Auto-focus search input
    function init(el) {
        el.focus();
    }
</script>

<!-- Search Bar and Controls -->
<div class="bg-base-100 rounded-lg shadow-md p-4 mb-6">
    <div class="flex flex-col md:flex-row gap-4">
        {#if showSearchInput}
            <div class="flex-1">
                <input
                    type="text"
                    class="input input-bordered w-full"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    oninput={onSearchInput}
                    disabled={isEditMode}
                    use:init
                />
            </div>
        {/if}
        <div class="flex items-center gap-2">
            <!-- Filters Toggle -->
            <button
                class="btn btn-sm"
                class:btn-active={filtersVisible}
                onclick={onToggleFilters}
                disabled={isEditMode}
                aria-label="Toggle filters"
                title={filtersVisible ? 'Hide filters' : 'Show filters'}
            >
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                </svg>
                <span class="hidden md:inline ml-1">Filters</span>
            </button>

            <!-- View Mode Toggle -->
            <div class="join">
                <button
                    class="join-item btn btn-sm"
                    class:btn-active={viewMode === 'list'}
                    onclick={() => onViewModeChange('list')}
                    disabled={isEditMode}
                    aria-label="List view"
                >
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                <button
                    class="join-item btn btn-sm"
                    class:btn-active={viewMode === 'grid'}
                    onclick={() => onViewModeChange('grid')}
                    disabled={isEditMode}
                    aria-label="Grid view"
                >
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                        />
                    </svg>
                </button>
            </div>

            <!-- Sort Dropdown -->
            <select
                class="select select-bordered select-sm"
                value={sortOrder}
                onchange={onSortChange}
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
			Showing {total > 0 ? offset + 1 : 0}–{Math.min(offset + resultsPerPage, total)} of {total} results
        {/if}
    </p>
</div>
