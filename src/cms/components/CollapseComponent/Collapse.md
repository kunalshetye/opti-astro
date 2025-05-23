# Collapse Component

## Description

The Collapse component creates an expandable/collapsible content section using DaisyUI's collapse component. It displays a heading that users can click to reveal or hide additional content, perfect for FAQs, detailed descriptions, or space-saving content organization.

## Usage

The component is ideal for creating accordion-style interfaces, FAQ sections, or any content that benefits from progressive disclosure.

### Component Structure

```typescript
interface CollapseProps {
  data: CollapseFragment;
  displaySettings: DisplaySettingsFragment[];
  contentPayload: ContentPayload;
}
```

### Content Fields

- **Heading**: Clickable title text that toggles the collapse state
- **Body**: Rich text content (HTML) that expands/collapses

### GraphQL Fragment

```graphql
fragment Collapse on Collapse {
    Heading
    Body {
        html
    }
}
```

## Styles

### Layout Classes
- **Container**: `collapse-plus bg-base-100 border-base-300 collapse border`
- **Checkbox Input**: `peer` (hidden checkbox for state management)
- **Title**: `collapse-title font-semibold`
- **Content**: `collapse-content text-sm`

### Design Features
- Uses DaisyUI collapse component with plus icon
- Light background (`bg-base-100`) with subtle border
- Bold title text with smaller body content
- Smooth expand/collapse animations
- Native checkbox-based state management

## Screenshot

*[Placeholder for Collapse component screenshot showing expanded and collapsed states]*

## Files

- `Collapse.astro` - Main component implementation
- `collapse.graphql` - GraphQL fragment for component data

## Implementation Notes

- Uses native HTML checkbox for state management (no JavaScript required)
- DaisyUI handles all styling and animations
- Supports rich HTML content in the body
- Fully accessible with keyboard navigation
- Mobile-friendly touch interactions