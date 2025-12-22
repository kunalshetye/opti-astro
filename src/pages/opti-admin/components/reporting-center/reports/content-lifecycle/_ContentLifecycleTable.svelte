<script lang="ts">
  import LoadingSpinner from '../../../shared/_LoadingSpinner.svelte';

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

  interface Props {
    pages: ContentPage[];
    isLoading: boolean;
  }

  let { pages, isLoading }: Props = $props();

  function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getInactivityBadgeClass(days: number): string {
    if (days < 90) return 'bg-yellow-100 text-yellow-800';
    if (days < 180) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200">
  <div class="p-6 border-b border-gray-200">
    <h3 class="text-lg font-semibold text-gray-900">
      Stale Content ({pages.length})
    </h3>
  </div>

  {#if isLoading}
    <div class="p-8 text-center">
      <LoadingSpinner />
      <p class="mt-2 text-gray-600">Loading content...</p>
    </div>
  {:else if pages.length === 0}
    <div class="p-8 text-center text-gray-500">
      No stale content found with current filters.
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Inactive</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each pages as page (page.id)}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                <div class="max-w-xs">
                  <div class="truncate" title={page.title}>
                    {page.title}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {page.locale}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <div class="flex flex-col">
                  <span>{page.owner}</span>
                  {#if page.contentType.length > 0}
                    <span class="text-xs text-gray-500 mt-1">
                      {page.contentType[page.contentType.length - 1].split('.').pop()}
                    </span>
                  {/if}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <div class="flex flex-col">
                  <span>{formatDate(page.lastModified)}</span>
                  {#if page.published}
                    <span class="text-xs text-gray-500 mt-1">
                      Published: {formatDate(page.published)}
                    </span>
                  {/if}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-semibold {getInactivityBadgeClass(page.daysSinceUpdate)}">
                  {page.daysSinceUpdate} days
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {page.status}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <a
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  View
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<!-- Legend -->
<div class="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
  <h4 class="text-sm font-semibold text-gray-900 mb-2">Inactivity Severity:</h4>
  <div class="flex flex-wrap gap-4 text-sm">
    <div class="flex items-center gap-2">
      <span class="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
        &lt; 90 days
      </span>
      <span class="text-gray-600">Needs review</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
        90-180 days
      </span>
      <span class="text-gray-600">Needs attention</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
        &gt; 180 days
      </span>
      <span class="text-gray-600">Critical - consider archiving</span>
    </div>
  </div>
</div>
