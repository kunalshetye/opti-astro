# Paragraph Component

## Description

The Paragraph component renders rich text content from the CMS. It provides a simple container for formatted text content including HTML markup, making it perfect for body text, descriptions, and formatted content blocks.

## Usage

The Paragraph component is used for displaying rich text content throughout the site, including article bodies, descriptions, formatted text with links, lists, and other HTML elements.

### Content Fields

- **Text**: Rich text content with HTML formatting

## Styles

No Visual Builder style options are currently configured for the Paragraph component.

## Screenshot

*[Placeholder for Paragraph component screenshot showing rich text formatting]*

## Files

- `Paragraph.astro` - Main component implementation
- `paragraph.graphql` - GraphQL fragment for component data
- `ParagraphStyling.ts` - Style configuration utilities

## Implementation Notes

- Uses Astro's `set:html` directive for safe HTML rendering
- Minimal wrapper to preserve content flexibility
- Supports all standard HTML elements (links, lists, emphasis, etc.)
- Content is sanitized by Optimizely CMS before rendering
- Works seamlessly with CMS rich text editor
- Lightweight implementation focused on content delivery
- Inherits responsive design from global styles