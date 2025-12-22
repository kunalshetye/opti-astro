<script lang="ts">
  import { OPTIMIZELY_GRAPH_GATEWAY, OPTIMIZELY_GRAPH_APP_KEY, OPTIMIZELY_GRAPH_SECRET } from 'astro:env/client';
  import StatusMessage from '../../../shared/_StatusMessage.svelte';
  import LoadingSpinner from '../../../shared/_LoadingSpinner.svelte';
  import ContentLifecycleChart from './_ContentLifecycleChart.svelte';
  import ContentLifecycleTable from './_ContentLifecycleTable.svelte';

  interface ContentPage {
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
    daysSinceUpdate: number;
  }

  // State
  let pages = $state<ContentPage[]>([]);
  let isLoading = $state(false);
  let message = $state('');
  let messageType = $state<'success' | 'error'>('success');
  let showMessage = $state(false);

  // Filter state
  let searchQuery = $state('');
  let filterLocale = $state<string>('all');
  let availableLocales = $state<string[]>([]);
  let inactivityPeriod = $state<number>(90); // Default: 90 days
  let inactivityUnit = $state<'days' | 'months'>('days');

  function displayMessage(text: string, isSuccess: boolean) {
    message = text;
    messageType = isSuccess ? 'success' : 'error';
    showMessage = true;
    setTimeout(() => {
      showMessage = false;
    }, 5000);
  }

  // Load pages on mount and when filters change
  $effect(() => {
    loadContentPages();
  });

  async function loadContentPages() {
    isLoading = true;
    showMessage = false;

    try {
      // Calculate the date threshold
      const daysThreshold = inactivityUnit === 'months'
        ? inactivityPeriod * 30
        : inactivityPeriod;

      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
      const dateFilter = thresholdDate.toISOString();

      // GraphQL query to fetch published pages not updated since threshold
      // Only show published pages for lifecycle tracking (not drafts)
      const query = `
        query GetStaleContent {
          _Page(
            limit: 100
            orderBy: {
              _metadata: {
                lastModified: ASC
              }
            }
            where: {
              _and: [
                {
                  _metadata: {
                    lastModified: {
                      lt: "${dateFilter}"
                    }
                  }
                }
                {
                  _metadata: {
                    status: {
                      eq: "Published"
                    }
                  }
                }
              ]
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

      console.log('GraphQL Endpoint:', OPTIMIZELY_GRAPH_GATEWAY);
      console.log('Query:', query);
      console.log('Date threshold:', dateFilter);

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
      console.log('Total items found:', items.length);

      // Transform data and filter to only include Pages (exclude Experiences, Blocks, etc.)
      const now = new Date();
      pages = items
        .filter((item: any) => {
          const types = item._metadata?.types || [];

          // Exclude Experiences and Blocks
          const isExperience = types.some((type: string) =>
            type.includes('_Experience') || type.includes('Experience')
          );
          const isBlock = types.some((type: string) =>
            type.includes('_Block') || type.includes('Block') || type.includes('ShareableContent')
          );

          return !isExperience && !isBlock;
        })
        .map((item: any) => {
          const lastModified = new Date(item._metadata?.lastModified || '');
          const daysSinceUpdate = Math.floor((now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24));

          return {
            id: item._id,
            title: item._metadata?.displayName || 'Untitled',
            url: item._metadata?.url?.default || '',
            published: item._metadata?.published || '',
            lastModified: item._metadata?.lastModified || '',
            owner: item.Author || extractOwner(item._metadata?.key || ''),
            locale: item._metadata?.locale || '',
            status: item._metadata?.status || '',
            baseUrl: item._metadata?.url?.base || '',
            contentType: item._metadata?.types || [],
            daysSinceUpdate
          };
        });

      console.log('Filtered pages:', pages.length);

      // Extract unique locales for filter
      const locales = new Set(pages.map(p => p.locale));
      availableLocales = Array.from(locales).sort();

      displayMessage(`✅ Loaded ${pages.length} pages not updated in ${inactivityPeriod} ${inactivityUnit}`, true);
    } catch (error) {
      const errorMsg = '❌ Error loading pages: ' + (error instanceof Error ? error.message : 'Unknown error');
      displayMessage(errorMsg, false);
      console.error('Error loading content lifecycle:', error);
    } finally {
      isLoading = false;
    }
  }

  function extractOwner(key: string): string {
    const parts = key.split('_');
    return parts.length > 1 ? parts[1] : 'Unknown';
  }

  // Computed filtered pages
  let filteredPages = $derived(
    pages.filter(page => {
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
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Content Lifecycle Dashboard</h1>
    <p class="text-gray-600">Track pages that haven't been updated recently</p>
  </div>

  {#if showMessage}
    <StatusMessage {message} type={messageType} />
  {/if}

  <!-- Filters Bar -->
  <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Inactivity Period -->
      <div>
        <label for="inactivityPeriod" class="block text-sm font-medium text-gray-700 mb-2">
          Inactivity Period
        </label>
        <input
          id="inactivityPeriod"
          type="number"
          bind:value={inactivityPeriod}
          min="1"
          max="365"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Time Unit -->
      <div>
        <label for="inactivityUnit" class="block text-sm font-medium text-gray-700 mb-2">
          Time Unit
        </label>
        <select
          id="inactivityUnit"
          bind:value={inactivityUnit}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="days">Days</option>
          <option value="months">Months</option>
        </select>
      </div>

      <!-- Search -->
      <div>
        <label for="searchQuery" class="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          id="searchQuery"
          type="text"
          bind:value={searchQuery}
          placeholder="Search pages..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Locale Filter -->
      <div>
        <label for="filterLocale" class="block text-sm font-medium text-gray-700 mb-2">
          Locale
        </label>
        <select
          id="filterLocale"
          bind:value={filterLocale}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Locales</option>
          {#each availableLocales as locale}
            <option value={locale}>{locale}</option>
          {/each}
        </select>
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="mt-4 flex justify-end">
      <button
        onclick={loadContentPages}
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
        Apply Filters
      </button>
    </div>
  </div>

  <!-- Charts -->
  {#if !isLoading && filteredPages.length > 0}
    <ContentLifecycleChart pages={filteredPages} />
  {/if}

  <!-- Pages Table -->
  <ContentLifecycleTable
    pages={filteredPages}
    {isLoading}
  />
</div>
