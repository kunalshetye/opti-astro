# Hero Component

## Description

The Hero component creates a full-width banner section with video or image backgrounds, overlay text content, and call-to-action buttons. It supports customizable styling through display settings for alignment, height, opacity, and text positioning.

## Usage

The Hero component is typically used as the primary focal point at the top of landing pages, featuring compelling visuals and key messaging to engage visitors.

### Component Structure

```typescript
interface HeroProps {
  data: HeroFragment;
  displaySettings: DisplaySettingsFragment[];
  contentPayload: ContentPayload;
}
```

### Content Fields

- **Video**: Optional background video (takes priority over image)
- **Image**: Background image (used when no video is provided)
- **Heading**: Large primary title text
- **SubHeading**: Secondary descriptive text
- **Body**: Rich text content (HTML)
- **Links**: Collection of call-to-action buttons

### GraphQL Fragment

```graphql
fragment Hero on Hero {
    Video {
        url {
            default
        }
    }
    Image {
        url {
            default
        }
    }
    Heading
    SubHeading
    Body {
        html
    }
    Links {
        url {
            default
        }
        text
    }
}
```

## Styles

### Layout Classes
- **Section**: `relative flex w-full items-center`
- **Background Video/Image**: `absolute inset-0 h-full w-full object-cover`
- **Overlay**: `absolute inset-0` (with configurable opacity)
- **Content**: `relative z-10 px-6`

### Typography Classes
- **Heading**: `text-5xl font-bold md:text-6xl`
- **SubHeading**: `mx-auto mt-4 max-w-2xl text-lg`
- **Body**: `mx-auto mt-4 max-w-2xl text-base text-gray-200`

### Button Classes
- **Buttons Container**: `mt-6 flex space-x-4`
- **Button**: `rounded-full bg-black/90 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-700`

### Configurable Styles

The component uses `HeroStyling.ts` to apply display settings:
- **justifyClass**: Content alignment (left, center, right)
- **backgroundOpacityClass**: Overlay darkness
- **textClasses**: Text color and alignment
- **heightClass**: Section height (viewport heights)

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