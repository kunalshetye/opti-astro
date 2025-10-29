# Faceted Search Component

A comprehensive, interactive search component with faceted filtering capabilities for ArticlePage content and extensible to other content types.

## Overview

The Faceted Search component provides a powerful search interface with dynamic facets (filters), full-text search, sorting options, and URL parameter support for SEO-friendly filtered views. Built with Svelte 5 for optimal interactivity and Astro for SSR performance.

## Features

- **Full-text Search**: Search across article headings, subheadings, body content, and author fields
- **Dynamic Facets**: Auto-generated filters based on content attributes
  - Author facet (shows all authors with article counts)
  - Content Type facet (filters by ArticlePage, LandingPage, etc.)
- **URL State Management**: All filters reflected in URL parameters for:
  - SEO-friendly filtered views
  - Shareable search results
  - Browser back/forward support
- **Sorting Options**:
  - Relevance (default)
  - Newest First
  - Oldest First
  - Title A-Z
  - Title Z-A
- **Results Display**:
  - Paginated results
  - Shows result count and range
  - Clear all filters button
  - Individual filter badges
- **Responsive Design**: Mobile-first layout with collapsible facet sidebar

## Configuration

### CMS Properties

#### Information Group
- **Title** (string): Heading displayed above the search interface
- **Description** (rich text): Optional description text below the title

#### Configuration Group
- **Results Per Page** (integer, 1-100): Number of results per page (default: 20)
- **Default Sort Order** (select):
  - Relevance
  - Newest First
  - Oldest First
  - Title A-Z
  - Title Z-A
- **Show Search Input** (boolean): Display the search input field (default: true)

#### Facets Group
- **Show Author Filter** (boolean): Display author facet (default: true)
- **Show Content Type Filter** (boolean): Display content type facet (default: true)

#### Labels Group
- **Search Placeholder** (string): Placeholder text for search input
- **No Results Message** (string): Message when no results found

### Display Settings

Available through the component's style definition:

- **Max Width**: Container width (xs to 7xl, or none for full width)
- **Content Alignment**: Left, Center, or Right

## Usage

### Adding to a Page

1. In the Optimizely CMS, edit any page that supports sections/elements
2. Add a new block/component
3. Select "Faceted Search" from the component list
4. Configure the component properties
5. Publish the page

### URL Parameters

The component automatically manages URL parameters:

- `?q=search+term` - Full-text search query
- `?authors[]=John+Doe&authors[]=Jane+Smith` - Filter by authors
- `?types[]=ArticlePage&types[]=LandingPage` - Filter by content types
- `?sort=date_desc` - Sort order
- `?page=2` - Current page number

**Example filtered URL:**
```
/search?q=technology&authors[]=John+Doe&sort=date_desc&page=1
```

## Technical Details

### Architecture

- **FacetedSearch.astro**: Server-side wrapper
  - Handles initial data fetching
  - Reads URL parameters for SSR
  - Passes data to Svelte component
- **FacetedSearch.svelte**: Client-side interactive component
  - Manages filter state
  - Syncs state with URL parameters
  - Handles user interactions
  - Fetches updated results (future enhancement)
- **facetedSearch.graphql**: GraphQL query
  - Fetches ArticlePage content with facets
  - Supports filters and pagination
  - Returns facet counts

### GraphQL Facets API

The component uses Optimizely Graph's facets API:

```graphql
facets {
  Author(filters: $authorFilters, orderType: COUNT, orderBy: DESC, limit: 50) {
    name
    count
  }
  _metadata {
    types(filters: $typeFilters, orderType: COUNT, orderBy: DESC, limit: 20) {
      name
      count
    }
  }
}
```

### Svelte 5 Features

Uses modern Svelte 5 runes for reactivity:
- `$state` - Component state management
- `$derived` - Computed values
- `$effect` - Side effects (URL sync)
- `$props` - Component props

## Extending the Component

### Adding New Facets

To add custom facets (e.g., Categories, Tags):

1. **Update ArticlePage Type** (or create custom content type):
   ```json
   "Category": {
     "type": "string",
     "indexingType": "searchable"
   }
   ```

2. **Update GraphQL Query** (`facetedSearch.graphql`):
   ```graphql
   query facetedSearch(
     ...
     $categoryFilters: [String!]
   ) {
     ArticlePage(
       where: {
         _and: [
           ...
           { Category: { in: $categoryFilters } }
         ]
       }
     ) {
       ...
       facets {
         Category(filters: $categoryFilters, orderType: COUNT) {
           name
           count
         }
       }
     }
   }
   ```

3. **Update Component Type** (`FacetedSearch.opti-type.json`):
   ```json
   "ShowCategoryFacet": {
     "type": "boolean",
     "displayName": "Show Category Filter"
   }
   ```

4. **Update Svelte Component** (`FacetedSearch.svelte`):
   - Add category state
   - Add category facet UI
   - Include in URL params

### Supporting Multiple Content Types

The query currently focuses on ArticlePage but can be extended:

1. Use `_Content` or `_Page` interface in GraphQL query
2. Add conditional fragments for each content type
3. Update result display to handle different content types

## Performance Considerations

- **SSR First**: Initial results rendered server-side for fast page loads
- **Progressive Enhancement**: JavaScript-free fallback displays initial results
- **Debounced Search**: 500ms delay before triggering search
- **Facet Caching**: Facet counts cached until filters change
- **Pagination**: Limits result sets for optimal performance

## Troubleshooting

### Facets Not Showing
- Ensure fields are marked as `indexingType: "searchable"` in content type definition
- Run Content Graph Full Sync in CMS after type changes
- Check that content actually has values for the facet field

### GraphQL Errors
- Run `yarn codegen` after making GraphQL changes
- Verify content type exists in CMS
- Check that field names match between type definition and query

### URL Parameters Not Working
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify `query-string` library is installed

## Dependencies

- **Svelte 5**: Interactive UI framework
- **query-string**: URL parameter parsing/stringifying
- **@astrojs/svelte**: Astro-Svelte integration
- **graphql-request**: GraphQL client
- **TailwindCSS + daisyUI**: Styling system

## Future Enhancements

- [ ] API route for client-side facet refreshing (currently uses SSR data)
- [ ] Date range facets for published dates
- [ ] Number range facets (if applicable)
- [ ] Saved search functionality
- [ ] Export results (CSV, JSON)
- [ ] Advanced search syntax support
- [ ] Search analytics tracking
- [ ] A/B testing integration

## References

- [Optimizely Graph Facets Documentation](https://docs.developers.optimizely.com/platform-optimizely/docs/facets)
- [Svelte 5 Documentation](https://svelte.dev/)
- [Astro Documentation](https://docs.astro.build/)
