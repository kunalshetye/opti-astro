# Grid Component

## Description

The Grid component is a flexible layout system that displays content items in either a standard grid layout or a Bento-style layout. It allows content editors to organize multiple components in responsive grid patterns with customizable column configurations across different device sizes.

The component supports two distinct layout modes:
- **Standard Grid**: A uniform grid with customizable columns per device breakpoint
- **Bento Grid**: A dynamic masonry-style layout with varying card sizes based on the number of items

## Usage

The Grid component is used through the Optimizely CMS interface and automatically renders based on the content structure and selected display template.

### Content Fields

- **RichText**: Optional header text/HTML content displayed above the grid
- **Items**: Collection of content components to display in the grid layout

### Layout Selection

The layout is automatically determined by the `displayTemplateKey`:
- `GridBentoStyles`: Renders the Bento layout
- `GridStyles` (default): Renders the standard grid layout

## Styles

### Visual Builder Style Options

#### Grid Default (`GridStyles`)
- **Columns on Desktop**: 1-4 columns (default: 3)
- **Columns on Tablet**: 1-4 columns (default: 2)
- **Columns on Mobile**: 1-4 columns (default: 1)

#### Grid Bento (`GridBentoStyles`)
- No configurable options - uses dynamic patterns based on item count

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