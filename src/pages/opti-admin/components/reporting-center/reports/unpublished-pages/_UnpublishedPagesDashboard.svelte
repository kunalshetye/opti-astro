<script lang="ts">
  import { OPTIMIZELY_GRAPH_GATEWAY, OPTIMIZELY_GRAPH_APP_KEY, OPTIMIZELY_GRAPH_SECRET } from 'astro:env/client';
  import StatusMessage from '../../../shared/_StatusMessage.svelte';
  import LoadingSpinner from '../../../shared/_LoadingSpinner.svelte';
  import WipBadge from '../../../shared/_WipBadge.svelte';
  import UnpublishedPagesChart from './_UnpublishedPagesChart.svelte';
  import UnpublishedPagesTable from './_UnpublishedPagesTable.svelte';

  interface UnpublishedPage {
    id: string;
    title: string;
    url: string;
    created: string;
    lastModified: string;
    owner: string;
    locale: string;
    status: string;
    baseUrl: string;
    contentType: string[];
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
    loadUnpublishedPages();
  });

  async function loadUnpublishedPages() {
    isLoading = true;
    showMessage = false;

    try {
      // GraphQL query to fetch draft/unpublished page versions
      // Using App Key + Secret authentication with status filter
      // Status "Published" means live, anything else (like empty/null) means draft
      const query = `
        query GetUnpublishedPages {
          _Page(
            limit: 100
            orderBy: {
              _metadata: {
                lastModified: DESC
              }
            }
            where: {
              _metadata: {
                status: {
                  notEq: "Published"
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
                created
                lastModified
                locale
                status
                key
                types
                published
                version
              }
              ... on ArticlePage {
                Author
              }
            }
          }
        }
      `;

      // Fetch from GraphQL endpoint using App Key + Secret for draft content access
      console.log('GraphQL Endpoint:', OPTIMIZELY_GRAPH_GATEWAY);
      console.log('Query:', query);

      if (!OPTIMIZELY_GRAPH_GATEWAY || !OPTIMIZELY_GRAPH_APP_KEY || !OPTIMIZELY_GRAPH_SECRET) {
        throw new Error('Missing GraphQL configuration. Please check your environment variables (need App Key and Secret for draft content).');
      }

      const response = await fetch(`${OPTIMIZELY_GRAPH_GATEWAY}/content/v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${OPTIMIZELY_GRAPH_APP_KEY}:${OPTIMIZELY_GRAPH_SECRET}`)}`
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
      console.log('=== UNPUBLISHED PAGES DEBUG ===');
      console.log('Total items found:', items.length);

      // Analyze all unique status values
      const statusSet = new Set<string>();
      items.forEach((item: any) => {
        if (item._metadata?.status) {
          statusSet.add(item._metadata.status);
        }
      });
      console.log('Unique status values found:', Array.from(statusSet));

      // Show sample of first 10 items
      console.log('Sample items (first 10):', items.slice(0, 10).map((item: any) => ({
        title: item._metadata?.displayName,
        published: item._metadata?.published,
        status: item._metadata?.status,
        types: item._metadata?.types,
        locale: item._metadata?.locale,
        version: item._metadata?.version
      })));

      // Transform data and filter to only include Pages (exclude Experiences, Blocks, etc.)
      const filteredItems: any[] = [];
      const excludedItems: any[] = [];

      items.forEach((item: any) => {
        const types = item._metadata?.types || [];

        // Only include if it's a Page type (not Experience or Block)
        const isExperience = types.some((type: string) =>
          type.includes('_Experience') || type.includes('Experience')
        );
        const isBlock = types.some((type: string) =>
          type.includes('_Block') || type.includes('Block') || type.includes('ShareableContent')
        );

        if (isExperience) {
          excludedItems.push({
            title: item._metadata?.displayName,
            reason: 'is Experience',
            types
          });
          return;
        }

        if (isBlock) {
          excludedItems.push({
            title: item._metadata?.displayName,
            reason: 'is Block/ShareableContent',
            types
          });
          return;
        }

        // Filter to only show non-published versions
        // Status "Published" means this version is live
        // Any other status (CheckedOut, etc.) means it's a draft
        const status = item._metadata?.status || '';
        if (status === 'Published') {
          excludedItems.push({
            title: item._metadata?.displayName,
            reason: 'status is Published',
            status,
            locale: item._metadata?.locale
          });
          return;
        }

        filteredItems.push(item);
      });

      console.log('Excluded items (showing first 5):', excludedItems.slice(0, 5));
      console.log('Items passing filter:', filteredItems.length);
      console.log('Filtered items by locale:', filteredItems.reduce((acc: any, item: any) => {
        const locale = item._metadata?.locale || 'unknown';
        acc[locale] = (acc[locale] || 0) + 1;
        return acc;
      }, {}));

      pages = filteredItems.map((item: any) => ({
        id: item._id,
        title: item._metadata?.displayName || 'Untitled',
        url: item._metadata?.url?.default || '',
        created: item._metadata?.created || '',
        lastModified: item._metadata?.lastModified || '',
        owner: item.Author || extractOwner(item._metadata?.key || ''),
        locale: item._metadata?.locale || '',
        status: item._metadata?.status || '',
        baseUrl: item._metadata?.url?.base || '',
        contentType: item._metadata?.types || []
      }));

      console.log('Final pages array:', pages.length, pages);

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

  function extractOwner(key: string): string {
    // Try to extract owner from content key if available
    // Format is typically something like "contentkey_owner_timestamp"
    // This is a simplified extraction - adjust based on your actual key format
    const parts = key.split('_');
    return parts.length > 1 ? parts[1] : 'Unknown';
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
  />
</div>
