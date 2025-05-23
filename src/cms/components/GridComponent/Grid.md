# Grid Component

## Description

The Grid component is a flexible layout system that displays content items in either a standard grid layout or a Bento-style layout. It allows content editors to organize multiple components in responsive grid patterns with customizable column configurations across different device sizes.

The component supports two distinct layout modes:
- **Standard Grid**: A uniform grid with customizable columns per device breakpoint
- **Bento Grid**: A dynamic masonry-style layout with varying card sizes based on the number of items

## Usage

The Grid component is used through the Optimizely CMS interface and automatically renders based on the content structure and selected display template.

### Component Structure

```typescript
interface GridProps {
  data: GridFragment;
  displaySettings: DisplaySettingsFragment[];
  displayTemplateKey: string;
  contentPayload: ContentPayload;
}
```

### Content Fields

- **RichText**: Optional header text/HTML content displayed above the grid
- **Items**: Collection of content components to display in the grid layout

### GraphQL Fragment

```graphql
fragment Grid on Grid {
    RichText {
        html
    }
    Items {
        _metadata {
            types
        }
        ...AllComponentsExceptGrid
    }
}
```

### Layout Selection

The layout is automatically determined by the `displayTemplateKey`:
- `GridBentoStyles`: Renders the Bento layout
- `GridStyles` (default): Renders the standard grid layout

## Styles

### Standard Grid Styles (`GridStyles`)

The standard grid provides responsive column configuration options:

#### Desktop Columns (`columnsOnDesktop`)
- **1 Column**: `lg:grid-cols-1`
- **2 Columns**: `lg:grid-cols-2` 
- **3 Columns**: `lg:grid-cols-3` (default)
- **4 Columns**: `lg:grid-cols-4`

#### Tablet Columns (`columnsOnTablet`)
- **1 Column**: `md:grid-cols-1`
- **2 Columns**: `md:grid-cols-2` (default)
- **3 Columns**: `md:grid-cols-3`
- **4 Columns**: `md:grid-cols-4`

#### Mobile Columns (`columnsOnMobile`)
- **1 Column**: `grid-cols-1` (default)
- **2 Columns**: `grid-cols-2`
- **3 Columns**: `grid-cols-3`
- **4 Columns**: `grid-cols-4`

### Bento Grid Styles (`GridBentoStyles`)

The Bento layout uses dynamic patterns based on the number of items:

#### Layout Patterns
- **1 item**: Full width (12 columns)
- **2 items**: Large left (8 cols), small right (4 cols)
- **3 items**: 2-row layout (8, 4, 12)
- **4 items**: Mixed 2-row (8, 4, 5, 7)
- **5+ items**: Complex patterns with varying card sizes

#### Visual Styling
- **Container**: `max-w-7xl mx-auto grid grid-cols-12 gap-6`
- **Cards**: `bg-white rounded-3xl p-6 overflow-hidden relative shadow-lg border border-slate-100`
- **Background**: `bg-gray-100 p-6 text-gray-800`

### CSS Classes

The component uses TailwindCSS classes for responsive grid layouts:

```typescript
// Column span classes for responsive breakpoints
md:col-span-{1-12}  // Tablet and up
col-span-{1-12}     // Mobile
lg:grid-cols-{1-4}  // Desktop columns
md:grid-cols-{1-4}  // Tablet columns
grid-cols-{1-4}     // Mobile columns
```

## Screenshot

*[Placeholder for Grid component screenshot showing both standard and Bento layouts]*

## Files

- `Grid.astro` - Main component that routes to Standard or Bento layouts
- `GridStandard.astro` - Standard responsive grid implementation
- `GridBento.astro` - Bento masonry-style grid implementation
- `GridStyles.ts` - Style conversion utilities for standard grid
- `GridBentoHelper.ts` - Layout pattern utilities for Bento grid
- `grid.graphql` - GraphQL fragment for data fetching
- `GridStyles.opti-style.json` - CMS style configuration for standard grid
- `GridBentoStyles.opti-style.json` - CMS style configuration for Bento grid

## Implementation Notes

- The component automatically prevents infinite nesting by excluding Grid components from the `AllComponentsExceptGrid` fragment
- Bento layout patterns are predefined for up to 12 items, with a repeating pattern for larger collections
- Both layouts are fully responsive and work with any child component type
- The standard grid uses CSS Grid with gap spacing, while Bento uses a 12-column layout system