<script lang="ts">
  import LoadingSpinner from '../../../shared/_LoadingSpinner.svelte';

  interface ContentPage {
    id: string;
    contentId: string;
    variationId: string | null;
    fullId: string;
    title: string;
    url: string;
    published: string;
    lastModified: string;
    owner: string;
    locale: string;
    status: string;
    baseUrl: string;
    contentType: string[];
    version: string | null;
    isVariation: boolean;
    variations?: ContentPage[];
    daysSinceUpdate: number;
  }

  interface Props {
    pages: ContentPage[];
    isLoading: boolean;
    searchQuery: string;
    filterLocale: string;
    expandedRows: Set<string>;
    onToggleRow: (contentId: string) => void;
  }

  let { pages, isLoading, searchQuery, filterLocale, expandedRows, onToggleRow }: Props = $props();

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
      {#if searchQuery || filterLocale !== 'all'}
        No pages match your filters.
      {:else}
        No stale content found.
      {/if}
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"></th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locale</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content ID / Variation</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Inactive</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each pages as page (page.id)}
            <!-- Parent Row -->
            <tr class="hover:bg-gray-50 {page.variations && page.variations.length > 0 ? 'font-medium' : ''}">
              <!-- Expand/Collapse Icon -->
              <td class="px-4 py-4 whitespace-nowrap">
                {#if page.variations && page.variations.length > 0}
                  <button
                    onclick={() => onToggleRow(page.contentId)}
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Toggle variations"
                  >
                    {#if expandedRows.has(page.contentId)}
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    {:else}
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    {/if}
                  </button>
                {/if}
              </td>

              <!-- Title with variation count badge -->
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                <div class="max-w-xs">
                  <div class="flex items-center gap-2">
                    <div class="truncate" title={page.title}>
                      {page.title}
                    </div>
                    {#if page.variations && page.variations.length > 0}
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                        {page.variations.length} {page.variations.length === 1 ? 'variation' : 'variations'}
                      </span>
                    {/if}
                  </div>
                </div>
              </td>

              <!-- Locale -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                  {page.locale.toUpperCase()}
                </span>
              </td>

              <!-- Content ID / Variation -->
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex flex-col">
                  <span class="font-mono text-gray-900">{page.fullId}</span>
                  <span class="text-xs text-gray-500 mt-1">Original</span>
                </div>
              </td>

              <!-- Owner -->
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

              <!-- Last Modified -->
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

              <!-- Days Inactive -->
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-semibold {getInactivityBadgeClass(page.daysSinceUpdate)}">
                  {page.daysSinceUpdate} days
                </span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {page.status}
              </td>

              <!-- Link -->
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

            <!-- Child Variation Rows (only shown when expanded) -->
            {#if expandedRows.has(page.contentId) && page.variations}
              {#each page.variations as variant (variant.id)}
                <tr class="bg-gray-50 border-l-4 border-purple-400">
                  <!-- Empty expand cell -->
                  <td class="px-4 py-4"></td>

                  <!-- Title (indented) -->
                  <td class="px-6 py-4 text-sm text-gray-700">
                    <div class="max-w-xs pl-8">
                      <div class="truncate" title={variant.title}>
                        {variant.title}
                      </div>
                    </div>
                  </td>

                  <!-- Locale -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                      {variant.locale.toUpperCase()}
                    </span>
                  </td>

                  <!-- Variation ID -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-gray-900">{variant.fullId}</span>
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Variation {variant.variationId}
                      </span>
                    </div>
                  </td>

                  <!-- Owner -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div class="flex flex-col">
                      <span>{variant.owner}</span>
                      {#if variant.contentType.length > 0}
                        <span class="text-xs text-gray-500 mt-1">
                          {variant.contentType[variant.contentType.length - 1].split('.').pop()}
                        </span>
                      {/if}
                    </div>
                  </td>

                  <!-- Last Modified -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div class="flex flex-col">
                      <span>{formatDate(variant.lastModified)}</span>
                      {#if variant.published}
                        <span class="text-xs text-gray-500 mt-1">
                          Published: {formatDate(variant.published)}
                        </span>
                      {/if}
                    </div>
                  </td>

                  <!-- Days Inactive -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold {getInactivityBadgeClass(variant.daysSinceUpdate)}">
                      {variant.daysSinceUpdate} days
                    </span>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {variant.status}
                  </td>

                  <!-- Link -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <a
                      href={variant.url}
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
            {/if}
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
