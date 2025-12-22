<script lang="ts">
  import LoadingSpinner from '../../../shared/_LoadingSpinner.svelte';
  import { identifyTopIssue, type PageQualityMetrics } from './_ScoreCalculator';

  interface Props {
    metrics: PageQualityMetrics[];
    isLoading: boolean;
  }

  let { metrics, isLoading }: Props = $props();

  // Sorting state
  let sortColumn = $state<'rank' | 'title' | 'pageType' | 'total' | 'seo' | 'content' | 'lastModified'>('total');
  let sortDirection = $state<'asc' | 'desc'>('desc');

  // Pagination state
  let currentPage = $state(1);
  let pageSize = $state(25);

  // Expanded rows
  let expandedRows = $state<Set<string>>(new Set());

  function handleSort(column: typeof sortColumn) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = column === 'lastModified' ? 'desc' : (column === 'total' || column === 'seo' || column === 'content') ? 'desc' : 'asc';
    }
    currentPage = 1; // Reset to first page when sorting
  }

  function toggleRowExpansion(id: string) {
    if (expandedRows.has(id)) {
      expandedRows.delete(id);
    } else {
      expandedRows.add(id);
    }
    expandedRows = expandedRows; // Trigger reactivity
  }

  // Sorted metrics
  let sortedMetrics: PageQualityMetrics[] = $derived.by(() => {
    const sorted = [...metrics];
    sorted.sort((a, b) => {
      let comparison = 0;

      if (sortColumn === 'rank' || sortColumn === 'total') {
        comparison = a.score.total - b.score.total;
      } else if (sortColumn === 'title') {
        comparison = a.page.title.localeCompare(b.page.title);
      } else if (sortColumn === 'pageType') {
        comparison = a.page.pageType.localeCompare(b.page.pageType);
      } else if (sortColumn === 'seo') {
        comparison = a.score.seo - b.score.seo;
      } else if (sortColumn === 'content') {
        comparison = a.score.content - b.score.content;
      } else if (sortColumn === 'lastModified') {
        comparison = new Date(a.page.lastModified).getTime() - new Date(b.page.lastModified).getTime();
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  });

  // Paginated metrics
  let paginatedMetrics = $derived(
    sortedMetrics.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  );

  let totalPages = $derived(Math.ceil(sortedMetrics.length / pageSize));

  function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    if (diffDays === 0) return `${formatted} (today)`;
    if (diffDays === 1) return `${formatted} (yesterday)`;
    return `${formatted} (${diffDays} days ago)`;
  }

  function getScoreBadgeClass(score: number, max: number): string {
    const percentage = (score / max) * 100;
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }

  function getCategoryBadgeClass(category: string): string {
    if (category === 'Excellent') return 'bg-green-100 text-green-800';
    if (category === 'Good') return 'bg-yellow-100 text-yellow-800';
    if (category === 'Fair') return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200">
  <!-- Header -->
  <div class="p-6 border-b border-gray-200 flex justify-between items-center">
    <h3 class="text-lg font-semibold text-gray-900">
      Content Quality Leaderboard ({sortedMetrics.length})
    </h3>
  </div>

  {#if isLoading}
    <!-- Loading State -->
    <div class="p-8 text-center">
      <LoadingSpinner />
      <p class="mt-2 text-gray-600">Analyzing content quality...</p>
    </div>
  {:else if sortedMetrics.length === 0}
    <!-- Empty State -->
    <div class="p-8 text-center text-gray-500">
      No pages available for quality analysis.
    </div>
  {:else}
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Rank
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('title')}
            >
              <div class="flex items-center gap-1">
                Page Title
                {#if sortColumn === 'title'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('pageType')}
            >
              <div class="flex items-center gap-1">
                Type
                {#if sortColumn === 'pageType'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('total')}
            >
              <div class="flex items-center gap-1">
                Quality Score
                {#if sortColumn === 'total'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Category
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('seo')}
            >
              <div class="flex items-center gap-1">
                SEO
                {#if sortColumn === 'seo'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('content')}
            >
              <div class="flex items-center gap-1">
                Content
                {#if sortColumn === 'content'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('lastModified')}
            >
              <div class="flex items-center gap-1">
                Last Modified
                {#if sortColumn === 'lastModified'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Top Issue
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each paginatedMetrics as metric, idx (metric.page.id)}
            {@const isExpanded = expandedRows.has(metric.page.id)}
            {@const rank = (currentPage - 1) * pageSize + idx + 1}
            <tr class="hover:bg-gray-50 transition-colors cursor-pointer" onclick={() => toggleRowExpansion(metric.page.id)}>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                #{rank}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                {metric.page.title}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {metric.page.pageType}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-lg font-bold {getCategoryBadgeClass(metric.score.category)}">
                  {metric.score.total}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-2.5 py-1 rounded text-xs font-medium {getCategoryBadgeClass(metric.score.category)}">
                  {metric.score.category}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-1 rounded text-xs font-medium {getScoreBadgeClass(metric.score.seo, 40)}">
                    {metric.score.seo}/40
                  </span>
                  <div class="w-16 bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: {(metric.score.seo / 40) * 100}%"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-1 rounded text-xs font-medium {getScoreBadgeClass(metric.score.content, 30)}">
                    {metric.score.content}/30
                  </span>
                  <div class="w-16 bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" style="width: {(metric.score.content / 30) * 100}%"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(metric.page.lastModified)}
              </td>
              <td class="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                {identifyTopIssue(metric.score, metric.page)}
              </td>
            </tr>

            <!-- Expanded Row Details -->
            {#if isExpanded}
              <tr class="bg-gray-50">
                <td colspan="9" class="px-6 py-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="bg-white p-4 rounded border border-gray-200">
                      <h4 class="text-sm font-semibold text-gray-700 mb-2">Score Breakdown</h4>
                      <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                          <span>SEO Excellence:</span>
                          <span class="font-medium">{metric.score.seo}/40</span>
                        </div>
                        <div class="flex justify-between">
                          <span>Content Quality:</span>
                          <span class="font-medium">{metric.score.content}/30</span>
                        </div>
                        <div class="flex justify-between">
                          <span>Accessibility:</span>
                          <span class="font-medium">{metric.score.accessibility}/10</span>
                        </div>
                        <div class="flex justify-between">
                          <span>Freshness:</span>
                          <span class="font-medium">{metric.score.freshness}/10</span>
                        </div>
                        <div class="flex justify-between">
                          <span>Publication:</span>
                          <span class="font-medium">{metric.score.publication}/10</span>
                        </div>
                        <div class="flex justify-between pt-2 border-t border-gray-200 font-bold">
                          <span>Total Score:</span>
                          <span class="{getCategoryBadgeClass(metric.score.category).split(' ')[1]}">{metric.score.total}/100</span>
                        </div>
                      </div>
                    </div>

                    <div class="bg-white p-4 rounded border border-gray-200">
                      <h4 class="text-sm font-semibold text-gray-700 mb-2">Page Details</h4>
                      <div class="space-y-2 text-sm">
                        <div>
                          <span class="text-gray-600">URL:</span>
                          <a href={metric.page.url} target="_blank" class="ml-1 text-blue-600 hover:underline break-all">
                            {metric.page.url}
                          </a>
                        </div>
                        <div>
                          <span class="text-gray-600">Locale:</span>
                          <span class="ml-1 font-medium">{metric.page.locale}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Status:</span>
                          <span class="ml-1 px-2 py-0.5 rounded text-xs {metric.page.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                            {metric.page.status}
                          </span>
                        </div>
                        <div>
                          <span class="text-gray-600">Days Since Update:</span>
                          <span class="ml-1 font-medium">{metric.page.daysSinceUpdate}</span>
                        </div>
                      </div>
                    </div>

                    <div class="bg-white p-4 rounded border border-gray-200">
                      <h4 class="text-sm font-semibold text-gray-700 mb-2">Top Issue</h4>
                      <div class="text-sm">
                        <p class="text-orange-700 font-medium">{identifyTopIssue(metric.score, metric.page)}</p>
                        <p class="text-gray-600 mt-2 text-xs">
                          Fix this issue first for maximum quality score improvement.
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedMetrics.length)} of {sortedMetrics.length} pages
        </div>
        <div class="flex gap-2">
          <button
            onclick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {#if totalPages <= 7}
            {#each Array.from({ length: totalPages }) as _, i}
              <button
                onclick={() => goToPage(i + 1)}
                class="px-3 py-1 text-sm border rounded-md transition-colors {currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}"
              >
                {i + 1}
              </button>
            {/each}
          {:else}
            <button
              onclick={() => goToPage(1)}
              class="px-3 py-1 text-sm border rounded-md transition-colors {currentPage === 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}"
            >
              1
            </button>

            {#if currentPage > 3}
              <span class="px-2 py-1 text-sm text-gray-500">...</span>
            {/if}

            {#each Array.from({ length: 5 }) as _, i}
              {@const page = Math.max(2, Math.min(totalPages - 1, currentPage - 2 + i))}
              {#if page > 1 && page < totalPages}
                <button
                  onclick={() => goToPage(page)}
                  class="px-3 py-1 text-sm border rounded-md transition-colors {currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}"
                >
                  {page}
                </button>
              {/if}
            {/each}

            {#if currentPage < totalPages - 2}
              <span class="px-2 py-1 text-sm text-gray-500">...</span>
            {/if}

            <button
              onclick={() => goToPage(totalPages)}
              class="px-3 py-1 text-sm border rounded-md transition-colors {currentPage === totalPages ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}"
            >
              {totalPages}
            </button>
          {/if}

          <button
            onclick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>
