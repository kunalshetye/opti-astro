<script lang="ts">
    import { onMount } from 'svelte';
    import { OPTIMIZELY_GRAPH_SINGLE_KEY } from 'astro:env/client';

    interface Scenario {
        id: string;
        query: string;
        repetitions: number;
        enabled: boolean;
    }

    interface LogEntry {
        id: number;
        type: 'info' | 'success' | 'error' | 'warning';
        message: string;
        time: string;
        url?: string;
    }

    const STORAGE_KEY = 'opti-tracking-seeder';
    const DEFAULT_SCENARIOS: Scenario[] = [
        { id: 'default-1', query: 'getting started', repetitions: 5, enabled: true },
        { id: 'default-2', query: 'features', repetitions: 4, enabled: true },
        { id: 'default-3', query: 'pricing', repetitions: 8, enabled: true },
    ];

    let scenarios = $state<Scenario[]>([]);
    let entries = $state<LogEntry[]>([]);
    let isRunning = $state(false);
    let shouldAbort = $state(false);
    let entryCounter = 0;

    let domain = $state('');
    let locale = $state('en');
    let delayMs = $state(400);

    let showAddForm = $state(false);
    let newQuery = $state('');
    let newReps = $state(5);

    onMount(() => {
        domain = window.location.origin;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            scenarios = stored ? JSON.parse(stored) : structuredClone(DEFAULT_SCENARIOS);
        } catch {
            scenarios = structuredClone(DEFAULT_SCENARIOS);
        }
    });

    function persist() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios)); } catch {}
    }

    function addScenario() {
        if (!newQuery.trim()) return;
        scenarios = [...scenarios, {
            id: crypto.randomUUID(),
            query: newQuery.trim(),
            repetitions: Math.max(1, newReps),
            enabled: true,
        }];
        persist();
        newQuery = ''; newReps = 5; showAddForm = false;
    }

    function removeScenario(id: string) {
        scenarios = scenarios.filter(s => s.id !== id);
        persist();
    }

    function toggleEnabled(id: string) {
        scenarios = scenarios.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
        persist();
    }

    function addEntry(type: LogEntry['type'], message: string, url?: string) {
        const time = new Date().toTimeString().slice(0, 8);
        entries = [{ id: entryCounter++, type, message, time, url }, ...entries];
    }

    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

    async function fetchResults(query: string): Promise<any[]> {
        const params = new URLSearchParams({
            q: query, locale, domain,
            limit: '10', offset: '0', sort: 'relevance',
            useSemanticSearch: 'false', semanticWeight: '0.3',
            trackingSource: `/search-seeder?s=${crypto.randomUUID()}`,
        });
        const res = await fetch(`/api/faceted-search.json?${params}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()).items ?? [];
    }

    function weightedRandomPick(results: any[]): { item: any; pos: number } {
        const weights = results.map((_, i) => 1 / (i + 1));
        const total = weights.reduce((sum, w) => sum + w, 0);
        let r = Math.random() * total;
        for (let i = 0; i < results.length; i++) {
            r -= weights[i];
            if (r <= 0) return { item: results[i], pos: i };
        }
        return { item: results[results.length - 1], pos: results.length - 1 };
    }

    async function fireTrack(trackUrl: string, pos: number): Promise<string> {
        const u = new URL(trackUrl);
        u.searchParams.set('pos', String(pos));
        u.searchParams.set('auth', OPTIMIZELY_GRAPH_SINGLE_KEY);
        const finalUrl = u.toString();
        await fetch(finalUrl, { method: 'GET', mode: 'no-cors' });
        return finalUrl;
    }

    function resultTitle(r: any): string {
        return r.Heading || r._metadata?.displayName || r._metadata?.key || '(untitled)';
    }

    async function executeScenario(s: Scenario) {
        addEntry('info', `▶ "${s.query}" — ${s.repetitions} search(es)`);
        for (let rep = 0; rep < s.repetitions; rep++) {
            if (shouldAbort) return;
            try {
                const results = await fetchResults(s.query);
                if (!results.length) {
                    addEntry('warning', `"${s.query}": no results — check query or domain`);
                    return;
                }
                const { item, pos } = weightedRandomPick(results);
                if (!item._track) {
                    addEntry('warning', `"${s.query}" rep ${rep + 1} pos ${pos}: no _track URL on result`);
                } else {
                    const firedUrl = await fireTrack(item._track, pos);
                    addEntry('success', `"${s.query}" rep ${rep + 1} pos ${pos}: "${resultTitle(item)}"`, firedUrl);
                }
            } catch (e: any) {
                addEntry('error', `"${s.query}" rep ${rep + 1}: ${e.message}`);
            }
            await sleep(delayMs);
        }
        addEntry('success', `✓ "${s.query}" complete`);
    }

    async function runAll() {
        const active = scenarios.filter(s => s.enabled);
        if (!active.length) { addEntry('warning', 'No scenarios enabled — toggle at least one on'); return; }
        isRunning = true; shouldAbort = false;
        addEntry('info', `Starting ${active.length} scenario(s)…`);
        for (const s of active) {
            if (shouldAbort) break;
            await executeScenario(s);
            await sleep(delayMs);
        }
        addEntry('info', shouldAbort ? 'Stopped by user.' : 'All scenarios complete.');
        isRunning = false;
    }

    async function runOne(s: Scenario) {
        isRunning = true; shouldAbort = false;
        await executeScenario(s);
        isRunning = false;
    }

    function stop() { shouldAbort = true; }

    const logColors: Record<LogEntry['type'], string> = {
        info:    'text-gray-600',
        success: 'text-green-600',
        error:   'text-red-600',
        warning: 'text-yellow-600',
    };
    const logIcons: Record<LogEntry['type'], string> = {
        info: '·', success: '✓', error: '✗', warning: '⚠',
    };
</script>

<div class="space-y-6">
    <div>
        <h2 class="text-2xl font-bold text-gray-900">Search Hit Tracking Seeder</h2>
        <p class="text-gray-600 mt-1">Seed Optimizely Graph with realistic search query and click-through data for demo dashboards.</p>
    </div>

    <!-- Configuration -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <input
                    type="text"
                    bind:value={domain}
                    placeholder="https://example.com"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p class="text-xs text-gray-500 mt-1">Must match the domain your CMS content is indexed under</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Locale</label>
                <input
                    type="text"
                    bind:value={locale}
                    placeholder="en"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Delay between requests (ms)</label>
                <input
                    type="number"
                    bind:value={delayMs}
                    min="100"
                    max="5000"
                    step="100"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>
    </div>

    <!-- Scenarios -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Scenarios</h3>
            <button
                onclick={() => showAddForm = !showAddForm}
                disabled={isRunning}
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Scenario
            </button>
        </div>

        <!-- Add form -->
        {#if showAddForm}
            <div class="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div class="md:col-span-2">
                        <label class="block text-xs font-medium text-gray-700 mb-1">Search query</label>
                        <input
                            type="text"
                            bind:value={newQuery}
                            placeholder="e.g. pricing"
                            class="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                            onkeydown={(e) => e.key === 'Enter' && addScenario()}
                        />
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Repetitions</label>
                        <input
                            type="number"
                            bind:value={newReps}
                            min="1"
                            max="50"
                            class="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div class="flex gap-2">
                    <button
                        onclick={addScenario}
                        class="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                        Add
                    </button>
                    <button
                        onclick={() => showAddForm = false}
                        class="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        {/if}

        <!-- Scenario list -->
        {#if scenarios.length === 0}
            <p class="text-sm text-gray-500 text-center py-6">No scenarios yet — add one above.</p>
        {:else}
            <div class="space-y-2">
                {#each scenarios as scenario (scenario.id)}
                    <div class="flex items-center gap-3 p-3 rounded-lg border {scenario.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'}">
                        <!-- Enable toggle -->
                        <button
                            onclick={() => toggleEnabled(scenario.id)}
                            disabled={isRunning}
                            class="flex-shrink-0 w-10 h-6 rounded-full transition-colors {scenario.enabled ? 'bg-blue-600' : 'bg-gray-300'} disabled:opacity-50"
                            title={scenario.enabled ? 'Enabled' : 'Disabled'}
                        >
                            <span class="block w-4 h-4 bg-white rounded-full shadow transform transition-transform mx-1 {scenario.enabled ? 'translate-x-4' : 'translate-x-0'}"></span>
                        </button>

                        <!-- Query -->
                        <span class="flex-1 font-medium text-sm text-gray-900 {!scenario.enabled ? 'opacity-50' : ''}">{scenario.query}</span>

                        <!-- Meta -->
                        <span class="text-xs text-gray-500 {!scenario.enabled ? 'opacity-50' : ''}">
                            {scenario.repetitions}×
                        </span>

                        <!-- Run single -->
                        <button
                            onclick={() => runOne(scenario)}
                            disabled={isRunning || !scenario.enabled}
                            class="p-1.5 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title="Run this scenario"
                        >
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>

                        <!-- Delete -->
                        <button
                            onclick={() => removeScenario(scenario.id)}
                            disabled={isRunning}
                            class="p-1.5 text-red-400 hover:bg-red-50 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title="Delete scenario"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                {/each}
            </div>

            <!-- Run all / stop -->
            <div class="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                {#if !isRunning}
                    <button
                        onclick={runAll}
                        class="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Run All Enabled
                    </button>
                {:else}
                    <button
                        onclick={stop}
                        class="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Stop
                    </button>
                    <span class="flex items-center gap-2 text-sm text-gray-500">
                        <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Running…
                    </span>
                {/if}
            </div>
        {/if}
    </div>

    <!-- Progress log -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-900">Log</h3>
            {#if entries.length > 0}
                <button
                    onclick={() => entries = []}
                    class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    Clear
                </button>
            {/if}
        </div>

        {#if entries.length === 0}
            <p class="text-sm text-gray-400 text-center py-8">Log output will appear here when you run scenarios.</p>
        {:else}
            <div class="font-mono text-xs space-y-1 max-h-80 overflow-y-auto">
                {#each entries as entry (entry.id)}
                    <div class="flex gap-3 {logColors[entry.type]}">
                        <span class="flex-shrink-0 text-gray-400">{entry.time}</span>
                        <span class="flex-shrink-0 w-3">{logIcons[entry.type]}</span>
                        <span>
                            {entry.message}
                            {#if entry.url}
                                — <a href={entry.url} target="_blank" rel="noopener noreferrer" class="underline opacity-60 hover:opacity-100">tracking link</a>
                            {/if}
                        </span>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
