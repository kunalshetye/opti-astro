<script lang="ts">
	import { Search, Filter, Trash2, Edit } from 'lucide-svelte';
	import type { StyleDefinition } from '../services/style-manager-types';

	interface Props {
		styles: StyleDefinition[];
		selectedStyle: string | null;
		onSelect: (styleKey: string) => void;
		onEdit: (styleKey: string) => void;
		onDelete: (styleKey: string) => void;
	}

	let { styles, selectedStyle, onSelect, onEdit, onDelete }: Props = $props();

	let searchQuery = $state('');
	let filterType = $state<string>('all');

	// Filter styles
	let filteredStyles = $derived.by(() => {
		return styles.filter((style) => {
			// Search filter
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const matchesSearch =
					style.key.toLowerCase().includes(query) ||
					style.displayName.toLowerCase().includes(query);
				if (!matchesSearch) return false;
			}

			// Type filter
			if (filterType !== 'all') {
				if (filterType === 'contentType' && !style.contentType) return false;
				if (filterType === 'nodeType' && !style.nodeType) return false;
				if (filterType === 'baseType' && !style.baseType) return false;
			}

			return true;
		});
	});

	function getStyleType(style: StyleDefinition): string {
		if (style.contentType) return 'Content Type';
		if (style.nodeType) return 'Node Type';
		if (style.baseType) return 'Base Type';
		return 'Unknown';
	}

	function getStyleTypeValue(style: StyleDefinition): string {
		return style.contentType || style.nodeType || style.baseType || '';
	}
</script>

<div class="flex flex-col h-full bg-white border-r border-gray-200">
	<!-- Header -->
	<div class="p-4 border-b border-gray-200">
		<h3 class="text-lg font-semibold text-gray-900 mb-3">Styles ({filteredStyles.length})</h3>

		<!-- Search -->
		<div class="relative mb-3">
			<Search size={18} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search styles..."
				class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>

		<!-- Filter -->
		<div class="flex items-center gap-2">
			<Filter size={16} class="text-gray-500" />
			<select
				bind:value={filterType}
				class="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			>
				<option value="all">All Types</option>
				<option value="contentType">Content Type</option>
				<option value="nodeType">Node Type</option>
				<option value="baseType">Base Type</option>
			</select>
		</div>
	</div>

	<!-- List -->
	<div class="flex-1 overflow-auto">
		{#if filteredStyles.length === 0}
			<div class="text-center py-12 px-4 text-gray-500">
				<p class="text-sm">No styles found.</p>
				{#if searchQuery || filterType !== 'all'}
					<p class="text-xs mt-1">Try adjusting your filters.</p>
				{/if}
			</div>
		{:else}
			<div class="divide-y divide-gray-200">
				{#each filteredStyles as style (style.key)}
					<div
						role="button"
						tabindex="0"
						onclick={() => onSelect(style.key)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onSelect(style.key);
							}
						}}
						class="w-full p-4 hover:bg-gray-50 transition-colors cursor-pointer {selectedStyle ===
						style.key
							? 'bg-blue-50 border-l-4 border-blue-600'
							: ''}"
					>
						<div class="flex items-start gap-3">
							<div class="flex-1 min-w-0">
								<h4 class="text-sm font-semibold text-gray-900 truncate">
									{style.displayName}
								</h4>
								<p class="text-xs text-gray-500 truncate">{style.key}</p>
								<div class="flex items-center gap-2 mt-1">
									<span class="inline-block px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-600">
										{getStyleType(style)}
									</span>
									<span class="text-xs text-gray-500">{getStyleTypeValue(style)}</span>
								</div>
								{#if style.isDefault}
									<span class="inline-block px-2 py-0.5 text-xs font-medium rounded bg-green-50 text-green-600 mt-1">
										Default
									</span>
								{/if}
							</div>

							<!-- Quick Actions -->
							<div class="flex flex-col gap-1">
								<button
									type="button"
									onclick={(e) => {
										e.stopPropagation();
										onEdit(style.key);
									}}
									class="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
									title="Edit style"
								>
									<Edit size={14} />
								</button>
								<button
									type="button"
									onclick={(e) => {
										e.stopPropagation();
										onDelete(style.key);
									}}
									class="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
									title="Delete style"
								>
									<Trash2 size={14} />
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
