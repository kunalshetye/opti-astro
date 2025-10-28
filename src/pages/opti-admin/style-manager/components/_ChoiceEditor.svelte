<script lang="ts">
	import { GripVertical, Trash2 } from 'lucide-svelte';
	import type { DisplaySettingChoice } from '../services/style-manager-types';

	interface Props {
		choiceKey: string;
		choice: DisplaySettingChoice;
		onUpdate: (choiceKey: string, choice: DisplaySettingChoice) => void;
		onDelete: () => void;
		onKeyChange: (oldKey: string, newKey: string) => void;
	}

	let { choiceKey, choice, onUpdate, onDelete, onKeyChange }: Props = $props();

	let localChoiceKey = $state(choiceKey);
	let localDisplayName = $state(choice.displayName);
	let localSortOrder = $state(choice.sortOrder || 10);

	function handleKeyBlur() {
		if (localChoiceKey !== choiceKey && localChoiceKey.trim()) {
			onKeyChange(choiceKey, localChoiceKey.trim());
		}
	}

	function handleUpdate() {
		onUpdate(choiceKey, {
			displayName: localDisplayName,
			sortOrder: localSortOrder
		});
	}
</script>

<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
	<button
		type="button"
		class="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
		aria-label="Drag to reorder"
	>
		<GripVertical size={20} />
	</button>

	<div class="flex-1 grid grid-cols-3 gap-3">
		<!-- Choice Key -->
		<div>
			<label class="block text-xs font-medium text-gray-700 mb-1">
				Choice Key
			</label>
			<input
				type="text"
				bind:value={localChoiceKey}
				onblur={handleKeyBlur}
				oninput={handleUpdate}
				class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				placeholder="e.g., small"
				pattern="[a-z][_0-9a-z]*"
			/>
			<p class="text-xs text-gray-500 mt-1">lowercase, underscores</p>
		</div>

		<!-- Display Name -->
		<div>
			<label class="block text-xs font-medium text-gray-700 mb-1">
				Display Name <span class="text-red-500">*</span>
			</label>
			<input
				type="text"
				bind:value={localDisplayName}
				oninput={handleUpdate}
				class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				placeholder="e.g., Small"
				required
			/>
		</div>

		<!-- Sort Order -->
		<div>
			<label class="block text-xs font-medium text-gray-700 mb-1">
				Sort Order
			</label>
			<input
				type="number"
				bind:value={localSortOrder}
				oninput={handleUpdate}
				class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				min="0"
				step="10"
			/>
		</div>
	</div>

	<button
		type="button"
		onclick={onDelete}
		class="text-red-500 hover:text-red-700 transition-colors"
		aria-label="Delete choice"
	>
		<Trash2 size={18} />
	</button>
</div>
