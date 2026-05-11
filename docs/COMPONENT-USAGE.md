# Component Usage Dashboard

The Component Usage dashboard helps you find every Experience page that uses a specific component type — useful for assessing impact before modifying or deprecating a component.

**Location:** `/opti-admin?view=component-usage`

---

## How It Works

### Index Building

On first search, the tool scans all Experience pages in Optimizely Graph and builds an in-memory component index. It queries the `_Experience` type, which covers all experience page types (e.g. `BlankExperience`) in a single paginated request rather than one query per type. Pages are fetched 100 at a time using cursor-based pagination, and each page's `composition` tree is fetched directly (not the full page JSON). The composition tree is traversed up to 4 levels deep — covering the standard Visual Builder hierarchy of Section → Row → Column → Component. Each `CompositionComponentNode` found is counted by its `type` key and stored against the page. For shared blocks (components with an independent CMS content key), the content key and display name are also stored to enable the Shared Blocks and Unused views.

Progress is shown in real time: the total page count is known from the first response, so the progress bar reflects actual scan progress throughout.

### Searching

Once the index is built, switching between component types is instant — no further network requests. The tool filters the in-memory index and displays matching pages sorted by use count (most uses first). After the first search, changing the component type dropdown re-runs the search automatically.

The results header shows:
- **Page count** — number of Experience pages containing at least one instance of the selected type
- **Uses** — total placement count across all matching pages
- **Shared instances** — number of distinct shared block instances of that type found in the index (only shown when shared blocks are present)

### Filtering

Two filters are available after the index is warm:

- **Site** — filters by domain (e.g. `www.example.com`). Appears automatically when the index contains pages from more than one site.
- **Locale** — filters by content locale. Appears after a search when results span more than one locale.

Both filters are applied client-side with no additional queries.

---

## Views

After a search, three views are available via the toggle in the results header:

### Pages

The default view. Lists every Experience page that uses the selected component type, with the URL, locale, and use count per page. Sorted by use count descending.

### Shared Blocks

Available when the selected component type has shared block instances placed on Experience pages. Shows a list of individual shared block instances, each expandable to reveal which pages it appears on. Only shared blocks — components with an independent CMS content key — appear here; inline components created directly inside an experience are not included.

### Unused

Fetches all content items of the selected type from Optimizely Graph and compares them against the index. Items not found in any Experience page composition are listed as potentially unused.

> **Note:** "Unused" means not found on any *Experience page* in the index. A block used on a Landing Page, Article Page, or other non-Experience page type will still appear in this list. See [Limitations](#limitations) for details.

The tab label updates to **Unused (N)** once loaded, so you can see the count without switching views. Results for the current type are cached in memory — switching back to the Unused tab does not re-fetch.

---

## Caching

The built index is persisted to `localStorage` with a 4-hour TTL. On subsequent visits within that window, the index loads instantly from cache and the Site/Locale filters are immediately available — no scan required.

Use the **Refresh index** button to clear the cache and trigger a fresh scan on the next search. This is useful after publishing significant content changes.

---

## Limitations

**Experience pages only.**
The scanner covers all Visual Builder experience pages (any type implementing `_IExperience`). Other page types — Landing Pages, Article Pages, etc. — are not scanned. This also means the **Unused** tab can produce false positives: a shared block used only on a Landing Page will appear as unused here.

**New experience types require a query update.**
Because `_IExperience` doesn't expose `composition` directly, composition is selected via a per-type inline fragment (`... on BlankExperience { composition { ... } }`). When a new experience type is added to the CMS, add a matching inline fragment to `COMPOSITION_QUERY` in [_ComponentUsage.svelte](../src/pages/opti-admin/components/_ComponentUsage.svelte). Until then, pages of the new type will appear in the index with zero component counts and won't show up in search results.

**Composition nodes only.**
Only components placed directly as Visual Builder nodes (i.e. `CompositionComponentNode` entries in the composition tree) are counted. Components referenced inside a *content area property of a component* — for example, blocks dropped into a Tabs component's content area — are not captured. The composition tree traversal does not follow component content references, only structural composition nodes.

**Component instance vs. type.**
The use count on each page row reflects how many times that component *type* appears on the page — not how many distinct shared block *instances* are in use. The **Shared Blocks** view surfaces the per-instance breakdown: each shared block is listed with the pages it appears on. Inline components (not shared blocks) contribute to the use count but do not appear in the Shared Blocks view.

---

## Technical Reference

### GraphQL Query

The index is built using a single paginated query against `_Experience.composition`, avoiding the N+1 pattern of fetching per-page JSON. `_Experience` returns all experience page types in one query. Because `_IExperience` (the interface) doesn't expose `composition` directly, it is selected via a per-concrete-type inline fragment:

```graphql
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
            ... on BlankExperience {
                composition {
                    nodes {
                        __typename
                        key
                        type
                        ... on CompositionComponentNode {
                            component { _metadata { key displayName } }
                        }
                        ... on CompositionStructureNode {
                            nodes {
                                __typename
                                key
                                type
                                ... on CompositionComponentNode {
                                    component { _metadata { key displayName } }
                                }
                                ... on CompositionStructureNode {
                                    nodes {
                                        __typename
                                        key
                                        type
                                        ... on CompositionComponentNode {
                                            component { _metadata { key displayName } }
                                        }
                                        ... on CompositionStructureNode {
                                            nodes {
                                                __typename
                                                key
                                                type
                                                ... on CompositionComponentNode {
                                                    component { _metadata { key displayName } }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```

`total(all: true)` returns the full dataset count (not just the current page), which drives the progress display and terminates the pagination loop correctly. `component._metadata.key` identifies shared block instances; nodes without a content key are inline components.

### Unused Tab Query

When the Unused tab is clicked, a separate paginated query fetches all content items of the selected type:

```graphql
query GetTypeInstances($cursor: String) {
    Card(limit: 100, cursor: $cursor) {
        cursor
        total(all: true)
        items {
            _metadata { key displayName }
        }
    }
}
```

The type field name matches the selected component type key. Results are compared against the content keys already in the index to determine which instances have not been placed on any Experience page.

### Component Type List

The component type dropdown is populated from the Optimizely CMS REST API (`/contenttypes`), filtered to items where `baseType === '_component'`. System and internal sources are excluded.

### localStorage Cache Key

```
opti-admin:component-usage-index-v3
```

Stored as `{ ts: number, data: CachedPage[] }`. Expires after 4 hours. The version suffix is incremented when the cached data shape changes (e.g. new fields added to `CachedPage`), which forces a fresh scan rather than attempting to read stale cache entries.
