# Style Standards Reference

This document provides a comprehensive reference for all standardized style values used in the Optimizely CMS component system. These standards ensure consistency across all components and make it easier to create new components or modify existing ones.

## Overview

All component styles are defined in `.opti-style.json` files and converted to TailwindCSS classes using the centralized `styleHelpers` library located at `src/cms/shared/styleHelpers/`.

## Table of Contents

- [Color System](#color-system)
- [Typography](#typography)
- [Button Styles](#button-styles)
- [Spacing](#spacing)
- [Border Radius](#border-radius)
- [Layout & Alignment](#layout--alignment)
- [Effects](#effects)
- [Images](#images)
- [Grid System](#grid-system)

---

## Color System

### Theme Colors

Standard color palette used across all components:

| Value | CSS Class (Background) | CSS Class (Text) | Use Case |
|-------|----------------------|------------------|----------|
| `transparent` | _(none)_ | _(none)_ | No color applied |
| `base_100` | `bg-base-100` | `text-base-content` | Lightest base color |
| `base_200` | `bg-base-200` | `text-base-content` | Medium base color |
| `base_300` | `bg-base-300` | `text-base-content` | Darkest base color |
| `primary` | `bg-primary` | `text-primary-content` | Primary brand color |
| `secondary` | `bg-secondary` | `text-secondary-content` | Secondary brand color |
| `accent` | `bg-accent` | `text-accent-content` | Accent highlights |
| `neutral` | `bg-neutral` | `text-neutral-content` | Neutral elements |
| `info` | `bg-info` | `text-info-content` | Informational elements |
| `success` | `bg-success` | `text-success-content` | Success states |
| `warning` | `bg-warning` | `text-warning-content` | Warning states |
| `error` | `bg-error` | `text-error-content` | Error states |

### Direct Text Colors

Additional text-only colors available in specific components:

| Value | CSS Class | Use Case |
|-------|-----------|----------|
| `white` | `text-white` | White text |
| `black` | `text-black` | Black text |
| `base_content` | `text-base-content` | Default content color |

### Helpers

- **`getBackgroundColorClass(color)`** - Convert to background color class
- **`getTextColorClass(color)`** - Convert to content text color (for contrast)
- **`getDirectTextColorClass(color)`** - Convert to direct text color
- **`getHeroTextColorClass(color)`** - Hero-specific text colors (includes `white`, `black`, `default`)
- **`getDividerColorClass(color)`** - Divider-specific colors

---

## Typography

### Text Transform

Controls text capitalization:

| Value | CSS Class | Description | Legacy Support |
|-------|-----------|-------------|----------------|
| `normal` | _(none)_ | No transformation | `keep`, `normal_case` |
| `uppercase` | `uppercase` | ALL CAPS |  |
| `lowercase` | `lowercase` | all lowercase |  |
| `capitalize` | `capitalize` | Capitalize First Letter |  |

**Helper:** `getTextTransformClass(transform)`

### Text Alignment

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `left` | `text-left` | Left aligned (default) |
| `center` | `text-center` | Center aligned |
| `right` | `text-right` | Right aligned |
| `justify` | `text-justify` | Justified |

**Helper:** `getTextAlignmentClass(alignment)`

### Text Size

| Value | CSS Class | Approximate Size |
|-------|-----------|------------------|
| `xs` | `text-xs` | 0.75rem (12px) |
| `sm` | `text-sm` | 0.875rem (14px) |
| `base` | `text-base` | 1rem (16px) |
| `lg` | `text-lg` | 1.125rem (18px) |
| `xl` | `text-xl` | 1.25rem (20px) |
| `2xl` | `text-2xl` | 1.5rem (24px) |
| `3xl` | `text-3xl` | 1.875rem (30px) |
| `4xl` | `text-4xl` | 2.25rem (36px) |
| `5xl` | `text-5xl` | 3rem (48px) |
| `6xl` | `text-6xl` | 3.75rem (60px) |
| `7xl` | `text-7xl` | 4.5rem (72px) |
| `8xl` | `text-8xl` | 6rem (96px) |
| `9xl` | `text-9xl` | 8rem (128px) |

**Helper:** `getTextSizeClass(size)`

### Font Weight

| Value | CSS Class | Weight |
|-------|-----------|--------|
| `thin` | `font-thin` | 100 |
| `extralight` | `font-extralight` | 200 |
| `light` | `font-light` | 300 |
| `normal` | `font-normal` | 400 |
| `medium` | `font-medium` | 500 |
| `semibold` | `font-semibold` | 600 |
| `bold` | `font-bold` | 700 |
| `extrabold` | `font-extrabold` | 800 |
| `black` | `font-black` | 900 |

**Helper:** `getFontWeightClass(weight)`

---

## Button Styles

### Button Style Variants

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `standard` | `btn-standard` | Standard filled button (default) |
| `soft` | `btn-soft` | Soft/muted fill |
| `outline` | `btn-outline` | Outlined button |
| `dash` | `btn-dash` | Dashed outline |
| `neutral` | `btn-neutral` | Neutral style |
| `link` | `btn-link` | Link-style button |
| `ghost` | `btn-ghost` | Ghost/transparent |
| `wide` | `btn-wide` | Extra wide padding |
| `disabled` | `btn-disabled` | Disabled state |

**Helper:** `getButtonStyleClass(buttonStyle)`

### Button Color Types

| Value | CSS Class | Color |
|-------|-----------|-------|
| `primary` | `btn-primary` | Primary color (default) |
| `secondary` | `btn-secondary` | Secondary color |
| `neutral` | `btn-neutral` | Neutral color |
| `accent` | `btn-accent` | Accent color |
| `info` | `btn-info` | Info color |
| `success` | `btn-success` | Success color |
| `warning` | `btn-warning` | Warning color |
| `error` | `btn-error` | Error color |

**Helper:** `getButtonTypeClass(buttonType)`

### Button Sizes

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `xs` | `btn-xs` | Extra small |
| `sm` | `btn-sm` | Small |
| `medium` | _(none)_ | Medium (default) |
| `lg` | `btn-lg` | Large |
| `xl` | `btn-xl` | Extra large |
| `responsive` | `btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl` | Responsive sizing |

**Helper:** `getButtonSizeClass(buttonSize)`

### Button Widths

| Value | CSS Class | Width |
|-------|-----------|-------|
| `w_6rem` | `w-[6rem]` | 6rem (96px) |
| `w_9rem` | `w-[9rem]` | 9rem (144px) |
| `w_10rem` | `w-[10rem]` | 10rem (160px) - default |
| `w_12rem` | `w-[12rem]` | 12rem (192px) |
| `w_15rem` | `w-[15rem]` | 15rem (240px) |
| `w_20rem` | `w-[20rem]` | 20rem (320px) |
| `auto` | _(none)_ | Auto width |
| `half` | `w-1/2` | 50% width |
| `full` | `btn-block` | 100% width |
| `responsive` | Complex | Responsive width |

**Helper:** `getButtonWidthClass(buttonWidth)`

### Button Border Radius

See [Border Radius](#border-radius) section. Uses `getButtonRadiusClass(buttonRadius)`.

### Button Actions (Hover Effects)

| Value | CSS Class | Effect |
|-------|-----------|--------|
| `static` | _(none)_ | No hover effect (default) |
| `bouncy` | `transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg` | Bounces up on hover |

**Helper:** `getButtonActionClass(buttonAction)`

### Complete Button Helper

**`getButtonClasses(settings, options?)`** - Combines all button settings into a single array of classes.

```typescript
getButtonClasses({
  buttonStyle: 'soft',
  buttonType: 'primary',
  buttonSize: 'lg',
  buttonWidth: 'w_12rem',
  buttonRadius: 'md',
  buttonAction: 'bouncy'
})
// Returns: ['btn-soft', 'btn-primary', 'btn-lg', 'w-[12rem]', 'rounded-md', 'transition-transform...']
```

---

## Spacing

### Spacing Scale

Standard spacing values used for gaps, margins, and padding:

| Value | Size | Pixel Equivalent |
|-------|------|------------------|
| `none` | 0 | 0px |
| `small` | 0.5rem | 8px |
| `medium` | 1rem | 16px |
| `large` | 2rem | 32px |
| `xl` | 3rem | 48px |
| `xxl` | 6rem | 96px |
| `verylarge` | Special | 5rem/10rem responsive |

### Gap

| Value | CSS Class | Size |
|-------|-----------|------|
| `none` | `gap-0` | 0 |
| `small` | `gap-2` | 0.5rem (8px) |
| `medium` | `gap-4` | 1rem (16px) |
| `large` | `gap-8` | 2rem (32px) |
| `xl` | `gap-12` | 3rem (48px) |
| `xxl` | `gap-24` | 6rem (96px) |

**Helper:** `getGapClass(gap)`

### Row Gap (Vertical Gap)

| Value | CSS Class | Size |
|-------|-----------|------|
| `none` | `gap-y-0` | 0 |
| `small` | `gap-y-2` | 0.5rem (8px) |
| `medium` | `gap-y-4` | 1rem (16px) |
| `large` | `gap-y-8` | 2rem (32px) |
| `xl` | `gap-y-12` | 3rem (48px) |
| `xxl` | `gap-y-24` | 6rem (96px) |

**Helper:** `getRowGapClass(gap)`

### Margin

Similar to gap, but uses `margin` classes (`m-0`, `m-2`, `m-4`, etc.)

**Helper:** `getMarginClass(margin)`

### Padding

Similar to gap, but uses `padding` classes (`p-0`, `p-2`, `p-4`, etc.)

**Helper:** `getPaddingClass(padding)`

### Content Spacing (Combined)

Convenience helper that returns both gap and padding:

**Helper:** `getContentSpacingClasses(spacing)` - Returns `[gapClass, paddingClass]`

---

## Border Radius

### Standard Border Radius

| Value | CSS Class | Size | Legacy Names |
|-------|-----------|------|--------------|
| `none` | `rounded-none` | 0 | `standard` |
| `xs` | `rounded-xs` | 0.125rem (2px) | `small` (images) |
| `sm` | `rounded-sm` | 0.25rem (4px) | `small` (buttons) |
| `md` | `rounded-md` | 0.375rem (6px) | `medium` |
| `lg` | `rounded-lg` | 0.5rem (8px) | `large` |
| `xl` | `rounded-xl` | 0.75rem (12px) | `xlarge` |
| `xl2` | `rounded-2xl` | 1rem (16px) |  |
| `xl3` | `rounded-3xl` | 1.5rem (24px) | `x3large` |
| `xl4` | `rounded-4xl` | 2rem (32px) | `huge` |
| `full` | `rounded-full` | 9999px (circle) | `xhuge` |

### Helpers

- **`getBorderRadiusClass(radius)`** - Standard border radius conversion
- **`getRoundedCornersClass(corners)`** - Legacy alias for images/videos (maps `small` → `xs`, etc.)

---

## Layout & Alignment

### Vertical Alignment (Align Items)

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `start` | `items-start` | Align to top |
| `center` | `items-center` | Center vertically |
| `end` | `items-end` | Align to bottom |
| `stretch` | `items-stretch` | Stretch to fill (default) |
| `baseline` | `items-baseline` | Align baselines |

**Helper:** `getVerticalAlignmentClass(alignment)` or `getAlignItemsClass(align)`

### Horizontal Alignment (Justify Items)

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `start` | `justify-items-start` | Align to left (default) |
| `center` | `justify-items-center` | Center horizontally |
| `end` | `justify-items-end` | Align to right |

**Helper:** `getHorizontalAlignmentClass(alignment)`

### Justify Content

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `start` | `justify-start` | Start (default) |
| `center` | `justify-center` | Center |
| `end` | `justify-end` | End |
| `between` | `justify-between` | Space between |
| `around` | `justify-around` | Space around |
| `evenly` | `justify-evenly` | Space evenly |

**Helper:** `getJustifyContentClass(justify)`

### Align Content

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `start` | `content-start` | Start (default) |
| `center` | `content-center` | Center |
| `end` | `content-end` | End |
| `between` | `content-between` | Space between |
| `around` | `content-around` | Space around |
| `evenly` | `content-evenly` | Space evenly |
| `stretch` | `content-stretch` | Stretch |

**Helper:** `getAlignContentClass(align)`

### Self Alignment

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `auto` | `self-auto` | Auto (default) |
| `start` | `self-start` | Start |
| `center` | `self-center` | Center |
| `end` | `self-end` | End |
| `stretch` | `self-stretch` | Stretch |

**Helper:** `getSelfAlignmentClass(alignment)`

### Content Alignment (Combined)

For Column components, combines place-items classes:

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `top_left` | `place-items-start` | Top left (default) |
| `center` | `place-items-center` | Center both axes |
| `bottom_right` | `place-items-end` | Bottom right |

**Helper:** `getContentAlignmentClasses(alignment)` - Returns `[placeItemsClass, placeContentClass]`

---

## Effects

### Hover Effects

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `none` | _(none)_ | No hover effect |
| `zoom_subtle` | `transition-transform hover:scale-105` | Subtle zoom (5%) |
| `zoom` | `transition-transform hover:scale-110` | Zoom (10%) |

**Helper:** `getHoverEffectClass(effect)`

### Shadows

| Value | CSS Class | Size |
|-------|-----------|------|
| `none` | `shadow-none` | No shadow |
| `sm` | `shadow-sm` | Small shadow |
| `md` | `shadow-md` | Medium shadow |
| `lg` | `shadow-lg` | Large shadow |
| `xl` | `shadow-xl` | Extra large shadow |

**Helpers:**
- **`getShadowClass(shadow)`** - Regular shadow
- **`getHoverShadowClass(shadow)`** - Hover shadow (adds `transition-shadow` and `hover:` prefix)

### Opacity

| Value | CSS Class | Percentage |
|-------|-----------|------------|
| `o_0` | `opacity-0` | 0% |
| `o_10` | `opacity-10` | 10% |
| `o_20` | `opacity-20` | 20% |
| `o_30` | `opacity-30` | 30% |
| `o_40` | `opacity-40` | 40% |
| `o_50` | `opacity-50` | 50% |
| `o_60` | `opacity-60` | 60% |
| `o_70` | `opacity-70` | 70% |
| `o_75` | `opacity-75` | 75% |
| `o_80` | `opacity-80` | 80% |
| `o_90` | `opacity-90` | 90% |
| `o_100` | `opacity-100` | 100% |

**Helper:** `getOpacityClass(opacity)`

### Background Tints

Creates a semi-transparent overlay layer for backgrounds:

| Value | CSS Classes | Description |
|-------|-------------|-------------|
| _(any opacity)_ | `relative` + pseudo-element | Adds tint layer |

**Helper:** `getBackgroundTintClasses(tintColor, opacity)` - Returns array with positioning and tint classes

### Transitions

| Value | CSS Class | Duration |
|-------|-----------|----------|
| `fast` | `duration-150` | 150ms |
| `normal` | `duration-300` | 300ms |
| `slow` | `duration-500` | 500ms |

**Helper:** `getTransitionDurationClass(duration)`

### Animations

| Value | CSS Class | Effect |
|-------|-----------|--------|
| `none` | _(none)_ | No animation |
| `pulse` | `animate-pulse` | Pulsing |
| `bounce` | `animate-bounce` | Bouncing |
| `spin` | `animate-spin` | Spinning |
| `ping` | `animate-ping` | Ping effect |

**Helper:** `getAnimationClass(animation)`

---

## Images

### Image Fit (Object Fit)

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `object_cover` | `object-cover` | Cover container (crop if needed) |
| `object_contain` | `object-contain` | Contain within container |
| `object_fill` | `object-fill` | Fill container (stretch) |
| `object_none` | `object-none` | Original size |
| `object_scale_down` | `object-scale-down` | Scale down if needed |

**Helper:** `getImageFitClass(fit)`

### Image Position

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `center` | `object-center` | Center (default) |
| `top` | `object-top` | Top |
| `bottom` | `object-bottom` | Bottom |
| `left` | `object-left` | Left |
| `right` | `object-right` | Right |
| `top_left` | `object-left-top` | Top left |
| `top_right` | `object-right-top` | Top right |
| `bottom_left` | `object-left-bottom` | Bottom left |
| `bottom_right` | `object-right-bottom` | Bottom right |

**Helper:** `getImagePositionClass(position)`

### Aspect Ratio

| Value | CSS Class | Ratio |
|-------|-----------|-------|
| `auto` | `aspect-auto` | Original aspect ratio |
| `square` | `aspect-square` | 1:1 |
| `video` | `aspect-video` | 16:9 |
| `portrait` | `aspect-[3/4]` | 3:4 |
| `landscape` | `aspect-[4/3]` | 4:3 |
| `ultrawide` | `aspect-[21/9]` | 21:9 |

**Helper:** `getAspectRatioClass(ratio)`

### Image Loading Strategy

| Value | Astro Loading | Description |
|-------|---------------|-------------|
| `lazy` | `"lazy"` | Load when visible (default) |
| `eager` | `"eager"` | Load immediately |
| `auto` | `undefined` | Browser default |

**Helper:** `getImageLoadingStrategy(loading)`

### Image Filters

| Value | CSS Class | Effect |
|-------|-----------|--------|
| `none` | _(none)_ | No filter |
| `grayscale` | `grayscale` | Black and white |
| `sepia` | `sepia` | Sepia tone |
| `blur` | `blur-sm` | Blur effect |
| `brightness` | `brightness-110` | Increase brightness |
| `contrast` | `contrast-125` | Increase contrast |

**Helper:** `getImageFilterClass(filter)`

### Complete Image Helper

**`getImageClasses(settings)`** - Combines fit, position, aspect ratio, and filter:

```typescript
getImageClasses({
  imageFit: 'object_cover',
  imagePosition: 'center',
  aspectRatio: 'video',
  imageFilter: 'none'
})
// Returns: ['object-cover', 'object-center', 'aspect-video']
```

---

## Grid System

### Grid Columns (Template Columns)

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `auto` | `grid-cols-[auto]` | Auto columns |
| `col1` | `grid-cols-1` | 1 column |
| `col2` | `grid-cols-2` | 2 columns |
| `col3` | `grid-cols-3` | 3 columns |
| `col4` | `grid-cols-4` | 4 columns |
| `col5` | `grid-cols-5` | 5 columns |
| `col6` | `grid-cols-6` | 6 columns |

Legacy naming (`c1`, `c2`, etc.) is also supported.

**Helper:** `getGridColumnsClass(columns)`

### Grid Column Span

| Value | CSS Class | Spans |
|-------|-----------|-------|
| `auto` | _(none)_ | Auto span |
| `span1` | `col-span-1` | 1 column |
| `span2` | `col-span-2` | 2 columns |
| ... | ... | ... |
| `span12` | `col-span-12` | 12 columns (full width) |

**Helper:** `getGridColumnSpanClass(span)`

### Grid Row Span

| Value | CSS Class | Spans |
|-------|-----------|-------|
| `auto` | _(none)_ | Auto span |
| `span1` | `row-span-1` | 1 row |
| `span2` | `row-span-2` | 2 rows |
| `span3` | `row-span-3` | 3 rows |
| `span4` | `row-span-4` | 4 rows |
| `span5` | `row-span-5` | 5 rows |
| `span6` | `row-span-6` | 6 rows |

**Helper:** `getGridRowSpanClass(span)`

### Grid Auto Flow

| Value | CSS Class | Description |
|-------|-----------|-------------|
| `row` | `grid-flow-row` | Fill rows first (default) |
| `column` | `grid-flow-col` | Fill columns first |
| `dense` | `grid-flow-row-dense` | Dense packing (fills gaps) |

**Helper:** `getGridAutoFlowClass(flow)`

---

## Utility Functions

The styleHelpers library also exports several utility functions:

### `joinClasses(...classes)`

Filters falsy values and joins classes into a single string:

```typescript
joinClasses('btn', 'btn-primary', '', null, 'rounded-lg')
// Returns: 'btn btn-primary rounded-lg'
```

### `conditionalClass(condition, trueClass, falseClass?)`

Conditionally includes classes:

```typescript
conditionalClass(isActive, 'bg-primary', 'bg-secondary')
// Returns 'bg-primary' if isActive, otherwise 'bg-secondary'
```

### `mergeClasses(...classArrays)`

Merges multiple class arrays and filters empty strings:

```typescript
mergeClasses(
  ['btn', 'btn-primary'],
  ['rounded-lg', ''],
  getButtonClasses(settings)
)
// Returns single merged array
```

---

## Legacy Support

The styleHelpers library maintains backward compatibility with legacy naming conventions:

| Component | Old Name | New Name |
|-----------|----------|----------|
| Text Transform | `keep` | `normal` |
| Text Transform | `normal_case` | `normal` |
| Border Radius | `standard` | `none` |
| Border Radius (Image) | `small` | `xs` |
| Border Radius (Image) | `medium` | `md` |
| Border Radius (Image) | `large` | `lg` |
| Border Radius (Image) | `xlarge` | `xl` |
| Border Radius (Image) | `x3large` | `xl3` |
| Border Radius (Image) | `huge` | `xl4` |
| Border Radius (Image) | `xhuge` | `full` |
| Grid Columns | `c1`, `c2`, etc. | `col1`, `col2`, etc. |

All legacy values are automatically converted to their new equivalents by the helper functions.

---

## Best Practices

1. **Always use helper functions** - Never hardcode Tailwind classes in component files
2. **Use TypeScript types** - Import types from `styleHelpers/types` for type safety
3. **Follow naming conventions** - Use the standardized naming (e.g., `col1` not `c1`, `normal` not `keep`)
4. **Provide defaults** - All helper functions handle `undefined`/`null` gracefully
5. **Document deviations** - If you need custom behavior, document why in comments
6. **Test across components** - Changes to helpers affect all components using them

---

## Adding New Standards

When adding new style options:

1. Add the type to `styleHelpers/types.ts`
2. Create or update the helper function in the appropriate file
3. Export from `styleHelpers/index.ts`
4. Update this documentation
5. Update affected `.opti-style.json` files
6. Test across all components using the new option

---

## Related Documentation

- [Component Styling Guide](COMPONENT-STYLING-GUIDE.md) - How to use these standards when building components
- [Row & Column Layout Guide](ROW-COLUMN-LAYOUT-GUIDE.md) - Layout system reference
- [Migration Guide](migrations/2025-style-consolidation.md) - Migrating from old to new standards

---

**Last Updated:** January 2025
**Maintained By:** Style Refactor Team
