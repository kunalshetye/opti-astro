<script lang="ts">
  import StatusMessage from '../../../shared/_StatusMessage.svelte';
  import LoadingSpinner from '../../../shared/_LoadingSpinner.svelte';
  import PublishedPagesChart from './_PublishedPagesChart.svelte';
  import PublishedPagesTable from './_PublishedPagesTable.svelte';

  interface PublishedPage {
    id: string;
    contentId: string;
    variationId: string | null;
    fullId: string;
    title: string;
    url: string;
    published: string;
    lastModified: string;
    owner: string;
    locale: string;
    status: string;
    baseUrl: string;
    contentType: string[];
    version: string | null;
    isVariation: boolean;
    variations?: PublishedPage[];
    action?: 'copy' | 'copy-with-changes' | 'ignore';
  }

  // State
  let pages = $state<PublishedPage[]>([]);
  let isLoading = $state(false);
  let message = $state('');
  let messageType = $state<'success' | 'error'>('success');
  let showMessage = $state(false);

  // Filter state
  let searchQuery = $state('');
  let filterLocale = $state<string>('all');
  let availableLocales = $state<string[]>([]);

  // Days to look back
  const daysToLookBack = 365;

  // Expanded state for variations
  let expandedRows = $state<Set<string>>(new Set());

  function displayMessage(text: string, isSuccess: boolean) {
    message = text;
    messageType = isSuccess ? 'success' : 'error';
    showMessage = true;
    setTimeout(() => {
      showMessage = false;
    }, 5000);
  }

  function toggleRow(contentId: string) {
    if (expandedRows.has(contentId)) {
      expandedRows.delete(contentId);
    } else {
      expandedRows.add(contentId);
    }
    expandedRows = new Set(expandedRows); // Trigger reactivity
  }

  // Load pages on mount
  $effect(() => {
    loadPublishedPages();
  });

  // Load saved actions from localStorage
  function loadSavedActions() {
    try {
      const saved = localStorage.getItem('opti-published-pages-actions');
      if (saved) {
        const actions: Record<string, 'copy' | 'copy-with-changes' | 'ignore'> = JSON.parse(saved);
        pages = pages.map(page => ({
          ...page,
          action: actions[page.id] || undefined
        }));
      }
    } catch (error) {
      console.error('Error loading saved actions:', error);
    }
  }

  // Save action to localStorage
  function saveAction(pageId: string, action: 'copy' | 'copy-with-changes' | 'ignore') {
    try {
      const saved = localStorage.getItem('opti-published-pages-actions');
      const actions: Record<string, 'copy' | 'copy-with-changes' | 'ignore'> = saved ? JSON.parse(saved) : {};
      actions[pageId] = action;
      localStorage.setItem('opti-published-pages-actions', JSON.stringify(actions));
    } catch (error) {
      console.error('Error saving action:', error);
    }
  }

  async function loadPublishedPages() {
    isLoading = true;
    showMessage = false;

    try {
      // Call server-side API instead of direct GraphQL
      const response = await fetch(`/opti-admin/api/reporting/published-pages.json?daysToLookBack=${daysToLookBack}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to load pages');
      }

      pages = result.data.pages;

      // Extract unique locales for filter
      const locales = new Set(pages.map(p => p.locale));
      availableLocales = Array.from(locales).sort();

      // Load saved actions
      loadSavedActions();

      displayMessage(`✅ Loaded ${pages.length} published pages`, true);
    } catch (error) {
      const errorMsg = '❌ Error loading pages: ' + (error instanceof Error ? error.message : 'Unknown error');
      displayMessage(errorMsg, false);
      console.error('Error loading published pages:', error);
    } finally {
      isLoading = false;
    }
  }

  function setAction(pageId: string, action: 'copy' | 'copy-with-changes' | 'ignore') {
    const index = pages.findIndex(p => p.id === pageId);
    if (index !== -1) {
      pages[index] = {
        ...pages[index],
        action
      };
      pages = [...pages]; // Trigger reactivity
      saveAction(pageId, action);
    }
  }

  // Computed filtered pages (maintains parent-child structure)
  let filteredPages = $derived(
    pages
      .filter(page => {
        // Filter out pages with no base URL
        const hasBaseUrl = page.baseUrl && page.baseUrl.trim() !== '';

        const matchesSearch = !searchQuery ||
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.owner.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocale = filterLocale === 'all' || page.locale === filterLocale;

        return hasBaseUrl && matchesSearch && matchesLocale;
      })
      .map(page => ({
        ...page,
        // Filter variations too
        variations: page.variations?.filter(variant => {
          const matchesSearch = !searchQuery ||
            variant.title.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesSearch;
        }) || []
      }))
  );
</script>

<div class="w-full">
  <!-- Info box explaining the action column -->
  <div class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div class="flex items-start gap-3">
      <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <div class="flex-1">
        <h3 class="text-sm font-semibold text-blue-900 mb-1">Action Tracking for Content Migration Planning</h3>
        <p class="text-sm text-blue-800">
          Use the <strong>Action</strong> column to mark pages for migration planning. Choose "Copy as is", "Copy + changes", or "Ignore" for each page.
          Your selections are automatically saved to your browser's localStorage and persist between sessions.
        </p>
      </div>
    </div>
  </div>

  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Published Pages Dashboard</h1>
    <p class="text-gray-600">Overview of pages published in the last <strong>{daysToLookBack} days</strong></p>
  </div>

  {#if showMessage}
    <StatusMessage {message} type={messageType} />
  {/if}

  <!-- Actions Bar -->
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-6">
    <div class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      <button
        onclick={loadPublishedPages}
        disabled={isLoading}
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {#if isLoading}
          <LoadingSpinner size="sm" />
        {:else}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        {/if}
        Refresh
      </button>

      <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search pages..."
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <select
          bind:value={filterLocale}
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="all">All Locales</option>
          {#each availableLocales as locale}
            <option value={locale}>{locale}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <!-- Charts -->
  {#if !isLoading && filteredPages.length > 0}
    <PublishedPagesChart pages={filteredPages} />
  {/if}

  <!-- Pages Table -->
  <PublishedPagesTable
    pages={filteredPages}
    {isLoading}
    {searchQuery}
    {filterLocale}
    {daysToLookBack}
    {expandedRows}
    onToggleRow={toggleRow}
    onSetAction={setAction}
  />
</div>
