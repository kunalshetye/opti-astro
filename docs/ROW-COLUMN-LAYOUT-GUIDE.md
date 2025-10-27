# Row & Column Layout Guide

This guide explains how to use the Row and Column styling options in the Optimizely CMS to create flexible, responsive layouts using **CSS Grid**.

## Related Documentation

For detailed information about style standards and development:
- **[Style Standards Reference](STYLE-STANDARDS.md)** - Complete list of all standardized style values and their CSS classes
- **[Component Styling Guide](COMPONENT-STYLING-GUIDE.md)** - Developer guide for implementing styling in components
- **[Migration Guide](migrations/2025-style-consolidation.md)** - Details about the 2025 style consolidation migration

## Overview

The layout system uses **CSS Grid** with a combination of **Sections**, **Rows**, and **Columns** to create advanced, responsive designs:

- **Sections** contain rows and provide overall width constraints (uses single-column grid for vertical stacking)
- **Rows** use a **12-column grid system** to organize columns horizontally
- **Columns** are grid items that can span multiple columns **and rows**, containing your content components

## Row Styles: Simple vs Advanced

The system offers **two row styles** to match your needs:

### Simple Row (Default) ⭐ Recommended for Most Layouts
A streamlined row style with just **6 essential settings**:
- Show as row from (breakpoint)
- Gap between columns (unified horizontal/vertical)
- Horizontal alignment (left/center/right)
- Vertical alignment (top/center/bottom/stretch)
- Vertical spacing (margin)
- Background color

**Use Simple Row when**:
- ✅ You want clean, easy-to-understand layout controls
- ✅ Creating standard layouts (hero sections, card grids, content blocks)
- ✅ You don't need precise column width control
- ✅ 90% of typical CMS use cases

### Advanced Row 🔧 For Power Users
Full-featured row style with **13 settings** for complex layouts:
- All Simple Row features, PLUS:
- Width override (independent from Section width)
- Grid template modes (fixed 12-column, auto-fit, auto-fill)
- Auto column min width (for responsive grids)
- Grid auto flow (row, dense, column)
- Separate horizontal and vertical gap controls
- Advanced alignment options

**Use Advanced Row when**:
- ✅ You need precise control over column widths (e.g., 66/33 sidebar layouts)
- ✅ Creating magazine-style layouts with dense packing
- ✅ Using auto-fit/auto-fill responsive grids
- ✅ Width needs to differ from Section width
- ✅ Complex, non-standard layouts

> **💡 Tip**: Start with Simple Row. Only switch to Advanced Row when you need features it doesn't provide.

### Grid Architecture

```
Section (grid, single column)
  └─ Row (grid, 12 columns on desktop, 1 on mobile)
      ├─ Column (grid item + grid container, spans N columns and M rows)
      │   └─ Components (grid items)
      └─ Column
          └─ Components
```

## Section Layout Options

### Width
Controls the maximum width of the section:
- **Default**: Responsive container with padding
- **Full width**: Stretch across entire viewport
- **Wide**: 7XL (80rem) max width
- **Narrow**: 3XL (48rem) max width
- **Edge to Edge (no padding)** ⭐ NEW: No width constraints or padding - content spans complete viewport width

### Gap Between Rows
Controls the vertical spacing between rows in the section:
- **None**: No gap (0)
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 2rem (32px)
- **Extra Large**: 3rem (48px)

## Row Layout Options

### Simple Row Options (7 Settings)

#### Horizontal Padding ⭐ NEW
Controls padding on the left and right sides of the row:
- **Default**: Standard padding (0.25rem)
- **None (Edge to Edge)**: No horizontal padding - content extends to row edges

#### Gap Between Columns
Unified spacing that applies both horizontally and vertically:
- **None**: 0
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px) - Default
- **Large**: 2rem (32px)
- **Extra Large**: 3rem (48px)
- **Extra Extra Large**: 6rem (96px)

#### Horizontal Alignment
Controls where columns are positioned horizontally:
- **Left**: Align to start (default)
- **Center**: Center columns in the row
- **Right**: Align to end

#### Vertical Alignment
Controls how columns align vertically:
- **Top**: Align to top
- **Center**: Center vertically
- **Bottom**: Align to bottom
- **Stretch**: Equal heights (default)

#### Show as Row From (Screen Width)
When the grid switches from stacked to side-by-side:
- **Medium** (768px+): Default - mobile stacked, tablet/desktop side-by-side
- **Large** (1024px+): Mobile and tablet stacked
- **Extra Large** (1280px+): Only large screens side-by-side

#### Vertical Spacing
Margin spacing above and below the row:
- **None**: 0
- **Small**: 0.5rem
- **Medium**: 1rem (default)
- **Large**: 2rem
- **Very Large**: 5rem on desktop, 10rem on large screens

#### Background Color
Background color for the entire row using the standardized theme color system (same options as Section).

Available colors: `transparent`, `base_100`, `base_200`, `base_300`, `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error`

See [Style Standards Reference](STYLE-STANDARDS.md#color-system) for complete color documentation.

---

### Advanced Row Options (13 Settings)

Advanced Row includes all Simple Row options (including Horizontal Padding) PLUS the following:

#### Grid Template Mode ⭐ NEW
Controls how the grid columns are defined:

- **Auto-fit** (Default): Responsive grid that automatically distributes columns equally, just like old flex-1 behavior! Columns wrap based on minimum width.
- **Fixed 12-column grid**: Traditional 12-column system where columns specify their precise span (1-12). Use for exact control.
- **Auto-fill**: Responsive grid that maintains column sizes even when empty, creating more uniform layouts

**Auto-fit is the default** because it works exactly like the old flexbox system - adding columns automatically splits the space equally!

When using **Auto-fit** or **Auto-fill**, set the **Auto Column Min Width** to control when columns wrap.

### Auto Column Min Width ⭐ NEW
Used with Auto-fit/Auto-fill modes:
- **Small**: 15rem (240px) minimum
- **Medium**: 20rem (320px) minimum
- **Large**: 25rem (400px) minimum
- **Extra Large**: 30rem (480px) minimum

### Grid Auto Flow ⭐ NEW
Controls how grid items are placed:
- **Row** (Default): Fill rows first, then move to next row
- **Dense**: Automatically fill gaps in the grid for tighter packing (great for magazine-style layouts)
- **Column**: Fill columns first, then move to next column

### Horizontal Gap (between columns) ⭐ NEW
Controls the horizontal spacing between columns:
- **None**: 0
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 2rem (32px)
- **Extra Large**: 3rem (48px)
- **Extra Extra Large**: 6rem (96px)

### Vertical Gap (between rows when wrapping) ⭐ NEW
Controls the vertical spacing between rows when columns wrap:
- **None**: 0
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 2rem (32px)
- **Extra Large**: 3rem (48px)
- **Extra Extra Large**: 6rem (96px)

#### Width Override
Controls the maximum width of the row (overrides section width):

- **Inherit from section**: Use the section's width setting (default)
- **Full width**: Stretch across entire viewport
- **Container**: Responsive container with padding
- **7XL through Extra Small**: Fixed maximum widths from 20rem to 80rem

## Column Layout Options

### Width ⭐ NEW
Controls the maximum width of the column:
- **Default (inherit)**: No width constraints, inherits from parent
- **Full width**: `w-full` - full width
- **Wide (max-w-7xl)**: Wide but centered with 80rem max-width
- **Narrow (max-w-3xl)**: Narrow centered column with 48rem max-width
- **Edge to Edge (no constraints)**: `w-full max-w-full` - truly unrestricted width

### Padding ⭐ NEW
Controls padding inside the column:
- **Default**: Responsive padding (0.5rem on mobile, 0.75rem on tablet, 1rem on desktop)
- **None (Edge to Edge)**: No padding - content extends to column edges

### Grid Span (out of 12)
Controls how many columns (out of 12) this column occupies:

- **Auto**: Flexible width based on content and available space
- **1-12 Columns**: Fixed width as fraction of 12-column grid
  - **12 Columns** = Full width (100%)
  - **6 Columns** = Half width (50%)
  - **4 Columns** = Third width (33%)
  - **3 Columns** = Quarter width (25%)

### Row Span (vertical spanning) ⭐ NEW
Controls how many rows this column spans vertically:

- **Auto** (1 row): Default, single row height
- **2-6 Rows**: Span multiple rows vertically

**Use Case**: Create magazine-style layouts where a large image spans multiple rows of text.

### Content Alignment
Controls how content within the column is aligned:

- **Top Left**: Content aligned to top-left corner (default)
- **Center**: Content centered both horizontally and vertically
- **Bottom Right**: Content aligned to bottom-right corner

### Content Spacing
Controls vertical spacing within the column:

- **None**: No internal spacing
- **Small**: 0.5rem gap and padding
- **Medium**: 1rem gap and padding
- **Large**: 2rem gap and padding
- **Extra Large**: 3rem gap and 6rem padding on large screens
- **Extra Extra Large**: 4rem gap and 18rem padding on large screens

### Show On
Controls which screen sizes display this column:

- **All screen sizes**: Always visible (default)
- **Small and up**: Hidden on extra-small screens
- **Medium and up**: Hidden on small and extra-small screens
- **Large and up**: Only visible on large screens

### Background Color
Background color for the column using the standardized theme color system (same color options as Section and Row).

Available colors: `transparent`, `base_100`, `base_200`, `base_300`, `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error`

See [Style Standards Reference](STYLE-STANDARDS.md#color-system) for complete color documentation.

## Common Layout Patterns

### 1. Edge-to-Edge Hero Image ⭐ NEW
**Use Case**: Full-width hero image or video spanning complete viewport

**Row Style**: **Simple Row** ✨

**Section Settings**:
- Width: **Edge to Edge (no padding)**

**Row Settings**:
- Horizontal Padding: **None (Edge to Edge)**

**Column Settings**:
- Width: **Edge to Edge (no constraints)**
- Padding: **None (Edge to Edge)**
- Grid Span: **12 Columns** (full width)

> **Note**: This creates a truly full-width element with no margins or padding at any level

### 2. Text + Form Side by Side (Centered)
**Use Case**: Align introductory text with a signup form

**Row Style**: **Simple Row** ✨

**Row Settings**:
- Show as Row From: **Medium**
- Vertical Alignment: **Center**
- Horizontal Alignment: **Left**
- Gap: **Medium**

**Column Settings**:
- Left Column (Text): Grid Span **6 Columns**
- Right Column (Form): Grid Span **6 Columns**

> **Note**: For exact 50/50 split, you could also use Advanced Row with Fixed 12-column mode

### 3. Responsive Card Grid
**Use Case**: Cards that automatically adjust to screen width

**Row Style**: **Simple Row** ✨ (easiest option)

**Row Settings**:
- Show as Row From: **Medium**
- Gap: **Medium**
- Vertical Alignment: **Stretch** (equal card heights)

**Column Settings**:
- All Columns: Grid Span **4 Columns** (3 cards across on desktop)

> **Advanced Alternative**: Use **Advanced Row** with Auto-fit mode for truly dynamic column count

### 4. Magazine Layout with Hero Image
**Use Case**: Large image spanning multiple rows of text

**Row Style**: **Advanced Row** 🔧 (requires dense packing)

**Row Settings**:
- Grid Template Mode: **Fixed 12-column**
- Grid Auto Flow: **Dense** ⭐
- Horizontal Gap: **Medium**
- Vertical Gap: **Small**

**Column Settings**:
- Hero Image: Grid Span **6 Columns**, Row Span **3 Rows** ⭐
- Text Columns: Grid Span **6 Columns** each (will flow around hero)

### 5. Sidebar Layout
**Use Case**: Main content with sidebar

**Row Style**: **Simple Row** ✨

**Row Settings**:
- Show as Row From: **Large**
- Vertical Alignment: **Top**
- Gap: **Large**

**Column Settings**:
- Main Content: Grid Span **8 Columns**
- Sidebar: Grid Span **4 Columns**

### 6. Pinterest-Style Masonry
**Use Case**: Cards of varying heights that pack tightly

**Row Style**: **Advanced Row** 🔧 (requires auto-fill + dense)

**Row Settings**:
- Grid Template Mode: **Auto-fill** ⭐
- Auto Column Min Width: **Small** (15rem)
- Grid Auto Flow: **Dense** ⭐
- Horizontal Gap: **Small**
- Vertical Gap: **Small**

**Column Settings**:
- All Columns: Grid Span **Auto**, Row Span varies by content

## Advanced Features

### Auto-Fit vs Auto-Fill

**Auto-Fit**:
- Columns shrink to fit content
- Empty space is distributed to existing columns
- Best for: Gallery layouts, product grids

**Auto-Fill**:
- Columns maintain minimum width even if empty
- Creates more columns than needed, leaving some empty
- Best for: Consistent grid patterns, form layouts

### Dense Grid Packing

When **Grid Auto Flow** is set to **Dense**, the grid automatically fills gaps:

```
Normal Flow:     Dense Flow:
[1][2][ ]        [1][2][4]
[3][ ][ ]   →    [3][5][ ]
[4][5][ ]        [6][ ][ ]
```

Great for:
- Magazine layouts
- Pinterest-style boards
- Mixed content sizes

### Row Spanning

Columns can span multiple rows vertically, creating complex layouts:

```
[Column 1  ][Column 2]
[spans 2   ][Column 3]
[rows      ]
```

Use cases:
- Feature images next to article text
- Large callouts with surrounding content
- Dashboard layouts with different widget sizes

## Responsive Behavior

### Mobile-First Approach
All layouts start as single-column on mobile devices, then transition to 12-column grid based on your "Show as Row From" setting.

### Breakpoints
- **Mobile**: < 768px (always single column)
- **Medium**: 768px - 1023px
- **Large**: 1024px - 1279px
- **Extra Large**: 1280px+

### Grid Behavior by Breakpoint

| Screen Size | Section | Row | Column |
|------------|---------|-----|--------|
| Mobile (< 768px) | Single column | Single column | Full width |
| Tablet (768px+) | Single column | 12 columns (if show from md) | Span N of 12 |
| Desktop (1024px+) | Single column | 12 columns | Span N of 12 |

## Best Practices

### When to Use Simple Row vs Advanced Row

**Simple Row** ⭐ (Recommended for 90% of cases):
- ✅ Hero sections, content blocks, basic layouts
- ✅ Standard card grids (3-4 cards across)
- ✅ Text + image side-by-side layouts
- ✅ Sidebar layouts (main content + sidebar)
- ✅ You want clean, easy-to-understand options
- ✅ Fixed 12-column grid is all you need

**Advanced Row** 🔧 (Power users only):
- ✅ Auto-fit/auto-fill responsive grids (dynamic column count)
- ✅ Magazine layouts with dense packing
- ✅ Pinterest-style masonry with varying heights
- ✅ Need to override Section width
- ✅ Separate horizontal/vertical gap controls
- ✅ Complex, non-standard layouts

### Grid Mode Options (Advanced Row Only)

**Auto-fit** (Recommended for dynamic grids):
- ✅ Columns automatically split based on min-width
- ✅ Adding columns automatically distributes space
- ✅ Responsive card grids
- ✅ Product catalogs and gallery layouts
- ✅ When content count varies

**Fixed 12-column** (Precise control):
- ✅ Exact column widths needed (span6, span4, etc.)
- ✅ Asymmetric layouts (66/33 split, sidebars)
- ✅ Works in both Simple and Advanced Row
- ✅ Most common choice for standard layouts

**Auto-fill** (Uniform patterns):
- ✅ Consistent grid patterns
- ✅ Form layouts
- ✅ When you want uniform columns even with few items

### Grid Spans Best Practices

**Fixed Mode**:
- **6 + 6 Columns**: Perfect 50/50 split
- **8 + 4 Columns**: Content with sidebar
- **4 + 4 + 4 Columns**: Three equal columns
- **3 + 9 or 9 + 3 Columns**: Narrow sidebar
- **2 + 5 + 5 Columns**: Three-column with narrow first

**Auto-fit/Auto-fill Mode**:
- Use **Auto** grid span
- Control wrapping with **Auto Column Min Width**

### Gap Controls

**Independent Control** (Recommended):
- Use **Horizontal Gap** and **Vertical Gap** separately
- Different horizontal and vertical spacing looks more natural
- Example: `gap-x-4 gap-y-8` (tight horizontal, roomy vertical)

**Legacy Content Spacing**:
- Still works for backward compatibility
- Applies the same gap to both directions

### Alignment

**Vertical Alignment**:
- **Center**: Text and forms, mixed content heights
- **Top**: Blog layouts, content-heavy sections
- **Stretch**: Card layouts with equal heights
- **Baseline**: Text-heavy content that should align

**Horizontal Alignment** (Justify Items):
- Controlled by Row settings
- Affects how content is positioned within each column

### Row Spanning Tips

- Keep row spans reasonable (2-4 rows max for readability)
- Use with **Dense** grid flow for automatic packing
- Test at different screen sizes - row spanning only works above breakpoint

## Troubleshooting

### Columns Not Forming a Grid
- Check **Grid Template Mode** - should be "Fixed 12-column" for manual control
- Check "Show as Row From" setting - might be set too high
- Verify you're viewing at the correct screen size
- Ensure the row contains multiple columns

### Auto-fit/Auto-fill Not Working
- Ensure **Grid Template Mode** is set correctly
- Check **Auto Column Min Width** - might be too large
- Verify columns are set to **Auto** grid span
- Test at wider screen sizes

### Row Spanning Not Working
- Row spanning only works above the breakpoint ("Show as Row From")
- Requires multiple implicit rows to span (other columns must create rows)
- Check that **Grid Auto Flow** allows row creation

### Gaps Not Showing
- Check both **Horizontal Gap** and **Vertical Gap** settings
- Section **Gap Between Rows** only affects spacing between Row elements
- Column **Content Spacing** only affects spacing within the column

## Migration Notes

### For Existing Content

This layout system was migrated from **Flexbox to CSS Grid** for better flexibility and control.

**What Changed**:
- Rows now use CSS Grid instead of Flexbox
- Columns use `col-span-X` instead of `flex-basis`
- New features: Row/column spanning, auto-fit/fill, dense packing

**Backward Compatibility**:
- Existing **Grid Span** settings still work (converted to `col-span`)
- Legacy **Content Spacing** still works (converted to `gap`)
- Layouts should look the same or better after migration

**IMPORTANT: Auto-Fit Default = Flex-1 Behavior** ✓

**Good News!** The new grid system with **Auto-fit default** works exactly like the old flexbox system:

```
Add Column 1 (auto) → Full width
Add Column 2 (auto) → Both split to ~50/50 ✓
Add Column 3 (auto) → All split to ~33/33/33 ✓
Add Column 4 (auto) → All split to ~25/25/25/25 ✓
```

**This is the default behavior!** Just add columns and they automatically distribute equally, just like `flex-1`.

**Column 'Auto' with Auto-Fit Mode:**
- Columns automatically split based on available space
- Minimum width: 20rem (Medium) per column
- Wraps to fewer columns on smaller screens
- **Works exactly like old flex-1!**

**For Precise Control, Use Fixed Mode:**
If you need exact column widths (like 66/33 split for sidebar):
```
Row Settings:
- Grid Template Mode = Fixed 12-column

Column Settings:
- Column 1: Grid Span = 8 Columns (66%)
- Column 2: Grid Span = 4 Columns (33%)
```

**Why Auto-Fit is Default:**
- ✅ Matches old flex-1 behavior exactly
- ✅ Columns automatically split when you add more
- ✅ No manual span adjustment needed
- ✅ Responsive by default
- ✅ Most intuitive for CMS users

**Simplified Row Styles**

The system now offers **two row styles**:

- **Simple Row** (NEW DEFAULT): Streamlined with 6 essential settings for 90% of layouts
- **Advanced Row**: Full-featured with 12 settings for complex layouts

**Default Values**

All new content uses these defaults:

**Section**:
- Width: Default (container)
- Vertical Spacing: Default
- Row Gap: Small
- Background: Transparent

**Simple Row** (Default):
- Show as Row From: Medium
- Horizontal Padding: Default
- Gap: Medium (unified horizontal/vertical)
- Horizontal Alignment: Left
- Vertical Alignment: Stretch
- Vertical Spacing: Medium
- Background: Transparent

**Column**:
- Width: Default (inherit)
- Padding: Default
- Grid Span: Auto
- Row Span: Auto
- Content Alignment: Top Left
- Content Spacing: Medium
- Show On: All screen sizes
- Background: Transparent

**Recommended Actions**:
- Test existing pages after migration
- **New rows use Simple Row style** - cleaner interface with essential options
- For complex layouts (auto-fit grids, dense packing), switch to "Advanced Row" style
- Existing content with AdvancedRow continues to work
- Column alignment simplified - use new unified "Content Alignment" option
- Removed rarely-used options (minWidth, overflow) - contact support if you need these

## Examples in Action

Visit your site at different screen sizes to see how these settings affect your layout:
- **Desktop**: See full 12-column grid with chosen alignment and spanning
- **Tablet**: May see grid or single column depending on "Show as Row From"
- **Mobile**: Always see single-column stacked layout

Remember: The CMS preview shows your desktop layout. Always test on actual devices or resize your browser to see responsive behavior.

## Further Reading

### External Resources
- [CSS Grid Layout Guide (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS Grid Auto-fit vs Auto-fill](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/)

### Internal Documentation
- **[Style Standards Reference](STYLE-STANDARDS.md)** - Complete reference for all standardized style values including colors, spacing, alignment, and more
- **[Component Styling Guide](COMPONENT-STYLING-GUIDE.md)** - Developer guide for implementing component styling using the centralized helpers library
- **[Migration Guide](migrations/2025-style-consolidation.md)** - Details about the 2025 style consolidation project and how styles are now managed
