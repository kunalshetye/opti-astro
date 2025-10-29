<script lang="ts">
	import { Plus, Save, X, Code, FileText } from 'lucide-svelte';
	import SettingEditor from './_SettingEditor.svelte';
	import type { StyleDefinition, DisplaySetting } from '../services/style-manager-types';
	import { validateStyleDefinition } from '../services/style-manager-types';

	interface Props {
		style?: StyleDefinition | null;
		onSave: (style: StyleDefinition) => void;
		onCancel: () => void;
	}

	let { style = null, onSave, onCancel }: Props = $props();

	// Initialize form state
	let key = $state(style?.key || '');
	let displayName = $state(style?.displayName || '');
	let scopeType = $state<'contentType' | 'nodeType' | 'baseType'>(
		style?.contentType ? 'contentType' : style?.nodeType ? 'nodeType' : 'baseType'
	);
	let scopeValue = $state(style?.contentType || style?.nodeType || style?.baseType || '');
	let isDefault = $state(style?.isDefault || false);
	let settings = $state<Record<string, DisplaySetting>>(
		style?.settings ? { ...style.settings } : {}
	);

	let showJsonView = $state(false);
	let jsonError = $state<string | null>(null);
	let validationErrors = $state<string[]>([]);
	let draggedIndex = $state<number | null>(null);

	// Computed JSON representation
	let jsonValue = $derived.by(() => {
		const styleObj: Partial<StyleDefinition> = {
			key,
			displayName,
			isDefault,
			settings
		};

		if (scopeType === 'contentType') {
			styleObj.contentType = scopeValue;
			styleObj.nodeType = null;
			styleObj.baseType = null;
		} else if (scopeType === 'nodeType') {
			styleObj.nodeType = scopeValue;
			styleObj.contentType = null;
			styleObj.baseType = null;
		} else {
			styleObj.baseType = scopeValue;
			styleObj.contentType = null;
			styleObj.nodeType = null;
		}

		return JSON.stringify(styleObj, null, 2);
	});

	// Parse JSON when switching back from JSON view
	function handleJsonUpdate(event: Event) {
		try {
			const target = event.target as HTMLTextAreaElement;
			const parsed = JSON.parse(target.value);

			key = parsed.key || '';
			displayName = parsed.displayName || '';
			isDefault = parsed.isDefault || false;
			settings = parsed.settings || {};

			if (parsed.contentType) {
				scopeType = 'contentType';
				scopeValue = parsed.contentType;
			} else if (parsed.nodeType) {
				scopeType = 'nodeType';
				scopeValue = parsed.nodeType;
			} else if (parsed.baseType) {
				scopeType = 'baseType';
				scopeValue = parsed.baseType;
			}

			jsonError = null;
		} catch (error) {
			jsonError = (error as Error).message;
		}
	}

	function addSetting() {
		const newSettingKey = `setting${Object.keys(settings).length + 1}`;
		settings = {
			...settings,
			[newSettingKey]: {
				displayName: 'New Setting',
				editor: 'DropDown',
				sortOrder: (Object.keys(settings).length + 1) * 10,
				choices: {}
			}
		};
	}

	function updateSetting(settingKey: string, setting: DisplaySetting) {
		settings = {
			...settings,
			[settingKey]: setting
		};
	}

	function deleteSetting(settingKey: string) {
		const { [settingKey]: _, ...rest } = settings;
		settings = rest;
	}

	function handleSettingKeyChange(oldKey: string, newKey: string) {
		if (oldKey === newKey) return;
		const setting = settings[oldKey];
		const { [oldKey]: _, ...rest } = settings;
		settings = {
			...rest,
			[newKey]: setting
		};
	}

	function handleSave() {
		const styleObj: StyleDefinition = {
			key,
			displayName,
			isDefault,
			settings,
			contentType: scopeType === 'contentType' ? scopeValue : null,
			nodeType: scopeType === 'nodeType' ? scopeValue : null,
			baseType: scopeType === 'baseType' ? scopeValue : null
		};

		const validation = validateStyleDefinition(styleObj);
		if (!validation.valid) {
			validationErrors = validation.errors;
			return;
		}

		validationErrors = [];
		onSave(styleObj);
	}

	// Sort entries by sortOrder
	const settingEntries = $derived(
		Object.entries(settings).sort(
			([, a], [, b]) => (a.sortOrder || 0) - (b.sortOrder || 0)
		)
	);

	function handleDragStart(index: number) {
		draggedIndex = index;
	}

	function handleDragOver(event: DragEvent, index: number) {
		event.preventDefault();
		if (draggedIndex === null || draggedIndex === index) return;

		// Visual feedback
		const target = event.currentTarget as HTMLElement;
		target.classList.add('border-t-4', 'border-blue-500');
	}

	function handleDragLeave(event: DragEvent) {
		const target = event.currentTarget as HTMLElement;
		target.classList.remove('border-t-4', 'border-blue-500');
	}

	function handleDrop(event: DragEvent, dropIndex: number) {
		event.preventDefault();
		const target = event.currentTarget as HTMLElement;
		target.classList.remove('border-t-4', 'border-blue-500');

		if (draggedIndex === null || draggedIndex === dropIndex) {
			draggedIndex = null;
			return;
		}

		// Get current sorted entries
		const currentEntries = Object.entries(settings).sort(
			([, a], [, b]) => (a.sortOrder || 0) - (b.sortOrder || 0)
		);

		// Reorder the settings array
		const entries = [...currentEntries];
		const [draggedEntry] = entries.splice(draggedIndex, 1);
		entries.splice(dropIndex, 0, draggedEntry);

		// Update sortOrder for all settings based on new order
		const newSettings: Record<string, DisplaySetting> = {};
		entries.forEach(([key, setting], index) => {
			newSettings[key] = {
				...setting,
				sortOrder: (index + 1) * 10
			};
		});

		// Force reactivity by creating a new object
		settings = { ...newSettings };
		draggedIndex = null;
	}

	function handleDragEnd() {
		draggedIndex = null;
	}
</script>

<div class="flex flex-col h-full">
	<!-- Header -->
	<div class="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
		<div>
			<h3 class="text-xl font-semibold text-gray-900">
				{style ? `Edit Style: ${style.displayName}` : 'Create New Style'}
			</h3>
			<p class="text-sm text-gray-500 mt-1">
				{showJsonView ? 'JSON Editor Mode' : 'Form Editor Mode'}
			</p>
		</div>
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => (showJsonView = !showJsonView)}
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
			>
				{#if showJsonView}
					<FileText size={16} />
					Form View
				{:else}
					<Code size={16} />
					JSON View
				{/if}
			</button>
			<button
				type="button"
				onclick={handleSave}
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
			>
				<Save size={16} />
				Save Style
			</button>
			<button
				type="button"
				onclick={onCancel}
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
			>
				<X size={16} />
				Cancel
			</button>
		</div>
	</div>

	<!-- Validation Errors -->
	{#if validationErrors.length > 0}
		<div class="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
			<h4 class="text-sm font-semibold text-red-800 mb-2">Validation Errors:</h4>
			<ul class="list-disc list-inside space-y-1">
				{#each validationErrors as error}
					<li class="text-sm text-red-700">{error}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Content -->
	<div class="flex-1 overflow-auto p-6 bg-gray-50">
		{#if showJsonView}
			<!-- JSON Editor -->
			<div class="bg-white rounded-lg border border-gray-300 p-4">
				<textarea
					value={jsonValue}
					oninput={handleJsonUpdate}
					class="w-full h-[calc(100vh-300px)] font-mono text-sm border-none focus:ring-0 resize-none"
					spellcheck="false"
				></textarea>
				{#if jsonError}
					<div class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
						Invalid JSON: {jsonError}
					</div>
				{/if}
			</div>
		{:else}
			<!-- Form Editor -->
			<div class="space-y-6">
				<!-- Root Properties -->
				<div class="bg-white rounded-lg border border-gray-300 p-6">
					<h4 class="text-lg font-semibold text-gray-900 mb-4">Root Properties</h4>
					<div class="grid grid-cols-2 gap-4">
						<!-- Key -->
						<div>
							<label for="style-key" class="block text-sm font-medium text-gray-700 mb-2">
								Key <span class="text-red-500">*</span>
							</label>
							<input
								id="style-key"
								type="text"
								bind:value={key}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="e.g., ButtonPrimary"
								pattern="[A-Za-z][_0-9A-Za-z]+"
								required
							/>
							<p class="text-xs text-gray-500 mt-1">
								Start with letter, alphanumerics and underscores only
							</p>
						</div>

						<!-- Display Name -->
						<div>
							<label for="style-display-name" class="block text-sm font-medium text-gray-700 mb-2">
								Display Name <span class="text-red-500">*</span>
							</label>
							<input
								id="style-display-name"
								type="text"
								bind:value={displayName}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="e.g., Button - Primary"
								required
							/>
						</div>

						<!-- Scope Type -->
						<div>
							<label for="style-scope-type" class="block text-sm font-medium text-gray-700 mb-2">
								Scope Type <span class="text-red-500">*</span>
							</label>
							<select
								id="style-scope-type"
								bind:value={scopeType}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="contentType">Content Type (Specific component)</option>
								<option value="nodeType">Node Type (Visual editor nodes)</option>
								<option value="baseType">Base Type (All components/pages)</option>
							</select>
							<p class="text-xs text-gray-500 mt-1">Choose only one scope filter</p>
						</div>

						<!-- Scope Value -->
						<div>
							<label for="style-scope-value" class="block text-sm font-medium text-gray-700 mb-2">
								{scopeType === 'contentType'
									? 'Content Type'
									: scopeType === 'nodeType'
										? 'Node Type'
										: 'Base Type'} <span class="text-red-500">*</span>
							</label>
							<input
								id="style-scope-value"
								type="text"
								bind:value={scopeValue}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder={scopeType === 'contentType'
									? 'e.g., Button'
									: scopeType === 'nodeType'
										? 'e.g., Component'
										: 'e.g., Component'}
								required
							/>
						</div>

						<!-- Is Default -->
						<div class="col-span-2">
							<label class="inline-flex items-center cursor-pointer">
								<input type="checkbox" bind:checked={isDefault} class="sr-only peer" />
								<div
									class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
								></div>
								<span class="ml-3 text-sm font-medium text-gray-700"
									>Set as default style for this type</span
								>
							</label>
						</div>
					</div>
				</div>

				<!-- Settings -->
				<div class="bg-white rounded-lg border border-gray-300 p-6">
					<div class="flex items-center justify-between mb-4">
						<h4 class="text-lg font-semibold text-gray-900">
							Settings ({settingEntries.length})
						</h4>
						<button
							type="button"
							onclick={addSetting}
							class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
						>
							<Plus size={16} />
							Add Setting
						</button>
					</div>

					{#if settingEntries.length === 0}
						<div class="text-center py-12 text-gray-500">
							<p>No settings defined yet.</p>
							<p class="text-sm mt-1">Click "Add Setting" to create your first setting.</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each settingEntries as [settingKey, setting], index (settingKey)}
								<div
									role="button"
									tabindex="0"
									draggable="true"
									ondragstart={() => handleDragStart(index)}
									ondragover={(e) => handleDragOver(e, index)}
									ondragleave={handleDragLeave}
									ondrop={(e) => handleDrop(e, index)}
									ondragend={handleDragEnd}
									class="transition-all duration-200"
									class:opacity-50={draggedIndex === index}
								>
									<SettingEditor
										{settingKey}
										{setting}
										onUpdate={(key, val) => updateSetting(key, val)}
										onDelete={() => deleteSetting(settingKey)}
										onKeyChange={handleSettingKeyChange}
									/>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
