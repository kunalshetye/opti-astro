# CallToAction Component

## Description

The CallToAction component renders a collection of action buttons that encourage user interaction. It displays multiple links as styled buttons in a horizontal layout, perfect for driving user engagement and conversions.

## Usage

The component is used to present primary actions such as "Sign Up", "Learn More", "Contact Us", or other conversion-focused buttons on pages.

### Component Structure

```typescript
interface CallToActionProps {
  data: CallToActionFragment;
  displaySettings: DisplaySettingsFragment[];
  contentPayload: ContentPayload;
}
```

### Content Fields

- **Links**: Collection of link objects containing:
  - **text**: Button label text
  - **url**: Target URL for the button

### GraphQL Fragment

```graphql
fragment CallToAction on CallToAction {
    Links {
        text
        url {
            default
        }
    }
}
```

## Styles

### Layout Classes
- **Container**: `m-4 flex gap-4`
- **Button**: `btn btn-neutral btn-lg`

### Design Features
- Horizontal flex layout with consistent spacing
- Large button size (`btn-lg`) for prominent call-to-action
- Neutral button styling for professional appearance
- Responsive gap spacing between multiple buttons

### Button States
The component uses DaisyUI button classes:
- `btn`: Base button styling
- `btn-neutral`: Neutral color scheme
- `btn-lg`: Large button size for emphasis

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