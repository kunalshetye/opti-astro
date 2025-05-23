# ArticleList Component

## Description

The ArticleList component displays a horizontally scrollable list of article cards. It dynamically fetches articles from the CMS and presents them in a card-based layout with promotional images, titles, excerpts, and "Read more" links.

## Usage

The component is used to showcase recent articles or featured content on landing pages or content hubs.

### Component Structure

```typescript
interface ArticleListProps {
  data: ArticleListFragment;
  displaySettings: DisplaySettingsFragment[];
  contentPayload: ContentPayload;
}
```

### Content Fields

- **Title**: Display title for the article list section
- **NumberOfArticles**: Maximum number of articles to display (defaults to 1)

### GraphQL Fragment

```graphql
fragment ArticleList on ArticleList {
    Title
    NumberOfArticles
}
```

### Data Fetching

The component dynamically fetches articles using the `getArticles` query with:
- Current site context
- Locale from content payload
- Limit based on `NumberOfArticles` setting

## Styles

### Layout Classes
- **Container**: `mx-auto mt-4 mb-4 flex gap-8 overflow-x-auto flex-wrap`
- **Card**: `card bg-base-100 w-96 flex-shrink-0 shadow-sm flex flex-col`
- **Image**: `aspect-3/2 object-cover`
- **Body**: `card-body`
- **Title**: `card-title`
- **Actions**: `card-actions justify-end mt-auto`
- **Button**: `btn btn-primary`

### Design Features
- Horizontal scrolling for overflow content
- Fixed card width (384px) with flex-shrink-0
- 3:2 aspect ratio promotional images
- Truncated body text (100 characters + "...")
- Consistent card height with bottom-aligned actions

## Screenshot

*[Placeholder for ArticleList component screenshot showing horizontal card layout]*

## Files

- `ArticleList.astro` - Main component implementation
- `articleList.graphql` - GraphQL fragment for component data

## Implementation Notes

- Uses `randomBytes` for generating unique IDs (though glideId is defined but not used)
- Handles missing promotional images gracefully
- Responsive design with horizontal scrolling on smaller screens
- Articles are fetched server-side during build/render
- Truncates article body text for consistent card sizing