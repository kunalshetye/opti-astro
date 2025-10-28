<script lang="ts">
	import { Edit, Trash2, Plus } from 'lucide-svelte';
	import type { StyleDefinition } from '../services/style-manager-types';

	interface Props {
		contentType: string;
		styles: StyleDefinition[];
		onEdit: (styleKey: string) => void;
		onDelete: (styleKey: string) => void;
		onCreate: () => void;
	}

	let { contentType, styles, onEdit, onDelete, onCreate }: Props = $props();
</script>

<div class="p-6">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h2 class="text-2xl font-bold text-gray-900">{contentType}</h2>
			<p class="text-sm text-gray-600 mt-1">{styles.length} style(s) defined</p>
		</div>
		<button
			type="button"
			onclick={onCreate}
			class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
		>
			<Plus size={16} />
			Create Style
		</button>
	</div>

	{#if styles.length === 0}
		<div class="text-center py-12 text-gray-500">
			<p>No styles defined for this content type yet.</p>
			<p class="text-sm mt-2">Click "Create Style" to add one.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each styles as style (style.key)}
				<div class="bg-white rounded-lg border border-gray-300 p-4 hover:shadow-md transition-shadow">
					<div class="flex items-start justify-between mb-3">
						<div class="flex-1 min-w-0">
							<h3 class="text-lg font-semibold text-gray-900 truncate">
								{style.displayName}
							</h3>
							<p class="text-xs text-gray-500 truncate mt-1">{style.key}</p>
						</div>
						{#if style.isDefault}
							<span
								class="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800"
							>
								Default
							</span>
						{/if}
					</div>

					<div class="mb-4">
						<p class="text-sm text-gray-600">
							{Object.keys(style.settings).length} setting(s) defined
						</p>
					</div>

					<div class="flex items-center gap-2">
						<button
							type="button"
							onclick={() => onEdit(style.key)}
							class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
						>
							<Edit size={14} />
							Edit
						</button>
						<button
							type="button"
							onclick={() => onDelete(style.key)}
							class="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
						>
							<Trash2 size={14} />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
