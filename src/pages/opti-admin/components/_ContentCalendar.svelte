<script lang="ts">
    import LoadingSpinner from './shared/_LoadingSpinner.svelte';
    import StatusMessage from './shared/_StatusMessage.svelte';

    interface CalendarPage {
        key: string;
        version: string;
        displayName: string;
        url: string;
        baseUrl: string;
        locale: string;
        date: string | null;
    }

    interface CalendarData {
        scheduled: CalendarPage[];
        expiring: CalendarPage[];
        expiryScannedPages: number;
        expiryCapped: boolean;
    }

    // State
    let data = $state<CalendarData | null>(null);
    let isLoading = $state(false);
    let message = $state('');
    let messageType = $state<'success' | 'error'>('success');
    let showMessage = $state(false);
    let searchQuery = $state('');

    // Per-item preview loading state: key → boolean
    let previewLoading = $state<Record<string, boolean>>({});

    function displayMessage(text: string, isSuccess: boolean) {
        message = text;
        messageType = isSuccess ? 'success' : 'error';
        showMessage = true;
        setTimeout(() => {
            showMessage = false;
        }, 6000);
    }

    function formatDate(iso: string | null): string {
        if (!iso) return 'Date TBD';
        return new Date(iso).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function relativeTime(iso: string | null): string {
        if (!iso) return '';
        const diff = new Date(iso).getTime() - Date.now();
        const days = Math.round(diff / 86_400_000);
        if (days === 0) return 'today';
        if (days === 1) return 'tomorrow';
        if (days === -1) return 'yesterday';
        return days > 0 ? `in ${days} days` : `${Math.abs(days)} days ago`;
    }

    function filterPages(pages: CalendarPage[]): CalendarPage[] {
        if (!searchQuery.trim()) return pages;
        const q = searchQuery.toLowerCase();
        return pages.filter(
            (p) =>
                p.displayName.toLowerCase().includes(q) ||
                p.url.toLowerCase().includes(q) ||
                p.locale.toLowerCase().includes(q)
        );
    }

    let filteredScheduled = $derived(data ? filterPages(data.scheduled) : []);
    let filteredExpiring = $derived(data ? filterPages(data.expiring) : []);

    async function loadCalendar() {
        isLoading = true;
        showMessage = false;

        try {
            const response = await fetch(
                '/opti-admin/api/content-calendar.json'
            );
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error ?? 'Failed to load calendar data');
            }

            data = {
                scheduled: result.scheduled,
                expiring: result.expiring,
                expiryScannedPages: result.expiryScannedPages,
                expiryCapped: result.expiryCapped,
            };

            const total = result.scheduled.length + result.expiring.length;
            displayMessage(
                `Loaded ${result.scheduled.length} scheduled and ${result.expiring.length} expiring pages`,
                true
            );
        } catch (error) {
            displayMessage(
                'Error loading calendar: ' +
                    (error instanceof Error ? error.message : 'Unknown error'),
                false
            );
        } finally {
            isLoading = false;
        }
    }

    async function openPreview(page: CalendarPage) {
        previewLoading = { ...previewLoading, [page.key]: true };

        try {
            const params = new URLSearchParams({
                key: page.key,
                version: page.version,
            });
            if (page.baseUrl) params.set('baseUrl', page.baseUrl);

            const response = await fetch(
                `/opti-admin/api/content-preview.json?${params}`
            );
            const result = await response.json();

            if (!result.success || !result.previewUrl) {
                throw new Error(result.error ?? 'No preview URL returned');
            }

            window.open(result.previewUrl, '_blank', 'noopener');
        } catch (error) {
            displayMessage(
                'Preview error: ' +
                    (error instanceof Error ? error.message : 'Unknown error'),
                false
            );
        } finally {
            previewLoading = { ...previewLoading, [page.key]: false };
        }
    }

    $effect(() => {
        loadCalendar();
    });
</script>

<div class="max-w-7xl">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Content Calendar</h1>
        <p class="text-gray-600">Pages scheduled to publish or expire</p>
    </div>

    {#if showMessage}
        <StatusMessage {message} type={messageType} />
    {/if}

    <!-- Toolbar -->
    <div
        class="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center"
    >
        <button
            onclick={loadCalendar}
            disabled={isLoading}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
        >
            {#if isLoading}
                <LoadingSpinner size="sm" />
            {:else}
                <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                </svg>
            {/if}
            Refresh
        </button>

        <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search by title, URL or locale…"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-72"
        />
    </div>

    {#if isLoading && !data}
        <div class="flex justify-center py-16">
            <LoadingSpinner size="md" />
        </div>
    {:else if data}
        <!-- Scheduled to publish -->
        <section class="mb-10">
            <h2
                class="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2"
            >
                <span class="inline-block w-3 h-3 rounded-full bg-green-500"
                ></span>
                Scheduled to Publish
                <span class="text-sm font-normal text-gray-500"
                    >({filteredScheduled.length})</span
                >
            </h2>

            {#if filteredScheduled.length === 0}
                <div
                    class="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-400 text-sm"
                >
                    {searchQuery
                        ? 'No matching scheduled pages.'
                        : 'No pages are currently scheduled to publish.'}
                </div>
            {:else}
                <div
                    class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                    <table class="w-full text-sm">
                        <thead class="bg-green-50 border-b border-green-100">
                            <tr>
                                <th
                                    class="text-left px-4 py-3 font-semibold text-gray-700"
                                    >Page</th
                                >
                                <th
                                    class="text-left px-4 py-3 font-semibold text-gray-700"
                                    >Scheduled Date</th
                                >
                                <th
                                    class="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell"
                                    >Locale</th
                                >
                                <th
                                    class="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell"
                                    >Version</th
                                >
                                <th
                                    class="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell"
                                    >Site</th
                                >
                                <th
                                    class="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell"
                                    >Path</th
                                >
                                <th class="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            {#each filteredScheduled as page (`${page.key}__${page.locale}__${page.version}`)}
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td
                                        class="px-4 py-3 font-medium text-gray-900"
                                        >{page.displayName}</td
                                    >
                                    <td class="px-4 py-3 text-gray-600">
                                        {#if page.date}
                                            <span title={page.date}
                                                >{formatDate(page.date)}</span
                                            >
                                            <span
                                                class="ml-1 text-xs text-green-600"
                                                >({relativeTime(
                                                    page.date
                                                )})</span
                                            >
                                        {:else}
                                            <span class="text-gray-400 italic"
                                                >Date TBD</span
                                            >
                                        {/if}
                                    </td>
                                    <td
                                        class="px-4 py-3 text-gray-500 hidden sm:table-cell"
                                    >
                                        {page.locale || '—'}
                                    </td>
                                    <td class="px-4 py-3 hidden md:table-cell">
                                        <span
                                            class="text-gray-500 text-xs font-mono"
                                            >{page.version || '—'}</span
                                        >
                                    </td>
                                    <td class="px-4 py-3 hidden md:table-cell">
                                        <span
                                            class="text-gray-500 text-xs font-mono"
                                            >{page.baseUrl || '—'}</span
                                        >
                                    </td>
                                    <td class="px-4 py-3 hidden md:table-cell">
                                        <span
                                            class="text-gray-500 text-xs font-mono"
                                            >{page.url || '—'}</span
                                        >
                                    </td>
                                    <td class="px-4 py-3 text-right">
                                        <button
                                            onclick={() => openPreview(page)}
                                            disabled={previewLoading[page.key]}
                                            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {#if previewLoading[page.key]}
                                                <LoadingSpinner size="sm" />
                                            {:else}
                                                <svg
                                                    class="w-3.5 h-3.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            {/if}
                                            Preview
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        </section>

        <!-- Scheduled to expire -->
        <section>
            <h2
                class="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2"
            >
                <span class="inline-block w-3 h-3 rounded-full bg-amber-500"
                ></span>
                Scheduled to Expire
                <span class="text-sm font-normal text-gray-500"
                    >({filteredExpiring.length})</span
                >
                <!-- {#if data.expiryScannedPages > 0}
                    <span class="text-xs font-normal text-gray-400 ml-1"
                        >— from {data.expiryScannedPages} pages scanned</span
                    >
                {/if} -->
            </h2>

            <!-- {#if data.expiryCapped}
                <div
                    class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800"
                >
                    <strong>Note:</strong> For demo purposes, expiry results are based on the first
                    {data.expiryScannedPages} pages scanned. Some expiring pages
                    may not appear.
                </div>
            {/if} -->

            {#if filteredExpiring.length === 0}
                <div
                    class="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-400 text-sm"
                >
                    {searchQuery
                        ? 'No matching expiring pages.'
                        : 'No pages with a scheduled expiry date found.'}
                </div>
            {:else}
                <div
                    class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                    <table class="w-full text-sm">
                        <thead class="bg-amber-50 border-b border-amber-100">
                            <tr>
                                <th
                                    class="text-left px-4 py-3 font-semibold text-gray-700"
                                    >Page</th
                                >
                                <th
                                    class="text-left px-4 py-3 font-semibold text-gray-700"
                                    >Expiry Date</th
                                >
                                <th
                                    class="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell"
                                    >Locale</th
                                >
                                <th
                                    class="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell"
                                    >URL</th
                                >
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            {#each filteredExpiring as page (page.key)}
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td
                                        class="px-4 py-3 font-medium text-gray-900"
                                        >{page.displayName}</td
                                    >
                                    <td class="px-4 py-3 text-gray-600">
                                        <span title={page.date ?? ''}
                                            >{formatDate(page.date)}</span
                                        >
                                        {#if page.date}
                                            <span
                                                class="ml-1 text-xs text-amber-600"
                                                >({relativeTime(
                                                    page.date
                                                )})</span
                                            >
                                        {/if}
                                    </td>
                                    <td
                                        class="px-4 py-3 text-gray-500 hidden sm:table-cell"
                                    >
                                        {page.locale || '—'}
                                    </td>
                                    <td class="px-4 py-3 hidden md:table-cell">
                                        {#if page.url}
                                            <a
                                                href="{page.baseUrl}{page.url}"
                                                target="_blank"
                                                rel="noopener"
                                                class="text-blue-600 hover:underline text-xs font-mono truncate max-w-xs block"
                                                >{page.url}</a
                                            >
                                        {:else}
                                            <span class="text-gray-300 text-xs"
                                                >—</span
                                            >
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        </section>
    {/if}
</div>
