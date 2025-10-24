<script lang="ts">
	interface Props {
		viewMode?: 'list' | 'grid';
	}

	let { viewMode = 'list' }: Props = $props();
</script>

{#if viewMode === 'grid'}
	<!-- Grid View Skeleton -->
	<article class="card bg-base-100 shadow-md h-full animate-pulse">
		<!-- Image Skeleton -->
		<div class="aspect-video w-full bg-base-300"></div>

		<!-- Content Skeleton -->
		<div class="card-body p-4 gap-3">
			<!-- Title Skeleton -->
			<div class="h-5 bg-base-300 rounded w-3/4"></div>
			<div class="h-5 bg-base-300 rounded w-1/2"></div>

			<!-- Date/Author Skeleton -->
			<div class="h-3 bg-base-300 rounded w-1/3"></div>

			<!-- Excerpt Skeleton -->
			<div class="space-y-2">
				<div class="h-3 bg-base-300 rounded w-full"></div>
				<div class="h-3 bg-base-300 rounded w-5/6"></div>
				<div class="h-3 bg-base-300 rounded w-4/6"></div>
			</div>

			<!-- Button Skeleton -->
			<div class="flex justify-end mt-auto">
				<div class="h-8 bg-base-300 rounded w-24"></div>
			</div>
		</div>
	</article>
{:else}
	<!-- List View Skeleton -->
	<article class="card bg-base-100 shadow-md animate-pulse">
		<div class="card-body md:flex-row md:items-start gap-4 p-4">
			<!-- Image Skeleton -->
			<div class="flex-shrink-0 w-full md:w-48 h-36 bg-base-300 rounded-lg"></div>

			<!-- Content Skeleton -->
			<div class="flex-1 min-w-0 space-y-3">
				<!-- Title Skeleton -->
				<div class="space-y-2">
					<div class="h-6 bg-base-300 rounded w-3/4"></div>
					<div class="h-6 bg-base-300 rounded w-1/2"></div>
				</div>

				<!-- Subtitle Skeleton -->
				<div class="h-4 bg-base-300 rounded w-2/3"></div>

				<!-- Date/Author Skeleton -->
				<div class="h-3 bg-base-300 rounded w-1/4"></div>

				<!-- Excerpt Skeleton -->
				<div class="space-y-2">
					<div class="h-3 bg-base-300 rounded w-full"></div>
					<div class="h-3 bg-base-300 rounded w-11/12"></div>
					<div class="h-3 bg-base-300 rounded w-4/5"></div>
				</div>

				<!-- Button Skeleton -->
				<div class="h-8 bg-base-300 rounded w-28"></div>
			</div>
		</div>
	</article>
{/if}

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
