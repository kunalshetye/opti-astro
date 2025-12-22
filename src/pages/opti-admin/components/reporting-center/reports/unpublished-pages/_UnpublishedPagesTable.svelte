<script lang="ts">
  import LoadingSpinner from '../../../shared/_LoadingSpinner.svelte';

  interface UnpublishedPage {
    id: string;
    title: string;
    url: string;
    created: string;
    lastModified: string;
    owner: string;
    locale: string;
    status: string;
    baseUrl: string;
    contentType: string[];
  }

  interface Props {
    pages: UnpublishedPage[];
    isLoading: boolean;
    searchQuery: string;
    filterLocale: string;
  }

  let { pages, isLoading, searchQuery, filterLocale }: Props = $props();

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
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200">
  <div class="p-6 border-b border-gray-200">
    <h3 class="text-lg font-semibold text-gray-900">
      Draft Pages ({pages.length})
    </h3>
  </div>

  {#if isLoading}
    <div class="p-8 text-center">
      <LoadingSpinner />
      <p class="mt-2 text-gray-600">Loading draft pages...</p>
    </div>
  {:else if pages.length === 0}
    <div class="p-8 text-center text-gray-500">
      {#if searchQuery || filterLocale !== 'all'}
        No pages match your filters.
      {:else}
        No draft pages found.
      {/if}
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
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
                  {#if page.contentType.includes('ArticlePage')}
                    <span class="text-xs text-gray-500 mt-1">
                      (ArticlePage)
                    </span>
                  {/if}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <div class="flex flex-col">
                  <span>{formatDate(page.created)}</span>
                  {#if page.created !== page.lastModified}
                    <span class="text-xs text-gray-500 mt-1">
                      Modified: {formatDate(page.lastModified)}
                    </span>
                  {/if}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">
                <div class="max-w-xs">
                  <code class="text-xs bg-gray-100 px-2 py-1 rounded truncate block" title={page.baseUrl}>
                    {page.baseUrl || 'N/A'}
                  </code>
                </div>
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
