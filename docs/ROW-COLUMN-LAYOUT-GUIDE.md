# Row & Column Layout Guide

This guide explains how to use the Row and Column styling options in the Optimizely CMS to create flexible, responsive layouts using CSS Grid.

## Overview

The layout system uses **CSS Grid** with a combination of **Rows** and **Columns** to create responsive designs:
- **Sections** provide the outer container (single-column grid)
- **Rows** define the grid layout and organize columns
- **Columns** span grid cells and contain your content components (text, images, forms, etc.)

## Row Layout Options

### Column Layout ⭐ NEW!
Choose from preset column layouts for easy setup:

- **12-Column Grid (Flexible)**: Full flexibility - columns can span 1-12 columns
- **1 Column**: Single column layout (stacks vertically)
- **2 Equal Columns**: Two columns of equal width (50% each)
- **3 Equal Columns**: Three columns of equal width (33% each)
- **4 Equal Columns**: Four columns of equal width (25% each)
- **6 Equal Columns**: Six columns of equal width (16.67% each)
- **Auto-Fit Responsive**: Automatically fits columns based on available space (minimum 250px per column)

*Tip: Use preset layouts (2/3/4/6 columns) for simple equal-width layouts. Use 12-Column Grid for custom widths.*

#### How the 12-Column Grid (Flexible) Works

The 12-Column Grid gives you **complete control** over column widths by letting you manually set how many columns each Column component spans.

**Step 1: Row Creates the Grid**

When you select "12-Column Grid (Flexible)" on a Row, it creates an invisible grid with 12 equal columns:

```
┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐
│1│2│3│4│5│6│7│8│9│10│11│12│
└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘
```

**Step 2: Each Column Chooses Its Span**

On each Column component, you set **"Grid Span"** to control how many of those 12 columns it occupies.

**Common Layouts:**

**50/50 Split (Two Equal Columns):**
- Column 1: Grid Span = "Span 6" (6/12 = 50%)
- Column 2: Grid Span = "Span 6" (6/12 = 50%)
```
┌─────────────┬─────────────┐
│  Column 1   │  Column 2   │
│  (Span 6)   │  (Span 6)   │
└─────────────┴─────────────┘
```

**67/33 Split (Content + Sidebar):**
- Column 1: Grid Span = "Span 8" (8/12 = 67%)
- Column 2: Grid Span = "Span 4" (4/12 = 33%)
```
┌───────────────────┬─────────┐
│    Column 1       │ Column 2│
│    (Span 8)       │(Span 4) │
└───────────────────┴─────────┘
```

**Three Equal Columns:**
- Column 1: Grid Span = "Span 4" (4/12 = 33%)
- Column 2: Grid Span = "Span 4" (4/12 = 33%)
- Column 3: Grid Span = "Span 4" (4/12 = 33%)
```
┌────────┬────────┬────────┐
│Column 1│Column 2│Column 3│
└────────┴────────┴────────┘
```

**Grid Span Reference:**

| Grid Span | Columns | Width | Common Use |
|-----------|---------|-------|------------|
| Span 1 | 1/12 | 8.33% | Tiny icon column |
| Span 2 | 2/12 | 16.67% | Small accent |
| Span 3 | 3/12 | 25% | Quarter (4-column layout) |
| Span 4 | 4/12 | 33.33% | Third (3-column layout) |
| Span 5 | 5/12 | 41.67% | Custom width |
| Span 6 | 6/12 | 50% | Half (2-column layout) |
| Span 7 | 7/12 | 58.33% | Custom width |
| Span 8 | 8/12 | 66.67% | Main content area |
| Span 9 | 9/12 | 75% | Large content |
| Span 10 | 10/12 | 83.33% | Very wide |
| Span 11 | 11/12 | 91.67% | Almost full |
| Span 12 | 12/12 | 100% | Full width |

**What If Columns Don't Add Up to 12?**

**Less than 12 (Empty Space):**
If your spans total less than 12 (e.g., 6 + 4 = 10), you'll have 2 empty columns of space.

**More than 12 (Wrapping):**
If your spans total more than 12 (e.g., 8 + 6 = 14), columns automatically wrap to the next row.

**Example - Wrapping:**
- Column 1: Span 8
- Column 2: Span 6
- Column 3: Span 4

Result: Column 1 and 2 partially fit on first row, Column 2 wraps, Column 3 wraps to second row.

### Row Gap (Vertical Spacing) ⭐ NEW!
Controls the vertical gap between rows of content:

- **None**: 0rem (no gap)
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 1.5rem (24px)
- **XL**: 2rem (32px)
- **XXL**: 3rem (48px)
- **XXXL**: 4rem (64px)
- **XXXXL**: 6rem (96px)

### Column Gap (Horizontal Spacing) ⭐ NEW!
Controls the horizontal gap between columns:

- **None**: 0rem (no gap)
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 1.5rem (24px)
- **XL**: 2rem (32px)
- **XXL**: 3rem (48px)
- **XXXL**: 4rem (64px)
- **XXXXL**: 6rem (96px)

### Responsive Column Overrides (DefaultRow only) ⭐ NEW!
Fine-tune columns at different screen sizes:

**Mobile Columns** (small screens, 640px+):
- 1, 2, or 3 columns

**Tablet Columns** (medium screens, 768px+):
- 2, 3, or 4 columns

**Desktop Columns** (large screens, 1024px+):
- 3, 4, 5, or 6 columns

*Note: These override the main "Column Layout" setting at their respective breakpoints.*

### Vertical Alignment
Controls how columns are vertically aligned within grid cells:

- **Top**: Align columns to the top
- **Center**: Center columns vertically ✨ *Perfect for aligning text with forms*
- **Bottom**: Align columns to the bottom
- **Stretch**: Make all columns the same height (default)

### Horizontal Alignment
Controls how grid content is distributed horizontally:

- **Start**: Align to the left
- **Center**: Center the grid content
- **End**: Align to the right
- **Stretch**: Stretch to fill width

### Vertical Distribution
Controls how grid rows are distributed vertically:

- **Start**: Pack rows to the top
- **Center**: Center rows vertically
- **End**: Pack rows to the bottom
- **Stretch**: Distribute rows evenly

### Horizontal Alignment Within Cells (DefaultRow only) ⭐ NEW!
Controls how content aligns horizontally within each grid cell:

- **Start**: Align content to the left of each cell
- **Center**: Center content within each cell
- **End**: Align content to the right of each cell
- **Stretch**: Stretch content to fill cell width

### Width
Controls the maximum width of the row:

- **Inherit from section**: Use the section's width setting
- **Full width**: Stretch across entire viewport
- **Container (default)**: Responsive container with padding
- **7XL through Extra Small**: Fixed maximum widths from 20rem to 80rem

### Vertical Spacing (Margin Around Row)
Controls external margin around the entire row:

- **None**: No margin
- **Small**: Small margin
- **Medium**: Medium margin
- **Large**: Large margin
- **Very Large**: Extra large margin

## Column Layout Options

### Grid Span (out of 12)
Controls how many grid columns (out of 12) this column spans:

- **Auto**: Default - spans 1 column in grid
- **Span 1-12**: Fixed width as fraction of 12-column grid
  - **Span 6** = 50% width (6 out of 12 columns)
  - **Span 4** = 33% width (4 out of 12 columns)
  - **Span 3** = 25% width (3 out of 12 columns)
  - **Span 8** = 67% width (8 out of 12 columns)

*Note: Grid Span only applies when the Row uses "12-Column Grid (Flexible)" layout. For preset layouts (2/3/4/6 columns), columns automatically fill available space.*

### Advanced Grid Placement ⭐ NEW!

For precise control over column positioning (advanced users):

**Grid Column Start**: Choose which column (1-13) the content starts at
**Grid Column End**: Choose which column (1-13) the content ends at

Example: Start at 2, End at 8 = spans from column 2 to column 8 (6 columns wide, offset from left)

**Grid Row Start**: Choose which row (1-5) the content starts at
**Grid Row End**: Choose which row (1-5) the content ends at

*Allows columns to span multiple rows in multi-row layouts.*

**Grid Area Name**: Assign column to a named grid area (header, sidebar, content, footer)

*Works with Row's grid template areas feature (advanced).*

### Content Spacing
Controls vertical spacing within the column:

- **None**: No internal spacing
- **Small**: 0.5rem gap and padding
- **Medium**: 1rem gap and padding
- **Large**: 2rem gap and padding (8rem on large screens)
- **Extra Large**: 3rem gap and 6rem padding (24rem on large screens)
- **Extra Extra Large**: 4rem gap and 18rem padding (72rem on large screens)

### Visibility Control
Control when columns are visible:

- **Always**: Visible on all screen sizes
- **From Small**: Hidden on mobile, visible from 640px+
- **From Medium**: Hidden on mobile/small, visible from 768px+
- **From Large**: Hidden until large screens, visible from 1024px+

### Other Options
- **Min Width**: Set minimum width for overflow scenarios (auto, small, medium, large)
- **Overflow**: Control overflow behavior (full, clip, left, right)
- **Background Color**: Choose from daisyUI theme colors

## Common Layout Patterns

### 1. Text + Form Side by Side (Centered)
**Use Case**: Align introductory text with a signup form

**Row Settings**:
- Column Layout: **2 Equal Columns** (or use 12-Column Grid)
- Vertical Alignment: **Center**
- Column Gap: **Medium**

**Column Settings** (if using 12-Column Grid):
- Left Column (Text): Grid Span **Span 6** (50%)
- Right Column (Form): Grid Span **Span 6** (50%)

### 2. Hero Text with Call-to-Action
**Use Case**: Large headline with button to the side

**Row Settings**:
- Column Layout: **12-Column Grid (Flexible)**
- Vertical Alignment: **Center**
- Column Gap: **Large**

**Column Settings**:
- Text Column: Grid Span **Span 8** (67%)
- CTA Column: Grid Span **Span 4** (33%)

### 3. Three Equal Cards
**Use Case**: Feature highlights or service offerings

**Quick Method**:
**Row Settings**:
- Column Layout: **3 Equal Columns**
- Vertical Alignment: **Stretch** (equal heights)
- Column Gap: **Medium**

**Advanced Method (using 12-Column Grid)**:
**Row Settings**:
- Column Layout: **12-Column Grid (Flexible)**
- Vertical Alignment: **Stretch**
- Column Gap: **Medium**

**Column Settings**:
- All 3 Columns: Grid Span **Span 4** (each 33%)

### 4. Sidebar Layout
**Use Case**: Main content with sidebar

**Row Settings**:
- Column Layout: **12-Column Grid (Flexible)**
- Vertical Alignment: **Top**
- Column Gap: **Large**

**Column Settings**:
- Main Content: Grid Span **Span 8** (67%)
- Sidebar: Grid Span **Span 4** (33%)

### 5. Responsive Product Grid ⭐ NEW!
**Use Case**: Product cards that automatically adjust to screen size

**Row Settings**:
- Column Layout: **Auto-Fit Responsive**
- Column Gap: **Medium**
- Row Gap: **Medium**

No need to set Column Grid Span - columns automatically fit!

### 6. Custom Multi-Column Newsletter ⭐ NEW!
**Use Case**: Different column counts per device

**Row Settings**:
- Column Layout: **12-Column Grid (Flexible)** (base)
- Mobile Columns: **1** (stack on phone)
- Tablet Columns: **2** (2 columns on tablet)
- Desktop Columns: **4** (4 columns on desktop)
- Column Gap: **Medium**

## Responsive Behavior

### Mobile-First Approach
All layouts start as single-column on mobile devices (< 768px), then use the grid layout at medium screens and above (768px+).

### Breakpoints
- **Mobile**: < 640px (single column)
- **Small**: 640px - 767px (can use mobile column override)
- **Medium**: 768px - 1023px (grid layout activates, can use tablet column override)
- **Large**: 1024px - 1279px (can use desktop column override)
- **Extra Large**: 1280px+

### Grid Behavior
- On **mobile** (< 768px): All columns stack vertically regardless of settings
- At **medium+** (768px+): Grid layout activates with your chosen Column Layout
- Use **responsive column overrides** to fine-tune columns at each breakpoint

### Key Differences from Previous Flexbox System
- **No "Show as Row From"**: Grid is always active at medium+ breakpoints
- **Preset layouts**: New easy options (2/3/4/6 columns) for common patterns
- **Separate gaps**: Control row and column gaps independently
- **Better alignment**: More precise control over vertical and horizontal alignment
- **Explicit placement**: Advanced users can position columns exactly where needed

## Best Practices

### Choosing Column Layout
- **Use preset layouts (2/3/4/6 columns)** for simple, equal-width designs (easiest option)
  - All columns automatically equal width
  - No need to set Grid Span on individual columns
  - Perfect for card grids, feature lists, product showcases
- **Use 12-Column Grid (Flexible)** when you need custom widths (e.g., 67/33 split)
  - Full manual control over column widths
  - Set Grid Span on each Column to control its width
  - Perfect for main content + sidebar, asymmetric layouts
- **Use Auto-Fit** for product grids or card collections that need to adapt automatically
  - Automatically fits as many columns as possible (minimum 250px each)
  - No need to set Grid Span
  - Perfect for responsive product grids with unknown item counts

### Content Alignment
- Use **Center** vertical alignment when you want text and forms to align at their midpoints
- Use **Top** alignment for blog layouts or content-heavy sections
- Use **Stretch** for card layouts where equal heights look better

### Grid Spans (for 12-Column Grid)
- **Span 6 + Span 6**: Perfect 50/50 split
- **Span 8 + Span 4**: Content with sidebar (67/33)
- **Span 4 + Span 4 + Span 4**: Three equal columns (33/33/33)
- **Auto**: Default 1-column span

### Spacing
- **Row Gap**: Controls vertical spacing between wrapped rows
- **Column Gap**: Controls horizontal spacing between columns
- Use **Medium** (1rem) for most layouts
- Use **Large** or higher for marketing pages with more breathing room
- Use **None** for tightly packed content

### Responsive Design
- Use **responsive column overrides** to show different column counts on mobile/tablet/desktop
- Use **visibility controls** to hide columns on smaller screens
- Test on actual devices to see how layouts adapt

### Width Control
- Use **Container** for most content (recommended)
- Use **Full width** for hero sections or backgrounds
- Use fixed widths (like **5XL**) for consistent content width across all sections

## Troubleshooting

### Columns Not Using Preset Layout
- Check that Row's "Column Layout" is set correctly (not "12-Column Grid" if you want preset)
- Preset layouts (2/3/4/6 columns) override individual column Grid Span settings
- For custom widths, use "12-Column Grid (Flexible)" and set Column Grid Span

### Columns Not Spanning Correctly
- Verify Row is using "12-Column Grid (Flexible)" layout
- Check Column "Grid Span" setting (Span 1-12)
- Remember: Grid spans only apply at medium+ breakpoints (768px+)
- On mobile, all columns stack regardless of span

### Vertical Alignment Not Working
- Vertical alignment only works at medium+ breakpoints
- Check that grid is active (screen width >= 768px)
- Some content types may have their own alignment
- Use browser dev tools to verify grid classes are applied

### Gaps Not Appearing
- Check both "Row Gap" and "Column Gap" settings
- Gap only appears between multiple items (need 2+ columns or wrapped rows)
- Some background colors may make gaps less visible

### Responsive Columns Not Changing
- Check "Mobile/Tablet/Desktop Columns" settings (DefaultRow only)
- Verify screen size matches breakpoint (640px/768px/1024px)
- Responsive overrides only work when set (default is to use main "Column Layout")

### Advanced Placement Not Working
- "Grid Column Start/End" settings are for advanced users
- Both start AND end must be set for explicit placement
- Start value must be less than end value
- These settings override Grid Span

## Migration Notes

### For Existing Flex-Based Content

If you have existing pages built with the previous flex-based system:

1. **"Show as Row From" removed**: Grid is now always active at medium+ breakpoints
2. **"Content Spacing" split**: Old content spacing values map to both Row Gap and Column Gap
3. **Grid Spans unchanged**: Column Grid Span values (Span 1-12) work the same way
4. **New preset layouts available**: Use these for simpler configuration
5. **Alignment** still works the same, now with more options

Most existing layouts will work without changes. For new layouts, consider using the easier preset Column Layout options.

## Examples in Action

Visit your site at different screen sizes to see how these settings affect your layout:
- **Desktop** (1024px+): See full grid layout with your chosen column count and alignment
- **Tablet** (768px-1023px): See tablet column override (if set) or default column layout
- **Mobile** (< 768px): See single-column stacked layout

**Testing Tips**:
- Use browser dev tools (F12) to test responsive breakpoints
- CMS preview shows desktop layout - always test on actual devices
- Use "Responsive Design Mode" in browser to simulate different screen sizes

## See Also

For advanced grid features like grid template areas and complex layouts, see **GRID-FEATURES-GUIDE.md** (advanced users).