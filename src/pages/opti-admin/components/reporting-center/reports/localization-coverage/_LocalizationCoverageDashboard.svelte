<script lang="ts">
  import StatusMessage from '../../../shared/_StatusMessage.svelte';
  import LoadingSpinner from '../../../shared/_LoadingSpinner.svelte';
  import LocalizationCoverageCompletionChart from './_LocalizationCoverageCompletionChart.svelte';
  import LocalizationCoverageMissingChart from './_LocalizationCoverageMissingChart.svelte';
  import LocalizationCoverageTopContentChart from './_LocalizationCoverageTopContentChart.svelte';
  import LocalizationCoverageTrendChart from './_LocalizationCoverageTrendChart.svelte';
  import LocalizationCoverageTable from './_LocalizationCoverageTable.svelte';

  // Interfaces matching API response
  interface LocaleMetrics {
    locale: string;
    totalContentInDefault: number;
    translatedContent: number;
    missingContent: number;
    completenessPercentage: number;
  }

  interface ContentTranslation {
    key: string;
    defaultLocaleContent: {
      id: string;
      title: string;
      url: string;
      contentType: string;
      published: string;
      lastModified: string;
    };
    translations: Record<string, {
      id: string;
      title: string;
      url: string;
      published: string;
      lastModified: string;
    }>;
    missingLocales: string[];
    translationCompleteness: number;
    contentType: string;
  }

  interface TimeSeriesData {
    locale: string;
    dataPoints: Array<{
      date: string;
      publicationCount: number;
    }>;
  }

  interface ApiResponse {
    summary: {
      defaultLocale: string;
      totalContentInDefault: number;
      totalLocales: number;
      averageCompleteness: number;
      totalMissingTranslations: number;
    };
    localeMetrics: LocaleMetrics[];
    contentTranslations: ContentTranslation[];
    missingByContentType: Array<{
      contentType: string;
      missingCount: number;
    }>;
    timeSeriesData: TimeSeriesData[];
  }

  // State
  let data = $state<ApiResponse | null>(null);
  let isLoading = $state(false);
  let message = $state('');
  let messageType = $state<'success' | 'error'>('success');
  let showMessage = $state(false);

  // Filter state
  let filterStatus = $state<'Published' | 'Draft' | 'All'>('Published');
  let filterContentType = $state<string>('all');
  let filterLocale = $state<string>('all');
  let filterCompletenessThreshold = $state<number>(0);
  let searchQuery = $state('');

  // Available options (derived from data)
  let availableContentTypes = $state<string[]>([]);
  let availableLocales = $state<string[]>([]);

  // Filtered data
  let filteredContentTranslations = $derived.by(() => {
    if (!data) return [];

    return data.contentTranslations.filter((item: ContentTranslation) => {
      // Content type filter
      if (filterContentType !== 'all' && item.contentType !== filterContentType) {
        return false;
      }

      // Locale filter (show items missing this locale)
      if (filterLocale !== 'all' && !item.missingLocales.includes(filterLocale)) {
        return false;
      }

      // Completeness threshold
      if (item.translationCompleteness < filterCompletenessThreshold) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!item.defaultLocaleContent.title.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });
  });

  // Load data
  async function loadData() {
    isLoading = true;
    showMessage = false;

    try {
      const response = await fetch(
        `/opti-admin/api/reporting/localization-coverage.json?status=${filterStatus}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to load data');
      }

      data = result.data;

      // Extract available options
      const contentTypeSet = new Set<string>();
      data!.contentTranslations.forEach((item: ContentTranslation) => {
        contentTypeSet.add(item.contentType);
      });
      availableContentTypes = Array.from(contentTypeSet).sort();
      availableLocales = data!.localeMetrics.map((m: LocaleMetrics) => m.locale);

      displayMessage(
        `Loaded ${data!.summary.totalContentInDefault} content items across ${data!.summary.totalLocales} locales`,
        true
      );
    } catch (error: any) {
      displayMessage(`Error: ${error.message}`, false);
    } finally {
      isLoading = false;
    }
  }

  function displayMessage(text: string, isSuccess: boolean) {
    message = text;
    messageType = isSuccess ? 'success' : 'error';
    showMessage = true;
    setTimeout(() => {
      showMessage = false;
    }, 5000);
  }

  // Reload when status filter changes
  $effect(() => {
    loadData();
  });
</script>

<div class="w-full">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Localization Coverage Report</h1>
    <p class="text-gray-600">Track translation completeness and identify missing translations across locales</p>
  </div>

  {#if showMessage}
    <StatusMessage {message} type={messageType} />
  {/if}

  <!-- Filters Bar -->
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Content Status
        </label>
        <select
          bind:value={filterStatus}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="All">All</option>
        </select>
      </div>

      <!-- Content Type Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Content Type
        </label>
        <select
          bind:value={filterContentType}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!data || isLoading}
        >
          <option value="all">All Types</option>
          {#each availableContentTypes as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </div>

      <!-- Locale Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Missing Locale
        </label>
        <select
          bind:value={filterLocale}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!data || isLoading}
        >
          <option value="all">All Locales</option>
          {#each availableLocales as locale}
            <option value={locale}>{locale.toUpperCase()}</option>
          {/each}
        </select>
      </div>

      <!-- Completeness Threshold -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Min Completeness: {filterCompletenessThreshold}%
        </label>
        <input
          type="range"
          bind:value={filterCompletenessThreshold}
          min="0"
          max="100"
          step="5"
          class="w-full"
          disabled={!data || isLoading}
        />
      </div>

      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Search Content
        </label>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search by title..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!data || isLoading}
        />
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="mt-4">
      <button
        onclick={loadData}
        disabled={isLoading}
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
      >
        {#if isLoading}
          <LoadingSpinner size="sm" />
        {:else}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        {/if}
        Refresh Data
      </button>
    </div>
  </div>

  <!-- Summary Cards -->
  {#if !isLoading && data}
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Total Content (Default Locale)</div>
        <div class="text-3xl font-bold text-blue-600">{data.summary.totalContentInDefault}</div>
      </div>

      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Average Completeness</div>
        <div class="text-3xl font-bold text-green-600">{data.summary.averageCompleteness.toFixed(1)}%</div>
      </div>

      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Total Missing Translations</div>
        <div class="text-3xl font-bold text-orange-600">{data.summary.totalMissingTranslations}</div>
      </div>

      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Active Locales</div>
        <div class="text-3xl font-bold text-purple-600">{data.summary.totalLocales}</div>
      </div>
    </div>
  {/if}

  <!-- Charts -->
  {#if !isLoading && data}
    <!-- Chart 1: Completion % by Locale (Horizontal Bar) -->
    <LocalizationCoverageCompletionChart localeMetrics={data.localeMetrics} />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Chart 2: Missing Translations by Content Type (Bar) -->
      <LocalizationCoverageMissingChart missingByContentType={data.missingByContentType} />

      <!-- Chart 4: Publication Trend by Locale (Line) -->
      <LocalizationCoverageTrendChart timeSeriesData={data.timeSeriesData} />
    </div>

    <!-- Chart 3: Top Content by Missing Translations (Stacked Bar) -->
    <LocalizationCoverageTopContentChart
      contentTranslations={filteredContentTranslations}
      totalLocales={data.summary.totalLocales}
    />
  {/if}

  <!-- Loading State -->
  {#if isLoading}
    <div class="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
      <LoadingSpinner />
      <p class="mt-4 text-gray-600">Loading localization data...</p>
    </div>
  {/if}

  <!-- Table -->
  {#if !isLoading && data}
    <LocalizationCoverageTable
      contentTranslations={filteredContentTranslations}
      {isLoading}
      locales={availableLocales}
      defaultLocale={data.summary.defaultLocale}
    />
  {/if}
</div>
