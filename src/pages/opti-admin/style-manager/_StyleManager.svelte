<script lang="ts">
	import { onMount } from 'svelte';
	import { RefreshCw } from 'lucide-svelte';
	import ContentTypeList from './components/_ContentTypeList.svelte';
	import ContentTypeStyles from './components/_ContentTypeStyles.svelte';
	import StyleFormEditor from './components/_StyleFormEditor.svelte';
	import type { StyleDefinition } from './services/style-manager-types';
	import { toast } from '../components/shared/_Toast.svelte';
	import Modal from '../components/shared/_Modal.svelte';

	// State
	let styles = $state<StyleDefinition[]>([]);
	let selectedContentType = $state<string | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Modals
	let showEditModal = $state(false);
	let showCreateModal = $state(false);
	let showDeleteConfirm = $state(false);
	let styleToDelete = $state<string | null>(null);

	// Editor state
	let editorStyle = $state<StyleDefinition | null>(null);

	// Group styles by content type
	let contentTypeGroups = $derived.by(() => {
		const groups = new Map<string, StyleDefinition[]>();
		styles.forEach((style) => {
			const type = style.contentType || style.nodeType || style.baseType || 'Other';
			if (!groups.has(type)) {
				groups.set(type, []);
			}
			groups.get(type)!.push(style);
		});
		return Array.from(groups.entries())
			.map(([name, stylesList]) => ({
				name,
				count: stylesList.length
			}))
			.sort((a, b) => a.name.localeCompare(b.name));
	});

	// Get styles for selected content type
	let selectedStyles = $derived.by(() => {
		if (!selectedContentType) return [];
		return styles
			.filter(
				(s) =>
					s.contentType === selectedContentType ||
					s.nodeType === selectedContentType ||
					s.baseType === selectedContentType
			)
			.sort((a, b) => {
				// Default styles first
				if (a.isDefault && !b.isDefault) return -1;
				if (!a.isDefault && b.isDefault) return 1;
				return a.displayName.localeCompare(b.displayName);
			});
	});

	onMount(async () => {
		await loadStyles();
	});

	async function loadStyles() {
		loading = true;
		error = null;

		try {
			const response = await fetch('/opti-admin/api/styles/get-styles.json');
			if (!response.ok) throw new Error('Failed to load styles');

			const data = await response.json();
			styles = data.styles || [];
		} catch (err) {
			error = (err as Error).message;
			toast('Failed to load styles', 'error');
		} finally {
			loading = false;
		}
	}

	function handleSelectContentType(contentType: string) {
		selectedContentType = contentType;
	}

	function handleEdit(styleKey: string) {
		const style = styles.find((s) => s.key === styleKey);
		if (!style) return;

		editorStyle = style;
		showEditModal = true;
	}

	function handleCreate() {
		// Pre-fill the content type for the new style
		const newStyle: Partial<StyleDefinition> = {
			contentType: selectedContentType || undefined,
			settings: {}
		};
		editorStyle = newStyle as StyleDefinition;
		showCreateModal = true;
	}

	async function handleSaveStyle(style: StyleDefinition) {
		try {
			const response = await fetch('/opti-admin/api/styles/save-style.json', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(style)
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to save style');
			}

			toast('Style saved successfully', 'success');
			showEditModal = false;
			showCreateModal = false;
			await loadStyles();
		} catch (err) {
			toast(`Failed to save style: ${(err as Error).message}`, 'error');
		}
	}

	function confirmDelete(styleKey: string) {
		styleToDelete = styleKey;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		if (!styleToDelete) return;

		try {
			const response = await fetch(
				`/opti-admin/api/styles/delete-style.json?key=${encodeURIComponent(styleToDelete)}`,
				{
					method: 'DELETE'
				}
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete style');
			}

			toast('Style deleted successfully', 'success');
			showDeleteConfirm = false;
			styleToDelete = null;


			await loadStyles();
		} catch (err) {
			toast(`Failed to delete style: ${(err as Error).message}`, 'error');
		}
	}
</script>

<div class="flex flex-col h-screen bg-gray-50">
	<!-- Header -->
	<div class="flex items-center justify-between p-6 bg-white border-b border-gray-200">
		<div>
			<h2 class="text-2xl font-bold text-gray-900">Style Manager</h2>
			<p class="text-sm text-gray-600 mt-1">
				Manage CMS display templates with form-based editing
			</p>
		</div>
		<div class="flex items-center gap-3">
			<button
				type="button"
				onclick={loadStyles}
				disabled={loading}
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
			>
				<RefreshCw size={16} class={loading ? 'animate-spin' : ''} />
				Refresh
			</button>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex-1 flex overflow-hidden">
		<!-- Left Sidebar: Content Type List -->
		<div class="w-80 flex-shrink-0">
			{#if loading}
				<div class="flex items-center justify-center h-full bg-white">
					<div class="text-center">
						<RefreshCw size={32} class="animate-spin text-blue-600 mx-auto mb-4" />
						<p class="text-sm text-gray-600">Loading...</p>
					</div>
				</div>
			{:else if error}
				<div class="flex items-center justify-center h-full bg-white">
					<div class="text-center text-red-600 px-4">
						<p class="font-semibold mb-2">Error</p>
						<p class="text-sm">{error}</p>
					</div>
				</div>
			{:else}
				<ContentTypeList
					contentTypes={contentTypeGroups}
					selectedContentType={selectedContentType}
					onSelect={handleSelectContentType}
				/>
			{/if}
		</div>

		<!-- Main Panel: Styles for Selected Content Type -->
		<div class="flex-1 overflow-auto bg-gray-50">
			{#if loading}
				<!-- Loading handled in sidebar -->
			{:else if error}
				<!-- Error handled in sidebar -->
			{:else if !selectedContentType}
				<div class="flex items-center justify-center h-full">
					<div class="text-center text-gray-500">
						<p>Select a content type from the list to view its styles</p>
					</div>
				</div>
			{:else}
				<ContentTypeStyles
					contentType={selectedContentType}
					styles={selectedStyles}
					onEdit={handleEdit}
					onDelete={confirmDelete}
					onCreate={handleCreate}
				/>
			{/if}
		</div>
	</div>
</div>

<!-- Edit Modal -->
<Modal bind:open={showEditModal} title="Edit Style" size="full">
	{#snippet children()}
		{#if editorStyle}
			<StyleFormEditor
				style={editorStyle}
				onSave={handleSaveStyle}
				onCancel={() => (showEditModal = false)}
			/>
		{/if}
	{/snippet}
</Modal>

<!-- Create Modal -->
<Modal bind:open={showCreateModal} title="Create Style" size="full">
	{#snippet children()}
		<StyleFormEditor onSave={handleSaveStyle} onCancel={() => (showCreateModal = false)} />
	{/snippet}
</Modal>

<!-- Delete Confirmation Modal -->
<Modal bind:open={showDeleteConfirm} title="Confirm Delete" size="sm">
	{#snippet children()}
		<p class="text-gray-700">
			Are you sure you want to delete the style <strong>{styleToDelete}</strong>? This will remove
			it from the CMS.
		</p>
	{/snippet}
	{#snippet footer()}
		<button
			type="button"
			onclick={() => (showDeleteConfirm = false)}
			class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
		>
			Cancel
		</button>
		<button
			type="button"
			onclick={handleDelete}
			class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
		>
			Delete Style
		</button>
	{/snippet}
</Modal>
