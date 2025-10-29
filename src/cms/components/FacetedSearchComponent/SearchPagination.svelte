<script lang="ts">
	interface Props {
		currentPage: number;
		totalPages: number;
		isEditMode?: boolean;
		onPageChange: (page: number) => void;
	}

	let { currentPage, totalPages, isEditMode = false, onPageChange }: Props = $props();

	/**
	 * Calculate which page numbers to display
	 * Shows up to 7 page buttons with smart ellipsis handling
	 */
	function getPageNumbers(): number[] {
		const maxButtons = 7;

		if (totalPages <= maxButtons) {
			// Show all pages if total is less than max
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		if (currentPage <= 4) {
			// Near the start
			return Array.from({ length: maxButtons }, (_, i) => i + 1);
		}

		if (currentPage >= totalPages - 3) {
			// Near the end
			return Array.from({ length: maxButtons }, (_, i) => totalPages - (maxButtons - 1) + i);
		}

		// In the middle - show current page with 3 on each side
		return Array.from({ length: maxButtons }, (_, i) => currentPage - 3 + i);
	}

	let pageNumbers = $derived(getPageNumbers());
</script>

{#if totalPages > 1}
	<div class="flex justify-center mt-8">
		<div class="join">
			<button
				class="join-item btn"
				disabled={currentPage === 1 || isEditMode}
				onclick={() => onPageChange(currentPage - 1)}
			>
				«
			</button>
			{#each pageNumbers as page}
				<button
					class="join-item btn"
					class:btn-active={page === currentPage}
					onclick={() => onPageChange(page)}
					disabled={isEditMode}
				>
					{page}
				</button>
			{/each}
			<button
				class="join-item btn"
				disabled={currentPage === totalPages || isEditMode}
				onclick={() => onPageChange(currentPage + 1)}
			>
				»
			</button>
		</div>
	</div>
{/if}
