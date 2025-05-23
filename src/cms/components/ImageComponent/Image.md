# Image Component

## Description

The Image component renders optimized images with configurable styling through display settings. It provides a simple, accessible way to display images with proper alt text and customizable visual styling.

## Usage

The Image component is used throughout the site for displaying standalone images, supporting graphics, or any visual content that requires styling flexibility.

### Content Fields

- **Image**: The image asset with URL
- **AltText**: Accessibility text description for screen readers

## Styles

### Visual Builder Style Options

#### Image Default
- **Aspect Ratio**: Square (1:1), Banner (4:1), Classic Monitor (4:3), Photo (3:2), Widescreen (16:9)
- **Orientation**: Landscape, Portrait
- **Rounded Corners**: None, Small, Medium, Large, Huge, Full
- **Fade in Animation**: None, Circle
- **Fade in Direction**: Left to right, Right to left
- **Fade in Delay**: None, Short (0.5s), Medium (1s), Long (1.5s), Very Long (2s)
- **Fade in Duration**: None, Short (0.5s), Medium (1s), Long (1.5s), Very Long (2s)

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