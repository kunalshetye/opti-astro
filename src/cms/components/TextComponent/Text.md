# Text Component

## Description

The Text component renders configurable heading and text elements with dynamic styling. It supports different heading levels (h1-h6) or plain text, with styling controlled through CMS display settings for maximum flexibility.

## Usage

The Text component is used for headlines, subheadings, labels, and any text that requires specific typography treatment or semantic heading structure.

### Component Structure

```typescript
interface TextProps {
  data: TextFragment;
  displaySettings: DisplaySettingsFragment[];
  contentPayload: ContentPayload;
}
```

### Content Fields

- **Content**: The text content to display

### GraphQL Fragment

```graphql
fragment Text on Text {
    Content
}
```

## Styles

### Dynamic Element Types

The component dynamically renders different HTML elements based on display settings:
- **Heading Types**: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- **Plain Text**: `span` (default when headingType is "plain" or null)

### Style Configuration

The component uses:
- `TextStyling.ts` for style processing via `getHeadingElementStyles()`
- `TextStyles.opti-style.json` for CMS configuration
- Display settings to determine both element type and styling

### Element Selection Logic
```typescript
const HeadingStyle = (settings?.headingType == "plain" || settings?.headingType == null) 
    ? "span" : settings.headingType;
```

### Style Features
- Configurable typography through display settings
- Responsive design support
- Semantic HTML heading structure when appropriate
- Flexible styling for different text treatments

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