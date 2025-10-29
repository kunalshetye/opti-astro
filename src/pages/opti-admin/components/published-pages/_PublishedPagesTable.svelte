<script lang="ts">
  import LoadingSpinner from '../shared/_LoadingSpinner.svelte';

  interface PublishedPage {
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
    action?: 'copy' | 'copy-with-changes' | 'ignore';
  }

  interface Props {
    pages: PublishedPage[];
    isLoading: boolean;
    searchQuery: string;
    filterLocale: string;
    daysToLookBack: number;
    onSetAction: (pageId: string, action: 'copy' | 'copy-with-changes' | 'ignore') => void;
  }

  let { pages, isLoading, searchQuery, filterLocale, daysToLookBack, onSetAction }: Props = $props();

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
      Published Pages ({pages.length})
    </h3>
  </div>

  {#if isLoading}
    <div class="p-8 text-center">
      <LoadingSpinner />
      <p class="mt-2 text-gray-600">Loading published pages...</p>
    </div>
  {:else if pages.length === 0}
    <div class="p-8 text-center text-gray-500">
      {#if searchQuery || filterLocale !== 'all'}
        No pages match your filters.
      {:else}
        No pages published in the last {daysToLookBack} days.
      {/if}
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published at</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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
                  <span>{formatDate(page.published)}</span>
                  {#if page.published !== page.lastModified}
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
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex gap-2">
                  <button
                    onclick={() => onSetAction(page.id, 'copy')}
                    type="button"
                    class="px-3 py-1 text-xs font-semibold rounded border transition-colors {
                      page.action === 'copy'
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }"
                  >
                    Copy as is
                  </button>
                  <button
                    onclick={() => onSetAction(page.id, 'copy-with-changes')}
                    type="button"
                    class="px-3 py-1 text-xs font-semibold rounded border transition-colors {
                      page.action === 'copy-with-changes'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }"
                  >
                    Copy + changes
                  </button>
                  <button
                    onclick={() => onSetAction(page.id, 'ignore')}
                    type="button"
                    class="px-3 py-1 text-xs font-semibold rounded border transition-colors {
                      page.action === 'ignore'
                        ? 'bg-gray-100 text-gray-800 border-gray-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }"
                  >
                    Ignore
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<!-- Legend -->
<div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
  <h4 class="text-sm font-semibold text-blue-900 mb-2">Action Legend:</h4>
  <ul class="text-sm text-blue-800 space-y-1">
    <li><strong>Copy as is:</strong> Copy the page without modifications</li>
    <li><strong>Copy + changes:</strong> Copy the page and apply custom changes</li>
    <li><strong>Ignore:</strong> Skip this page from any bulk operations</li>
  </ul>
  <p class="text-xs text-blue-700 mt-3">
    Your selections are automatically saved to localStorage and will persist between sessions.
  </p>
</div>
