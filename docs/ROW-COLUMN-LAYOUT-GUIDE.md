# Row & Column Layout Guide

This guide explains how to use the Row and Column styling options in the Optimizely CMS to create flexible, responsive layouts.

## Overview

The layout system uses a combination of **Rows** and **Columns** to create responsive designs:
- **Rows** contain and organize columns horizontally
- **Columns** contain your content components (text, images, forms, etc.)

## Row Layout Options

### Show as Row From (Screen Width)
Controls when columns switch from vertical stacking to horizontal alignment:

- **Medium** (768px+): Default breakpoint - columns stack on mobile, align horizontally on tablet and up
- **Large** (1024px+): Columns stack on mobile and tablet, align horizontally on desktop
- **Extra Large** (1280px+): Columns stack until large desktop screens

### Vertical Alignment (Row Mode)
Controls how columns are vertically aligned when displayed horizontally:

- **Top**: Align columns to the top of the row
- **Center**: Center columns vertically within the row ✨ *Perfect for aligning text with forms*
- **Bottom**: Align columns to the bottom of the row
- **Stretch**: Make all columns the same height
- **Baseline**: Align columns along their text baseline

### Content Spacing
Controls the gap between columns:

- **None**: No gap between columns
- **Small**: 0.5rem gap (8px)
- **Medium**: 1rem gap (16px)
- **Large**: 1rem gap on mobile, 2rem on large screens
- **Extra Large**: 1rem gap on mobile, 6rem on large screens
- **Extra Extra Large**: 1rem gap on mobile, 18rem on large screens

### Width
Controls the maximum width of the row:

- **Inherit from section**: Use the section's width setting
- **Full width**: Stretch across entire viewport
- **Container (default)**: Responsive container with padding
- **7XL through Extra Small**: Fixed maximum widths from 20rem to 80rem

## Column Layout Options

### Grid Span (out of 12)
Controls how much horizontal space a column occupies:

- **Auto**: Flexible width based on content and available space
- **1-12 Columns**: Fixed width as fraction of 12-column grid
  - **6 Columns** = 50% width
  - **4 Columns** = 33% width
  - **3 Columns** = 25% width

### Content Spacing
Controls vertical spacing within the column:

- **None**: No internal spacing
- **Small**: 0.5rem gap and padding
- **Medium**: 1rem gap and padding
- **Large**: 2rem gap and padding
- **Extra Large**: 3rem gap and 6rem padding on large screens
- **Extra Extra Large**: 4rem gap and 18rem padding on large screens

## Common Layout Patterns

### 1. Text + Form Side by Side (Centered)
**Use Case**: Align introductory text with a signup form

**Row Settings**:
- Show as Row From: **Medium**
- Vertical Alignment: **Center**
- Content Spacing: **Medium**

**Column Settings**:
- Left Column (Text): Grid Span **6 Columns**
- Right Column (Form): Grid Span **6 Columns**

### 2. Hero Text with Call-to-Action
**Use Case**: Large headline with centered button below

**Row Settings**:
- Show as Row From: **Large**
- Vertical Alignment: **Center**
- Content Spacing: **Large**

**Column Settings**:
- Text Column: Grid Span **8 Columns**
- CTA Column: Grid Span **4 Columns**

### 3. Three Equal Cards
**Use Case**: Feature highlights or service offerings

**Row Settings**:
- Show as Row From: **Medium**
- Vertical Alignment: **Stretch** (equal heights)
- Content Spacing: **Medium**

**Column Settings**:
- All Columns: Grid Span **4 Columns**

### 4. Sidebar Layout
**Use Case**: Main content with sidebar

**Row Settings**:
- Show as Row From: **Large**
- Vertical Alignment: **Top**
- Content Spacing: **Large**

**Column Settings**:
- Main Content: Grid Span **8 Columns**
- Sidebar: Grid Span **4 Columns**

## Responsive Behavior

### Mobile-First Approach
All layouts start as single-column on mobile devices, then transition to multi-column based on your "Show as Row From" setting.

### Breakpoints
- **Mobile**: < 768px (always single column)
- **Medium**: 768px - 1023px
- **Large**: 1024px - 1279px
- **Extra Large**: 1280px+

### Alignment Timing
Vertical alignment only applies when columns are displayed horizontally. On mobile (single column), alignment has no effect.

## Best Practices

### Content Alignment
- Use **Center** vertical alignment when you want text and forms to align at their midpoints
- Use **Top** alignment for blog layouts or content-heavy sections
- Use **Stretch** for card layouts where equal heights look better

### Grid Spans
- **6 + 6 Columns**: Perfect 50/50 split
- **8 + 4 Columns**: Content with sidebar
- **4 + 4 + 4 Columns**: Three equal columns
- **Auto**: Let content determine width naturally

### Spacing
- Use **Medium** spacing for most layouts
- Use **Large** spacing for marketing pages with more breathing room
- Use **None** spacing for tightly packed content

### Width Control
- Use **Container** for most content (recommended)
- Use **Full width** for hero sections or backgrounds
- Use fixed widths (like **5XL**) for consistent content width

## Troubleshooting

### Columns Not Aligning Horizontally
- Check "Show as Row From" setting - it might be set too high
- Verify you're viewing at the correct screen size
- Ensure the row contains multiple columns

### Vertical Alignment Not Working
- Vertical alignment only works in row mode (horizontal layout)
- Check that "Show as Row From" breakpoint has been reached
- Some content types may have their own alignment that overrides row alignment

### Spacing Issues
- Row "Content Spacing" adds gaps between columns
- Column "Content Spacing" adds internal spacing within columns
- Both can be used together for optimal spacing

## Examples in Action

Visit your site at different screen sizes to see how these settings affect your layout:
- **Desktop**: See full row layout with chosen vertical alignment
- **Tablet**: May see row or column layout depending on "Show as Row From"
- **Mobile**: Always see single-column stacked layout

Remember: The CMS preview shows your desktop layout. Always test on actual devices or resize your browser to see responsive behavior.