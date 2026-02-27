<script lang="ts">
  import { onMount } from 'svelte';
  import StatusMessage from './shared/_StatusMessage.svelte';
  import NotesPanel from './shared/_NotesPanel.svelte';
  import LoadingSpinner from './shared/_LoadingSpinner.svelte';

  // Types
  interface Collection {
    id: string;
    title: string;
    key: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  interface PinnedItem {
    id: string;
    phrases: string;
    targetKey: string;
    language: string | null;
    priority: number;
    isActive: boolean;
    collectionId?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  interface SearchResult {
    guid: string;
    name: string;
    url?: string;
    contentType: string;
    language: string;
  }

  // State - Collections
  let collections: Collection[] = [];
  let selectedCollection: Collection | null = null;
  let loadingCollections = false;

  // State - Pinned Items
  let pinnedItems: PinnedItem[] = [];
  let loadingItems = false;

  // State - Forms
  let newCollectionTitle = '';
  let newCollectionActive = true;
  let creatingCollection = false;

  let selectedCollectionId = '';
  let phrases = '';
  let targetKey = '';
  let language = '';
  let priority = 1000;
  let itemActive = true;
  let addingItem = false;

  // State - Edit Collection
  let editingCollection: Collection | null = null;
  let editCollectionTitle = '';
  let editCollectionActive = false;
  let updatingCollection = false;

  // State - Edit Item
  let editingItem: PinnedItem | null = null;
  let editItemPhrases = '';
  let editItemTargetKey = '';
  let editItemLanguage = '';
  let editItemPriority = 1000;
  let editItemActive = true;
  let updatingItem = false;

  // State - Content Search
  let searchQuery = '';
  let searchResults: SearchResult[] = [];
  let searching = false;
  let showSearchResults = false;

  // State - Delete Dialog
  let showDeleteDialog = false;
  let collectionToDelete: { id: string; title: string } | null = null;
  let deleting = false;

  // State - Messages
  let message = '';
  let messageType: 'success' | 'error' = 'success';
  let showMessage = false;

  // Load collections on mount
  onMount(async () => {
    await loadCollections();
  });

  function displayMessage(text: string, isSuccess: boolean) {
    message = text;
    messageType = isSuccess ? 'success' : 'error';
    showMessage = true;
    setTimeout(() => {
      showMessage = false;
    }, 5000);
  }

  async function loadCollections() {
    loadingCollections = true;
    try {
      const response = await fetch('/opti-admin/api/pinned/collections.json');
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        collections = result.data;
      } else {
        console.error('Failed to load collections:', result.message);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      loadingCollections = false;
    }
  }

  async function handleCreateCollection(e: Event) {
    e.preventDefault();
    if (!newCollectionTitle.trim()) return;

    creatingCollection = true;
    showMessage = false;

    try {
      const response = await fetch('/opti-admin/api/pinned/collections.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCollectionTitle,
          isActive: newCollectionActive
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        displayMessage(`Collection "${newCollectionTitle}" created successfully!`, true);
        newCollectionTitle = '';
        newCollectionActive = true;
        await loadCollections();
      } else {
        displayMessage(`Failed to create collection: ${result.error || result.message}`, false);
      }
    } catch (error) {
      displayMessage(error instanceof Error ? error.message : 'Failed to create collection', false);
    } finally {
      creatingCollection = false;
    }
  }

  async function selectCollection(collection: Collection) {
    selectedCollection = collection;
    selectedCollectionId = collection.id;
    loadingItems = true;
    pinnedItems = [];

    try {
      const response = await fetch(`/opti-admin/api/pinned/items.json?collectionId=${collection.id}`);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        pinnedItems = result.data;
      } else {
        console.error('Failed to load items:', result.message);
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      loadingItems = false;
    }
  }

  // --- Edit Collection ---
  function startEditCollection(collection: Collection) {
    editingCollection = collection;
    editCollectionTitle = collection.title;
    editCollectionActive = collection.isActive;
  }

  function cancelEditCollection() {
    editingCollection = null;
  }

  async function saveEditCollection() {
    if (!editingCollection) return;

    const editedId = editingCollection.id;
    updatingCollection = true;
    try {
      const response = await fetch('/opti-admin/api/pinned/collections.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editedId,
          title: editCollectionTitle,
          isActive: editCollectionActive
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        displayMessage('Collection updated successfully!', true);
        editingCollection = null;
        await loadCollections();
        // Refresh selected collection if it was the one edited
        if (selectedCollection?.id === editedId) {
          const updated = collections.find(c => c.id === editedId);
          if (updated) selectedCollection = updated;
        }
      } else {
        displayMessage(`Failed to update collection: ${result.error || result.message}`, false);
      }
    } catch (error) {
      displayMessage(error instanceof Error ? error.message : 'Failed to update collection', false);
    } finally {
      updatingCollection = false;
    }
  }

  async function toggleCollectionActive(collection: Collection) {
    try {
      const response = await fetch('/opti-admin/api/pinned/collections.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: collection.id,
          isActive: !collection.isActive
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        displayMessage(`Collection "${collection.title}" ${!collection.isActive ? 'activated' : 'deactivated'}`, true);
        await loadCollections();
      } else {
        displayMessage(`Failed to toggle collection: ${result.error || result.message}`, false);
      }
    } catch (error) {
      displayMessage(error instanceof Error ? error.message : 'Failed to toggle collection', false);
    }
  }

  // --- Delete Collection ---
  function showDeleteConfirmation(collection: Collection) {
    collectionToDelete = { id: collection.id, title: collection.title };
    showDeleteDialog = true;
  }

  function hideDeleteDialog() {
    showDeleteDialog = false;
    collectionToDelete = null;
  }

  async function confirmDeleteCollection() {
    if (!collectionToDelete) return;

    deleting = true;
    try {
      const response = await fetch('/opti-admin/api/pinned/collections.json', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: collectionToDelete.id })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        displayMessage(`Collection "${collectionToDelete.title}" deleted successfully!`, true);

        // Clear selection if deleted collection was selected
        if (selectedCollection?.id === collectionToDelete.id) {
          selectedCollection = null;
          selectedCollectionId = '';
          pinnedItems = [];
        }

        await loadCollections();
        hideDeleteDialog();
      } else {
        displayMessage(`Failed to delete collection: ${result.error || result.message}`, false);
      }
    } catch (error) {
      displayMessage(error instanceof Error ? error.message : 'Failed to delete collection', false);
    } finally {
      deleting = false;
    }
  }

  // --- Pinned Items ---
  async function handleAddPinnedItem(e: Event) {
    e.preventDefault();
    if (!selectedCollectionId || !phrases.trim() || !targetKey.trim()) return;

    addingItem = true;
    showMessage = false;

    try {
      const response = await fetch('/opti-admin/api/pinned/items.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId: selectedCollectionId,
          phrases,
          targetKey,
          language: language || null,
          priority,
          isActive: itemActive
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        displayMessage('Pinned item added successfully!', true);

        // Clear form
        phrases = '';
        targetKey = '';
        language = '';
        priority = 1000;
        itemActive = true;

        // Reload items if a collection is selected
        if (selectedCollection) {
          await selectCollection(selectedCollection);
        }
      } else {
        displayMessage(`Failed to add pinned item: ${result.error || result.message}`, false);
      }
    } catch (error) {
      displayMessage(error instanceof Error ? error.message : 'Failed to add pinned item', false);
    } finally {
      addingItem = false;
    }
  }

  // --- Edit Item ---
  function startEditItem(item: PinnedItem) {
    editingItem = item;
    editItemPhrases = item.phrases;
    editItemTargetKey = item.targetKey;
    editItemLanguage = item.language || '';
    editItemPriority = item.priority;
    editItemActive = item.isActive;
  }

  function cancelEditItem() {
    editingItem = null;
  }

  async function saveEditItem() {
    if (!editingItem) return;

    updatingItem = true;
    try {
      const response = await fetch('/opti-admin/api/pinned/items.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId: selectedCollectionId,
          itemId: editingItem.id,
          phrases: editItemPhrases,
          targetKey: editItemTargetKey,
          language: editItemLanguage || null,
          priority: editItemPriority,
          isActive: editItemActive
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        displayMessage('Pinned item updated successfully!', true);
        editingItem = null;
        // Reload items
        if (selectedCollection) {
          await selectCollection(selectedCollection);
        }
      } else {
        displayMessage(`Failed to update item: ${result.error || result.message}`, false);
      }
    } catch (error) {
      displayMessage(error instanceof Error ? error.message : 'Failed to update item', false);
    } finally {
      updatingItem = false;
    }
  }

  async function toggleItemActive(item: PinnedItem) {
    try {
      const response = await fetch('/opti-admin/api/pinned/items.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId: selectedCollectionId,
          itemId: item.id,
          isActive: !item.isActive
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        displayMessage(`Item ${!item.isActive ? 'activated' : 'deactivated'}`, true);
        if (selectedCollection) {
          await selectCollection(selectedCollection);
        }
      } else {
        displayMessage(`Failed to toggle item: ${result.error || result.message}`, false);
      }
    } catch (error) {
      displayMessage(error instanceof Error ? error.message : 'Failed to toggle item', false);
    }
  }

  async function deletePinnedItem(item: PinnedItem) {
    if (!confirm('Are you sure you want to delete this pinned item?')) return;

    try {
      const response = await fetch('/opti-admin/api/pinned/items.json', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId: selectedCollectionId,
          itemId: item.id
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        displayMessage('Pinned item deleted', true);
        pinnedItems = pinnedItems.filter(i => i.id !== item.id);
      } else {
        displayMessage(`Failed to delete item: ${result.error || result.message}`, false);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  // --- Content Search ---
  async function searchContent() {
    if (!searchQuery.trim()) return;

    searching = true;
    showSearchResults = false;
    searchResults = [];

    try {
      const response = await fetch('/opti-admin/api/cms-sync/content-search.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: 10 })
      });

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        searchResults = result.data;
        showSearchResults = true;
      } else {
        console.error('Search failed:', result.message);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      searching = false;
    }
  }

  function selectSearchResult(result: SearchResult, e: MouseEvent) {
    targetKey = result.guid;

    // Show visual feedback
    const btn = e.target as HTMLButtonElement;
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.className = 'text-green-600 hover:text-green-800 text-sm font-medium';

      setTimeout(() => {
        btn.textContent = originalText || 'Select Page';
        btn.className = 'text-blue-600 hover:text-blue-800 text-sm font-medium';
      }, 2000);
    }
  }

  function handleSearchKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchContent();
    }
  }

  function handleDialogBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      hideDeleteDialog();
    }
  }

  function handleEscapeKey(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (showDeleteDialog) hideDeleteDialog();
      if (editingCollection) cancelEditCollection();
      if (editingItem) cancelEditItem();
    }
  }

  // Handle escape key
  onMount(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  });
</script>

<div class="max-w-6xl">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Pinned Results Manager</h1>
    <p class="text-gray-600">
      Manage collections and pinned results for Optimizely Graph search. Pinned results promote specific content
      when users search for particular phrases, displaying them at the top of search results.
    </p>
  </div>

  <!-- Notes Section -->
  <div class="mb-6 space-y-3">
    <h2 class="text-xl font-semibold text-gray-900 mb-3">Notes</h2>

    <NotesPanel title="How Pinned Results Work" color="blue">
      <p class="mb-2"><strong>Collections:</strong> Group related pinned results together for easier management. Collections must be <strong>active</strong> for their items to appear in search.</p>
      <p class="mb-2"><strong>Search Phrases:</strong> When users search for these terms, your pinned content appears first</p>
      <p class="mb-2"><strong>Content GUIDs:</strong> Each pinned result targets specific content using its unique identifier</p>
      <p class="text-xs mt-3">Priority determines display order when multiple items match the same phrase (default: 1000).</p>
    </NotesPanel>

    <NotesPanel title="Important Notes" color="yellow">
      <ul class="list-disc list-inside space-y-1">
        <li>Only the top 5 pinned items per phrase are displayed in search results</li>
        <li>Changes are available in near real-time after creating pinned results</li>
        <li>Pinned items receive higher boost weights and appear before organic results</li>
        <li>If multiple items have the same phrase, priority determines display order</li>
        <li>Both collections and individual items must be active to appear in results</li>
        <li>Language can be left empty to match all languages</li>
      </ul>
    </NotesPanel>

    <NotesPanel title="Example Usage in GraphQL" color="green">
      <p class="mb-2">To use pinned results in your GraphQL queries, use the pinned parameter:</p>
      <pre class="bg-green-100 p-3 rounded text-xs overflow-x-auto"><code>{`  Content(
    where: { _fulltext: { match: "water" } }
    pinned: {
      phrase: "water",
      collectionId: "your-collection-id"
    }
  ) {
    items {
      _score
      _id
      Name
      MainBody
    }
  }`}</code></pre>
      <p class="mt-2 text-xs">Pinned results will appear at the top with higher boost weights when the search phrase matches.</p>
    </NotesPanel>
  </div>

  <!-- Status Messages -->
  <StatusMessage {message} type={messageType} visible={showMessage} />

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-start">
    <!-- Left Column: Collections Management -->
    <div class="space-y-8">
      <!-- Browsing Section -->
      <div>
        <h2 class="text-lg font-semibold text-gray-700 mb-4 flex items-center h-7">
          <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          Browse Collections & Items
        </h2>

        <div class="space-y-6">
          <!-- Existing Collections -->
          <div class="bg-white shadow-lg rounded-lg border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <h2 class="text-xl font-semibold text-gray-900">Existing Collections</h2>
              <p class="text-sm text-gray-600 mt-1">Select a collection to manage its pinned results</p>
            </div>
            <div class="p-6">
              {#if loadingCollections}
                <p class="text-gray-500 text-center py-4"><LoadingSpinner /> Loading collections...</p>
              {:else if collections.length === 0}
                <p class="text-gray-500 text-center py-4">No collections found. Create one below to get started.</p>
              {:else}
                <div class="space-y-3">
                  {#each collections as collection}
                    <div class="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 {selectedCollection?.id === collection.id ? 'ring-2 ring-blue-400 bg-blue-50' : ''}">
                      <div class="flex items-center space-x-3">
                        <button
                          type="button"
                          onclick={() => toggleCollectionActive(collection)}
                          class="flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 {collection.isActive ? 'bg-green-500' : 'bg-gray-300'} relative"
                          title="{collection.isActive ? 'Active - click to deactivate' : 'Inactive - click to activate'}"
                        >
                          <span class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 {collection.isActive ? 'translate-x-5' : 'translate-x-0'}"></span>
                        </button>
                        <div>
                          <p class="font-medium text-gray-900">{collection.title}</p>
                          <p class="text-xs text-gray-500">
                            Key: {collection.key || '—'} &bull; ID: {collection.id}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <button
                          type="button"
                          onclick={() => selectCollection(collection)}
                          class="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Select
                        </button>
                        <button
                          type="button"
                          onclick={() => startEditCollection(collection)}
                          class="text-gray-600 hover:text-gray-800 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100"
                          title="Edit collection"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onclick={() => showDeleteConfirmation(collection)}
                          class="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                          title="Delete collection"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          </div>

          <!-- Edit Collection Inline Form -->
          {#if editingCollection}
            <div class="bg-white shadow-lg rounded-lg border border-yellow-300">
              <div class="px-6 py-4 border-b border-yellow-200 bg-yellow-50 rounded-t-lg">
                <h2 class="text-xl font-semibold text-gray-900">Edit Collection</h2>
                <p class="text-sm text-gray-600 mt-1">Editing: <strong>{editingCollection.title}</strong></p>
              </div>
              <div class="p-6 space-y-4">
                <div>
                  <label for="editCollectionTitle" class="block text-sm font-medium text-gray-700 mb-2">
                    Collection Title
                  </label>
                  <input
                    type="text"
                    id="editCollectionTitle"
                    bind:value={editCollectionTitle}
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="editCollectionActive"
                    bind:checked={editCollectionActive}
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="editCollectionActive" class="ml-2 block text-sm text-gray-700">
                    Active (collection and its items will appear in search results)
                  </label>
                </div>

                <div class="flex space-x-2">
                  <button
                    type="button"
                    onclick={saveEditCollection}
                    disabled={updatingCollection}
                    class="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200 disabled:bg-gray-400"
                  >
                    {#if updatingCollection}
                      <LoadingSpinner size="sm" /> Saving...
                    {:else}
                      Save Changes
                    {/if}
                  </button>
                  <button
                    type="button"
                    onclick={cancelEditCollection}
                    class="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          {/if}

          <!-- Pinned Items in Selected Collection -->
          {#if selectedCollection}
            <div class="bg-white shadow-lg rounded-lg border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h2 class="text-xl font-semibold text-gray-900">
                  Items in "<span class="text-blue-600">{selectedCollection.title}</span>"
                </h2>
                <p class="text-sm text-gray-600 mt-1">
                  Manage items pinned in the selected collection.
                  {#if !selectedCollection.isActive}
                    <span class="text-orange-600 font-medium"> (Collection is inactive — items won't appear in search)</span>
                  {/if}
                </p>
              </div>
              <div class="p-6">
                {#if loadingItems}
                  <p class="text-gray-500 text-center py-4"><LoadingSpinner /> Loading items...</p>
                {:else if pinnedItems.length === 0}
                  <p class="text-gray-500 text-center py-4">No pinned items in this collection.</p>
                {:else}
                  <div class="space-y-3">
                    {#each pinnedItems as item}
                      <div class="p-3 border border-gray-200 rounded-md {!item.isActive ? 'opacity-60 bg-gray-50' : ''}">
                        {#if editingItem?.id === item.id}
                          <!-- Inline Edit Form -->
                          <div class="space-y-3">
                            <div>
                              <label for="editPhrases_{item.id}" class="block text-xs font-medium text-gray-600 mb-1">Phrases (one per line)</label>
                              <textarea
                                id="editPhrases_{item.id}"
                                bind:value={editItemPhrases}
                                rows="2"
                                class="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-500"
                              ></textarea>
                            </div>
                            <div>
                              <label for="editTargetKey_{item.id}" class="block text-xs font-medium text-gray-600 mb-1">Content GUID</label>
                              <input
                                id="editTargetKey_{item.id}"
                                type="text"
                                bind:value={editItemTargetKey}
                                class="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-500"
                              />
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                              <div>
                                <label for="editLanguage_{item.id}" class="block text-xs font-medium text-gray-600 mb-1">Language</label>
                                <input
                                  id="editLanguage_{item.id}"
                                  type="text"
                                  bind:value={editItemLanguage}
                                  placeholder="(all languages)"
                                  class="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-500"
                                />
                              </div>
                              <div>
                                <label for="editPriority_{item.id}" class="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                                <input
                                  id="editPriority_{item.id}"
                                  type="number"
                                  bind:value={editItemPriority}
                                  min="1"
                                  class="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-500"
                                />
                              </div>
                            </div>
                            <div class="flex items-center">
                              <input
                                type="checkbox"
                                bind:checked={editItemActive}
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span class="ml-2 text-sm text-gray-700">Active</span>
                            </div>
                            <div class="flex space-x-2">
                              <button
                                type="button"
                                onclick={saveEditItem}
                                disabled={updatingItem}
                                class="bg-yellow-500 text-white text-sm py-1 px-3 rounded hover:bg-yellow-600 disabled:bg-gray-400"
                              >
                                {#if updatingItem}
                                  <LoadingSpinner size="sm" /> Saving...
                                {:else}
                                  Save
                                {/if}
                              </button>
                              <button
                                type="button"
                                onclick={cancelEditItem}
                                class="bg-gray-300 text-gray-700 text-sm py-1 px-3 rounded hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        {:else}
                          <!-- Display Mode -->
                          <div class="flex items-start justify-between">
                            <div class="flex items-start space-x-3">
                              <button
                                type="button"
                                onclick={() => toggleItemActive(item)}
                                class="flex-shrink-0 mt-1 w-8 h-4 rounded-full transition-colors duration-200 {item.isActive ? 'bg-green-500' : 'bg-gray-300'} relative"
                                title="{item.isActive ? 'Active - click to deactivate' : 'Inactive - click to activate'}"
                              >
                                <span class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 {item.isActive ? 'translate-x-4' : 'translate-x-0'}"></span>
                              </button>
                              <div>
                                <div class="mb-2">
                                  {#each item.phrases.split('\n') as phrase}
                                    <span class="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-1">{phrase}</span>
                                  {/each}
                                </div>
                                <p class="text-xs text-gray-500 font-mono" title="Content GUID">{item.targetKey}</p>
                                <p class="text-xs text-gray-400">
                                  Priority: {item.priority}
                                  {#if item.language}
                                    &bull; Lang: {item.language}
                                  {:else}
                                    &bull; All languages
                                  {/if}
                                </p>
                              </div>
                            </div>
                            <div class="flex items-center space-x-1">
                              <button
                                type="button"
                                onclick={() => startEditItem(item)}
                                class="text-gray-500 hover:text-gray-700 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100"
                                title="Edit item"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onclick={() => deletePinnedItem(item)}
                                class="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                                title="Delete pinned item"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        {/if}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Creation Section -->
      <div>
        <h2 class="text-lg font-semibold text-gray-700 mb-4 flex items-center h-7">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New Collection
        </h2>

        <!-- Create New Collection -->
        <div class="bg-white shadow-lg rounded-lg border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h2 class="text-xl font-semibold text-gray-900">Create Collection</h2>
            <p class="text-sm text-gray-600 mt-1">Collections group pinned results together for management</p>
          </div>
          <form onsubmit={handleCreateCollection} class="p-6 space-y-4">
            <div>
              <label for="collectionTitle" class="block text-sm font-medium text-gray-700 mb-2">
                Collection Title
              </label>
              <input
                type="text"
                id="collectionTitle"
                bind:value={newCollectionTitle}
                required
                placeholder="e.g., Homepage Promotions"
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="text-xs text-gray-500 mt-1">A unique key will be auto-generated from the title.</p>
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                id="newCollectionActive"
                bind:checked={newCollectionActive}
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="newCollectionActive" class="ml-2 block text-sm text-gray-700">
                Active (collection and its items will appear in search results)
              </label>
            </div>

            <button
              type="submit"
              disabled={creatingCollection}
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:bg-gray-400"
            >
              {#if creatingCollection}
                <LoadingSpinner /> Creating...
              {:else}
                Create Collection
              {/if}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Right Column: Pinned Items Management -->
    <div class="space-y-8">
      <!-- Search Section -->
      <div>
        <h2 class="text-lg font-semibold text-gray-700 mb-4 flex items-center h-7">
          <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          Search for Content
        </h2>

        <!-- Content Search Helper -->
        <div class="bg-white shadow-lg rounded-lg border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h2 class="text-xl font-semibold text-gray-900">Find Content</h2>
            <p class="text-sm text-gray-600 mt-1">Search for content to get its GUID for pinned results</p>
          </div>
          <div class="p-6">
            <div class="flex space-x-2">
              <input
                type="text"
                bind:value={searchQuery}
                onkeydown={handleSearchKeydown}
                placeholder="Search for content..."
                class="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onclick={searchContent}
                disabled={searching}
                class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 disabled:bg-gray-400"
              >
                {#if searching}
                  <LoadingSpinner />
                {:else}
                  Search
                {/if}
              </button>
            </div>
          </div>

          {#if showSearchResults}
            <div class="px-6 pb-6">
              <h3 class="font-medium text-gray-900 mb-3">Search Results:</h3>
              {#if searchResults.length === 0}
                <p class="text-sm text-gray-500">No results found.</p>
              {:else}
                <div class="space-y-2 max-h-64 overflow-y-auto">
                  {#each searchResults as result}
                    <div class="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                      <div>
                        <p class="font-medium text-gray-900 text-sm">
                          {result.name || 'Untitled'}
                          {#if result.url}
                            <a href={result.url} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline text-xs ml-2" title="Open content in new tab">[view page]</a>
                          {/if}
                        </p>
                        <p class="text-xs text-gray-500 font-mono">{result.guid}</p>
                        <p class="text-xs text-gray-400">{result.contentType} &bull; {result.language}</p>
                      </div>
                      <button
                        type="button"
                        onclick={(e) => selectSearchResult(result, e)}
                        role="button"
                        tabindex="0"
                        onkeydown={(e) => e.key === 'Enter' && selectSearchResult(result, e)}
                        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Select Page
                      </button>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>

      <!-- Add/Update Section -->
      <div>
        <h2 class="text-lg font-semibold text-gray-700 mb-4 flex items-center h-7">
          <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
          </svg>
          Add Pinned Result
        </h2>

        <!-- Add Pinned Item -->
        <div class="bg-white shadow-lg rounded-lg border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h2 class="text-xl font-semibold text-gray-900">Add Pinned Result</h2>
            <p class="text-sm text-gray-600 mt-1">Add content to be pinned for specific search phrases</p>
          </div>
          <form onsubmit={handleAddPinnedItem} class="p-6 space-y-4">
            {#if !selectedCollectionId}
              <div class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
                <p class="text-sm">Please select a collection from the left panel first.</p>
              </div>
            {:else}
              <div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                <p class="text-sm">Selected collection: <strong>{selectedCollection?.title}</strong></p>
              </div>

              <div>
                <label for="phrases" class="block text-sm font-medium text-gray-700 mb-2">
                  Search Phrases
                </label>
                <textarea
                  id="phrases"
                  bind:value={phrases}
                  rows="3"
                  required
                  placeholder="Enter one phrase per line, e.g.&#10;water bottle&#10;hydration&#10;drink water"
                  class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">One phrase per line. These phrases will trigger this pinned result.</p>
              </div>

              <div>
                <label for="targetKey" class="block text-sm font-medium text-gray-700 mb-2">
                  Content GUID
                </label>
                <input
                  type="text"
                  id="targetKey"
                  bind:value={targetKey}
                  required
                  placeholder="e.g., 12345678-1234-5678-9abc-123456789abc"
                  class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p class="text-xs text-gray-500 mt-1">The GUID of the content to pin. Use the content search above to find it.</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="language" class="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    id="language"
                    bind:value={language}
                    placeholder="(all languages)"
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p class="text-xs text-gray-500 mt-1">Leave empty for all languages</p>
                </div>

                <div>
                  <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <input
                    type="number"
                    id="priority"
                    bind:value={priority}
                    min="1"
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p class="text-xs text-gray-500 mt-1">Lower values = higher priority (default: 1000)</p>
                </div>
              </div>

              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="itemActive"
                  bind:checked={itemActive}
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="itemActive" class="ml-2 block text-sm text-gray-700">
                  Active (item will be used in search results)
                </label>
              </div>

              <button
                type="submit"
                disabled={addingItem}
                class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:bg-gray-400"
              >
                {#if addingItem}
                  <LoadingSpinner /> Adding...
                {:else}
                  Add Pinned Result
                {/if}
              </button>
            {/if}
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Delete Collection Confirmation Dialog -->
{#if showDeleteDialog && collectionToDelete}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onclick={handleDialogBackdropClick} onkeydown={(e) => e.key === 'Escape' && hideDeleteDialog()}>
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" role="dialog" aria-modal="true">
      <div class="mt-3 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">Delete Collection</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">
            Are you sure you want to delete the collection "<span class="font-semibold">{collectionToDelete.title}</span>"?
          </p>
          <p class="text-sm text-red-600 font-medium mt-2">
            All pinned items in this collection will be permanently deleted first. This action cannot be undone.
          </p>
        </div>
        <div class="items-center px-4 py-3">
          <button
            type="button"
            onclick={confirmDeleteCollection}
            disabled={deleting}
            class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:bg-gray-400"
          >
            {#if deleting}
              <LoadingSpinner size="sm" />
            {:else}
              Delete
            {/if}
          </button>
          <button
            type="button"
            onclick={hideDeleteDialog}
            disabled={deleting}
            class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<svelte:body onkeydown={handleEscapeKey} />
