<script lang="ts">
  import LoadingSpinner from '../../../shared/_LoadingSpinner.svelte';

  interface LeaderboardEntry {
    rank: number;
    author: string;
    totalPages: number;
    avgTimeToPublish: number;
    pagesPerMonth: number;
    mostRecent: string;
    locales: string[];
  }

  interface Props {
    leaderboard: LeaderboardEntry[];
    isLoading: boolean;
    filteredCount: number;
  }

  let { leaderboard, isLoading, filteredCount }: Props = $props();

  // Sorting state
  let sortColumn = $state<keyof LeaderboardEntry>('totalPages');
  let sortDirection = $state<'asc' | 'desc'>('desc');

  // Pagination state
  let currentPage = $state(1);
  let pageSize = $state(25);

  function handleSort(column: keyof LeaderboardEntry) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = column === 'avgTimeToPublish' ? 'asc' : 'desc'; // Lower time is better
    }
    currentPage = 1; // Reset to first page when sorting
  }

  // Sorted leaderboard
  function sortLeaderboard() {
    const sorted = [...leaderboard];
    sorted.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else if (Array.isArray(aVal) && Array.isArray(bVal)) {
        comparison = aVal.length - bVal.length;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  let sortedLeaderboard = $derived(sortLeaderboard());

  // Paginated leaderboard
  let paginatedLeaderboard = $derived(
    sortedLeaderboard.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  );

  let totalPages = $derived(Math.ceil(sortedLeaderboard.length / pageSize));

  function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  // Reset to page 1 when filtered count changes
  $effect(() => {
    if (filteredCount) {
      currentPage = 1;
    }
  });
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200">
  <!-- Header -->
  <div class="p-6 border-b border-gray-200 flex justify-between items-center">
    <h3 class="text-lg font-semibold text-gray-900">
      Author Leaderboard ({sortedLeaderboard.length})
    </h3>
    {#if filteredCount < leaderboard.length}
      <span class="text-sm text-gray-500">
        Showing {filteredCount} of {leaderboard.length} authors (filtered)
      </span>
    {/if}
  </div>

  {#if isLoading}
    <!-- Loading State -->
    <div class="p-8 text-center">
      <LoadingSpinner />
      <p class="mt-2 text-gray-600">Loading author data...</p>
    </div>
  {:else if sortedLeaderboard.length === 0}
    <!-- Empty State -->
    <div class="p-8 text-center text-gray-500">
      No author data available for the selected period or filters.
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
              onclick={() => handleSort('author')}
            >
              <div class="flex items-center gap-1">
                Author
                {#if sortColumn === 'author'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('totalPages')}
            >
              <div class="flex items-center gap-1">
                Total Pages
                {#if sortColumn === 'totalPages'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('avgTimeToPublish')}
            >
              <div class="flex items-center gap-1">
                Avg Time to Publish
                {#if sortColumn === 'avgTimeToPublish'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('pagesPerMonth')}
            >
              <div class="flex items-center gap-1">
                Pages/Month
                {#if sortColumn === 'pagesPerMonth'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('mostRecent')}
            >
              <div class="flex items-center gap-1">
                Most Recent
                {#if sortColumn === 'mostRecent'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Locales
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each paginatedLeaderboard as entry (entry.author)}
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                #{entry.rank}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {entry.author}
                {#if entry.totalPages === 1}
                  <span class="ml-2 text-xs text-gray-500">(Single page)</span>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {entry.totalPages}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {#if entry.avgTimeToPublish > 0}
                  {entry.avgTimeToPublish.toFixed(1)} days
                {:else}
                  <span class="text-gray-400">N/A</span>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {entry.pagesPerMonth.toFixed(1)}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(entry.mostRecent)}
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">
                <div class="flex gap-1 flex-wrap">
                  {#each entry.locales as locale}
                    <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      {locale}
                    </span>
                  {/each}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedLeaderboard.length)} of {sortedLeaderboard.length} authors
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
