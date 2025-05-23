# Image Component

## Description

The Image component renders optimized images with configurable styling through display settings. It provides a simple, accessible way to display images with proper alt text and customizable visual styling.

## Usage

The Image component is used throughout the site for displaying standalone images, supporting graphics, or any visual content that requires styling flexibility.

### Component Structure

```typescript
interface ImageProps {
  data: ImageFragment;
  displaySettings: DisplaySettingsFragment[];
  contentPayload: ContentPayload;
}
```

### Content Fields

- **Image**: The image asset with URL
- **AltText**: Accessibility text description for screen readers

### GraphQL Fragment

```graphql
fragment Image on Image {
    AltText
    Image {
        url {
            default
        }
    }
}
```

## Styles

### Configurable Styling

The component uses `ImageStyling.ts` to apply display settings:
- Styling is determined by the `getImageElementStyles()` function
- Style options are configured through CMS display settings
- Supports responsive design patterns

### Style Configuration

The component references:
- `DefaultImage.opti-style.json` - CMS style configuration
- `ImageStyling.ts` - Style processing utilities

### Common Style Options
- Aspect ratios (16:9, 4:3, 1:1, etc.)
- Border radius options (rounded corners)
- Sizing and alignment options
- Responsive breakpoint behaviors

## Screenshot

*[Placeholder for Image component screenshot showing different styling options]*

## Files

- `Image.astro` - Main component implementation
- `image.graphql` - GraphQL fragment for component data
- `ImageStyling.ts` - Style configuration utilities
- `DefaultImage.opti-style.json` - CMS style configuration

## Implementation Notes

- Uses proper semantic HTML with `img` element
- Includes required `alt` attribute for accessibility
- Leverages Optimizely's image optimization and CDN
- Style system allows for extensive customization without code changes
- Responsive design support through style configuration
- Clean, minimal implementation focused on performance
- Proper loading behavior with browser-native lazy loading