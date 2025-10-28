<script lang="ts">
	import { GripVertical, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-svelte';
	import ChoiceEditor from './_ChoiceEditor.svelte';
	import type { DisplaySetting, DisplaySettingChoice } from '../services/style-manager-types';

	interface Props {
		settingKey: string;
		setting: DisplaySetting;
		onUpdate: (settingKey: string, setting: DisplaySetting) => void;
		onDelete: () => void;
		onKeyChange: (oldKey: string, newKey: string) => void;
	}

	let { settingKey, setting, onUpdate, onDelete, onKeyChange }: Props = $props();

	let localSettingKey = $state(settingKey);
	let localDisplayName = $state(setting.displayName);
	let localEditor = $state(setting.editor || 'DropDown');
	let localSortOrder = $state(setting.sortOrder || 10);
	let localChoices = $state<Record<string, DisplaySettingChoice>>({ ...setting.choices });
	let expanded = $state(false);

	// Track previous values to detect external changes
	let prevSettingKey = $state(settingKey);
	let prevSetting = $state(setting);

	// Sync local state with prop changes (for drag and drop reordering)
	// Only update if the prop changed externally (not from our own updates)
	$effect(() => {
		// Check if settingKey changed externally (key rename from parent)
		if (settingKey !== prevSettingKey && settingKey !== localSettingKey) {
			localSettingKey = settingKey;
			prevSettingKey = settingKey;
		}

		// Check if setting changed externally (drag and drop reorder)
		if (setting !== prevSetting) {
			localDisplayName = setting.displayName;
			localEditor = setting.editor || 'DropDown';
			localSortOrder = setting.sortOrder || 10;
			localChoices = { ...setting.choices };
			prevSetting = setting;
		}
	});

	function handleKeyBlur() {
		if (localSettingKey !== settingKey && localSettingKey.trim()) {
			onKeyChange(settingKey, localSettingKey.trim());
		}
	}

	function handleUpdate() {
		onUpdate(settingKey, {
			displayName: localDisplayName,
			editor: localEditor,
			sortOrder: localSortOrder,
			choices: localChoices
		});
	}

	function addChoice() {
		const newChoiceKey = `choice${Object.keys(localChoices).length + 1}`;
		localChoices = {
			...localChoices,
			[newChoiceKey]: {
				displayName: 'New Choice',
				sortOrder: (Object.keys(localChoices).length + 1) * 10
			}
		};
		handleUpdate();
	}

	function updateChoice(choiceKey: string, choice: DisplaySettingChoice) {
		localChoices = {
			...localChoices,
			[choiceKey]: choice
		};
		handleUpdate();
	}

	function deleteChoice(choiceKey: string) {
		const { [choiceKey]: _, ...rest } = localChoices;
		localChoices = rest;
		handleUpdate();
	}

	function handleChoiceKeyChange(oldKey: string, newKey: string) {
		if (oldKey === newKey) return;
		const choice = localChoices[oldKey];
		const { [oldKey]: _, ...rest } = localChoices;
		localChoices = {
			...rest,
			[newKey]: choice
		};
		handleUpdate();
	}

	const choiceEntries = $derived(Object.entries(localChoices));
</script>

<div class="border border-gray-300 rounded-lg bg-white shadow-sm">
	<div class="flex items-center gap-3 p-4 bg-gray-100 border-b border-gray-300">
		<button
			type="button"
			class="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
			aria-label="Drag to reorder"
		>
			<GripVertical size={20} />
		</button>

		<button
			type="button"
			onclick={() => (expanded = !expanded)}
			class="text-gray-600 hover:text-gray-900"
			aria-label={expanded ? 'Collapse' : 'Expand'}
		>
			{#if expanded}
				<ChevronDown size={20} />
			{:else}
				<ChevronRight size={20} />
			{/if}
		</button>

		<div class="flex-1 grid grid-cols-4 gap-3">
			<!-- Setting Key -->
			<div>
				<label class="block text-xs font-medium text-gray-700 mb-1">
					Setting Key
				</label>
				<input
					type="text"
					bind:value={localSettingKey}
					onblur={handleKeyBlur}
					oninput={handleUpdate}
					class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					placeholder="e.g., size"
					pattern="[a-z][_0-9A-Za-z]*"
				/>
				<p class="text-xs text-gray-500 mt-1">camelCase</p>
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
					placeholder="e.g., Size"
					required
				/>
			</div>

			<!-- Editor Type -->
			<div>
				<label class="block text-xs font-medium text-gray-700 mb-1">
					Editor Type
				</label>
				<select
					bind:value={localEditor}
					onchange={handleUpdate}
					class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				>
					<option value="DropDown">Dropdown</option>
					<option value="RadioButtons">Radio Buttons</option>
					<option value="Buttons">Button Group</option>
				</select>
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
			aria-label="Delete setting"
		>
			<Trash2 size={20} />
		</button>
	</div>

	{#if expanded}
		<div class="p-4 space-y-3">
			<div class="flex items-center justify-between mb-2">
				<h4 class="text-sm font-semibold text-gray-700">
					Choices ({choiceEntries.length})
				</h4>
				<button
					type="button"
					onclick={addChoice}
					class="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
				>
					<Plus size={16} />
					Add Choice
				</button>
			</div>

			{#if choiceEntries.length === 0}
				<div class="text-center py-8 text-gray-500">
					<p class="text-sm">No choices defined yet.</p>
					<p class="text-xs mt-1">Click "Add Choice" to create one.</p>
				</div>
			{:else}
				<div class="space-y-2">
					{#each choiceEntries as [choiceKey, choice] (choiceKey)}
						<ChoiceEditor
							{choiceKey}
							{choice}
							onUpdate={(key, val) => updateChoice(key, val)}
							onDelete={() => deleteChoice(choiceKey)}
							onKeyChange={handleChoiceKeyChange}
						/>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
