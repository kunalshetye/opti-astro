# Edge-to-Edge Layout Guide

Complete guide to creating full-width, edge-to-edge layouts that span the complete viewport width without any padding or margins.

## Overview

The edge-to-edge system removes all padding and width constraints at multiple levels (Section, Row, Column, and Component) to create truly full-width layouts. This is perfect for:

- Full-width hero images and videos
- Edge-to-edge carousels and galleries
- Full-bleed background sections
- Magazine-style layouts
- Immersive visual experiences

## Understanding the Layout Hierarchy

Content in the CMS follows this nesting structure:

```
Page
  └─ Section (adds padding: p-2 sm:p-3 md:p-4)
      └─ Row (adds padding: p-1)
          └─ Column (adds padding: p-2 sm:p-3 md:p-4)
              └─ Component (may have its own padding)
```

By default, **each level adds padding**, which prevents content from reaching the viewport edges. To achieve true edge-to-edge display, you need to **disable padding at all levels**.

## Edge-to-Edge Options

### Section Level

**Width Setting**:
- **Edge to Edge (no padding)** - Removes all padding and width constraints from the section wrapper

### Row Level

**Horizontal Padding Setting**:
- **None (Edge to Edge)** - Removes horizontal padding from the row

### Column Level

**Width Setting**:
- **Edge to Edge (no constraints)** - `w-full max-w-full` - No width restrictions

**Padding Setting**:
- **None (Edge to Edge)** - Removes all padding from the column

### Component Level (for Components Used as Sections)

**Container Padding Setting**:
- **None (Edge to Edge)** - Removes padding from the section wrapper when component is used directly as a section

**Supported Components**:
- Hero
- CallToAction
- Image
- Video
- Carousel
- Grid (GridStyles and GridBentoStyles)

## Setup Methods

### Method 1: Traditional Section/Row/Column Structure

For pages using the traditional three-level structure:

**Step 1 - Section Settings**:
- Width → **Edge to Edge (no padding)**

**Step 2 - Row Settings**:
- Horizontal Padding → **None (Edge to Edge)**

**Step 3 - Column Settings**:
- Width → **Edge to Edge (no constraints)**
- Padding → **None (Edge to Edge)**

**Result**: Content inside the column will span the complete viewport width.

### Method 2: Component as Section (Simpler)

When using a component directly at the section level (without rows/columns):

**Step 1 - Component Settings**:
- Container Padding → **None (Edge to Edge)**

**Result**: The component will span the complete viewport width.

> **💡 Tip**: This is the simplest method for single full-width components like heroes, carousels, or images.

## Common Use Cases

### 1. Full-Width Hero Image

**Setup**: Use Method 2 (Component as Section)

**Component**: Hero or Image
- Container Padding → **None (Edge to Edge)**
- Hero Height → Choose your desired height
- Image Fit → **Cover** (for full bleed)

**Result**: Hero image fills the entire viewport width

---

### 2. Full-Width Carousel

**Setup**: Use Method 2 (Component as Section)

**Component**: Carousel
- Container Padding → **None (Edge to Edge)**

**Result**: Carousel slides extend edge-to-edge

---

### 3. Full-Width Video Background

**Setup**: Use Method 2 (Component as Section)

**Component**: Video
- Container Padding → **None (Edge to Edge)**
- Autoplay → Enable
- Loop → Enable
- Muted → Enable (required for autoplay)

**Result**: Video fills entire viewport as background

---

### 4. Split Screen Layout (Full-Width)

**Setup**: Use Method 1 (Section/Row/Column)

**Section Settings**:
- Width → **Edge to Edge (no padding)**

**Row Settings**:
- Horizontal Padding → **None (Edge to Edge)**
- Gap → **None** (for seamless split)
- Show as Row From → **Medium**

**Column Settings** (both columns):
- Width → **Edge to Edge (no constraints)**
- Padding → **None (Edge to Edge)**
- Grid Span → **6 Columns** (50/50 split)

**Result**: Two columns splitting the viewport perfectly in half with no gap

---

### 5. Alternating Full-Width Sections

**Setup**: Multiple sections, each using Method 2

**Section 1** - Hero (full-width):
- Container Padding → **None (Edge to Edge)**

**Section 2** - Text Content (constrained):
- Width → **Default** (keeps standard container)

**Section 3** - Image (full-width):
- Container Padding → **None (Edge to Edge)**

**Result**: Alternating full-width and constrained content sections

---

### 6. Full-Width Grid with Edge-to-Edge Images

**Setup**: Use Method 1 with Grid Component in column

**Section Settings**:
- Width → **Edge to Edge (no padding)**

**Row Settings**:
- Horizontal Padding → **None (Edge to Edge)**

**Column Settings**:
- Width → **Edge to Edge (no constraints)**
- Padding → **None (Edge to Edge)**
- Grid Span → **12 Columns**

**Component**: Grid
- Grid Columns → **3 or 4 columns**
- Gap → **None** (for seamless grid)

**Result**: Image grid fills viewport edge-to-edge with no gaps

## Best Practices

### Do's ✅

- **Use Method 2 for single components** - It's simpler and cleaner
- **Use Method 1 for complex layouts** - Multiple columns, grids, or nested content
- **Test on mobile devices** - Edge-to-edge can look different on small screens
- **Consider adding internal padding to text content** - Use Content Spacing in columns for readability
- **Use background colors strategically** - Full-width colored sections can create visual interest

### Don'ts ❌

- **Don't mix methods unnecessarily** - Choose one approach per section
- **Don't remove padding from text-heavy content** - Long lines are hard to read
- **Don't forget about mobile** - Very wide images may not look good on small screens
- **Don't override with custom CSS** - Use the CMS settings for consistency

## Combining with Other Features

### Edge-to-Edge + Background Colors

Create full-width colored sections:

**Section Settings**:
- Width → **Edge to Edge (no padding)**
- Background Color → **Primary** (or any theme color)

**Row Settings**:
- Horizontal Padding → **Default** (keeps some breathing room)
- Background Color → **Transparent**

**Result**: Full-width colored background with content inset slightly

---

### Edge-to-Edge + Vertical Spacing

Control spacing above/below full-width sections:

**Section Settings**:
- Width → **Edge to Edge (no padding)**
- Vertical Spacing → **Large** (adds margin above/below)

**Result**: Full-width content with vertical spacing

---

### Edge-to-Edge + Content Alignment

Center content within a full-width container:

**Row Settings**:
- Horizontal Padding → **None (Edge to Edge)**
- Horizontal Alignment → **Center**

**Column Settings**:
- Width → **Narrow** (max-w-3xl)
- Padding → **Default**
- Grid Span → **12 Columns**

**Result**: Narrow centered content within a full-width section

## Troubleshooting

### Content Still Has Padding

**Problem**: Content doesn't reach viewport edges

**Solutions**:
1. Check all three levels (Section/Row/Column) - each must be set to edge-to-edge
2. For components as sections, verify **Container Padding** is set to **None**
3. Check if the component itself has internal padding (some components may)
4. Verify you're not in the Visual Builder preview mode (which adds borders)

---

### Content Too Wide on Mobile

**Problem**: Edge-to-edge looks bad on small screens

**Solutions**:
1. Use **Show on** setting to hide the edge-to-edge version on mobile
2. Create a mobile-specific version with normal padding
3. Consider using responsive breakpoints in Row settings
4. Add a duplicate section with standard padding for mobile

---

### Text is Unreadable

**Problem**: Text extends too wide without padding

**Solutions**:
1. Don't use edge-to-edge for text-heavy content
2. Use **Content Spacing** in columns to add internal padding
3. Consider using a **Narrow** width column for text
4. Wrap text content in a container with padding

---

### Components Not Full-Width

**Problem**: Component used as section still has padding

**Solutions**:
1. Verify the component supports **Container Padding** setting
2. Supported components: Hero, CTA, Image, Video, Carousel, Grid
3. For unsupported components, use Method 1 (Section/Row/Column structure)

## Technical Details

### CSS Classes Applied

When edge-to-edge is enabled, the system removes padding classes and applies width classes:

**Section**:
- Removes: `p-2 sm:p-3 md:p-4`
- Adds: `w-full max-w-full`

**Row**:
- Removes: `p-1`

**Column**:
- Removes: `p-2 sm:p-3 md:p-4`
- Adds: `w-full max-w-full` (for Edge to Edge width option)

### Centralized Style Helper

The edge-to-edge logic is centralized in the style helper library:

```typescript
import { isEdgeToEdgeMode, getContainerPaddingClasses } from '@/cms/shared/styleHelpers';

// Checks if edge-to-edge is enabled
const isEdgeToEdge = isEdgeToEdgeMode(dictionary);

// Returns padding classes or empty string
const paddingClasses = getContainerPaddingClasses(dictionary);
```

This helper checks multiple setting keys:
- `gridWidth === 'edgeToEdge'` (Sections)
- `containerPadding === 'none'` (Components)
- `containerWidth === 'edgeToEdge'` (Alternative naming)

## Related Documentation

- **[Row & Column Layout Guide](ROW-COLUMN-LAYOUT-GUIDE.md)** - Complete layout system documentation
- **[Component Styling Guide](COMPONENT-STYLING-GUIDE.md)** - Component styling implementation
- **[Style Standards Reference](STYLE-STANDARDS.md)** - All standardized style values

## Examples

### Full-Width Hero with Centered Content

```
Section
├─ Width: Edge to Edge (no padding)
└─ Row
    ├─ Horizontal Padding: None
    ├─ Horizontal Alignment: Center
    └─ Column
        ├─ Width: Narrow (max-w-3xl)
        ├─ Padding: Default
        ├─ Grid Span: 12 Columns
        └─ Hero Component
            ├─ Background Image: [your image]
            └─ Text: [your content]
```

**Result**: Full-width hero image with narrow centered text overlay

---

### Edge-to-Edge Image Gallery

```
Section
├─ Width: Edge to Edge (no padding)
└─ Row
    ├─ Horizontal Padding: None
    ├─ Gap: None
    └─ Column
        ├─ Width: Edge to Edge
        ├─ Padding: None
        ├─ Grid Span: 12 Columns
        └─ Grid Component
            ├─ Grid Columns: 4 Columns
            ├─ Gap: None
            └─ Images: [multiple images]
```

**Result**: Seamless image grid filling entire viewport

---

### Simple Full-Width Carousel

```
Component: Carousel (used as section)
└─ Container Padding: None (Edge to Edge)
```

**Result**: Full-width carousel with simple one-step setup

## Summary

Edge-to-edge layouts provide maximum visual impact by using the complete viewport width. Choose:

- **Method 1** for complex multi-column layouts
- **Method 2** for simple single-component sections

Always test on multiple screen sizes and consider readability when applying edge-to-edge to text content.
