<script lang="ts">
	import { Search } from 'lucide-svelte';

	interface Props {
		contentTypes: { name: string; count: number }[];
		selectedContentType: string | null;
		onSelect: (contentType: string) => void;
	}

	let { contentTypes, selectedContentType, onSelect }: Props = $props();

	let searchQuery = $state('');

	// Filter content types
	let filteredContentTypes = $derived.by(() => {
		if (!searchQuery) return contentTypes;
		const query = searchQuery.toLowerCase();
		return contentTypes.filter((ct) => ct.name.toLowerCase().includes(query));
	});
</script>

<div class="flex flex-col h-full bg-white border-r border-gray-200">
	<!-- Header -->
	<div class="p-4 border-b border-gray-200">
		<h3 class="text-lg font-semibold text-gray-900 mb-3">
			Content Types ({filteredContentTypes.length})
		</h3>

		<!-- Search -->
		<div class="relative">
			<Search size={18} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search content types..."
				class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>
	</div>

	<!-- List -->
	<div class="flex-1 overflow-auto">
		{#if filteredContentTypes.length === 0}
			<div class="text-center py-12 px-4 text-gray-500">
				<p class="text-sm">No content types found.</p>
				{#if searchQuery}
					<p class="text-xs mt-1">Try adjusting your search.</p>
				{/if}
			</div>
		{:else}
			<div class="divide-y divide-gray-200">
				{#each filteredContentTypes as contentType (contentType.name)}
					<div
						role="button"
						tabindex="0"
						onclick={() => onSelect(contentType.name)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onSelect(contentType.name);
							}
						}}
						class="p-4 hover:bg-gray-50 transition-colors cursor-pointer {selectedContentType ===
						contentType.name
							? 'bg-blue-50 border-l-4 border-blue-600'
							: ''}"
					>
						<div class="flex items-center justify-between">
							<div class="flex-1 min-w-0">
								<h4 class="text-sm font-semibold text-gray-900 truncate">
									{contentType.name}
								</h4>
							</div>
							<span
								class="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
							>
								{contentType.count}
							</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
