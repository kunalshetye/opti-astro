<script lang="ts">
  import LoadingSpinner from '../../../shared/_LoadingSpinner.svelte';

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
    translations: Record<
      string,
      {
        id: string;
        title: string;
        url: string;
        published: string;
        lastModified: string;
      }
    >;
    missingLocales: string[];
    translationCompleteness: number;
    contentType: string;
  }

  interface Props {
    contentTranslations: ContentTranslation[];
    isLoading: boolean;
    locales: string[];
    defaultLocale: string;
  }

  let { contentTranslations, isLoading, locales, defaultLocale }: Props = $props();

  // Expandable rows
  let expandedRows = $state<Set<string>>(new Set());

  // Sorting
  let sortColumn = $state<'title' | 'contentType' | 'completeness'>('completeness');
  let sortDirection = $state<'asc' | 'desc'>('asc');

  function toggleRow(key: string) {
    if (expandedRows.has(key)) {
      expandedRows.delete(key);
    } else {
      expandedRows.add(key);
    }
    expandedRows = new Set(expandedRows);
  }

  function sortBy(column: typeof sortColumn) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'desc';
    }
  }

  let sortedTranslations = $derived.by(() => {
    const sorted = [...contentTranslations];

    sorted.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (sortColumn === 'title') {
        aVal = a.defaultLocaleContent.title;
        bVal = b.defaultLocaleContent.title;
      } else if (sortColumn === 'contentType') {
        aVal = a.contentType;
        bVal = b.contentType;
      } else {
        aVal = a.translationCompleteness;
        bVal = b.translationCompleteness;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  });

  function getCompletenessColor(percentage: number): string {
    if (percentage === 100) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  }
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200">
  <div class="p-6 border-b border-gray-200">
    <h3 class="text-lg font-semibold text-gray-900">
      Content Translation Details ({contentTranslations.length} items)
    </h3>
  </div>

  {#if isLoading}
    <div class="p-8 text-center">
      <LoadingSpinner />
      <p class="mt-2 text-gray-600">Loading translation data...</p>
    </div>
  {:else if sortedTranslations.length === 0}
    <div class="p-8 text-center text-gray-500">No content matches your filters.</div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-10"></th>

            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              onclick={() => sortBy('title')}
            >
              <div class="flex items-center gap-1">
                Content Title
                {#if sortColumn === 'title'}
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    {#if sortDirection === 'asc'}
                      <path d="M5 10l5-5 5 5H5z" />
                    {:else}
                      <path d="M15 10l-5 5-5-5h10z" />
                    {/if}
                  </svg>
                {/if}
              </div>
            </th>

            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Default Locale URL
            </th>

            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              onclick={() => sortBy('contentType')}
            >
              <div class="flex items-center gap-1">
                Content Type
                {#if sortColumn === 'contentType'}
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    {#if sortDirection === 'asc'}
                      <path d="M5 10l5-5 5 5H5z" />
                    {:else}
                      <path d="M15 10l-5 5-5-5h10z" />
                    {/if}
                  </svg>
                {/if}
              </div>
            </th>

            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Translated Locales
            </th>

            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Missing Locales
            </th>

            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              onclick={() => sortBy('completeness')}
            >
              <div class="flex items-center gap-1">
                Completeness
                {#if sortColumn === 'completeness'}
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    {#if sortDirection === 'asc'}
                      <path d="M5 10l5-5 5 5H5z" />
                    {:else}
                      <path d="M15 10l-5 5-5-5h10z" />
                    {/if}
                  </svg>
                {/if}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each sortedTranslations as content (content.key)}
            <tr class="hover:bg-gray-50">
              <!-- Expand/Collapse -->
              <td class="px-4 py-4 whitespace-nowrap">
                {#if content.missingLocales.length > 0}
                  <button
                    onclick={() => toggleRow(content.key)}
                    class="text-gray-400 hover:text-gray-600"
                  >
                    {#if expandedRows.has(content.key)}
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    {:else}
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    {/if}
                  </button>
                {/if}
              </td>

              <!-- Title -->
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                <div class="max-w-xs truncate" title={content.defaultLocaleContent.title}>
                  {content.defaultLocaleContent.title}
                </div>
              </td>

              <!-- Default Locale URL -->
              <td class="px-6 py-4 text-sm">
                <a
                  href={content.defaultLocaleContent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  View
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                </a>
              </td>

              <!-- Content Type -->
              <td class="px-6 py-4 text-sm text-gray-700">
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">
                  {content.contentType}
                </span>
              </td>

              <!-- Translated Locales -->
              <td class="px-6 py-4 text-sm">
                <div class="flex flex-wrap gap-1">
                  {#each Object.keys(content.translations) as locale}
                    <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {locale.toUpperCase()}
                    </span>
                  {/each}
                </div>
              </td>

              <!-- Missing Locales -->
              <td class="px-6 py-4 text-sm">
                {#if content.missingLocales.length === 0}
                  <span class="text-green-600 font-semibold">None</span>
                {:else}
                  <div class="flex flex-wrap gap-1">
                    {#each content.missingLocales.slice(0, 3) as locale}
                      <span class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        {locale.toUpperCase()}
                      </span>
                    {/each}
                    {#if content.missingLocales.length > 3}
                      <span class="text-xs text-gray-500">
                        +{content.missingLocales.length - 3} more
                      </span>
                    {/if}
                  </div>
                {/if}
              </td>

              <!-- Completeness -->
              <td class="px-6 py-4 text-sm">
                <span
                  class="px-3 py-1 rounded-full font-semibold {getCompletenessColor(
                    content.translationCompleteness
                  )}"
                >
                  {content.translationCompleteness.toFixed(0)}%
                </span>
              </td>
            </tr>

            <!-- Expanded Row: Show all missing locales -->
            {#if expandedRows.has(content.key)}
              <tr class="bg-gray-50">
                <td colspan="7" class="px-6 py-4">
                  <div class="pl-12">
                    <h4 class="text-sm font-semibold text-gray-700 mb-2">
                      Missing Translations ({content.missingLocales.length}):
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      {#each content.missingLocales as locale}
                        <span class="px-3 py-1 bg-red-100 text-red-800 rounded text-sm">
                          {locale.toUpperCase()}
                        </span>
                      {/each}
                    </div>
                  </div>
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
