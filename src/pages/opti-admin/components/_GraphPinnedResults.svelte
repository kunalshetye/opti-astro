<script lang="ts">
  import { onMount } from 'svelte';
  import StatusMessage from './shared/_StatusMessage.svelte';
  import NotesPanel from './shared/_NotesPanel.svelte';
  import LoadingSpinner from './shared/_LoadingSpinner.svelte';

  // Types
  interface Collection {
    id: string;
    title: string;
    isActive: boolean;
  }

  interface PinnedItem {
    id: string;
    phrases: string;
    targetKey: string;
    language: string;
    priority: number;
    isActive: boolean;
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
  let language = 'en';
  let priority = 1;
  let itemActive = true;
  let addingItem = false;

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
      const response = await fetch('/opti-admin/api/pinned-collections.json');
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
      const response = await fetch('/opti-admin/api/pinned-collections.json', {
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
        displayMessage(`Failed to create collection: ${result.message}`, false);
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
      const response = await fetch(`/opti-admin/api/pinned-items.json?collectionId=${collection.id}`);
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
      const response = await fetch('/opti-admin/api/pinned-collections.json', {
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
        displayMessage(`Failed to delete collection: ${result.message}`, false);
      }
    } catch (error) {
      displayMessage(error instanceof Error ? error.message : 'Failed to delete collection', false);
    } finally {
      deleting = false;
    }
  }

  async function handleAddPinnedItem(e: Event) {
    e.preventDefault();
    if (!selectedCollectionId || !phrases.trim() || !targetKey.trim()) return;

    addingItem = true;
    showMessage = false;

    try {
      const response = await fetch('/opti-admin/api/pinned-items.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId: selectedCollectionId,
          phrases,
          targetKey,
          language,
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
        language = 'en';
        priority = 1;
        itemActive = true;

        // Reload items if a collection is selected
        if (selectedCollection) {
          await selectCollection(selectedCollection);
        }
      } else {
        displayMessage(`Failed to add pinned item: ${result.message}`, false);
      }
    } catch (error) {
      displayMessage(error instanceof Error ? error.message : 'Failed to add pinned item', false);
    } finally {
      addingItem = false;
    }
  }

  async function deletePinnedItem(item: PinnedItem) {
    if (!confirm('Are you sure you want to delete this pinned item?')) return;

    try {
      await fetch('/opti-admin/api/pinned-items.json', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId: selectedCollectionId,
          itemId: item.id
        })
      });

      // Remove from local state
      pinnedItems = pinnedItems.filter(i => i.id !== item.id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  async function searchContent() {
    if (!searchQuery.trim()) return;

    searching = true;
    showSearchResults = false;
    searchResults = [];

    try {
      const response = await fetch('/opti-admin/api/content-search.json', {
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
    if (e.key === 'Escape' && showDeleteDialog) {
      hideDeleteDialog();
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
      <p class="mb-2"><strong>Collections:</strong> Group related pinned results together for easier management</p>
      <p class="mb-2"><strong>Search Phrases:</strong> When users search for these terms, your pinned content appears first</p>
      <p class="mb-2"><strong>Content GUIDs:</strong> Each pinned result targets specific content using its unique identifier</p>
      <p class="text-xs mt-3">Higher priority items (1-100) appear before lower priority items when multiple results match the same phrase.</p>
    </NotesPanel>

    <NotesPanel title="Important Notes" color="yellow">
      <ul class="list-disc list-inside space-y-1">
        <li>Only the top 5 pinned items per phrase are displayed in search results</li>
        <li>Changes are available in near real-time after creating pinned results</li>
        <li>Pinned items receive higher boost weights and appear before organic results</li>
        <li>If multiple items have the same phrase, priority determines display order</li>
        <li>Both collections and individual items must be active to appear in results</li>
      </ul>
    </NotesPanel>

    <NotesPanel title="Example Usage in GraphQL" color="green">
      <p class="mb-2">To use pinned results in your GraphQL queries, use the usePinned parameter:</p>
      <pre class="bg-green-100 p-3 rounded text-xs overflow-x-auto"><code>{`  Content(
    where: { _fulltext: { match: "water" } }
    usePinned: {
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
                    <div class="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                      <div class="flex items-center space-x-3">
                        <div class={`w-3 h-3 rounded-full ${collection.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        <div>
                          <p class="font-medium text-gray-900">{collection.title}</p>
                          <p class="text-xs text-gray-500">ID: {collection.id}</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <button
                          type="button"
                          on:click={() => selectCollection(collection)}
                          class="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Select
                        </button>
                        <button
                          type="button"
                          on:click={() => showDeleteConfirmation(collection)}
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

          <!-- Pinned Items in Selected Collection -->
          {#if selectedCollection}
            <div class="bg-white shadow-lg rounded-lg border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h2 class="text-xl font-semibold text-gray-900">
                  Items in "<span class="text-blue-600">{selectedCollection.title}</span>"
                </h2>
                <p class="text-sm text-gray-600 mt-1">Manage items pinned in the selected collection.</p>
              </div>
              <div class="p-6">
                {#if loadingItems}
                  <p class="text-gray-500 text-center py-4"><LoadingSpinner /> Loading items...</p>
                {:else if pinnedItems.length === 0}
                  <p class="text-gray-500 text-center py-4">No pinned items in this collection.</p>
                {:else}
                  <div class="space-y-3">
                    {#each pinnedItems as item}
                      <div class="p-3 border border-gray-200 rounded-md">
                        <div class="flex items-start justify-between">
                          <div>
                            <div class="mb-2">
                              {#each item.phrases.split('\n') as phrase}
                                <span class="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-1">{phrase}</span>
                              {/each}
                            </div>
                            <p class="text-xs text-gray-500 font-mono" title="Content GUID">{item.targetKey}</p>
                          </div>
                          <button
                            type="button"
                            on:click={() => deletePinnedItem(item)}
                            class="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                            title="Delete pinned item"
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
          <form on:submit={handleCreateCollection} class="p-6 space-y-4">
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
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                id="collectionActive"
                bind:checked={newCollectionActive}
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="collectionActive" class="ml-2 block text-sm text-gray-700">
                Active (collection and its items will be used in search)
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
                on:keydown={handleSearchKeydown}
                placeholder="Search for content..."
                class="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                on:click={searchContent}
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
                        <p class="text-xs text-gray-400">{result.contentType} • {result.language}</p>
                      </div>
                      <button
                        type="button"
                        on:click={(e) => selectSearchResult(result, e)}
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
          <form on:submit={handleAddPinnedItem} class="p-6 space-y-4">
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
                <p class="text-xs text-gray-500 mt-1">The GUID of the content to pin. Use the content search below to find it.</p>
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
                    placeholder="en"
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                    max="100"
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p class="text-xs text-gray-500 mt-1">Higher priority items appear first (1-100)</p>
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
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" on:click={handleDialogBackdropClick} on:keydown={(e) => e.key === 'Escape' && hideDeleteDialog()} role="dialog" aria-modal="true">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
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
            This action cannot be undone and will remove all pinned results in this collection.
          </p>
        </div>
        <div class="items-center px-4 py-3">
          <button
            type="button"
            on:click={confirmDeleteCollection}
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
            on:click={hideDeleteDialog}
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

<svelte:body on:keydown={handleEscapeKey} />
