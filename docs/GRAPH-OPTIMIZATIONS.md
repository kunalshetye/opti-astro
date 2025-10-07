# Optimizely Graph Search Optimizations Guide

This guide explains how to use the search optimization features for Optimizely Graph, including the **Synonyms Manager** and **Pinned Results Manager**. These tools are available in the Opti Admin dashboard to help you improve search relevance and user experience.

## 🔑 Accessing the Admin Dashboard

To access these features, you must first enable the Opti Admin dashboard by setting the following environment variables. If these are not set, the admin pages will not be accessible.

```bash
# .env
ADMIN_DASHBOARD_USERNAME=your-admin-username
ADMIN_DASHBOARD_PASSWORD=your-secure-password
```

Once configured, you can access the tools at the following paths:
- **Synonyms Manager**: `/opti-admin/graph-synonyms`
- **Pinned Results Manager**: `/opti-admin/graph-pinnedresults`

You can also navigate to the main admin dashboard at `/opti-admin` to find links to both management pages.

---

## 🔄 Synonyms Manager

The Synonyms Manager allows you to define terms that should be treated as equivalent or as replacements during a search. This helps users find relevant content even if they don't use the exact terminology present in your content.

### Synonym Formats

You can define synonyms in two formats:

#### 1. Bi-directional (Equivalent)
Use commas to separate words that should be treated as equivalents. A search for any term in the group will match documents containing any of the other terms.

**Format:**
```
term1, term2, term3
```

**Examples:**
```
laptop, computer, pc
episerver, optimizely
```

#### 2. Uni-directional (Replacement)
Use an arrow `=>` to map a term to one or more replacements. A search for the term on the left will be replaced by the term(s) on the right.

**Format:**
```
term => replacement1, replacement2
```

**Examples:**
```
H2O => water
NYC => New York City, New York, Big Apple
```

### How to Use the Manager

1.  **Navigate** to `/opti-admin/graph-synonyms`.
2.  **Select a Synonym Slot**: Choose which synonym file to edit. Currently, only Slot 1 is used by the site search.
3.  **Set Language Routing**: Specify the language locale for the synonyms (e.g., `en`, `sv`).
4.  **Enter Synonyms**: In the textarea, add your synonym rules, with one rule per line.
5.  **Upload**: Click "Upload Synonyms to Optimizely Graph". Leaving the textarea empty will clear all synonyms for the selected slot and language.

### Usage in GraphQL

To activate synonyms in your search queries, add the `synonyms: ONE` parameter to your `_fulltext` filter.

```graphql
{
  Content(
    where: {
      _fulltext: {
        match: "H2O",
        synonyms: ONE
      }
    }
  ) {
    items {
      _score
      Name
    }
  }
}
```

### Key Considerations

- Changes are available in near real-time.
- Results matching synonyms are ranked higher than non-matching results.
- Exact matches are ranked higher than synonym matches.

---

## 📌 Pinned Results Manager

The Pinned Results Manager allows you to "pin" specific content to the top of search results for certain search phrases. This is useful for promoting important pages, campaigns, or products.

### How Pinned Results Work

- **Collections**: Pinned results are organized into collections for easier management. A collection must be active for its pinned items to appear in search.
- **Search Phrases**: These are the user queries that will trigger a pinned result. You can define multiple phrases for a single pinned item.
- **Content GUID**: Each pinned item points to a specific piece of content using its unique GUID.
- **Priority**: A number from 1-100 that determines the order when multiple items are pinned to the same phrase. Lower numbers have higher priority.

### How to Use the Manager

1.  **Navigate** to `/opti-admin/graph-pinnedresults`.
2.  **Create a Collection**: Give your collection a title (e.g., "Homepage Promotions") and set it to active.
3.  **Select a Collection**: Click "Select" on an existing collection to manage its items.
4.  **Add a Pinned Result**:
    -   **Search Phrases**: Enter the phrases that should trigger this result (one per line).
    -   **Content GUID**: Enter the GUID of the content you want to pin. You can use the "Find Content" tool on the page to search for content and copy its GUID.
    -   **Language & Priority**: Set the language and priority for the item.
    -   **Set to Active**: Ensure the item is active.
5.  **Submit**: Click "Add Pinned Result".

### Usage in GraphQL

To use pinned results, add the `usePinned` parameter to your query, providing the user's search phrase and the `collectionId`.

```graphql
{
  Content(
    where: { _fulltext: { match: "water" } }
    usePinned: { 
      phrase: "water", 
      collectionId: "your-collection-id" 
    }
  ) {
    items {
      _score
      _id
      Name
    }
  }
}
```

### Key Considerations

- Only the top 5 pinned items per phrase are returned.
- Changes are available in near real-time.
- Pinned items receive a high boost weight and appear before organic search results.
- Both the collection and the individual item must be active to appear in results.