# Card Component

## Description

The Card component is a versatile content display component that combines images, text content, and call-to-action buttons in various layout configurations. It supports four different display modes for flexible content presentation.

## Usage

The Card component is ideal for feature highlights, product showcases, service descriptions, or any content that benefits from a visual + textual presentation.

### Component Structure

```typescript
interface CardProps {
  data: CardFragment;
  displaySettings: DisplaySettingsFragment[];
  displayTemplateKey: string;
  contentPayload: ContentPayload;
}
```

### Content Fields

- **DisplayAs**: Layout configuration (`textOnRight`, `textOnLeft`, `textAboveCard`, `textBelowCard`)
- **Heading**: Main title text (displayed as large, bold text)
- **SubHeading**: Secondary subtitle text
- **Body**: Rich text content (HTML)
- **Asset**: Image or media asset
- **Links**: Collection of call-to-action buttons

### GraphQL Fragment

```graphql
fragment Card on Card {
    DisplayAs
    Heading
    SubHeading
    Body {
        html
    }
    Asset {
        url {
            default
        }
    }
    Links {
        text
        url {
            default
        }
    }
}
```

## Styles

### Layout Configurations

#### Text on Right (`textOnRight`)
- **Container**: `mx-auto max-w-7xl grid gap-8 rounded-xl md:grid-cols-2 md:gap-12 lg:gap-20`
- **Order**: Asset first, then Content
- **Content**: `col-span-1 content-center`
- **Actions**: `z-20 mt-8 flex gap-2`

#### Text on Left (`textOnLeft`)
- **Container**: Same as textOnRight
- **Order**: Content first, then Asset
- **Content**: `col-span-1 content-center`
- **Actions**: `z-20 mt-8 flex gap-2`

#### Text Above Card (`textAboveCard`)
- **Container**: `mx-auto max-w-7xl grid gap-8 rounded-xl md:grid-cols-1 md:gap-12 lg:gap-20`
- **Order**: Content first, then Asset
- **Content**: `col-span-1 text-center`
- **Actions**: `z-20 mt-8 flex justify-center gap-2`

#### Text Below Card (`textBelowCard`)
- **Container**: Same as textAboveCard
- **Order**: Asset first, then Content
- **Content**: `col-span-1 text-center`
- **Actions**: `z-20 mt-8 flex justify-center gap-2`

### Typography Classes
- **Heading**: `text-4xl font-bold`
- **SubHeading**: `text-sm font-semibold`
- **Body**: Inherits rich text styling

### Asset Classes
- **Container**: `relative mx-auto max-w-4xl`
- **Image**: `relative content-center rounded-xl border border-transparent object-cover`

### Button Classes
- **Primary Button** (first link): `btn btn-lg btn-wide btn-soft btn-primary`
- **Secondary Button** (additional links): `btn btn-lg btn-wide btn-soft btn-secondary`

## Screenshot

*[Placeholder for Card component screenshot showing different layout configurations]*

## Files

- `Card.astro` - Main component that handles layout switching
- `Wrapper.astro` - Container component that applies layout-specific CSS classes
- `Content.astro` - Text content and call-to-action rendering
- `Asset.astro` - Image/media asset rendering
- `card.graphql` - GraphQL fragment for component data

## Implementation Notes

- Responsive design with different layouts for mobile and desktop
- Smart button styling (primary vs secondary based on order)
- Handles missing assets gracefully
- Uses CSS Grid for flexible layouts
- Supports rich text content with HTML rendering
- Fixed image dimensions (1075x700) with lazy loading
- All layouts are contained within max-width containers for readability