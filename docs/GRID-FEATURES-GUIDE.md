# Advanced CSS Grid Features Guide

This guide covers advanced CSS Grid features available in the Optimizely CMS layout system. These features are intended for advanced users who need precise control over complex layouts.

> **Note:** For basic grid layouts and common patterns, see **ROW-COLUMN-LAYOUT-GUIDE.md**

## Overview

The grid system now supports advanced CSS Grid features including:
- Explicit grid placement (column/row start/end positions)
- Named grid areas
- Multi-row layouts
- Complex overlapping layouts
- Precise positioning

## Explicit Grid Placement

### Grid Column Placement

Instead of using Grid Span (which spans X columns from the current position), you can specify exact start and end positions within the 12-column grid.

**Column Settings:**
- **Grid Column Start**: 1-13 (which grid line the column starts at)
- **Grid Column End**: 1-13 (which grid line the column ends at)

**How Grid Lines Work:**
A 12-column grid has 13 grid lines (lines 1-13):
```
Line:  1   2   3   4   5   6   7   8   9   10  11  12  13
Col:    |1| |2| |3| |4| |5| |6| |7| |8| |9| |10||11||12|
```

**Example 1: Centered Content with Gaps**
Create a centered column that leaves empty space on both sides:

**Row Settings:**
- Column Layout: **12-Column Grid (Flexible)**

**Column Settings:**
- Grid Column Start: **3**
- Grid Column End: **11**

Result: Column spans from line 3 to line 11 (columns 3-10 = 8 columns wide), leaving 2 columns empty on each side.

**Example 2: Asymmetric Layout with Intentional Gap**
Create two columns with a gap in the middle:

**Column 1:**
- Grid Column Start: **1**
- Grid Column End: **5** (spans columns 1-4)

**Column 2:**
- Grid Column Start: **7**
- Grid Column End: **13** (spans columns 7-12)

Result: Two columns with a 2-column gap in between (columns 5-6 are empty).

### Grid Row Placement

For multi-row layouts, you can control which rows a column spans:

**Column Settings:**
- **Grid Row Start**: 1-5 (which grid row the column starts at)
- **Grid Row End**: 1-5 (which grid row the column ends at)

**Example: Sidebar Spanning Multiple Rows**

**Row Settings:**
- Column Layout: **12-Column Grid (Flexible)**

**Main Content (spans 2 rows):**
- Grid Column Start: **1**
- Grid Column End: **9** (columns 1-8)
- Grid Row Start: **1**
- Grid Row End: **3** (spans rows 1-2)

**Sidebar:**
- Grid Column Start: **9**
- Grid Column End: **13** (columns 9-12)
- Grid Row Start: **1**
- Grid Row End: **2** (row 1 only)

**Second Row Content:**
- Grid Column Start: **9**
- Grid Column End: **13** (columns 9-12)
- Grid Row Start: **2**
- Grid Row End: **3** (row 2 only)

Result: Main content on the left spanning 2 rows, sidebar on the right split into 2 sections.

## Named Grid Areas

Named grid areas provide a semantic way to define complex layouts using template areas.

### Available Grid Area Names

- **header**: Top section
- **sidebar**: Side navigation or auxiliary content
- **content**: Main content area
- **footer**: Bottom section

### How to Use Grid Areas

**Step 1: Define Grid Template Areas (Advanced - Not Yet Implemented in CMS UI)**

Currently, grid template areas would need to be defined in code. A future enhancement could add this to the Row settings in the CMS.

**Step 2: Assign Columns to Grid Areas**

**Column Settings:**
- **Grid Area Name**: Choose from header, sidebar, content, footer

**Example Layout:**
```
+------------------+
|      header      |
+-----+------------+
| sb  |  content   |
| ar  |            |
+-----+------------+
|      footer      |
+------------------+
```

**Header Column:**
- Grid Area Name: **header**

**Sidebar Column:**
- Grid Area Name: **sidebar**

**Content Column:**
- Grid Area Name: **content**

**Footer Column:**
- Grid Area Name: **footer**

> **Note:** Grid template areas feature requires additional Row configuration. Contact your developer to set up custom grid template areas.

## Complex Layout Examples

### Example 1: Magazine Layout

**Objective:** Create a magazine-style layout with a large feature image and smaller article excerpts.

**Row Settings:**
- Column Layout: **12-Column Grid (Flexible)**
- Column Gap: **Medium**
- Row Gap: **Medium**

**Feature Image Column:**
- Grid Column Start: **1**
- Grid Column End: **9** (spans columns 1-8, 67% width)
- Grid Row Start: **1**
- Grid Row End: **3** (spans 2 rows)

**Article 1 Column:**
- Grid Column Start: **9**
- Grid Column End: **13** (spans columns 9-12, 33% width)
- Grid Row Start: **1**
- Grid Row End: **2** (row 1)

**Article 2 Column:**
- Grid Column Start: **9**
- Grid Column End: **13**
- Grid Row Start: **2**
- Grid Row End: **3** (row 2)

**Article 3 Column:**
- Grid Column Start: **1**
- Grid Column End: **5** (spans columns 1-4)
- Grid Row Start: **3**
- Grid Row End: **4** (row 3)

**Article 4 Column:**
- Grid Column Start: **5**
- Grid Column End: **9**
- Grid Row Start: **3**
- Grid Row End: **4**

**Article 5 Column:**
- Grid Column Start: **9**
- Grid Column End: **13**
- Grid Row Start: **3**
- Grid Row End: **4**

### Example 2: Dashboard Layout

**Objective:** Create a dashboard with header, sidebar, main content, and widgets.

**Row Settings:**
- Column Layout: **12-Column Grid (Flexible)**
- Column Gap: **Large**
- Row Gap: **Large**

**Header (full width):**
- Grid Column Start: **1**
- Grid Column End: **13** (full width)
- Grid Row Start: **1**
- Grid Row End: **2**

**Sidebar:**
- Grid Column Start: **1**
- Grid Column End: **4** (3 columns)
- Grid Row Start: **2**
- Grid Row End: **4** (spans 2 rows)

**Main Content:**
- Grid Column Start: **4**
- Grid Column End: **10** (6 columns)
- Grid Row Start: **2**
- Grid Row End: **3**

**Widget 1:**
- Grid Column Start: **10**
- Grid Column End: **13** (3 columns)
- Grid Row Start: **2**
- Grid Row End: **3**

**Widget 2:**
- Grid Column Start: **4**
- Grid Column End: **7**
- Grid Row Start: **3**
- Grid Row End: **4**

**Widget 3:**
- Grid Column Start: **7**
- Grid Column End: **10**
- Grid Row Start: **3**
- Grid Row End: **4**

**Widget 4:**
- Grid Column Start: **10**
- Grid Column End: **13**
- Grid Row Start: **3**
- Grid Row End: **4**

### Example 3: Overlapping Hero Section

**Objective:** Create a hero section with overlapping text card over background image.

**Row Settings:**
- Column Layout: **12-Column Grid (Flexible)**
- Row Gap: **None**
- Column Gap: **None**

**Background Image:**
- Grid Column Start: **1**
- Grid Column End: **13** (full width)
- Grid Row Start: **1**
- Grid Row End: **2**

**Text Card (overlapping):**
- Grid Column Start: **3**
- Grid Column End: **7** (4 columns, 33% width)
- Grid Row Start: **1**
- Grid Row End: **2** (same row as image = overlapping)
- Background Color: **White** or **Primary**
- Content Spacing: **Large** (for padding)

> **Note:** For overlapping to work properly, the overlapping column should have a background color and may need CSS z-index adjustments (contact developer).

## Responsive Considerations

### Mobile Behavior

All advanced grid placement (start/end positions) only applies at **medium breakpoints and above (768px+)**.

On mobile (< 768px), all columns stack vertically regardless of grid placement settings.

### Responsive Column Overrides

When using explicit placement, consider how responsive column overrides interact:

- **Mobile Columns**: Overrides column count at small screens (640px+)
- **Tablet Columns**: Overrides column count at medium screens (768px+)
- **Desktop Columns**: Overrides column count at large screens (1024px+)

**Important:** If you set responsive column overrides (e.g., "Tablet Columns: 6"), your explicit placement values (e.g., Grid Column Start/End) may not work as expected because the grid now has 6 columns instead of 12.

**Best Practice:** Use explicit placement with the default 12-column grid, or ensure your start/end values work with the overridden column count.

## Limitations & Constraints

### Current Limitations

1. **Grid Template Areas**: Not yet exposed in CMS UI (requires code configuration)
2. **Max 5 Rows**: Grid row start/end limited to 1-5
3. **Max 12 Columns**: Grid column start/end limited to 1-13 (12-column grid)
4. **No Gap Per Column**: Row gap and column gap apply to entire grid, not individual columns
5. **Z-Index Control**: Overlapping requires manual CSS z-index (contact developer)

### Best Practices

1. **Start Simple**: Use basic Grid Span before moving to explicit placement
2. **Test Responsive**: Always test on mobile/tablet/desktop
3. **Document Complex Layouts**: Add comments in CMS for future editors
4. **Avoid Over-Complexity**: Simpler layouts are easier to maintain
5. **Use Preset Layouts First**: Only use explicit placement when necessary

### When to Use Advanced Features

**Use Explicit Placement When:**
- You need intentional gaps in the grid
- You need asymmetric layouts
- You need to offset content from grid edges
- You need precise multi-row layouts
- You need overlapping content (with developer support)

**Don't Use Explicit Placement When:**
- Simple equal columns work (use preset layouts)
- You just need custom widths (use 12-Column Grid + Grid Span)
- Layout is simple and responsive (use preset layouts + responsive overrides)

## Troubleshooting Advanced Features

### Columns Overlapping Unintentionally

**Cause:** Start/end positions overlap for multiple columns in the same row.

**Solution:**
- Check all Grid Column Start/End values
- Ensure columns don't overlap (unless intentional)
- Use grid visualization tool (browser dev tools) to debug

### Columns Not Appearing

**Cause:** Start/end values are invalid (start >= end).

**Solution:**
- Ensure Grid Column Start < Grid Column End
- Ensure Grid Row Start < Grid Row End
- Check that values are within range (1-13 for columns, 1-5 for rows)

### Layout Breaks on Tablet

**Cause:** Responsive column overrides changed grid column count, but explicit placement assumes 12 columns.

**Solution:**
- Remove responsive column overrides when using explicit placement
- OR adjust start/end values to work with overridden column count
- OR use separate rows for tablet layouts

### Gaps Not Where Expected

**Cause:** Row gap and column gap apply uniformly to all gaps.

**Solution:**
- Use explicit placement to create intentional empty cells
- Adjust column start/end to leave gaps
- Consider using multiple rows with different gap settings

## Developer Notes

For developers extending this system:

### Adding Custom Grid Template Areas

Grid template areas can be added by extending `RowHelper.ts`:

```typescript
// Example: Add custom grid template area
const gridTemplateAreas = dictionary['gridTemplateAreas'];
if (gridTemplateAreas === 'header-sidebar-content') {
  cssClasses.push('[grid-template-areas:"header_header_header"_"sidebar_content_content"_"footer_footer_footer"]');
}
```

### Custom Z-Index for Overlapping

For overlapping layouts, add custom CSS or extend `ColumnHelper.ts`:

```typescript
// Example: Add z-index control
const zIndex = dictionary['zIndex'];
if (zIndex) {
  cssClasses.push(`z-${zIndex}`);
}
```

### Additional Grid Features

CSS Grid supports many more features that could be exposed:
- `grid-auto-flow`: Control auto-placement algorithm
- `grid-auto-rows`: Control implicit row sizes
- `minmax()`: Flexible track sizing
- `repeat(auto-fill, ...)`: Responsive without media queries
- `subgrid`: Nested grid alignment (limited browser support)

## Resources

- **CSS Grid Complete Guide**: https://css-tricks.com/snippets/css/complete-guide-grid/
- **MDN CSS Grid Layout**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
- **Grid by Example**: https://gridbyexample.com/
- **TailwindCSS Grid Docs**: https://tailwindcss.com/docs/grid-template-columns

## See Also

- **ROW-COLUMN-LAYOUT-GUIDE.md**: Basic grid layouts and common patterns
- **Style Creation Guide**: How to create custom opti-style.json files
- **ContentType Creation Guide**: How to create custom content types
