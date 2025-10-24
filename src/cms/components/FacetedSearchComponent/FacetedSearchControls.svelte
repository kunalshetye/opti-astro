<script lang="ts">
	interface Props {
		searchTerm: string;
		sortOrder: string;
		isLoading: boolean;
		total: number;
		offset: number;
		resultsPerPage: number;
		showSearchInput: boolean;
		searchPlaceholder?: string;
		isEditMode?: boolean;
		onSearchInput: (event: Event) => void;
		onSortChange: (event: Event) => void;
	}

	let {
		searchTerm,
		sortOrder,
		isLoading,
		total,
		offset,
		resultsPerPage,
		showSearchInput,
		searchPlaceholder = 'Search...',
		isEditMode = false,
		onSearchInput,
		onSortChange
	}: Props = $props();

	const sortOptions = [
		{ value: 'relevance', label: 'Relevance' },
		{ value: 'semantic', label: 'Semantic (AI-powered)' },
		{ value: 'date_desc', label: 'Newest First' },
		{ value: 'date_asc', label: 'Oldest First' },
		{ value: 'title_asc', label: 'Title A-Z' },
		{ value: 'title_desc', label: 'Title Z-A' }
	];
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
				/>
			</div>
		{/if}
		<div class="flex items-center gap-4">
			<select
				class="select select-bordered"
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
