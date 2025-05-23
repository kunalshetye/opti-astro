# Carousel Component

## Description

The Carousel component creates an infinite-scrolling image carousel with autoplay functionality, navigation controls, and slide indicators. Built with AlpineJS for smooth client-side interactions, it supports touch gestures and responsive design.

## Usage

The Carousel component is perfect for image galleries, featured content showcases, product demonstrations, or any content that benefits from a slideshow presentation.

### Content Fields

- **Assets**: Collection of images or components to display in carousel slides

### Features

- **Infinite Scroll**: Seamless looping with cloned slides at beginning and end
- **Autoplay**: Automatically advances slides every 5 seconds
- **Navigation Controls**: Previous/next chevron buttons
- **Slide Indicators**: Clickable dots showing current position
- **Touch Support**: Pause autoplay on touch/hover interactions
- **Responsive Design**: Adapts to different screen sizes

## Styles

No Visual Builder style options are currently configured for the Carousel component.

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