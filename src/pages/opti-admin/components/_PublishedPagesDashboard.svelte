<script lang="ts">
  import { OPTIMIZELY_GRAPH_GATEWAY, OPTIMIZELY_GRAPH_SINGLE_KEY } from 'astro:env/client';
  import StatusMessage from './shared/_StatusMessage.svelte';
  import LoadingSpinner from './shared/_LoadingSpinner.svelte';

  interface PublishedPage {
    id: string;
    title: string;
    url: string;
    published: string;
    lastModified: string;
    owner: string;
    locale: string;
    status: string;
    baseUrl: string;
    contentType: string[];
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
  const daysToLookBack = 10;

  function displayMessage(text: string, isSuccess: boolean) {
    message = text;
    messageType = isSuccess ? 'success' : 'error';
    showMessage = true;
    setTimeout(() => {
      showMessage = false;
    }, 5000);
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
      // Calculate the date from 10 days ago
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - daysToLookBack);
      const dateFilter = tenDaysAgo.toISOString();

      // GraphQL query to fetch published pages from the last 10 days
      const query = `
        query GetPublishedPages {
          _Page(
            limit: 100
            orderBy: {
              _metadata: {
                published: DESC
              }
            }
            where: {
              _metadata: {
                status: {
                  eq: "Published"
                }
                published: {
                  gte: "${dateFilter}"
                }
              }
            }
          ) {
            total
            items {
              _id
              _metadata {
                displayName
                url {
                  default
                  base
                }
                published
                lastModified
                locale
                status
                key
                types
              }
              ... on ArticlePage {
                Author
              }
            }
          }
        }
      `;

      // Fetch from GraphQL endpoint
      console.log('GraphQL Endpoint:', OPTIMIZELY_GRAPH_GATEWAY);
      console.log('Query:', query);

      if (!OPTIMIZELY_GRAPH_GATEWAY || !OPTIMIZELY_GRAPH_SINGLE_KEY) {
        throw new Error('Missing GraphQL configuration. Please check your environment variables.');
      }

      const response = await fetch(`${OPTIMIZELY_GRAPH_GATEWAY}/content/v2?auth=${OPTIMIZELY_GRAPH_SINGLE_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('GraphQL result:', result);

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors[0]?.message || 'GraphQL query failed');
      }

      const items = result.data?._Page?.items || [];
      console.log('Total items found:', items.length);

      // Transform data
      pages = items.map((item: any) => ({
        id: item._id,
        title: item._metadata?.displayName || 'Untitled',
        url: item._metadata?.url?.default || '',
        published: item._metadata?.published || '',
        lastModified: item._metadata?.lastModified || '',
        owner: item.Author || extractOwner(item._metadata?.key || ''),
        locale: item._metadata?.locale || '',
        status: item._metadata?.status || '',
        baseUrl: item._metadata?.url?.base || '',
        contentType: item._metadata?.types || []
      }));

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

  function extractOwner(key: string): string {
    // Try to extract owner from content key if available
    // Format is typically something like "contentkey_owner_timestamp"
    // This is a simplified extraction - adjust based on your actual key format
    const parts = key.split('_');
    return parts.length > 1 ? parts[1] : 'Unknown';
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

  function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getActionColor(action?: string): string {
    switch (action) {
      case 'copy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'copy-with-changes':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ignore':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-white text-gray-700 border-gray-300';
    }
  }

  // Computed filtered pages
  let filteredPages = $derived(
    pages.filter(page => {
      // Filter out pages with no base URL
      const hasBaseUrl = page.baseUrl && page.baseUrl.trim() !== '';

      const matchesSearch = !searchQuery ||
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.owner.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocale = filterLocale === 'all' || page.locale === filterLocale;

      return hasBaseUrl && matchesSearch && matchesLocale;
    })
  );
</script>

<div class="max-w-7xl">
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
        on:click={loadPublishedPages}
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

  <!-- Pages List -->
  <div class="bg-white rounded-lg shadow-md border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">
        Published Pages ({filteredPages.length})
      </h3>
    </div>

    {#if isLoading}
      <div class="p-8 text-center">
        <LoadingSpinner />
        <p class="mt-2 text-gray-600">Loading published pages...</p>
      </div>
    {:else if filteredPages.length === 0}
      <div class="p-8 text-center text-gray-500">
        {#if searchQuery || filterLocale !== 'all'}
          No pages match your filters.
        {:else}
          No pages published in the last {daysToLookBack} days.
        {/if}
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published at</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each filteredPages as page (page.id)}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  <div class="max-w-xs">
                    <div class="truncate" title={page.title}>
                      {page.title}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      {page.locale}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div class="flex flex-col">
                    <span>{page.owner}</span>
                    {#if page.contentType.includes('ArticlePage')}
                      <span class="text-xs text-gray-500 mt-1">
                        (ArticlePage)
                      </span>
                    {/if}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div class="flex flex-col">
                    <span>{formatDate(page.published)}</span>
                    {#if page.published !== page.lastModified}
                      <span class="text-xs text-gray-500 mt-1">
                        Modified: {formatDate(page.lastModified)}
                      </span>
                    {/if}
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">
                  <div class="max-w-xs">
                    <code class="text-xs bg-gray-100 px-2 py-1 rounded truncate block" title={page.baseUrl}>
                      {page.baseUrl || 'N/A'}
                    </code>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <a
                    href={page.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    View
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex gap-2">
                    <button
                      on:click={() => setAction(page.id, 'copy')}
                      type="button"
                      class="px-3 py-1 text-xs font-semibold rounded border transition-colors {
                        page.action === 'copy'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }"
                    >
                      Copy as is
                    </button>
                    <button
                      on:click={() => setAction(page.id, 'copy-with-changes')}
                      type="button"
                      class="px-3 py-1 text-xs font-semibold rounded border transition-colors {
                        page.action === 'copy-with-changes'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }"
                    >
                      Copy + changes
                    </button>
                    <button
                      on:click={() => setAction(page.id, 'ignore')}
                      type="button"
                      class="px-3 py-1 text-xs font-semibold rounded border transition-colors {
                        page.action === 'ignore'
                          ? 'bg-gray-100 text-gray-800 border-gray-300'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }"
                    >
                      Ignore
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  <!-- Legend -->
  <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
    <h4 class="text-sm font-semibold text-blue-900 mb-2">Action Legend:</h4>
    <ul class="text-sm text-blue-800 space-y-1">
      <li><strong>Copy as is:</strong> Copy the page without modifications</li>
      <li><strong>Copy + changes:</strong> Copy the page and apply custom changes</li>
      <li><strong>Ignore:</strong> Skip this page from any bulk operations</li>
    </ul>
    <p class="text-xs text-blue-700 mt-3">
      Your selections are automatically saved to localStorage and will persist between sessions.
    </p>
  </div>
</div>
