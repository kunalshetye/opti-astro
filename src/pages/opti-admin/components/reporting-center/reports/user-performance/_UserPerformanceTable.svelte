<script lang="ts">
  import LoadingSpinner from '../../../shared/_LoadingSpinner.svelte';

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

  interface Props {
    leaderboard: LeaderboardEntry[];
    isLoading: boolean;
    filteredCount: number;
  }

  let { leaderboard, isLoading, filteredCount }: Props = $props();

  // Sorting state
  let sortColumn = $state<keyof LeaderboardEntry>('totalActivity');
  let sortDirection = $state<'asc' | 'desc'>('desc');

  // Pagination state
  let currentPage = $state(1);
  let pageSize = $state(25);

  function handleSort(column: keyof LeaderboardEntry) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'desc'; // Default to descending for most columns
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
      User Leaderboard ({sortedLeaderboard.length})
    </h3>
    {#if filteredCount < leaderboard.length}
      <span class="text-sm text-gray-500">
        Showing {filteredCount} of {leaderboard.length} users (filtered)
      </span>
    {/if}
  </div>

  {#if isLoading}
    <!-- Loading State -->
    <div class="p-8 text-center">
      <LoadingSpinner />
      <p class="mt-2 text-gray-600">Loading user data...</p>
    </div>
  {:else if sortedLeaderboard.length === 0}
    <!-- Empty State -->
    <div class="p-8 text-center text-gray-500">
      No user data available for the selected period or filters.
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
              onclick={() => handleSort('user')}
            >
              <div class="flex items-center gap-1">
                User
                {#if sortColumn === 'user'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('itemsCreated')}
            >
              <div class="flex items-center gap-1">
                Items Created
                {#if sortColumn === 'itemsCreated'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('itemsModified')}
            >
              <div class="flex items-center gap-1">
                Items Modified
                {#if sortColumn === 'itemsModified'}
                  <span class="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </div>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              onclick={() => handleSort('totalActivity')}
            >
              <div class="flex items-center gap-1">
                Total Activity
                {#if sortColumn === 'totalActivity'}
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
              Content Types
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Locales
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each paginatedLeaderboard as entry (entry.user)}
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                #{entry.rank}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {entry.user}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {entry.itemsCreated}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {entry.itemsModified}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {entry.totalActivity}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(entry.mostRecent)}
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">
                <div class="flex gap-1 flex-wrap">
                  {#each entry.contentTypes.slice(0, 3) as type}
                    <span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                      {type}
                    </span>
                  {/each}
                  {#if entry.contentTypes.length > 3}
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{entry.contentTypes.length - 3}
                    </span>
                  {/if}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">
                <div class="flex gap-1 flex-wrap">
                  {#each entry.locales as locale}
                    <span class="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded">
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
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedLeaderboard.length)} of {sortedLeaderboard.length} users
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
