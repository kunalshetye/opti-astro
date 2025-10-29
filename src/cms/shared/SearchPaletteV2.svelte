<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import FacetedSearchClient from '../components/FacetedSearchComponent/FacetedSearch.svelte';

	interface Props {
		currentLocale?: string;
		domain?: string;
	}

	let { currentLocale = 'en', domain = '' }: Props = $props();

	let isOpen = $state(false);

	// Configuration for modal mode
	const config = {
		resultsPerPage: 10,
		gridColumns: 2,
		defaultViewMode: 'list' as const,
		defaultFiltersState: 'hide' as const,
		defaultSortOrder: 'relevance',
		showSearchInput: true,
		showAuthorFacet: true,
		showTypeFacet: true,
		searchPlaceholder: 'Search...',
		noResultsMessage: 'No results found. Try adjusting your filters.',
		locale: currentLocale,
		domain: domain,
		useSemanticSearch: true,
		semanticWeight: 0.3,
	};

	// Empty initial data - all fetching will be client-side
	const initialResults: any[] = [];
	const initialFacets = { authors: [], types: [] };
	const initialTotal = 0;

	function openModal() {
		isOpen = true;
	}

	function closeModal() {
		isOpen = false;
	}

	function handleResultClick(result: any) {
		// Navigate to result and close modal
		if (result._metadata?.url?.hierarchical) {
			window.location.href = result._metadata.url.hierarchical;
		}
	}

	onMount(() => {
		// Listen for custom event to open modal
		const handleOpenEvent = () => openModal();
		window.addEventListener('open-command-palette', handleOpenEvent);

		// Handle Escape key globally
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				closeModal();
			}
		};
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('open-command-palette', handleOpenEvent);
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50">
		<!-- Overlay -->
		<div
			class="bg-neutral/60 fixed inset-0 backdrop-blur-sm"
			aria-hidden="true"
			transition:fade={{ duration: 200 }}
			onclick={closeModal}
			role="presentation"
		>
		</div>

		<!-- Dialog container -->
		<div
			class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20"
			transition:scale={{ duration: 200, start: 0.95 }}
			onclick={(e) => {
				// Close if clicking the container itself (not children)
				if (e.target === e.currentTarget) {
					closeModal();
				}
			}}
			role="presentation"
		>
			<!-- Dialog panel -->
			<div
				class="bg-base-100 ring-base-300 relative mx-auto max-w-5xl transform overflow-hidden rounded-xl shadow-2xl ring-2 transition-all"
			>
				<!-- Close button -->
				<button
					onclick={closeModal}
					class="btn btn-circle btn-ghost btn-sm absolute top-4 right-4 z-10"
					aria-label="Close search"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				<!-- FacetedSearch Component -->
				<div class="p-6">
					<FacetedSearchClient
						initialResults={initialResults}
						initialFacets={initialFacets}
						initialTotal={initialTotal}
						config={config}
						baseUrl=""
						isEditMode={false}
						isModal={true}
						compact={true}
						persistState={true}
						onResultClick={handleResultClick}
					/>
				</div>
			</div>
		</div>
	</div>
{/if}
