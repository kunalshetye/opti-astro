# Carousel Component

## Description

The Carousel component creates an infinite-scrolling image carousel with autoplay functionality, navigation controls, and slide indicators. Built with AlpineJS for smooth client-side interactions, it supports touch gestures and responsive design.

## Usage

The Carousel component is perfect for image galleries, featured content showcases, product demonstrations, or any content that benefits from a slideshow presentation.

### Component Structure

```typescript
interface CarouselProps {
  data: CarouselFragment;
  displaySettings: DisplaySettingsFragment[];
  contentPayload: ContentPayload;
}
```

### Content Fields

- **Assets**: Collection of images or components to display in carousel slides

### GraphQL Fragment

```graphql
fragment Carousel on Carousel {
    Assets {
        url {
            default
        }
    }
}
```

### Features

- **Infinite Scroll**: Seamless looping with cloned slides at beginning and end
- **Autoplay**: Automatically advances slides every 5 seconds
- **Navigation Controls**: Previous/next chevron buttons
- **Slide Indicators**: Clickable dots showing current position
- **Touch Support**: Pause autoplay on touch/hover interactions
- **Responsive Design**: Adapts to different screen sizes

## Styles

### Container Classes
- **Main Container**: `relative h-full w-full overflow-hidden rounded-lg`
- **Slides Container**: `flex h-full transition-transform duration-500 ease-in-out`
- **Individual Slide**: `relative h-full w-full flex-shrink-0`

### Image Classes
- **Image**: `h-full w-full object-cover`
- **Caption Container**: `absolute inset-x-0 bottom-0 bg-black/50 p-2 text-white md:p-4`
- **Caption Text**: `text-8xl font-semibold`

### Navigation Classes
- **Chevron Buttons**: `absolute top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-800 shadow-md hover:bg-white focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:outline-none`
- **Previous Button**: `left-2 md:left-4 md:p-2`
- **Next Button**: `right-2 md:right-4 md:p-2`

### Indicator Classes
- **Indicators Container**: `absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1.5 md:bottom-4 md:space-x-2`
- **Indicator Button**: `h-1 w-4 rounded transition-colors md:w-12`
- **Active Indicator**: `bg-gray-800`
- **Inactive Indicator**: `bg-gray-200`

### Responsive Breakpoints
- **Mobile**: Smaller buttons and indicators
- **Desktop** (`md:`): Larger navigation elements and spacing

## Functionality

### AlpineJS Data Properties
- **currentIndex**: Current slide position (accounts for cloned slides)
- **displayIndex**: Visual indicator position (0-based)
- **isTransitioning**: Prevents multiple simultaneous transitions
- **itemCount**: Total number of slides

### Methods
- **next()**: Advance to next slide
- **prev()**: Go to previous slide  
- **goTo(index)**: Jump to specific slide
- **startAutoplay()**: Begin 5-second autoplay timer
- **stopAutoplay()**: Pause autoplay
- **handleTransitionEnd()**: Reset position for infinite scroll

### Event Handling
- **Mouse hover**: Pauses autoplay
- **Touch events**: Pauses autoplay
- **Transition end**: Handles infinite scroll reset

## Screenshot

*[Placeholder for Carousel component screenshot showing slide navigation and controls]*

## Files

- `Carousel.astro` - Main component with AlpineJS integration
- `carousel.graphql` - GraphQL fragment for component data

## Implementation Notes

- Uses cloned slides for seamless infinite scrolling
- Currently configured to work with image assets from the CMS
- Includes accessibility features (aria-labels, focus management)
- Smooth 500ms transitions with ease-in-out timing
- Autoplay automatically stops/starts based on user interaction
- Responsive design with different sizing for mobile/desktop
- Currently uses placeholder content for captions ("#todo")
- Full-width and full-height design for maximum visual impact