<script lang="ts">
  import { OPTIMIZELY_GRAPH_GATEWAY, OPTIMIZELY_GRAPH_APP_KEY, OPTIMIZELY_GRAPH_SECRET } from 'astro:env/client';
  import StatusMessage from '../../../shared/_StatusMessage.svelte';
  import AuthorProductivityChart from './_AuthorProductivityChart.svelte';
  import AuthorProductivityTable from './_AuthorProductivityTable.svelte';

  // Interfaces
  interface ArticlePageData {
    _id: string;
    _metadata: {
      displayName: string;
      published: string;
      created: string;
      locale: string;
      types: string[];
      url: {
        default: string;
      };
    };
    Author: string | null;
  }

  interface AuthorMetrics {
    author: string;
    totalPages: number;
    avgTimeToPublish: number;
    contentTypeBreakdown: Map<string, number>;
    pagesPerWeek: number;
    pagesPerMonth: number;
    mostRecentPublication: string;
    publicationDates: Date[];
    locales: Set<string>;
  }

  interface LeaderboardEntry {
    rank: number;
    author: string;
    totalPages: number;
    avgTimeToPublish: number;
    pagesPerMonth: number;
    mostRecent: string;
    locales: string[];
  }

  // Data state
  let pages = $state<ArticlePageData[]>([]);
  let authorMetrics = $state<Map<string, AuthorMetrics>>(new Map());
  let leaderboard = $state<LeaderboardEntry[]>([]);

  // UI state
  let isLoading = $state(false);
  let message = $state('');
  let messageType = $state<'success' | 'error'>('success');
  let showMessage = $state(false);

  // Filter state
  let timeRangeDays = $state<number>(90);
  let filterLocale = $state<string>('all');
  let filterContentType = $state<string>('all');
  let searchQuery = $state('');
  let velocityInterval = $state<'week' | 'month'>('week');

  // Available options
  let availableLocales = $state<string[]>([]);
  let availableContentTypes = $state<string[]>([]);

  const timeRangeOptions = [
    { value: 30, label: 'Last 30 days' },
    { value: 90, label: 'Last 90 days' },
    { value: 180, label: 'Last 6 months' },
    { value: 365, label: 'Last year' }
  ];

  // Derived state
  let totalAuthors = $derived(authorMetrics.size);
  let totalPages = $derived(pages.length);
  let avgPagesPerAuthor = $derived(
    totalAuthors > 0 ? totalPages / totalAuthors : 0
  );

  // Calculate average time to publish across all authors
  function calculateAvgTimeToPublish() {
    let total = 0;
    let count = 0;
    authorMetrics.forEach(metrics => {
      if (metrics.avgTimeToPublish > 0) {
        total += metrics.avgTimeToPublish;
        count++;
      }
    });
    return count > 0 ? total / count : 0;
  }

  let avgTimeToPublish = $derived(calculateAvgTimeToPublish());

  // Filtered metrics based on client-side filters
  let filteredMetrics = $derived(
    Array.from(authorMetrics.values()).filter(m => {
      // Locale filter
      if (filterLocale !== 'all' && !m.locales.has(filterLocale)) {
        return false;
      }

      // Content type filter
      if (filterContentType !== 'all' && !m.contentTypeBreakdown.has(filterContentType)) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!m.author.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    })
  );

  // Helper Functions

  function normalizeAuthor(author: string | null | undefined): string {
    if (!author || author.trim() === '') {
      return 'Unassigned';
    }

    // Trim whitespace
    const trimmed = author.trim();

    // If it's an email, extract the name part
    if (trimmed.includes('@')) {
      const namePart = trimmed.split('@')[0];
      // Convert email prefix to readable name (e.g., "john.doe" -> "John Doe")
      return namePart
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }

    // Otherwise return as-is with proper capitalization
    return trimmed
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  function aggregateAuthorData(pagesData: ArticlePageData[]): Map<string, AuthorMetrics> {
    const authorMap = new Map<string, AuthorMetrics>();

    pagesData.forEach(page => {
      const author = normalizeAuthor(page.Author);

      if (!authorMap.has(author)) {
        authorMap.set(author, {
          author,
          totalPages: 0,
          avgTimeToPublish: 0,
          contentTypeBreakdown: new Map(),
          pagesPerWeek: 0,
          pagesPerMonth: 0,
          mostRecentPublication: '',
          publicationDates: [],
          locales: new Set()
        });
      }

      const metrics = authorMap.get(author)!;
      metrics.totalPages++;

      // Track publication date for velocity
      if (page._metadata.published) {
        metrics.publicationDates.push(new Date(page._metadata.published));

        // Update most recent
        if (!metrics.mostRecentPublication ||
            page._metadata.published > metrics.mostRecentPublication) {
          metrics.mostRecentPublication = page._metadata.published;
        }
      }

      // Track content types
      page._metadata.types.forEach(type => {
        const cleanType = type.split('.').pop() || type;
        metrics.contentTypeBreakdown.set(
          cleanType,
          (metrics.contentTypeBreakdown.get(cleanType) || 0) + 1
        );
      });

      // Track locales
      if (page._metadata.locale) {
        metrics.locales.add(page._metadata.locale);
      }
    });

    // Calculate derived metrics
    authorMap.forEach(metrics => {
      // Publishing velocity
      const weeksInRange = timeRangeDays / 7;
      const monthsInRange = timeRangeDays / 30;
      metrics.pagesPerWeek = metrics.totalPages / weeksInRange;
      metrics.pagesPerMonth = metrics.totalPages / monthsInRange;
    });

    return authorMap;
  }

  function calculateTimeToPublish(pagesData: ArticlePageData[], metrics: Map<string, AuthorMetrics>) {
    const authorTimeMap = new Map<string, { total: number; count: number }>();

    pagesData.forEach(page => {
      const author = normalizeAuthor(page.Author);
      const created = page._metadata.created ? new Date(page._metadata.created) : null;
      const published = page._metadata.published ? new Date(page._metadata.published) : null;

      if (created && published) {
        const diffMs = published.getTime() - created.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        // Only count non-negative values (handle edge cases where published < created)
        if (diffDays >= 0) {
          if (!authorTimeMap.has(author)) {
            authorTimeMap.set(author, { total: 0, count: 0 });
          }
          const entry = authorTimeMap.get(author)!;
          entry.total += diffDays;
          entry.count++;
        }
      }
    });

    // Update metrics with averages
    authorTimeMap.forEach((value, author) => {
      const authorMetric = metrics.get(author);
      if (authorMetric) {
        authorMetric.avgTimeToPublish = value.count > 0 ? value.total / value.count : 0;
      }
    });
  }

  function generateLeaderboard(metrics: Map<string, AuthorMetrics>): LeaderboardEntry[] {
    const entries = Array.from(metrics.values())
      .map(m => ({
        rank: 0,
        author: m.author,
        totalPages: m.totalPages,
        avgTimeToPublish: m.avgTimeToPublish,
        pagesPerMonth: m.pagesPerMonth,
        mostRecent: m.mostRecentPublication,
        locales: Array.from(m.locales)
      }));

    // Sort by total pages (default)
    entries.sort((a, b) => b.totalPages - a.totalPages);

    // Assign ranks
    entries.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    return entries;
  }

  function displayMessage(text: string, isSuccess: boolean) {
    message = text;
    messageType = isSuccess ? 'success' : 'error';
    showMessage = true;
    setTimeout(() => { showMessage = false; }, 5000);
  }

  async function loadAuthorProductivity() {
    if (!OPTIMIZELY_GRAPH_GATEWAY || !OPTIMIZELY_GRAPH_APP_KEY || !OPTIMIZELY_GRAPH_SECRET) {
      displayMessage('Missing required environment variables. Please check your configuration.', false);
      return;
    }

    isLoading = true;

    try {
      // Calculate date filter based on time range
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - timeRangeDays);
      const dateFilter = dateThreshold.toISOString();

      const query = `
        query GetAuthorProductivity {
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
                published
                created
                locale
                types
                url {
                  default
                }
              }
              ... on ArticlePage {
                Author
              }
            }
          }
        }
      `;

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

      pages = result.data?._Page?.items || [];

      // Aggregate data by author
      const metrics = aggregateAuthorData(pages);

      // Calculate time-to-publish
      calculateTimeToPublish(pages, metrics);

      // Update state
      authorMetrics = metrics;
      leaderboard = generateLeaderboard(metrics);

      // Extract available locales and content types
      const localeSet = new Set<string>();
      const contentTypeSet = new Set<string>();

      pages.forEach(page => {
        if (page._metadata.locale) {
          localeSet.add(page._metadata.locale);
        }
        page._metadata.types.forEach(type => {
          const cleanType = type.split('.').pop() || type;
          contentTypeSet.add(cleanType);
        });
      });

      availableLocales = Array.from(localeSet).sort();
      availableContentTypes = Array.from(contentTypeSet).sort();

      displayMessage(`Loaded ${pages.length} articles from ${totalAuthors} authors`, true);
    } catch (error: any) {
      console.error('Error loading author productivity:', error);
      displayMessage(`Error: ${error.message}`, false);
    } finally {
      isLoading = false;
    }
  }

  // Load data on mount and when timeRangeDays changes
  $effect(() => {
    loadAuthorProductivity();
  });
</script>

<div class="w-full">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Author Performance Dashboard</h1>
    <p class="text-gray-600">Track content author performance and content creation velocity</p>
  </div>

  <!-- Status Message -->
  {#if showMessage}
    <StatusMessage {message} type={messageType} />
  {/if}

  <!-- Filters Bar -->
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Time Range Filter -->
      <div>
        <label for="timeRange" class="block text-sm font-medium text-gray-700 mb-1">
          Time Period
        </label>
        <select
          id="timeRange"
          bind:value={timeRangeDays}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {#each timeRangeOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>

      <!-- Locale Filter -->
      <div>
        <label for="locale" class="block text-sm font-medium text-gray-700 mb-1">
          Locale
        </label>
        <select
          id="locale"
          bind:value={filterLocale}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Locales</option>
          {#each availableLocales as locale}
            <option value={locale}>{locale}</option>
          {/each}
        </select>
      </div>

      <!-- Content Type Filter -->
      <div>
        <label for="contentType" class="block text-sm font-medium text-gray-700 mb-1">
          Content Type
        </label>
        <select
          id="contentType"
          bind:value={filterContentType}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Types</option>
          {#each availableContentTypes as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </div>

      <!-- Velocity Interval -->
      <div>
        <label for="velocityInterval" class="block text-sm font-medium text-gray-700 mb-1">
          Velocity View
        </label>
        <select
          id="velocityInterval"
          bind:value={velocityInterval}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      <!-- Search -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
          Search Author
        </label>
        <input
          id="search"
          type="text"
          bind:value={searchQuery}
          placeholder="Search by name..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>

  <!-- Summary Stats Cards -->
  {#if !isLoading && pages.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Total Authors</div>
        <div class="text-3xl font-bold text-gray-900">{totalAuthors}</div>
      </div>

      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Total Pages</div>
        <div class="text-3xl font-bold text-gray-900">{totalPages}</div>
      </div>

      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Avg Pages/Author</div>
        <div class="text-3xl font-bold text-gray-900">{avgPagesPerAuthor.toFixed(1)}</div>
      </div>

      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Avg Time to Publish</div>
        <div class="text-3xl font-bold text-gray-900">{avgTimeToPublish.toFixed(0)} days</div>
      </div>
    </div>
  {/if}

  <!-- Charts -->
  {#if !isLoading && filteredMetrics.length > 0}
    <AuthorProductivityChart
      metrics={filteredMetrics}
      {timeRangeDays}
      {velocityInterval}
    />
  {/if}

  <!-- Leaderboard Table -->
  <AuthorProductivityTable
    {leaderboard}
    {isLoading}
    filteredCount={filteredMetrics.length}
  />
</div>
