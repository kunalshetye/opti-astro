# ArticleList Component

## Description

The ArticleList component displays a horizontally scrollable list of article cards. It dynamically fetches articles from the CMS and presents them in a card-based layout with promotional images, titles, excerpts, and "Read more" links.

## Usage

The component is used to showcase recent articles or featured content on landing pages or content hubs.

### Content Fields

- **Title**: Display title for the article list section
- **NumberOfArticles**: Maximum number of articles to display (defaults to 1)

### Data Fetching

The component dynamically fetches articles using the `getArticles` query with:
- Current site context
- Locale from content payload
- Limit based on `NumberOfArticles` setting

## Styles

No Visual Builder style options are currently configured for the ArticleList component.

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