<script lang="ts">
  import { onMount } from 'svelte';
  import PublishedPagesDashboard from './reports/published-pages/_PublishedPagesDashboard.svelte';
  import UnpublishedPagesDashboard from './reports/unpublished-pages/_UnpublishedPagesDashboard.svelte';
  import ContentLifecycleDashboard from './reports/content-lifecycle/_ContentLifecycleDashboard.svelte';
  import AuthorProductivityDashboard from './reports/author-productivity/_AuthorProductivityDashboard.svelte';
  import UserPerformanceDashboard from './reports/user-performance/_UserPerformanceDashboard.svelte';
  import ContentQualityDashboard from './reports/content-quality/_ContentQualityDashboard.svelte';

  // State for current report
  let currentReport = $state<string>('published-pages');

  // Available reports configuration
  const reports = [
    {
      id: 'published-pages',
      name: 'Published Pages',
      description: 'Pages published in the last 365 days',
      icon: 'document-check'
    },
    {
      id: 'unpublished-pages',
      name: 'Unpublished Pages',
      description: 'All draft pages awaiting publication',
      icon: 'document-draft'
    },
    {
      id: 'content-lifecycle',
      name: 'Content Lifecycle',
      description: 'Pages not updated recently',
      icon: 'clock'
    },
    {
      id: 'author-productivity',
      name: 'Author Performance',
      description: 'Track content author performance and velocity',
      icon: 'users'
    },
    {
      id: 'user-performance',
      name: 'User Performance',
      description: 'Track CMS user activity and content management',
      icon: 'chart'
    },
    {
      id: 'content-quality',
      name: 'Content Quality Score',
      description: 'Assess content completeness and SEO readiness',
      icon: 'badge-check'
    }
  ];

  // Navigation function
  function navigateToReport(reportId: string) {
    currentReport = reportId;

    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'reporting-center');
    url.searchParams.set('report', reportId);
    window.history.pushState({ view: 'reporting-center', report: reportId }, '', url);
  }

  // Initialize from URL on mount
  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const reportParam = params.get('report');
    if (reportParam && reports.some(r => r.id === reportParam)) {
      currentReport = reportParam;
    }

    // Handle browser back/forward
    function handlePopState() {
      const params = new URLSearchParams(window.location.search);
      const reportParam = params.get('report') || 'published-pages';
      if (reports.some(r => r.id === reportParam)) {
        currentReport = reportParam;
      }
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  });
</script>

<div class="w-full">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Reporting Center</h1>
    <p class="text-gray-600">Comprehensive reports and analytics for your content</p>
  </div>

  <div class="flex gap-6 flex-col xl:flex-row">
    <!-- Left Sidebar Menu -->
    <aside class="w-full xl:w-72 flex-shrink-0">
      <nav class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Available Reports
        </h2>
        <ul class="space-y-1 list-none">
          {#each reports as report}
            <li>
              <button
                onclick={() => navigateToReport(report.id)}
                class="w-full text-left px-4 py-3 rounded-lg transition-all {
                  currentReport === report.id
                    ? 'bg-blue-50 border-2 border-blue-500 text-blue-900'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }"
              >
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {#if report.icon === 'document-check'}
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    {:else if report.icon === 'document-draft'}
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    {:else if report.icon === 'clock'}
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    {:else if report.icon === 'users'}
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    {:else if report.icon === 'chart'}
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    {:else if report.icon === 'badge-check'}
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    {/if}
                  </svg>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-sm">{report.name}</div>
                    <div class="text-xs text-gray-500 mt-0.5">{report.description}</div>
                  </div>
                </div>
              </button>
            </li>
          {/each}
        </ul>
      </nav>
    </aside>

    <!-- Main Report Content Area -->
    <main class="flex-1 min-w-0">
      {#if currentReport === 'published-pages'}
        <PublishedPagesDashboard />
      {:else if currentReport === 'unpublished-pages'}
        <UnpublishedPagesDashboard />
      {:else if currentReport === 'content-lifecycle'}
        <ContentLifecycleDashboard />
      {:else if currentReport === 'author-productivity'}
        <AuthorProductivityDashboard />
      {:else if currentReport === 'user-performance'}
        <UserPerformanceDashboard />
      {:else if currentReport === 'content-quality'}
        <ContentQualityDashboard />
      {/if}
    </main>
  </div>
</div>
