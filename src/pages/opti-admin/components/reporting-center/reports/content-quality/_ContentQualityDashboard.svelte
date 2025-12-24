<script lang="ts">
  import StatusMessage from '../../../shared/_StatusMessage.svelte';
  import ContentQualityChart from './_ContentQualityChart.svelte';
  import ContentQualityTable from './_ContentQualityTable.svelte';
  import {
    calculateQualityScore,
    identifyTopIssue,
    stripHtmlTags,
    type PageQualityData,
    type QualityScoreBreakdown,
    type PageQualityMetrics
  } from './_ScoreCalculator';

  // GraphQL response interfaces
  interface GraphQLPageData {
    _id: string;
    _metadata: {
      displayName: string;
      published: string | null;
      lastModified: string;
      locale: string;
      types: string[];
      status: string;
      url: {
        default: string;
      };
    };
    Heading?: string;
    SubHeading?: string;
    Body?: {
      html: string;
    };
    Author?: string;
    AuthorEmail?: string;
    PromoImage?: {
      item?: {
        AltText?: string;
      } | null;
    } | null;
    SeoSettings?: {
      MetaTitle?: string | null;
      MetaDescription?: string | null;
      SharingImage?: {
        item?: {
          _metadata?: {
            key?: string;
          };
        } | null;
      } | null;
      Indexing?: boolean | null;
      GraphType?: string | null;
    } | null;
    TopContentArea?: Array<{
      _metadata: {
        key: string;
      };
    }>;
    MainContentArea?: Array<{
      _metadata: {
        key: string;
      };
    }>;
    FolderDescription?: string;
  }

  interface QualityAggregation {
    scoreRanges: {
      poor: number;
      fair: number;
      good: number;
      excellent: number;
    };
    byContentType: Map<string, {
      totalPages: number;
      avgScore: number;
      scoreDistribution: { poor: number; fair: number; good: number; excellent: number };
    }>;
    byLocale: Map<string, {
      totalPages: number;
      avgScore: number;
      scoreDistribution: { poor: number; fair: number; good: number; excellent: number };
    }>;
    topIssues: Array<{
      issue: string;
      count: number;
      percentage: number;
    }>;
    avgScoreByCategory: {
      seo: number;
      content: number;
      accessibility: number;
      freshness: number;
      publication: number;
    };
  }

  // Data state
  let rawPages = $state<GraphQLPageData[]>([]);
  let pageMetrics = $state<PageQualityMetrics[]>([]);
  let aggregation = $state<QualityAggregation>({
    scoreRanges: { poor: 0, fair: 0, good: 0, excellent: 0 },
    byContentType: new Map(),
    byLocale: new Map(),
    topIssues: [],
    avgScoreByCategory: { seo: 0, content: 0, accessibility: 0, freshness: 0, publication: 0 }
  });

  // UI state
  let isLoading = $state(false);
  let message = $state('');
  let messageType = $state<'success' | 'error'>('success');
  let showMessage = $state(false);

  // Filter state
  let filterTimeRange = $state<'all' | 30 | 90 | 180 | 365>('all');
  let filterScoreThreshold = $state<'all' | 'needs-attention' | 'good-plus' | 'excellent'>('all');
  let filterContentType = $state<string>('all');
  let filterLocale = $state<string>('all');
  let searchQuery = $state('');

  // Available options
  let availableContentTypes = $state<string[]>([]);
  let availableLocales = $state<string[]>([]);

  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 30, label: 'Last 30 days' },
    { value: 90, label: 'Last 90 days' },
    { value: 180, label: 'Last 6 months' },
    { value: 365, label: 'Last year' }
  ];

  // Derived state - Summary stats
  let avgQualityScore = $derived(
    pageMetrics.length > 0
      ? pageMetrics.reduce((sum, m) => sum + m.score.total, 0) / pageMetrics.length
      : 0
  );

  let pagesNeedingAttention = $derived(
    pageMetrics.filter(m => m.score.total < 50).length
  );

  let seoCompletionRate = $derived(
    pageMetrics.length > 0
      ? (pageMetrics.filter(m => m.score.seo === 40).length / pageMetrics.length) * 100
      : 0
  );

  let contentFreshnessRate = $derived(
    pageMetrics.length > 0
      ? (pageMetrics.filter(m => m.page.daysSinceUpdate < 90).length / pageMetrics.length) * 100
      : 0
  );

  // Filtered metrics
  let filteredMetrics: PageQualityMetrics[] = $derived.by(() => {
    console.log('DEBUG: Computing filteredMetrics, pageMetrics.length:', pageMetrics.length);
    const filtered = pageMetrics.filter(m => {
      // Time range filter
      if (filterTimeRange !== 'all') {
        const daysAgo = filterTimeRange as number;
        const threshold = new Date();
        threshold.setDate(threshold.getDate() - daysAgo);
        const pageDate = new Date(m.page.lastModified);
        if (pageDate < threshold) return false;
      }

      // Score threshold filter
      if (filterScoreThreshold === 'needs-attention' && m.score.total >= 50) return false;
      if (filterScoreThreshold === 'good-plus' && m.score.total < 51) return false;
      if (filterScoreThreshold === 'excellent' && m.score.total < 76) return false;

      // Content type filter
      if (filterContentType !== 'all' && m.page.pageType !== filterContentType) {
        return false;
      }

      // Locale filter
      if (filterLocale !== 'all' && m.page.locale !== filterLocale) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!m.page.title.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });
    console.log('DEBUG: filteredMetrics.length:', filtered.length);
    return filtered;
  });

  // Helper Functions

  function transformGraphQLPage(gqlPage: GraphQLPageData): PageQualityData {
    // Determine page type
    const pageType = gqlPage._metadata.types.find(t =>
      t.includes('ArticlePage') || t.includes('LandingPage') || t.includes('FolderPage') || t.includes('MockupPage')
    )?.split('.').pop() || 'Unknown';

    // Calculate days since update
    const lastModifiedDate = new Date(gqlPage._metadata.lastModified);
    const now = new Date();
    const daysSinceUpdate = Math.floor((now.getTime() - lastModifiedDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      id: gqlPage._id,
      title: gqlPage._metadata.displayName,
      url: gqlPage._metadata.url.default,
      locale: gqlPage._metadata.locale,
      status: gqlPage._metadata.status,
      published: gqlPage._metadata.published,
      lastModified: gqlPage._metadata.lastModified,
      pageType,
      daysSinceUpdate,
      seo: {
        metaTitle: gqlPage.SeoSettings?.MetaTitle || null,
        metaDescription: gqlPage.SeoSettings?.MetaDescription || null,
        sharingImage: !!(gqlPage.SeoSettings?.SharingImage?.item?._metadata?.key),
        indexingConfigured: gqlPage.SeoSettings?.Indexing !== null && gqlPage.SeoSettings?.Indexing !== undefined
      },
      content: {
        heading: gqlPage.Heading || null,
        body: gqlPage.Body?.html || null,
        bodyLength: gqlPage.Body?.html ? stripHtmlTags(gqlPage.Body.html).length : 0,
        author: gqlPage.Author || null,
        promoImageAltText: gqlPage.PromoImage?.item?.AltText || null,
        hasPromoImage: !!(gqlPage.PromoImage?.item),
        topContentAreaCount: gqlPage.TopContentArea?.length || 0,
        mainContentAreaCount: gqlPage.MainContentArea?.length || 0
      }
    };
  }

  function aggregateMetrics(metrics: PageQualityMetrics[]): QualityAggregation {
    const scoreRanges = { poor: 0, fair: 0, good: 0, excellent: 0 };
    const byContentType = new Map<string, any>();
    const byLocale = new Map<string, any>();
    const issueMap = new Map<string, number>();
    let totalSeo = 0;
    let totalContent = 0;
    let totalAccessibility = 0;
    let totalFreshness = 0;
    let totalPublication = 0;

    metrics.forEach(m => {
      // Score ranges
      if (m.score.total < 26) scoreRanges.poor++;
      else if (m.score.total < 51) scoreRanges.fair++;
      else if (m.score.total < 76) scoreRanges.good++;
      else scoreRanges.excellent++;

      // By content type
      if (!byContentType.has(m.page.pageType)) {
        byContentType.set(m.page.pageType, {
          totalPages: 0,
          totalScore: 0,
          avgScore: 0,
          scoreDistribution: { poor: 0, fair: 0, good: 0, excellent: 0 }
        });
      }
      const typeData = byContentType.get(m.page.pageType)!;
      typeData.totalPages++;
      typeData.totalScore += m.score.total;
      if (m.score.total < 26) typeData.scoreDistribution.poor++;
      else if (m.score.total < 51) typeData.scoreDistribution.fair++;
      else if (m.score.total < 76) typeData.scoreDistribution.good++;
      else typeData.scoreDistribution.excellent++;

      // By locale
      if (!byLocale.has(m.page.locale)) {
        byLocale.set(m.page.locale, {
          totalPages: 0,
          totalScore: 0,
          avgScore: 0,
          scoreDistribution: { poor: 0, fair: 0, good: 0, excellent: 0 }
        });
      }
      const localeData = byLocale.get(m.page.locale)!;
      localeData.totalPages++;
      localeData.totalScore += m.score.total;
      if (m.score.total < 26) localeData.scoreDistribution.poor++;
      else if (m.score.total < 51) localeData.scoreDistribution.fair++;
      else if (m.score.total < 76) localeData.scoreDistribution.good++;
      else localeData.scoreDistribution.excellent++;

      // Top issues
      const topIssue = identifyTopIssue(m.score, m.page);
      if (topIssue !== 'No Issues') {
        issueMap.set(topIssue, (issueMap.get(topIssue) || 0) + 1);
      }

      // Accumulate scores
      totalSeo += m.score.seo;
      totalContent += m.score.content;
      totalAccessibility += m.score.accessibility;
      totalFreshness += m.score.freshness;
      totalPublication += m.score.publication;
    });

    // Calculate averages for content types and locales
    byContentType.forEach(data => {
      data.avgScore = data.totalPages > 0 ? data.totalScore / data.totalPages : 0;
    });

    byLocale.forEach(data => {
      data.avgScore = data.totalPages > 0 ? data.totalScore / data.totalPages : 0;
    });

    // Create top issues array
    const topIssues = Array.from(issueMap.entries())
      .map(([issue, count]) => ({
        issue,
        count,
        percentage: (count / metrics.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate average scores by category
    const count = metrics.length || 1;
    const avgScoreByCategory = {
      seo: totalSeo / count,
      content: totalContent / count,
      accessibility: totalAccessibility / count,
      freshness: totalFreshness / count,
      publication: totalPublication / count
    };

    return {
      scoreRanges,
      byContentType,
      byLocale,
      topIssues,
      avgScoreByCategory
    };
  }

  function displayMessage(text: string, isSuccess: boolean) {
    message = text;
    messageType = isSuccess ? 'success' : 'error';
    showMessage = true;
    setTimeout(() => { showMessage = false; }, 5000);
  }

  async function loadContentQuality() {
    isLoading = true;

    try {
      // Call server-side API instead of direct GraphQL
      const response = await fetch('/opti-admin/api/reporting/content-quality.json');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to load content quality data');
      }

      rawPages = result.data.pages;

      // Transform pages and calculate scores
      pageMetrics = rawPages.map(gqlPage => {
        const page = transformGraphQLPage(gqlPage);
        const score = calculateQualityScore(page);
        return { page, score };
      });

      // Aggregate metrics
      aggregation = aggregateMetrics(pageMetrics);

      // Extract available content types and locales
      const contentTypeSet = new Set<string>();
      const localeSet = new Set<string>();

      pageMetrics.forEach(m => {
        contentTypeSet.add(m.page.pageType);
        localeSet.add(m.page.locale);
      });

      availableContentTypes = Array.from(contentTypeSet).sort();
      availableLocales = Array.from(localeSet).sort();

      console.log('DEBUG: pageMetrics length:', pageMetrics.length);
      console.log('DEBUG: First page metric:', pageMetrics[0]);
      console.log('DEBUG: Filter states:', {
        filterTimeRange,
        filterScoreThreshold,
        filterContentType,
        filterLocale,
        searchQuery
      });

      displayMessage(`Analyzed ${pageMetrics.length} pages (showing 100 most recently modified)`, true);
    } catch (error: any) {
      console.error('Error loading content quality:', error);
      displayMessage(`Error: ${error.message}`, false);
    } finally {
      isLoading = false;
    }
  }

  // Load data on mount
  $effect(() => {
    loadContentQuality();
  });
</script>

<div class="w-full">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Content Quality Score Dashboard</h1>
    <p class="text-gray-600">Assess content completeness and SEO readiness across your pages</p>
    <p class="text-sm text-gray-500 mt-1">
      <strong>Note:</strong> Showing quality scores for 100 most recently modified pages
    </p>
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
          bind:value={filterTimeRange}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {#each timeRangeOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>

      <!-- Score Threshold Filter -->
      <div>
        <label for="scoreThreshold" class="block text-sm font-medium text-gray-700 mb-1">
          Score Filter
        </label>
        <select
          id="scoreThreshold"
          bind:value={filterScoreThreshold}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Pages</option>
          <option value="needs-attention">Needs Attention (&lt; 50)</option>
          <option value="good-plus">Good+ (&gt;= 51)</option>
          <option value="excellent">Excellent Only (&gt;= 76)</option>
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

      <!-- Search -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
          Search Page
        </label>
        <input
          id="search"
          type="text"
          bind:value={searchQuery}
          placeholder="Search by title..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>

  <!-- Summary Stats Cards -->
  {#if !isLoading && pageMetrics.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Average Quality Score</div>
        <div class="text-3xl font-bold" class:text-green-600={avgQualityScore >= 76} class:text-yellow-600={avgQualityScore >= 51 && avgQualityScore < 76} class:text-orange-600={avgQualityScore >= 26 && avgQualityScore < 51} class:text-red-600={avgQualityScore < 26}>
          {avgQualityScore.toFixed(1)}
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Pages Needing Attention</div>
        <div class="text-3xl font-bold text-orange-600">{pagesNeedingAttention}</div>
      </div>

      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">SEO Completion Rate</div>
        <div class="text-3xl font-bold text-blue-600">{seoCompletionRate.toFixed(0)}%</div>
      </div>

      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div class="text-sm font-medium text-gray-500 mb-1">Content Freshness</div>
        <div class="text-3xl font-bold text-green-600">{contentFreshnessRate.toFixed(0)}%</div>
      </div>
    </div>
  {/if}

  <!-- Charts -->
  {#if !isLoading && filteredMetrics.length > 0}
    <ContentQualityChart
      metrics={filteredMetrics}
      {aggregation}
    />
  {/if}

  <!-- Table -->
  <ContentQualityTable
    metrics={filteredMetrics}
    {isLoading}
  />
</div>
