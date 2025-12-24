<script lang="ts">
  import StatusMessage from '../../../shared/_StatusMessage.svelte';
  import UserPerformanceChart from './_UserPerformanceChart.svelte';
  import UserPerformanceTable from './_UserPerformanceTable.svelte';

  // Interfaces
  interface PageData {
    id: string;
    contentId: string;
    variationId: string | null;
    fullId: string;
    title: string;
    url: string;
    published: string;
    created: string;
    lastModified: string;
    owner: string;
    locale: string;
    status: string;
    baseUrl: string;
    contentType: string[];
    version: string | null;
    isVariation: boolean;
    createdBy: string | null;
    lastModifiedBy: string | null;
    variations?: PageData[];
  }

  interface UserMetrics {
    user: string;
    itemsCreated: number;
    itemsModified: number;
    totalActivity: number;
    contentTypeBreakdown: Map<string, number>;
    mostRecentActivity: string;
    locales: Set<string>;
    createdDates: Date[];
    modifiedDates: Date[];
  }

  interface LeaderboardEntry {
    rank: number;
    user: string;
    itemsCreated: number;
    itemsModified: number;
    totalActivity: number;
    mostRecent: string;
    contentTypes: string[];
    locales: string[];
  }

  // Data state
  let pages = $state<PageData[]>([]);
  let userMetrics = $state<Map<string, UserMetrics>>(new Map());
  let leaderboard = $state<LeaderboardEntry[]>([]);

  // UI state
  let isLoading = $state(false);
  let message = $state('');
  let messageType = $state<'success' | 'error'>('success');
  let showMessage = $state(false);

  // Filter state
  let timeRangeDays = $state<number>(30);
  let filterLocale = $state<string>('all');
  let filterContentType = $state<string>('all');
  let filterActivityType = $state<'all' | 'created' | 'modified'>('all');
  let searchQuery = $state('');

  // Available options
  let availableLocales = $state<string[]>([]);
  let availableContentTypes = $state<string[]>([]);

  const timeRangeOptions = [
    { value: 7, label: 'Last 7 days' },
    { value: 14, label: 'Last 14 days' },
    { value: 30, label: 'Last 30 days' },
    { value: 60, label: 'Last 60 days' },
    { value: 90, label: 'Last 90 days' }
  ];

  // Derived state
  let totalUsers = $derived(userMetrics.size);
  let totalItems = $derived(pages.length);
  let totalCreated = $derived(
    Array.from(userMetrics.values()).reduce((sum, m) => sum + m.itemsCreated, 0)
  );
  let totalModified = $derived(
    Array.from(userMetrics.values()).reduce((sum, m) => sum + m.itemsModified, 0)
  );

  // Filtered metrics based on client-side filters
  let filteredMetrics = $derived(
    Array.from(userMetrics.values()).filter(m => {
      // Locale filter
      if (filterLocale !== 'all' && !m.locales.has(filterLocale)) {
        return false;
      }

      // Content type filter
      if (filterContentType !== 'all' && !m.contentTypeBreakdown.has(filterContentType)) {
        return false;
      }

      // Activity type filter
      if (filterActivityType === 'created' && m.itemsCreated === 0) {
        return false;
      }
      if (filterActivityType === 'modified' && m.itemsModified === 0) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!m.user.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    })
  );

  // Helper Functions

  function normalizeUser(user: string | null | undefined): string {
    if (!user || user.trim() === '') {
      return 'Unassigned';
    }

    // Trim whitespace
    const trimmed = user.trim();

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

  function processPageForUser(page: PageData, userMap: Map<string, UserMetrics>) {
    const createdBy = normalizeUser(page.createdBy);
    const modifiedBy = normalizeUser(page.lastModifiedBy);

    // Track creator
    if (!userMap.has(createdBy)) {
      userMap.set(createdBy, {
        user: createdBy,
        itemsCreated: 0,
        itemsModified: 0,
        totalActivity: 0,
        contentTypeBreakdown: new Map(),
        mostRecentActivity: '',
        locales: new Set(),
        createdDates: [],
        modifiedDates: []
      });
    }

    const creatorMetrics = userMap.get(createdBy)!;
    creatorMetrics.itemsCreated++;
    creatorMetrics.totalActivity++;
    creatorMetrics.createdDates.push(new Date(page.created));

    // Update most recent activity
    if (!creatorMetrics.mostRecentActivity || page.created > creatorMetrics.mostRecentActivity) {
      creatorMetrics.mostRecentActivity = page.created;
    }

    // Track content types
    page.contentType.forEach(type => {
      const cleanType = type.split('.').pop() || type;
      creatorMetrics.contentTypeBreakdown.set(
        cleanType,
        (creatorMetrics.contentTypeBreakdown.get(cleanType) || 0) + 1
      );
    });

    // Track locales
    if (page.locale) {
      creatorMetrics.locales.add(page.locale);
    }

    // Track modifier (if different from creator)
    if (modifiedBy !== createdBy) {
      if (!userMap.has(modifiedBy)) {
        userMap.set(modifiedBy, {
          user: modifiedBy,
          itemsCreated: 0,
          itemsModified: 0,
          totalActivity: 0,
          contentTypeBreakdown: new Map(),
          mostRecentActivity: '',
          locales: new Set(),
          createdDates: [],
          modifiedDates: []
        });
      }

      const modifierMetrics = userMap.get(modifiedBy)!;
      modifierMetrics.itemsModified++;
      modifierMetrics.totalActivity++;
      modifierMetrics.modifiedDates.push(new Date(page.lastModified));

      // Update most recent activity
      if (!modifierMetrics.mostRecentActivity || page.lastModified > modifierMetrics.mostRecentActivity) {
        modifierMetrics.mostRecentActivity = page.lastModified;
      }

      // Track content types for modifier
      page.contentType.forEach(type => {
        const cleanType = type.split('.').pop() || type;
        modifierMetrics.contentTypeBreakdown.set(
          cleanType,
          (modifierMetrics.contentTypeBreakdown.get(cleanType) || 0) + 1
        );
      });

      // Track locales for modifier
      if (page.locale) {
        modifierMetrics.locales.add(page.locale);
      }
    }
  }

  function aggregateUserData(pagesData: PageData[]): Map<string, UserMetrics> {
    const userMap = new Map<string, UserMetrics>();

    pagesData.forEach(page => {
      // Process parent page
      processPageForUser(page, userMap);

      // Process variations
      if (page.variations && page.variations.length > 0) {
        page.variations.forEach(variant => {
          processPageForUser(variant, userMap);
        });
      }
    });

    return userMap;
  }

  function generateLeaderboard(metrics: Map<string, UserMetrics>): LeaderboardEntry[] {
    const entries = Array.from(metrics.values())
      .map(m => ({
        rank: 0,
        user: m.user,
        itemsCreated: m.itemsCreated,
        itemsModified: m.itemsModified,
        totalActivity: m.totalActivity,
        mostRecent: m.mostRecentActivity,
        contentTypes: Array.from(m.contentTypeBreakdown.keys()),
        locales: Array.from(m.locales)
      }));

    // Sort by total activity (default)
    entries.sort((a, b) => b.totalActivity - a.totalActivity);

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

  async function loadUserPerformance() {
    isLoading = true;

    try {
      // Call server-side API instead of direct GraphQL
      const response = await fetch(`/opti-admin/api/reporting/user-performance.json?timeRangeDays=${timeRangeDays}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to load user performance data');
      }

      pages = result.data.pages;

      // Aggregate data by user
      const metrics = aggregateUserData(pages);

      // Update state
      userMetrics = metrics;
      leaderboard = generateLeaderboard(metrics);

      // Extract available locales and content types
      const localeSet = new Set<string>();
      const contentTypeSet = new Set<string>();

      pages.forEach(page => {
        if (page.locale) {
          localeSet.add(page.locale);
        }
        page.contentType.forEach(type => {
          const cleanType = type.split('.').pop() || type;
          contentTypeSet.add(cleanType);
        });

        // Also process variations
        if (page.variations) {
          page.variations.forEach(variant => {
            if (variant.locale) {
              localeSet.add(variant.locale);
            }
            variant.contentType.forEach(type => {
              const cleanType = type.split('.').pop() || type;
              contentTypeSet.add(cleanType);
            });
          });
        }
      });

      availableLocales = Array.from(localeSet).sort();
      availableContentTypes = Array.from(contentTypeSet).sort();

      displayMessage(`Loaded ${pages.length} items from ${totalUsers} users`, true);
    } catch (error: any) {
      console.error('Error loading user performance:', error);
      displayMessage(`Error: ${error.message}`, false);
    } finally {
      isLoading = false;
    }
  }

  // Load data on mount and when timeRangeDays changes
  $effect(() => {
    loadUserPerformance();
  });
</script>

<div class="w-full">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">User Performance Dashboard</h1>
    <p class="text-gray-600">Track CMS user activity and content management performance</p>
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

      <!-- Activity Type Filter -->
      <div>
        <label for="activityType" class="block text-sm font-medium text-gray-700 mb-1">
          Activity Type
        </label>
        <select
          id="activityType"
          bind:value={filterActivityType}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Activity</option>
          <option value="created">Created Only</option>
          <option value="modified">Modified Only</option>
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

      <!-- Search -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
          Search User
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
        <div class="text-sm font-medium text-gray-500 mb-1">Total Users</div>
        <div class="text-3xl font-bold text-gray-900">{totalUsers}</div>
      </div>

      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Total Items</div>
        <div class="text-3xl font-bold text-gray-900">{totalItems}</div>
      </div>

      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Items Created</div>
        <div class="text-3xl font-bold text-green-600">{totalCreated}</div>
      </div>

      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Items Modified</div>
        <div class="text-3xl font-bold text-blue-600">{totalModified}</div>
      </div>
    </div>
  {/if}

  <!-- Charts -->
  {#if !isLoading && filteredMetrics.length > 0}
    <UserPerformanceChart
      metrics={filteredMetrics}
      {timeRangeDays}
    />
  {/if}

  <!-- Leaderboard Table -->
  <UserPerformanceTable
    {leaderboard}
    {isLoading}
    filteredCount={filteredMetrics.length}
  />
</div>
