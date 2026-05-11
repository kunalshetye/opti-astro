<script lang="ts">
    import { onMount } from 'svelte';
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

    // --- Shared state ---
    let data = $state<CalendarData | null>(null);
    let isLoading = $state(false);
    let message = $state('');
    let messageType = $state<'success' | 'error'>('success');
    let showMessage = $state(false);
    let searchQuery = $state('');
    let previewLoading = $state<Record<string, boolean>>({});

    // --- View state ---
    let viewMode = $state<'list' | 'calendar'>('list');

    // --- Calendar state ---
    let calendarDate = $state(new Date());
    let calendarMode = $state<'month' | 'week'>('month');
    let showPublish = $state(true);
    let showExpiry = $state(true);
    let selectedItem = $state<{ page: CalendarPage; type: 'scheduled' | 'expiring' } | null>(null);
    let expandedDay = $state<string | null>(null);

    onMount(() => {
        const saved = localStorage.getItem('opti-calendar-view');
        if (saved === 'calendar') viewMode = 'calendar';
        const savedMode = localStorage.getItem('opti-calendar-mode');
        if (savedMode === 'week') calendarMode = 'week';
    });

    function setViewMode(mode: 'list' | 'calendar') {
        viewMode = mode;
        localStorage.setItem('opti-calendar-view', mode);
        selectedItem = null;
        expandedDay = null;
    }

    function setCalendarMode(mode: 'month' | 'week') {
        calendarMode = mode;
        localStorage.setItem('opti-calendar-mode', mode);
        expandedDay = null;
        selectedItem = null;
    }

    // --- Shared helpers ---
    function displayMessage(text: string, isSuccess: boolean) {
        message = text;
        messageType = isSuccess ? 'success' : 'error';
        showMessage = true;
        setTimeout(() => { showMessage = false; }, 6000);
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

    // --- API calls ---
    async function loadCalendar() {
        isLoading = true;
        showMessage = false;

        try {
            const response = await fetch('/opti-admin/api/content-calendar.json');
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
            const params = new URLSearchParams({ key: page.key, version: page.version });
            if (page.baseUrl) params.set('baseUrl', page.baseUrl);

            const response = await fetch(`/opti-admin/api/content-preview.json?${params}`);
            const result = await response.json();

            if (!result.success || !result.previewUrl) {
                throw new Error(result.error ?? 'No preview URL returned');
            }

            window.open(result.previewUrl, '_blank', 'noopener');
        } catch (error) {
            displayMessage(
                'Preview error: ' + (error instanceof Error ? error.message : 'Unknown error'),
                false
            );
        } finally {
            previewLoading = { ...previewLoading, [page.key]: false };
        }
    }

    // --- Calendar helpers ---
    const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    function isoDay(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    function getCalendarGrid(date: Date): (Date | null)[] {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startOffset = (firstDay.getDay() + 6) % 7; // Mon = 0
        const grid: (Date | null)[] = [];
        for (let i = 0; i < startOffset; i++) grid.push(null);
        for (let d = 1; d <= lastDay.getDate(); d++) grid.push(new Date(year, month, d));
        while (grid.length % 7 !== 0) grid.push(null);
        return grid;
    }

    function getItemsForDay(date: Date) {
        const dayStr = isoDay(date);
        return {
            scheduled: showPublish && data
                ? data.scheduled.filter(p => p.date ? isoDay(new Date(p.date)) === dayStr : false)
                : [],
            expiring: showExpiry && data
                ? data.expiring.filter(p => p.date ? isoDay(new Date(p.date)) === dayStr : false)
                : [],
        };
    }

    function isToday(date: Date): boolean {
        return isoDay(date) === isoDay(new Date());
    }

    function calendarMonthLabel(date: Date): string {
        return date.toLocaleString(undefined, { month: 'long', year: 'numeric' });
    }

    function getWeekGrid(date: Date): Date[] {
        const mondayOffset = (date.getDay() + 6) % 7;
        const monday = new Date(date);
        monday.setDate(date.getDate() - mondayOffset);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d;
        });
    }

    function calendarWeekLabel(date: Date): string {
        const week = getWeekGrid(date);
        const first = week[0];
        const last = week[6];
        const year = last.getFullYear();
        if (first.getMonth() === last.getMonth()) {
            return `${first.toLocaleString(undefined, { month: 'long' })} ${first.getDate()}–${last.getDate()}, ${year}`;
        }
        return `${first.toLocaleString(undefined, { month: 'short' })} ${first.getDate()} – ${last.toLocaleString(undefined, { month: 'short' })} ${last.getDate()}, ${year}`;
    }

    function prevPeriod() {
        if (calendarMode === 'month') {
            calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
        } else {
            const d = new Date(calendarDate);
            d.setDate(d.getDate() - 7);
            calendarDate = d;
        }
        expandedDay = null;
        selectedItem = null;
    }

    function nextPeriod() {
        if (calendarMode === 'month') {
            calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
        } else {
            const d = new Date(calendarDate);
            d.setDate(d.getDate() + 7);
            calendarDate = d;
        }
        expandedDay = null;
        selectedItem = null;
    }

    function goToday() {
        calendarDate = new Date();
        expandedDay = null;
        selectedItem = null;
    }

    function selectItem(page: CalendarPage, type: 'scheduled' | 'expiring') {
        const isSame =
            selectedItem?.page.key === page.key &&
            selectedItem?.page.version === page.version &&
            selectedItem?.type === type;
        selectedItem = isSame ? null : { page, type };
        expandedDay = null;
    }

    function toggleExpanded(dayStr: string) {
        expandedDay = expandedDay === dayStr ? null : dayStr;
    }

    let calendarGrid = $derived(getCalendarGrid(calendarDate));
    let weekGrid = $derived(getWeekGrid(calendarDate));

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
    <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div class="flex items-center gap-3">
            <!-- View toggle (desktop only) -->
            <div class="hidden sm:flex rounded-lg border border-gray-200 overflow-hidden text-sm">
                <button
                    onclick={() => setViewMode('list')}
                    class="px-3 py-2 flex items-center gap-1.5 transition-colors {viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List
                </button>
                <button
                    onclick={() => setViewMode('calendar')}
                    class="px-3 py-2 flex items-center gap-1.5 border-l border-gray-200 transition-colors {viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Calendar
                </button>
            </div>

            <!-- Refresh -->
            <button
                onclick={loadCalendar}
                disabled={isLoading}
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
                {#if isLoading}
                    <LoadingSpinner size="sm" />
                {:else}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                {/if}
                Refresh
            </button>
        </div>

        {#if viewMode === 'list'}
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search by title, URL or locale…"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-72"
            />
        {/if}
    </div>

    {#if isLoading && !data}
        <div class="flex justify-center py-16">
            <LoadingSpinner size="md" />
        </div>
    {:else if data}

        {#if viewMode === 'list'}
            <!-- ======================================================== -->
            <!-- LIST VIEW                                                 -->
            <!-- ======================================================== -->

            <!-- Scheduled to publish -->
            <section class="mb-10">
                <h2 class="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span class="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    Scheduled to Publish
                    <span class="text-sm font-normal text-gray-500">({filteredScheduled.length})</span>
                </h2>

                {#if filteredScheduled.length === 0}
                    <div class="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-400 text-sm">
                        {searchQuery ? 'No matching scheduled pages.' : 'No pages are currently scheduled to publish.'}
                    </div>
                {:else}
                    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <table class="w-full text-sm">
                            <thead class="bg-green-50 border-b border-green-100">
                                <tr>
                                    <th class="text-left px-4 py-3 font-semibold text-gray-700">Page</th>
                                    <th class="text-left px-4 py-3 font-semibold text-gray-700">Scheduled Date</th>
                                    <th class="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Locale</th>
                                    <th class="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Version</th>
                                    <th class="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Site</th>
                                    <th class="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Path</th>
                                    <th class="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                {#each filteredScheduled as page (`${page.key}__${page.locale}__${page.version}`)}
                                    <tr class="hover:bg-gray-50 transition-colors">
                                        <td class="px-4 py-3 font-medium text-gray-900">{page.displayName}</td>
                                        <td class="px-4 py-3 text-gray-600">
                                            {#if page.date}
                                                <span title={page.date}>{formatDate(page.date)}</span>
                                                <span class="ml-1 text-xs text-green-600">({relativeTime(page.date)})</span>
                                            {:else}
                                                <span class="text-gray-400 italic">Date TBD</span>
                                            {/if}
                                        </td>
                                        <td class="px-4 py-3 text-gray-500 hidden sm:table-cell">{page.locale || '—'}</td>
                                        <td class="px-4 py-3 hidden md:table-cell">
                                            <span class="text-gray-500 text-xs font-mono">{page.version || '—'}</span>
                                        </td>
                                        <td class="px-4 py-3 hidden md:table-cell">
                                            <span class="text-gray-500 text-xs font-mono">{page.baseUrl || '—'}</span>
                                        </td>
                                        <td class="px-4 py-3 hidden md:table-cell">
                                            <span class="text-gray-500 text-xs font-mono">{page.url || '—'}</span>
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
                                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
                <h2 class="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span class="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
                    Scheduled to Expire
                    <span class="text-sm font-normal text-gray-500">({filteredExpiring.length})</span>
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
                    <div class="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-400 text-sm">
                        {searchQuery ? 'No matching expiring pages.' : 'No pages with a scheduled expiry date found.'}
                    </div>
                {:else}
                    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <table class="w-full text-sm">
                            <thead class="bg-amber-50 border-b border-amber-100">
                                <tr>
                                    <th class="text-left px-4 py-3 font-semibold text-gray-700">Page</th>
                                    <th class="text-left px-4 py-3 font-semibold text-gray-700">Expiry Date</th>
                                    <th class="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Locale</th>
                                    <th class="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">URL</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                {#each filteredExpiring as page (page.key)}
                                    <tr class="hover:bg-gray-50 transition-colors">
                                        <td class="px-4 py-3 font-medium text-gray-900">{page.displayName}</td>
                                        <td class="px-4 py-3 text-gray-600">
                                            <span title={page.date ?? ''}>{formatDate(page.date)}</span>
                                            {#if page.date}
                                                <span class="ml-1 text-xs text-amber-600">({relativeTime(page.date)})</span>
                                            {/if}
                                        </td>
                                        <td class="px-4 py-3 text-gray-500 hidden sm:table-cell">{page.locale || '—'}</td>
                                        <td class="px-4 py-3 hidden md:table-cell">
                                            {#if page.url}
                                                <a
                                                    href="{page.baseUrl}{page.url}"
                                                    target="_blank"
                                                    rel="noopener"
                                                    class="text-blue-600 hover:underline text-xs font-mono truncate max-w-xs block"
                                                >{page.url}</a>
                                            {:else}
                                                <span class="text-gray-300 text-xs">—</span>
                                            {/if}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {/if}
            </section>

        {:else}
            <!-- ======================================================== -->
            <!-- CALENDAR VIEW                                             -->
            <!-- ======================================================== -->
            <div class="flex gap-6 items-start">

                <!-- Calendar panel -->
                <div class="flex-1 min-w-0">

                    <!-- Month nav + filters -->
                    <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-1">
                            <button
                                onclick={prevPeriod}
                                class="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                                aria-label="Previous {calendarMode === 'month' ? 'month' : 'week'}"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span class="text-base font-semibold text-gray-800 w-56 text-center select-none">
                                {calendarMode === 'month' ? calendarMonthLabel(calendarDate) : calendarWeekLabel(calendarDate)}
                            </span>
                            <button
                                onclick={nextPeriod}
                                class="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                                aria-label="Next {calendarMode === 'month' ? 'month' : 'week'}"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button
                                onclick={goToday}
                                class="ml-2 px-3 py-1 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                            >
                                Today
                            </button>
                            <div class="ml-3 flex rounded-md border border-gray-200 overflow-hidden text-xs">
                                <button
                                    onclick={() => setCalendarMode('month')}
                                    class="px-2.5 py-1 transition-colors {calendarMode === 'month' ? 'bg-gray-200 text-gray-800 font-medium' : 'text-gray-500 hover:bg-gray-50'}"
                                >Month</button>
                                <button
                                    onclick={() => setCalendarMode('week')}
                                    class="px-2.5 py-1 border-l border-gray-200 transition-colors {calendarMode === 'week' ? 'bg-gray-200 text-gray-800 font-medium' : 'text-gray-500 hover:bg-gray-50'}"
                                >Week</button>
                            </div>
                        </div>

                        <!-- Filters -->
                        <div class="flex items-center gap-5 text-sm">
                            <label class="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" bind:checked={showPublish} class="rounded accent-green-600" />
                                <span class="flex items-center gap-1.5 text-gray-700">
                                    <span class="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
                                    Scheduled Publish
                                </span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" bind:checked={showExpiry} class="rounded accent-red-500" />
                                <span class="flex items-center gap-1.5 text-gray-700">
                                    <span class="inline-block w-2.5 h-2.5 rounded-full bg-red-400"></span>
                                    Scheduled Expiration
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Calendar grid -->
                    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        {#if calendarMode === 'month'}
                            <!-- Monthly: day-of-week headers -->
                            <div class="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                                {#each WEEK_DAYS as day}
                                    <div class="py-2 text-xs font-semibold text-gray-500 text-center">{day}</div>
                                {/each}
                            </div>

                            <!-- Monthly: day cells -->
                            <div class="grid grid-cols-7 divide-x divide-y divide-gray-100">
                                {#each calendarGrid as day}
                                    {#if day}
                                        {@const dayStr = isoDay(day)}
                                        {@const items = getItemsForDay(day)}
                                        {@const allItems = [
                                            ...items.scheduled.map(p => ({ page: p, type: 'scheduled' as const })),
                                            ...items.expiring.map(p => ({ page: p, type: 'expiring' as const })),
                                        ]}
                                        {@const isExpanded = expandedDay === dayStr}
                                        {@const visible = isExpanded ? allItems : allItems.slice(0, 4)}
                                        {@const overflow = allItems.length - 4}
                                        <div class="min-h-36 p-1.5 {isToday(day) ? 'bg-blue-50' : 'hover:bg-gray-50/70'} transition-colors">
                                            <div class="text-right mb-1 pr-0.5">
                                                {#if isToday(day)}
                                                    <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">
                                                        {day.getDate()}
                                                    </span>
                                                {:else}
                                                    <span class="text-xs text-gray-400">{day.getDate()}</span>
                                                {/if}
                                            </div>
                                            {#each visible as item}
                                                {@const isSelected =
                                                    selectedItem?.page.key === item.page.key &&
                                                    selectedItem?.page.version === item.page.version &&
                                                    selectedItem?.type === item.type}
                                                <button
                                                    onclick={() => selectItem(item.page, item.type)}
                                                    title={item.page.displayName}
                                                    class="w-full text-left text-xs rounded px-1.5 py-0.5 mb-0.5 truncate transition-colors
                                                        {item.type === 'scheduled'
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-800 hover:bg-red-200'}
                                                        {isSelected ? 'ring-1 ring-inset ring-blue-400' : ''}"
                                                >
                                                    {item.page.displayName}{item.page.locale ? ` (${item.page.locale})` : ''}
                                                </button>
                                            {/each}
                                            {#if overflow > 0}
                                                <button
                                                    onclick={() => toggleExpanded(dayStr)}
                                                    class="text-xs text-gray-400 hover:text-gray-600 pl-1 transition-colors"
                                                >
                                                    {isExpanded ? 'show less' : `+${overflow} more`}
                                                </button>
                                            {/if}
                                        </div>
                                    {:else}
                                        <div class="min-h-36 bg-gray-50/40"></div>
                                    {/if}
                                {/each}
                            </div>
                        {:else}
                            <!-- Weekly: headers show weekday + date -->
                            <div class="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                                {#each weekGrid as day}
                                    <div class="py-2 text-center">
                                        <div class="text-xs font-semibold text-gray-500">
                                            {day.toLocaleString(undefined, { weekday: 'short' })}
                                        </div>
                                        {#if isToday(day)}
                                            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold mt-0.5">
                                                {day.getDate()}
                                            </span>
                                        {:else}
                                            <div class="text-sm font-medium text-gray-700 mt-0.5">{day.getDate()}</div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>

                            <!-- Weekly: single row of tall cells -->
                            <div class="grid grid-cols-7 divide-x divide-gray-100">
                                {#each weekGrid as day}
                                    {@const dayStr = isoDay(day)}
                                    {@const items = getItemsForDay(day)}
                                    {@const allItems = [
                                        ...items.scheduled.map(p => ({ page: p, type: 'scheduled' as const })),
                                        ...items.expiring.map(p => ({ page: p, type: 'expiring' as const })),
                                    ]}
                                    {@const isExpanded = expandedDay === dayStr}
                                    {@const visible = isExpanded ? allItems : allItems.slice(0, 8)}
                                    {@const overflow = allItems.length - 8}
                                    <div class="min-h-64 p-1.5 {isToday(day) ? 'bg-blue-50' : 'hover:bg-gray-50/70'} transition-colors">
                                        {#each visible as item}
                                            {@const isSelected =
                                                selectedItem?.page.key === item.page.key &&
                                                selectedItem?.page.version === item.page.version &&
                                                selectedItem?.type === item.type}
                                            <button
                                                onclick={() => selectItem(item.page, item.type)}
                                                title={item.page.displayName}
                                                class="w-full text-left text-xs rounded px-1.5 py-1 mb-0.5 truncate transition-colors
                                                    {item.type === 'scheduled'
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'}
                                                    {isSelected ? 'ring-1 ring-inset ring-blue-400' : ''}"
                                            >
                                                {item.page.displayName}{item.page.locale ? ` (${item.page.locale})` : ''}
                                            </button>
                                        {/each}
                                        {#if overflow > 0}
                                            <button
                                                onclick={() => toggleExpanded(dayStr)}
                                                class="text-xs text-gray-400 hover:text-gray-600 pl-1 transition-colors"
                                            >
                                                {isExpanded ? 'show less' : `+${overflow} more`}
                                            </button>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>

                    <!-- {#if data.expiryCapped}
                        <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                            <strong>Note:</strong> For demo purposes, expiry results are based on the first
                            {data.expiryScannedPages} pages scanned. Some expiring pages may not appear.
                        </div>
                    {/if} -->
                </div>

                <!-- Detail panel -->
                {#if selectedItem}
                    <div class="w-72 flex-shrink-0 bg-white rounded-lg border border-gray-200 shadow-sm p-4 sticky top-4">
                        <div class="flex items-start justify-between mb-3">
                            <span class="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full {selectedItem.type === 'scheduled' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                <span class="w-2 h-2 rounded-full {selectedItem.type === 'scheduled' ? 'bg-green-500' : 'bg-red-400'}"></span>
                                {selectedItem.type === 'scheduled' ? 'Scheduled to Publish' : 'Scheduled to Expire'}
                            </span>
                            <button
                                onclick={() => selectedItem = null}
                                class="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <h3 class="font-semibold text-gray-900 text-sm mb-4 leading-snug">
                            {selectedItem.page.displayName}
                        </h3>

                        <dl class="space-y-3 text-sm">
                            <div>
                                <dt class="text-xs text-gray-400 mb-0.5">{selectedItem.type === 'scheduled' ? 'Publish Date' : 'Expiry Date'}</dt>
                                <dd class="text-gray-800">
                                    {formatDate(selectedItem.page.date)}
                                    {#if selectedItem.page.date}
                                        <span class="text-xs text-gray-400 ml-1">({relativeTime(selectedItem.page.date)})</span>
                                    {/if}
                                </dd>
                            </div>
                            {#if selectedItem.page.locale}
                                <div>
                                    <dt class="text-xs text-gray-400 mb-0.5">Locale</dt>
                                    <dd class="text-gray-800">{selectedItem.page.locale}</dd>
                                </div>
                            {/if}
                            {#if selectedItem.page.version}
                                <div>
                                    <dt class="text-xs text-gray-400 mb-0.5">Version</dt>
                                    <dd class="font-mono text-gray-800 text-xs">{selectedItem.page.version}</dd>
                                </div>
                            {/if}
                            {#if selectedItem.page.baseUrl}
                                <div>
                                    <dt class="text-xs text-gray-400 mb-0.5">Site</dt>
                                    <dd class="text-gray-800 text-xs font-mono break-all">{selectedItem.page.baseUrl}</dd>
                                </div>
                            {/if}
                            {#if selectedItem.page.url}
                                <div>
                                    <dt class="text-xs text-gray-400 mb-0.5">Path</dt>
                                    <dd class="text-gray-600 text-xs font-mono break-all">{selectedItem.page.url}</dd>
                                </div>
                            {/if}
                        </dl>

                        {#if selectedItem.type === 'scheduled'}
                            <div class="mt-4 pt-4 border-t border-gray-100">
                                <button
                                    onclick={() => selectedItem && openPreview(selectedItem.page)}
                                    disabled={!!(selectedItem && previewLoading[selectedItem.page.key])}
                                    class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {#if selectedItem && previewLoading[selectedItem.page.key]}
                                        <LoadingSpinner size="sm" />
                                    {:else}
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    {/if}
                                    Preview
                                </button>
                            </div>
                        {/if}
                    </div>
                {/if}

            </div>
        {/if}

    {/if}
</div>
