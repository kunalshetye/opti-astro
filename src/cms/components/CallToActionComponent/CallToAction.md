# CallToAction Component

## Description

The CallToAction component renders a collection of action buttons that encourage user interaction. It displays multiple links as styled buttons in a horizontal layout, perfect for driving user engagement and conversions.

## Usage

The component is used to present primary actions such as "Sign Up", "Learn More", "Contact Us", or other conversion-focused buttons on pages.

### Content Fields

- **Links**: Collection of link objects containing:
  - **text**: Button label text
  - **url**: Target URL for the button

## Styles

No Visual Builder style options are currently configured for the CallToAction component.

## Screenshot

*[Placeholder for CallToAction component screenshot showing button layout]*

## Files

- `CallToAction.astro` - Main component implementation
- `callToAction.graphql` - GraphQL fragment for component data

## Implementation Notes

- Supports multiple action buttons in a single component
- Uses DaisyUI button components for consistent styling
- Handles empty or missing links gracefully
- Simple and focused implementation for maximum conversion impact
- Responsive design works well on all device sizes