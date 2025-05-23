# Hero Component

## Description

The Hero component creates a full-width banner section with video or image backgrounds, overlay text content, and call-to-action buttons. It supports customizable styling through display settings for alignment, height, opacity, and text positioning.

## Usage

The Hero component is typically used as the primary focal point at the top of landing pages, featuring compelling visuals and key messaging to engage visitors.

### Content Fields

- **Video**: Optional background video (takes priority over image)
- **Image**: Background image (used when no video is provided)
- **Heading**: Large primary title text
- **SubHeading**: Secondary descriptive text
- **Body**: Rich text content (HTML)
- **Links**: Collection of call-to-action buttons

## Styles

### Visual Builder Style Options

#### Default Hero
- **Hero Height**: Small (18rem), Medium (28rem), Large (38rem), X-Large (48rem)
- **Text Placement**: Right, Center, Left
- **Text Color**: White, Black
- **Background Tint Level**: 0-100 (opacity overlay)

## Screenshot

*[Placeholder for Hero component screenshot showing background video/image with overlay content]*

## Files

- `Hero.astro` - Main component implementation
- `hero.graphql` - GraphQL fragment for component data
- `HeroStyling.ts` - Style configuration utilities
- `DefaultHero.opti-style.json` - CMS style configuration

## Implementation Notes

- Video backgrounds auto-play, loop, and are muted for browser compatibility
- Uses `playsinline` attribute for mobile video support
- Graceful fallback from video to image background
- Responsive typography scaling (5xl to 6xl on larger screens)
- Dark overlay ensures text readability over any background
- Buttons include hover states and smooth transitions
- Content is properly layered with z-index for visibility
- Supports rich HTML content in body section