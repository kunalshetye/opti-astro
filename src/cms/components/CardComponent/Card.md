# Card Component

## Description

The Card component is a versatile content display component that combines images, text content, and call-to-action buttons in various layout configurations. It supports four different display modes for flexible content presentation.

## Usage

The Card component is ideal for feature highlights, product showcases, service descriptions, or any content that benefits from a visual + textual presentation.

### Content Fields

- **DisplayAs**: Layout configuration (`textOnRight`, `textOnLeft`, `textAboveCard`, `textBelowCard`)
- **Heading**: Main title text (displayed as large, bold text)
- **SubHeading**: Secondary subtitle text
- **Body**: Rich text content (HTML)
- **Asset**: Image or media asset
- **Links**: Collection of call-to-action buttons

## Styles

No Visual Builder style options are currently configured for the Card component.

## Screenshot

*[Placeholder for Card component screenshot showing different layout configurations]*

## Files

- `Card.astro` - Main component that handles layout switching
- `Wrapper.astro` - Container component that applies layout-specific CSS classes
- `Content.astro` - Text content and call-to-action rendering
- `Asset.astro` - Image/media asset rendering
- `card.graphql` - GraphQL fragment for component data

## Implementation Notes

- Responsive design with different layouts for mobile and desktop
- Smart button styling (primary vs secondary based on order)
- Handles missing assets gracefully
- Uses CSS Grid for flexible layouts
- Supports rich text content with HTML rendering
- Fixed image dimensions (1075x700) with lazy loading
- All layouts are contained within max-width containers for readability