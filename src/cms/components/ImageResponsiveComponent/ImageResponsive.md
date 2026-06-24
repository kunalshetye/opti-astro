# Image (Responsive) Component

## Description

The Image (Responsive) component allows for "art direction" by rendering different image files for different screen sizes (mobile, tablet, and desktop). This is ideal for optimizing user experience and performance by serving appropriately cropped or sized images based on the device's viewport. It uses the HTML `<picture>` element to achieve this.

## Usage

Use this component when you need to display different versions of an image on different devices. For example, a wide banner image on desktop can be swapped for a more tightly cropped, portrait-oriented version on mobile.

### Content Fields

- **Image**: The default image asset, used for desktop screens and as a fallback.
- **Image (Tablet)**: The image asset to display on tablet-sized screens (up to 1023px wide).
- **Image (Mobile)**: The image asset to display on mobile-sized screens (up to 767px wide).
- **AltText**: A single accessibility text description for the image, used across all versions.

## Styles

### Visual Builder Style Options

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

- `ImageResponsive.astro` - Main component implementation using the `<picture>` element.
- `ImageResponsive.opti-type.json` - CMS type definition for the component's properties.
- `ImageResponsiveStyling.ts` - Style configuration utilities.

## Implementation Notes

- Uses the semantic HTML `<picture>` element with `<source>` tags for responsive art direction.
- The final `<AstroImage>` inside the `<picture>` element serves as the default image and fallback for older browsers.
- Astro's built-in image optimization (`inferSize`) is applied to the default image.
- A single `alt` attribute is used for all image sources, ensuring accessibility.
- The component is fully integrated with the Optimizely CMS for content editing.