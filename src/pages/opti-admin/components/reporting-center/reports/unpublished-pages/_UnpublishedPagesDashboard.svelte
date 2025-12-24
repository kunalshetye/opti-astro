<script lang="ts">
  import StatusMessage from '../../../shared/_StatusMessage.svelte';
  import LoadingSpinner from '../../../shared/_LoadingSpinner.svelte';
  import WipBadge from '../../../shared/_WipBadge.svelte';
  import UnpublishedPagesChart from './_UnpublishedPagesChart.svelte';
  import UnpublishedPagesTable from './_UnpublishedPagesTable.svelte';

  interface UnpublishedPage {
    id: string;
    contentId: string;
    variationId: string | null;
    fullId: string;
    title: string;
    url: string;
    created: string;
    lastModified: string;
    owner: string;
    locale: string;
    status: string;
    baseUrl: string;
    contentType: string[];
    version: string | null;
    isVariation: boolean;
    variations?: UnpublishedPage[];
  }

  // State
  let pages = $state<UnpublishedPage[]>([]);
  let isLoading = $state(false);
  let message = $state('');
  let messageType = $state<'success' | 'error'>('success');
  let showMessage = $state(false);

  // Filter state
  let searchQuery = $state('');
  let filterLocale = $state<string>('all');
  let availableLocales = $state<string[]>([]);

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
    loadUnpublishedPages();
  });

  async function loadUnpublishedPages() {
    isLoading = true;
    showMessage = false;

    try {
      // Call server-side API instead of direct GraphQL
      const response = await fetch('/opti-admin/api/reporting/unpublished-pages.json');

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

      displayMessage(`✅ Loaded ${pages.length} draft pages`, true);
    } catch (error) {
      const errorMsg = '❌ Error loading pages: ' + (error instanceof Error ? error.message : 'Unknown error');
      displayMessage(errorMsg, false);
      console.error('Error loading unpublished pages:', error);
    } finally {
      isLoading = false;
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
  <WipBadge size="large" message="This feature is actively being developed. Showing all draft pages awaiting publication." />

  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Unpublished Pages Dashboard</h1>
    <p class="text-gray-600">Overview of all draft pages awaiting publication</p>
  </div>

  {#if showMessage}
    <StatusMessage {message} type={messageType} />
  {/if}

  <!-- Actions Bar -->
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-6">
    <div class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      <button
        onclick={loadUnpublishedPages}
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
          placeholder="Search draft pages..."
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
    <UnpublishedPagesChart pages={filteredPages} />
  {/if}

  <!-- Pages Table -->
  <UnpublishedPagesTable
    pages={filteredPages}
    {isLoading}
    {searchQuery}
    {filterLocale}
    {expandedRows}
    onToggleRow={toggleRow}
  />
</div>
