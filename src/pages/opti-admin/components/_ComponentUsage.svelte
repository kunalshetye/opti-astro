<script lang="ts">
    import { onMount } from 'svelte';
    import {
        OPTIMIZELY_GRAPH_GATEWAY,
        OPTIMIZELY_GRAPH_SINGLE_KEY,
    } from 'astro:env/client';
    import LoadingSpinner from './shared/_LoadingSpinner.svelte';
    import StatusMessage from './shared/_StatusMessage.svelte';

    interface SharedBlockRef {
        key: string;
        name: string;
    }

    interface ResultPage {
        title: string;
        path: string;
        fullUrl: string;
        locale: string;
        site: string;
        count: number;
        instanceKeys: SharedBlockRef[];
    }

    interface CachedPage {
        title: string;
        path: string;
        fullUrl: string;
        locale: string;
        site: string;
        componentCounts: Record<string, number>;
        componentInstances: Record<string, SharedBlockRef[]>;
    }

    interface SharedBlock {
        key: string;
        name: string;
        pages: ResultPage[];
    }

    const CACHE_KEY = 'opti-admin:component-usage-index-v3';
    const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

    // Fetches composition structure directly — no per-page _json round-trips.
    // 4 levels of nesting covers Section > Row > Column > Component.
    // Uses _Experience to cover all experience types. Composition is selected
    // via inline fragments because _IExperience doesn't expose it directly.
    // Add a new fragment here when additional experience types are introduced.
    const COMPONENT_NODE_FRAGMENT = `
        ... on CompositionComponentNode {
            component { _metadata { key displayName } }
        }
    `;

    const COMPOSITION_FRAGMENT = `
        composition {
            nodes {
                __typename
                key
                type
                ${COMPONENT_NODE_FRAGMENT}
                ... on CompositionStructureNode {
                    nodes {
                        __typename
                        key
                        type
                        ${COMPONENT_NODE_FRAGMENT}
                        ... on CompositionStructureNode {
                            nodes {
                                __typename
                                key
                                type
                                ${COMPONENT_NODE_FRAGMENT}
                                ... on CompositionStructureNode {
                                    nodes {
                                        __typename
                                        key
                                        type
                                        ${COMPONENT_NODE_FRAGMENT}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    const COMPOSITION_QUERY = `
        query GetAllCompositions($cursor: String) {
            _Experience(limit: 100, cursor: $cursor) {
                cursor
                total(all: true)
                items {
                    _metadata {
                        key
                        displayName
                        locale
                        url { base default }
                    }
                    ... on BlankExperience { ${COMPOSITION_FRAGMENT} }
                }
            }
        }
    `;

    let componentTypes = $state<{ key: string; displayName: string }[]>([]);
    let typesLoading = $state(true);
    let typesError = $state('');

    let pageCache = $state<CachedPage[] | null>(null);
    let cacheBuilt = $state(false);

    function loadCachedIndex(): CachedPage[] | null {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const { ts, data } = JSON.parse(raw);
            if (Date.now() - ts > CACHE_TTL_MS) {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }
            return data as CachedPage[];
        } catch { return null; }
    }

    function saveCachedIndex(pages: CachedPage[]) {
        try {
            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({ ts: Date.now(), data: pages })
            );
        } catch {} // storage quota exceeded — fail silently
    }

    onMount(async () => {
        try {
            const res = await fetch(
                '/opti-admin/api/component-usage/list-component-types.json'
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            componentTypes = data.types ?? [];
            if (componentTypes.length > 0) selectedType = componentTypes[0].key;
        } catch (err) {
            typesError = (err as Error).message;
        } finally {
            typesLoading = false;
        }

        const stored = loadCachedIndex();
        if (stored) {
            pageCache = stored;
            cacheBuilt = true;
        }
    });

    let selectedType = $state('');
    let searchLoading = $state(false);
    let verifyingIndex = $state(0);
    let verifyingTotal = $state(0);
    let results = $state<ResultPage[]>([]);
    let hasSearched = $state(false);

    let filterSite = $state('all');
    let filterLocale = $state('all');

    let availableSites = $derived(
        pageCache
            ? [...new Set(pageCache.map((p) => p.site).filter(Boolean))].sort()
            : []
    );

    function displaySite(base: string) {
        return base.replace(/^https?:\/\//, '').replace(/\/$/, '');
    }

    let message = $state('');
    let messageType = $state<'success' | 'error'>('success');
    let showMessage = $state(false);

    function displayMessage(text: string, isSuccess: boolean) {
        message = text;
        messageType = isSuccess ? 'success' : 'error';
        showMessage = true;
        setTimeout(() => {
            showMessage = false;
        }, 5000);
    }

    let availableLocales = $derived(
        [...new Set(results.map((r) => r.locale).filter(Boolean))].sort()
    );

    let filteredResults = $derived(
        results.filter(
            (r) =>
                (filterSite === 'all' || r.site === filterSite) &&
                (filterLocale === 'all' || r.locale === filterLocale)
        )
    );

    let totalUses = $derived(
        filteredResults.reduce((sum, r) => sum + r.count, 0)
    );

    let sharedInstanceCount = $derived(
        new Set(filteredResults.flatMap((r) => r.instanceKeys.map((i) => i.key))).size
    );

    let sharedBlockResults = $derived.by((): SharedBlock[] => {
        const map = new Map<string, { name: string; pages: ResultPage[] }>();
        for (const page of filteredResults) {
            const seenOnPage = new Set<string>();
            for (const { key, name } of page.instanceKeys) {
                if (!map.has(key)) map.set(key, { name, pages: [] });
                if (!seenOnPage.has(key)) {
                    map.get(key)!.pages.push(page);
                    seenOnPage.add(key);
                }
            }
        }
        return [...map.entries()]
            .map(([key, { name, pages }]) => ({ key, name, pages }))
            .sort((a, b) => b.pages.length - a.pages.length);
    });

    function collectComponentData(
        node: any,
        acc = { counts: {} as Record<string, number>, instances: {} as Record<string, SharedBlockRef[]> }
    ) {
        if (!node) return acc;
        if (node.__typename === 'CompositionComponentNode' && node.type) {
            acc.counts[node.type] = (acc.counts[node.type] ?? 0) + 1;
            const key = node.component?._metadata?.key;
            if (key) (acc.instances[node.type] ??= []).push({
                key,
                name: node.component?._metadata?.displayName ?? '',
            });
        }
        for (const child of node.nodes ?? []) collectComponentData(child, acc);
        return acc;
    }

    async function graphql(query: string, variables?: Record<string, unknown>) {
        const response = await fetch(
            `${OPTIMIZELY_GRAPH_GATEWAY}/content/v2?auth=${OPTIMIZELY_GRAPH_SINGLE_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables }),
            }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.errors)
            throw new Error(data.errors[0]?.message || 'GraphQL error');
        return data;
    }

    function processItems(items: any[], pages: CachedPage[]) {
        for (const item of items ?? []) {
            if (!item) continue;
            const base = item._metadata?.url?.base ?? '';
            const path = item._metadata?.url?.default ?? '';
            const { counts, instances } = collectComponentData(item.composition);
            pages.push({
                title: item._metadata?.displayName || 'Untitled',
                path,
                fullUrl: path ? base + path : '',
                locale: item._metadata?.locale || '',
                site: base,
                componentCounts: counts,
                componentInstances: instances,
            });
        }
    }

    async function buildIndex(): Promise<CachedPage[]> {
        const pages: CachedPage[] = [];

        // First request also gives us the total for accurate progress display
        const first = await graphql(COMPOSITION_QUERY);
        const firstData = first.data?._Experience;
        verifyingTotal = firstData?.total ?? 0;
        processItems(firstData?.items ?? [], pages);
        verifyingIndex = pages.length;

        let cursor: string | null = firstData?.cursor ?? null;
        while (cursor && pages.length < verifyingTotal) {
            const res = await graphql(COMPOSITION_QUERY, { cursor });
            const data = res.data?._Experience;
            const items = data?.items ?? [];
            if (items.length === 0) break;
            processItems(items, pages);
            verifyingIndex = pages.length;
            cursor = data?.cursor ?? null;
        }

        return pages;
    }

    async function search() {
        if (!selectedType) return;

        searchLoading = true;
        hasSearched = true;
        results = [];
        filterSite = 'all';
        filterLocale = 'all';
        viewMode = 'pages';
        expandedBlocks = new Set();
        unusedBlocks = null;
        unusedFetchedForType = '';
        showMessage = false;

        try {
            if (!OPTIMIZELY_GRAPH_GATEWAY || !OPTIMIZELY_GRAPH_SINGLE_KEY) {
                throw new Error(
                    'Missing GraphQL configuration. Check environment variables.'
                );
            }

            if (!pageCache) {
                verifyingIndex = 0;
                verifyingTotal = 0;
                pageCache = await buildIndex();
                saveCachedIndex(pageCache);
                cacheBuilt = true;
            }

            const confirmed: ResultPage[] = pageCache
                .filter((p) => (p.componentCounts[selectedType] ?? 0) > 0)
                .map((p) => ({
                    title: p.title,
                    path: p.path,
                    fullUrl: p.fullUrl,
                    locale: p.locale,
                    site: p.site,
                    count: p.componentCounts[selectedType],
                    instanceKeys: p.componentInstances[selectedType] ?? [],
                }))
                .sort((a, b) => b.count - a.count);

            results = confirmed;
            const displayName =
                componentTypes.find((t) => t.key === selectedType)
                    ?.displayName ?? selectedType;
            displayMessage(
                `Found ${confirmed.length} page${confirmed.length === 1 ? '' : 's'} using ${displayName}`,
                true
            );
        } catch (error) {
            displayMessage(
                'Search failed: ' +
                    (error instanceof Error ? error.message : 'Unknown error'),
                false
            );
        } finally {
            searchLoading = false;
            verifyingIndex = 0;
            verifyingTotal = 0;
        }
    }

    let viewMode = $state<'pages' | 'shared-blocks' | 'unused'>('pages');
    let expandedBlocks = $state(new Set<string>());

    function toggleBlock(key: string) {
        const next = new Set(expandedBlocks);
        next.has(key) ? next.delete(key) : next.add(key);
        expandedBlocks = next;
    }

    let unusedBlocks = $state<{ key: string; name: string }[] | null>(null);
    let unusedLoading = $state(false);
    let unusedFetchedForType = $state('');

    async function fetchUnused() {
        if (!selectedType || !pageCache) return;
        if (unusedFetchedForType === selectedType) return;

        unusedLoading = true;
        try {
            const query = `
                query GetTypeInstances($cursor: String) {
                    ${selectedType}(limit: 100, cursor: $cursor) {
                        cursor
                        total(all: true)
                        items {
                            _metadata { key displayName }
                        }
                    }
                }
            `;
            const allInstances: { key: string; name: string }[] = [];

            const first = await graphql(query);
            const firstData = first.data?.[selectedType];
            const total = firstData?.total ?? 0;
            for (const item of firstData?.items ?? []) {
                if (item?._metadata?.key)
                    allInstances.push({ key: item._metadata.key, name: item._metadata.displayName ?? '' });
            }

            let cursor: string | null = firstData?.cursor ?? null;
            while (cursor && allInstances.length < total) {
                const res = await graphql(query, { cursor });
                const data = res.data?.[selectedType];
                const items = data?.items ?? [];
                if (items.length === 0) break;
                for (const item of items) {
                    if (item?._metadata?.key)
                        allInstances.push({ key: item._metadata.key, name: item._metadata.displayName ?? '' });
                }
                cursor = data?.cursor ?? null;
            }

            // Use full cache (all sites/locales) — a block used anywhere is not unused
            const usedKeys = new Set(
                pageCache!.flatMap((p) => (p.componentInstances[selectedType] ?? []).map((i) => i.key))
            );
            unusedBlocks = allInstances.filter((i) => !usedKeys.has(i.key));
            unusedFetchedForType = selectedType;
        } catch {
            unusedBlocks = [];
        } finally {
            unusedLoading = false;
        }
    }

    function clearCache() {
        pageCache = null;
        cacheBuilt = false;
        results = [];
        hasSearched = false;
        showMessage = false;
        filterSite = 'all';
        filterLocale = 'all';
        viewMode = 'pages';
        expandedBlocks = new Set();
        unusedBlocks = null;
        unusedFetchedForType = '';
        try { localStorage.removeItem(CACHE_KEY); } catch {}
    }
</script>

<div class="max-w-5xl">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Component Usage</h1>
        <p class="text-gray-600">
            Find all Experience pages that use a specific component to assess
            impact before making updates.
        </p>
    </div>

    {#if showMessage}
        <StatusMessage {message} type={messageType} />
    {/if}

    <!-- Controls -->
    <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-6">
        <div class="flex flex-col sm:flex-row gap-3 items-end">
            <div class="flex-1">
                <label
                    for="component-select"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Component type</label
                >
                {#if typesError}
                    <p class="text-sm text-red-600">
                        Failed to load types: {typesError}
                    </p>
                {:else}
                    <select
                        id="component-select"
                        bind:value={selectedType}
                        onchange={() => { if (hasSearched) search(); }}
                        disabled={typesLoading}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50"
                    >
                        {#if typesLoading}
                            <option value="">Loading component types...</option>
                        {:else}
                            {#each componentTypes as type}
                                <option value={type.key}
                                    >{type.displayName}</option
                                >
                            {/each}
                        {/if}
                    </select>
                {/if}
            </div>

            {#if cacheBuilt && availableSites.length > 1}
                <div>
                    <label
                        for="site-filter"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Site</label
                    >
                    <select
                        id="site-filter"
                        bind:value={filterSite}
                        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                        <option value="all">All sites</option>
                        {#each availableSites as site}
                            <option value={site}>{displaySite(site)}</option>
                        {/each}
                    </select>
                </div>
            {/if}

            {#if hasSearched && availableLocales.length > 1}
                <div>
                    <label
                        for="locale-filter"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Locale</label
                    >
                    <select
                        id="locale-filter"
                        bind:value={filterLocale}
                        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                        <option value="all">All locales</option>
                        {#each availableLocales as locale}
                            <option value={locale}>{locale}</option>
                        {/each}
                    </select>
                </div>
            {/if}

            <button
                onclick={search}
                disabled={searchLoading || typesLoading || !selectedType}
                class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
            >
                {#if searchLoading}
                    <LoadingSpinner size="sm" />
                    {verifyingTotal > 0
                        ? `Indexing ${verifyingIndex} of ${verifyingTotal}...`
                        : 'Fetching pages...'}
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
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"
                        ></path>
                    </svg>
                    Search
                {/if}
            </button>

            {#if cacheBuilt}
                <button
                    onclick={clearCache}
                    disabled={searchLoading}
                    title="Clear cached index and re-scan on next search"
                    class="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
                >
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
                        ></path>
                    </svg>
                    Refresh index
                </button>
            {/if}
        </div>

        {#if cacheBuilt && !searchLoading}
            <p class="mt-2 text-xs text-gray-400">
                Index cached — subsequent searches are instant. Click "Refresh
                index" to re-scan.
            </p>
        {/if}
    </div>

    <!-- Results -->
    {#if hasSearched}
        <div
            class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        >
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
                <h2 class="text-base font-semibold text-gray-900">
                    {#if searchLoading}
                        {verifyingTotal > 0
                            ? `Building index: page ${verifyingIndex} of ${verifyingTotal}...`
                            : 'Fetching Experience pages...'}
                    {:else}
                        {filteredResults.length} page{filteredResults.length === 1 ? '' : 's'}
                        · {totalUses} use{totalUses === 1 ? '' : 's'}
                        {filterSite !== 'all' ? `on ${displaySite(filterSite)}` : ''}
                        {filterLocale !== 'all' ? `in ${filterLocale}` : ''}
                        using
                        <span class="font-mono text-blue-700"
                            >{componentTypes.find((t) => t.key === selectedType)
                                ?.displayName ?? selectedType}</span
                        >
                        {#if sharedInstanceCount > 0}
                            <span class="text-sm font-normal text-gray-400">· {sharedInstanceCount} shared instance{sharedInstanceCount === 1 ? '' : 's'}</span>
                        {/if}
                    {/if}
                </h2>
                {#if !searchLoading}
                    <div class="flex shrink-0 rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
                        <button
                            onclick={() => viewMode = 'pages'}
                            class="px-3 py-1.5 transition-colors {viewMode === 'pages' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}"
                        >Pages</button>
                        {#if sharedBlockResults.length > 0}
                            <button
                                onclick={() => viewMode = 'shared-blocks'}
                                class="px-3 py-1.5 border-l border-gray-200 transition-colors {viewMode === 'shared-blocks' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}"
                            >Shared Blocks</button>
                        {/if}
                        <button
                            onclick={() => { viewMode = 'unused'; fetchUnused(); }}
                            class="px-3 py-1.5 border-l border-gray-200 transition-colors {viewMode === 'unused' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}"
                        >{#if unusedLoading}Unused…{:else if unusedBlocks !== null && unusedFetchedForType === selectedType}Unused ({unusedBlocks.length}){:else}Unused{/if}</button>
                    </div>
                {/if}
            </div>

            {#if searchLoading}
                <div
                    class="flex flex-col justify-center items-center py-16 gap-3 text-gray-500 text-sm"
                >
                    <LoadingSpinner size="lg" color="text-blue-600" />
                    {#if verifyingTotal > 0}
                        <div class="w-48 bg-gray-200 rounded-full h-1.5">
                            <div
                                class="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style="width: {Math.round(
                                    (verifyingIndex / verifyingTotal) * 100
                                )}%"
                            ></div>
                        </div>
                    {/if}
                </div>
            {:else if viewMode === 'unused'}
                {#if unusedLoading}
                    <div class="flex flex-col justify-center items-center py-16 gap-3 text-gray-500 text-sm">
                        <LoadingSpinner size="lg" color="text-blue-600" />
                        Fetching all instances…
                    </div>
                {:else if unusedBlocks === null}
                    <div class="py-16 text-center text-gray-500 text-sm">
                        Click <strong>Unused</strong> to check for shared blocks not placed on any Experience page.
                    </div>
                {:else if unusedBlocks.length === 0}
                    <div class="py-16 text-center text-gray-500">
                        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        All <strong>{componentTypes.find((t) => t.key === selectedType)?.displayName ?? selectedType}</strong> shared blocks are in use on Experience pages.
                    </div>
                {:else}
                    <div class="px-6 py-3 bg-amber-50 border-b border-amber-100 text-xs text-amber-700">
                        These blocks exist in the CMS but were not found on any Experience page. They may still be used on other page types (Landing Pages, etc.).
                    </div>
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                            <tr>
                                <th class="px-6 py-3 text-left font-medium">Block name</th>
                                <th class="px-6 py-3 text-left font-medium">Content key</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            {#each unusedBlocks as block}
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-3 font-medium text-gray-900">{block.name || 'Unnamed'}</td>
                                    <td class="px-6 py-3 font-mono text-xs text-gray-400">{block.key}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {/if}
            {:else if filteredResults.length === 0}
                <div class="py-16 text-center text-gray-500">
                    <svg
                        class="w-12 h-12 mx-auto mb-3 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                    </svg>
                    No Experience pages found using
                    <strong
                        >{componentTypes.find((t) => t.key === selectedType)
                            ?.displayName ?? selectedType}</strong
                    >
                    {filterSite !== 'all' ? ` on ${displaySite(filterSite)}` : ''}
                    {filterLocale !== 'all' ? ` in locale "${filterLocale}"` : ''}.
                </div>
            {:else if viewMode === 'pages'}
                <table class="w-full text-sm">
                    <thead
                        class="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider"
                    >
                        <tr>
                            <th class="px-6 py-3 text-left font-medium">Page</th>
                            <th class="px-6 py-3 text-left font-medium">URL</th>
                            <th class="px-6 py-3 text-left font-medium">Locale</th>
                            <th class="px-6 py-3 text-right font-medium">Uses</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        {#each filteredResults as page}
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-3 font-medium text-gray-900">
                                    {#if page.fullUrl}
                                        <a
                                            href={page.fullUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="text-blue-600 hover:underline"
                                        >{page.title}</a>
                                    {:else}
                                        {page.title}
                                    {/if}
                                </td>
                                <td class="px-6 py-3 text-gray-500 font-mono text-xs">{page.fullUrl || '—'}</td>
                                <td class="px-6 py-3 text-gray-500">{page.locale || '—'}</td>
                                <td class="px-6 py-3 text-right">
                                    <span class="inline-flex items-center justify-center min-w-6 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                        {page.count}
                                    </span>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {:else}
                <div class="divide-y divide-gray-100">
                    {#each sharedBlockResults as block}
                        <div>
                            <button
                                onclick={() => toggleBlock(block.key)}
                                class="w-full px-6 py-3 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div class="flex items-center gap-3 min-w-0">
                                    <svg
                                        class="w-4 h-4 shrink-0 text-gray-400 transition-transform {expandedBlocks.has(block.key) ? 'rotate-90' : ''}"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span class="text-sm font-medium text-gray-900 truncate">
                                        {block.name || 'Unnamed block'}
                                    </span>
                                    <span class="font-mono text-xs text-gray-300 shrink-0">{block.key.slice(0, 8)}…</span>
                                </div>
                                <span class="inline-flex shrink-0 items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                    {block.pages.length} page{block.pages.length === 1 ? '' : 's'}
                                </span>
                            </button>
                            {#if expandedBlocks.has(block.key)}
                                <ul class="px-6 pb-3 pl-14 bg-gray-50 space-y-1.5">
                                    {#each block.pages as page}
                                        <li class="text-sm text-gray-700 flex items-center gap-2">
                                            {#if page.fullUrl}
                                                <a
                                                    href={page.fullUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    class="text-blue-600 hover:underline"
                                                >{page.title}</a>
                                            {:else}
                                                {page.title}
                                            {/if}
                                            {#if page.locale}
                                                <span class="text-xs text-gray-400">{page.locale}</span>
                                            {/if}
                                        </li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>
