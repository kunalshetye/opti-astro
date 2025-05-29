# Text Component

## Description

The Text component renders configurable heading and text elements with dynamic styling. It supports different heading levels (h1-h6) or plain text, with styling controlled through CMS display settings for maximum flexibility.

## Usage

The Text component is used for headlines, subheadings, labels, and any text that requires specific typography treatment or semantic heading structure.

### Content Fields

- **Content**: The text content to display

## Styles

### Visual Builder Style Options

#### Text Default
- **Heading Type**: Heading 1-6, Plain text
- **Text Align**: Left, Center, Right, Justify
- **Render As**: Heading element, Basic element
- **Text Transform**: As entered, Uppercase, Lowercase, Capitalize

## Screenshot

*[Placeholder for Text component screenshot showing different heading levels and styles]*

## Files

- `Text.astro` - Main component implementation
- `text.graphql` - GraphQL fragment for component data
- `TextStyling.ts` - Style configuration utilities
- `TextStyles.opti-style.json` - CMS style configuration

## Implementation Notes

- Dynamically renders appropriate HTML element based on settings
- Uses Astro's component interpolation for element type selection
- Supports full spectrum of heading semantics (h1-h6)
- Falls back to span for non-semantic text styling
- Style system allows complete customization without code changes
- Maintains proper accessibility with semantic heading structure
- Clean separation between content and presentation
- Lightweight implementation with powerful configuration options