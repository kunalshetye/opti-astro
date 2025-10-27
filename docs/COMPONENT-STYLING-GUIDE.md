# Component Styling Guide

This guide explains how to properly implement styling in Optimizely CMS components using the centralized `styleHelpers` library. Follow these patterns to ensure consistency, maintainability, and reduce code duplication.

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Component Architecture](#component-architecture)
- [Creating Styling Functions](#creating-styling-functions)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Basic Component Styling Function

```typescript
// src/cms/components/MyComponent/MyComponentStyling.ts
import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';
import {
  getBackgroundColorClass,
  getTextColorClass,
  getBorderRadiusClass
} from '../../shared/styleHelpers/index.ts';

export function getMyComponentStyles(displaySettings: DisplaySettingsFragment[]): string[] {
  const settings = getDictionaryFromDisplaySettings(displaySettings);
  const cssClasses: string[] = [];

  // Background color
  const bgColor = getBackgroundColorClass(settings['backgroundColor']);
  if (bgColor) cssClasses.push(bgColor);

  // Text color
  const textColor = getTextColorClass(settings['backgroundColor']);
  if (textColor) cssClasses.push(textColor);

  // Border radius
  const radius = getBorderRadiusClass(settings['borderRadius']);
  if (radius) cssClasses.push(radius);

  return cssClasses;
}
```

### Using in Astro Component

```astro
---
// src/cms/components/MyComponent/MyComponent.astro
import { getMyComponentStyles } from './MyComponentStyling';

const classes = getMyComponentStyles(data.displaySettings || []);
---

<div class:list={['my-component', ...classes]}>
  <slot />
</div>
```

---

## Core Concepts

### 1. Display Settings

Display settings from the CMS are provided as an array of `DisplaySettingsFragment` objects. Always convert them to a dictionary using `getDictionaryFromDisplaySettings()`:

```typescript
const settings = getDictionaryFromDisplaySettings(displaySettings);
// Now access as: settings['backgroundColor'], settings['buttonStyle'], etc.
```

### 2. Style Helper Functions

All style conversions should use helper functions from `styleHelpers`. **Never hardcode Tailwind classes** directly in component files.

```typescript
// ❌ Bad - Hardcoded
if (settings['buttonStyle'] === 'soft') {
  cssClasses.push('btn-soft');
}

// ✅ Good - Using helper
cssClasses.push(getButtonStyleClass(settings['buttonStyle']));
```

### 3. Null Safety

All helper functions handle `undefined` and `null` values gracefully, returning sensible defaults or empty strings:

```typescript
getBackgroundColorClass(undefined); // Returns ''
getButtonStyleClass(null);          // Returns 'btn-standard' (default)
```

### 4. Legacy Support

Helper functions automatically handle legacy naming conventions:

```typescript
// Both work correctly
getTextTransformClass('normal');  // Returns ''
getTextTransformClass('keep');    // Returns '' (legacy, same as 'normal')
```

---

## Component Architecture

### File Structure

```
src/cms/components/MyComponent/
├── MyComponent.astro          # Component template
├── MyComponentStyling.ts      # Styling logic (this file!)
├── MyComponent.opti-type.json # CMS content type definition
├── MyComponent.opti-style.json# CMS style definition
├── MyComponent.graphql        # GraphQL fragment
└── MyComponent.md             # Documentation (optional)
```

### Styling File Pattern

Every component should have a `*Styling.ts` file that exports one or more styling functions:

```typescript
// Export a main styling function
export function getMyComponentStyles(displaySettings: DisplaySettingsFragment[]): string[] {
  // Returns array of CSS classes
}

// Optionally export specialized functions
export function getMyComponentHeaderStyles(displaySettings: DisplaySettingsFragment[]): string {
  // Returns single CSS class string
}
```

---

## Creating Styling Functions

### Step 1: Import Required Helpers

```typescript
import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';
import {
  // Import only what you need
  getBackgroundColorClass,
  getTextColorClass,
  getButtonClasses,
  getBorderRadiusClass,
  getGapClass
} from '../../shared/styleHelpers/index.ts';
```

### Step 2: Create the Function Signature

```typescript
export function getMyComponentStyles(
  displaySettings: DisplaySettingsFragment[],
  options?: {
    includeBackground?: boolean;  // Optional configuration
  }
): string[] {  // Return array for flexibility
```

### Step 3: Convert Display Settings

```typescript
  const settings = getDictionaryFromDisplaySettings(displaySettings);
  const cssClasses: string[] = [];
```

### Step 4: Apply Helpers

```typescript
  // Example: Background color
  const bgColor = getBackgroundColorClass(settings['backgroundColor']);
  if (bgColor) cssClasses.push(bgColor);

  // Example: Using complete helper (buttons)
  const buttonClasses = getButtonClasses({
    buttonStyle: settings['buttonStyle'],
    buttonType: settings['buttonType'],
    buttonSize: settings['buttonSize'],
    buttonWidth: settings['buttonWidth'],
    buttonRadius: settings['buttonRadius'],
    buttonAction: settings['buttonAction']
  });
  cssClasses.push(...buttonClasses);
```

### Step 5: Return Classes

```typescript
  return cssClasses;
}
```

---

## Common Patterns

### Pattern 1: Basic Styling (Colors, Spacing, Borders)

```typescript
export function getBasicStyles(displaySettings: DisplaySettingsFragment[]): string[] {
  const settings = getDictionaryFromDisplaySettings(displaySettings);
  const cssClasses: string[] = [];

  // Background & text colors
  const bgColor = getBackgroundColorClass(settings['backgroundColor']);
  if (bgColor) cssClasses.push(bgColor);

  const textColor = getTextColorClass(settings['backgroundColor']);
  if (textColor) cssClasses.push(textColor);

  // Spacing
  const gap = getGapClass(settings['gap']);
  if (gap) cssClasses.push(gap);

  // Border radius
  const radius = getBorderRadiusClass(settings['borderRadius']);
  if (radius) cssClasses.push(radius);

  return cssClasses;
}
```

### Pattern 2: Button Styling

Use the `getButtonClasses()` convenience helper for complete button styling:

```typescript
export function getButtonStyles(
  displaySettings: DisplaySettingsFragment[],
  needButtonType: boolean = true
): string[] {
  const settings = getDictionaryFromDisplaySettings(displaySettings);
  const cssClasses: string[] = [];

  // Text transform (separate from button classes)
  const textTransform = getTextTransformClass(
    settings['textTransform'] || settings['transform']  // Support legacy
  );
  if (textTransform) cssClasses.push(textTransform);

  // All button styling in one call
  const buttonClasses = getButtonClasses(
    {
      buttonStyle: settings['buttonStyle'],
      buttonType: settings['buttonType'],
      buttonSize: settings['buttonSize'],
      buttonWidth: settings['buttonWidth'],
      buttonRadius: settings['buttonRadius'],
      buttonAction: settings['buttonAction']
    },
    { includeType: needButtonType }  // Optional: exclude button type
  );

  cssClasses.push(...buttonClasses);
  return cssClasses;
}
```

See: `src/cms/components/ButtonComponent/ButtonStyling.ts:5`

### Pattern 3: Text Styling

```typescript
export function getTextStyles(displaySettings: DisplaySettingsFragment[]): string[] {
  const settings = getDictionaryFromDisplaySettings(displaySettings);
  const cssClasses: string[] = [];

  // Color
  const color = getDirectTextColorClass(settings['textColor']);
  if (color) cssClasses.push(color);

  // Transform
  const transform = getTextTransformClass(settings['textTransform']);
  if (transform) cssClasses.push(transform);

  // Alignment
  const alignment = getTextAlignmentClass(settings['textAlign']);
  if (alignment) cssClasses.push(alignment);

  // Size
  const size = getTextSizeClass(settings['textSize']);
  if (size) cssClasses.push(size);

  // Weight
  const weight = getFontWeightClass(settings['fontWeight']);
  if (weight) cssClasses.push(weight);

  return cssClasses;
}
```

### Pattern 4: Image Styling

Use the `getImageClasses()` convenience helper:

```typescript
export function getImageStyles(displaySettings: DisplaySettingsFragment[]): string[] {
  const settings = getDictionaryFromDisplaySettings(displaySettings);

  // Complete image styling in one call
  return getImageClasses({
    imageFit: settings['imageFit'],
    imagePosition: settings['imagePosition'],
    aspectRatio: settings['aspectRatio'],
    imageFilter: settings['imageFilter']
  });
}

// Or individually if needed
export function getImageFitClass(displaySettings: DisplaySettingsFragment[]): string {
  const settings = getDictionaryFromDisplaySettings(displaySettings);
  return getImageFitClass(settings['imageFit']) || 'object-cover';
}
```

### Pattern 5: Layout & Alignment

```typescript
export function getLayoutStyles(displaySettings: DisplaySettingsFragment[]): string[] {
  const settings = getDictionaryFromDisplaySettings(displaySettings);
  const cssClasses: string[] = [];

  // Vertical alignment
  const vAlign = getVerticalAlignmentClass(settings['verticalAlign']);
  if (vAlign) cssClasses.push(vAlign);

  // Horizontal alignment
  const hAlign = getHorizontalAlignmentClass(settings['horizontalAlign']);
  if (hAlign) cssClasses.push(hAlign);

  // Gap
  const gap = getGapClass(settings['gap']);
  if (gap) cssClasses.push(gap);

  return cssClasses;
}
```

### Pattern 6: Multiple Specialized Functions

For complex components, create multiple focused functions:

```typescript
// Main component styles
export function getCardStyles(displaySettings: DisplaySettingsFragment[]): string[] {
  const settings = getDictionaryFromDisplaySettings(displaySettings);
  const cssClasses: string[] = [];
  // ... main card styling
  return cssClasses;
}

// Card header specific
export function getCardHeaderStyles(displaySettings: DisplaySettingsFragment[]): string {
  const settings = getDictionaryFromDisplaySettings(displaySettings);
  const transform = settings['headerTextTransform'] || settings['transformHeader'];
  return getTextTransformClass(transform) || 'normal-case';
}

// Card text alignment
export function getCardTextAlignmentStyle(displaySettings: DisplaySettingsFragment[]): string {
  const settings = getDictionaryFromDisplaySettings(displaySettings);
  return getTextAlignmentClass(settings['textAlign']) || 'text-left';
}
```

See: `src/cms/components/CardComponent/CardStyling.ts:5`

### Pattern 7: Background Tints

For components with background tint overlays (like Hero):

```typescript
export function getBackgroundTintStyles(displaySettings: DisplaySettingsFragment[]): string[] {
  const settings = getDictionaryFromDisplaySettings(displaySettings);

  const tintColor = settings['tintColor'];
  const tintOpacity = settings['tintOpacity'];

  if (!tintColor || !tintOpacity || tintOpacity === 'o_0') {
    return [];  // No tint
  }

  return getBackgroundTintClasses(tintColor, tintOpacity);
}
```

### Pattern 8: Conditional Styling

Use optional parameters to control behavior:

```typescript
export function getMyComponentStyles(
  displaySettings: DisplaySettingsFragment[],
  options?: {
    includeBackground?: boolean;
    includeSpacing?: boolean;
  }
): string[] {
  const settings = getDictionaryFromDisplaySettings(displaySettings);
  const cssClasses: string[] = [];

  // Conditionally include background
  if (options?.includeBackground !== false) {
    const bg = getBackgroundColorClass(settings['backgroundColor']);
    if (bg) cssClasses.push(bg);
  }

  // Conditionally include spacing
  if (options?.includeSpacing) {
    const gap = getGapClass(settings['gap']);
    if (gap) cssClasses.push(gap);
  }

  return cssClasses;
}
```

---

## Best Practices

### 1. Always Use Helpers

**Never hardcode Tailwind classes** for values that come from display settings:

```typescript
// ❌ Bad
if (settings['backgroundColor'] === 'primary') {
  cssClasses.push('bg-primary');
}

// ✅ Good
const bgColor = getBackgroundColorClass(settings['backgroundColor']);
if (bgColor) cssClasses.push(bgColor);
```

### 2. Handle Legacy Naming

Support both old and new property names during transition:

```typescript
// Support both 'textTransform' and legacy 'transform'
const transform = settings['textTransform'] || settings['transform'];
const transformClass = getTextTransformClass(transform);
```

### 3. Return Arrays for Flexibility

Return arrays even if you only have one class - it's more flexible:

```typescript
// ✅ Good - Can easily add more classes later
export function getStyles(displaySettings: DisplaySettingsFragment[]): string[] {
  return [getBackgroundColorClass(settings['backgroundColor'])].filter(Boolean);
}

// ❌ Less flexible - Hard to add more classes
export function getStyles(displaySettings: DisplaySettingsFragment[]): string {
  return getBackgroundColorClass(settings['backgroundColor']);
}
```

### 4. Filter Falsy Values

Always filter out empty strings before returning:

```typescript
return cssClasses.filter(Boolean);
// or
return [class1, class2, class3].filter(Boolean);
```

### 5. Use Convenience Helpers

Use combined helpers like `getButtonClasses()` and `getImageClasses()` instead of calling individual helpers:

```typescript
// ❌ More verbose
cssClasses.push(getButtonStyleClass(settings['buttonStyle']));
cssClasses.push(getButtonTypeClass(settings['buttonType']));
cssClasses.push(getButtonSizeClass(settings['buttonSize']));
cssClasses.push(getButtonWidthClass(settings['buttonWidth']));
cssClasses.push(getButtonRadiusClass(settings['buttonRadius']));
cssClasses.push(getButtonActionClass(settings['buttonAction']));

// ✅ Cleaner
cssClasses.push(...getButtonClasses({
  buttonStyle: settings['buttonStyle'],
  buttonType: settings['buttonType'],
  buttonSize: settings['buttonSize'],
  buttonWidth: settings['buttonWidth'],
  buttonRadius: settings['buttonRadius'],
  buttonAction: settings['buttonAction']
}));
```

### 6. Document Component-Specific Behavior

Add comments for non-obvious behavior:

```typescript
export function getCardStyles(displaySettings: DisplaySettingsFragment[]): string[] {
  const settings = getDictionaryFromDisplaySettings(displaySettings);
  const cssClasses: string[] = [];

  // Note: button styles managed via: src/cms/components/ButtonComponent/ButtonStyling.ts
  // This component delegates button styling to the Button component

  return cssClasses;
}
```

### 7. Type Safety

Import and use TypeScript types from the helpers:

```typescript
import type { ThemeColor, ButtonStyle } from '../../shared/styleHelpers/types';

function validateColor(color: string): color is ThemeColor {
  // Type-safe validation
}
```

### 8. Keep Functions Focused

Create multiple small functions instead of one large function:

```typescript
// ✅ Good - Focused functions
export function getCardStyles(displaySettings: DisplaySettingsFragment[]): string[];
export function getCardHeaderStyles(displaySettings: DisplaySettingsFragment[]): string;
export function getCardTextAlignment(displaySettings: DisplaySettingsFragment[]): string;

// ❌ Bad - One giant function that does everything
export function getAllCardStyles(displaySettings: DisplaySettingsFragment[]): {
  card: string[],
  header: string,
  text: string
};
```

---

## Migration Guide

### Migrating Existing Components

If you're updating an old component to use the styleHelpers library:

#### Step 1: Identify Hardcoded Classes

Find all places where Tailwind classes are hardcoded based on display settings:

```typescript
// Old code
if (settings['backgroundColor'] === 'primary') {
  cssClasses.push('bg-primary', 'text-primary-content');
} else if (settings['backgroundColor'] === 'secondary') {
  cssClasses.push('bg-secondary', 'text-secondary-content');
}
```

#### Step 2: Replace with Helpers

```typescript
// New code
const bgColor = getBackgroundColorClass(settings['backgroundColor']);
if (bgColor) cssClasses.push(bgColor);

const textColor = getTextColorClass(settings['backgroundColor']);
if (textColor) cssClasses.push(textColor);
```

#### Step 3: Remove Duplicate Logic

If your component duplicates logic from other components, delegate to shared helpers:

```typescript
// Old - Button logic duplicated in Card component
if (settings['buttonStyle'] === 'soft') {
  btnClasses.push('btn-soft');
}
// ... 100 more lines of button logic

// New - Use shared helper
const buttonClasses = getButtonClasses({...});
```

#### Step 4: Test

After migration:

1. Run `yarn build` to ensure no errors
2. Visually test the component in the CMS
3. Check that all style options work as expected
4. Verify responsive behavior

---

## Troubleshooting

### Issue: Classes Not Applying

**Problem:** Display settings not converting to CSS classes

**Solution:** Check that you're using the correct property name:

```typescript
// ✅ Correct
const settings = getDictionaryFromDisplaySettings(displaySettings);
const bgColor = getBackgroundColorClass(settings['backgroundColor']);

// ❌ Wrong - Direct property access won't work
const bgColor = getBackgroundColorClass(displaySettings.backgroundColor);
```

### Issue: Legacy Names Not Working

**Problem:** Old property names causing issues

**Solution:** Support both old and new names:

```typescript
const transform = settings['textTransform'] || settings['transform'];
const radius = settings['borderRadius'] || settings['roundedCorners'];
```

### Issue: Empty Classes in Output

**Problem:** Extra spaces in class string

**Solution:** Always filter falsy values:

```typescript
// ✅ Good
return cssClasses.filter(Boolean);

// ❌ Bad - May include empty strings
return cssClasses;
```

### Issue: Button Styles Not Working

**Problem:** Button appears unstyled

**Solution:** Make sure you're including the base `btn` class in your template:

```astro
---
const buttonClasses = getButtonStyles(displaySettings);
---

<!-- ✅ Include base 'btn' class -->
<button class:list={['btn', ...buttonClasses]}>Click me</button>

<!-- ❌ Missing base class -->
<button class:list={buttonClasses}>Click me</button>
```

### Issue: Type Errors

**Problem:** TypeScript errors when calling helpers

**Solution:** Import the correct types:

```typescript
import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';

export function getStyles(displaySettings: DisplaySettingsFragment[]): string[] {
  // Now TypeScript knows the correct type
}
```

---

## Advanced Topics

### Creating New Helpers

If you need a new style conversion that doesn't exist:

1. Add the type to `src/cms/shared/styleHelpers/types.ts`
2. Create the helper in the appropriate file (e.g., `colorHelpers.ts`)
3. Export from `src/cms/shared/styleHelpers/index.ts`
4. Update `docs/STYLE-STANDARDS.md`
5. Use in your component

Example:

```typescript
// types.ts
export type MyNewStyle = 'option1' | 'option2' | 'option3';

// myHelpers.ts
export function getMyNewStyleClass(style: string | undefined | null): string {
  if (!style) return 'default-class';

  const styleMap: Record<string, string> = {
    'option1': 'tailwind-class-1',
    'option2': 'tailwind-class-2',
    'option3': 'tailwind-class-3',
  };

  return styleMap[style] || 'default-class';
}

// index.ts
export { getMyNewStyleClass } from './myHelpers';
```

### Performance Optimization

For components that render many times, consider memoizing:

```typescript
const styleCache = new Map<string, string[]>();

export function getCachedStyles(displaySettings: DisplaySettingsFragment[]): string[] {
  const key = JSON.stringify(displaySettings);

  if (styleCache.has(key)) {
    return styleCache.get(key)!;
  }

  const styles = computeStyles(displaySettings);
  styleCache.set(key, styles);
  return styles;
}
```

**Note:** Only use caching if profiling shows it's necessary.

---

## Related Documentation

- [Style Standards Reference](STYLE-STANDARDS.md) - Complete list of all standard values
- [Row & Column Layout Guide](ROW-COLUMN-LAYOUT-GUIDE.md) - Layout-specific styling
- [Migration Guide](migrations/2025-style-consolidation.md) - Detailed migration instructions

---

## Examples in Codebase

Reference these well-implemented examples:

- **Button Component** - `src/cms/components/ButtonComponent/ButtonStyling.ts:5`
  - Shows use of `getButtonClasses()` convenience helper
  - Handles legacy `transform` property
  - Optional `needButtonType` parameter

- **Card Component** - `src/cms/components/CardComponent/CardStyling.ts:5`
  - Multiple focused functions (header, text, alignment)
  - Legacy property support
  - Clean delegation to shared helpers

- **Hero Component** - `src/cms/components/HeroComponent/HeroStyling.ts`
  - Background tint handling
  - Text color overrides
  - Complex multi-section styling

- **Text Component** - `src/cms/components/TextComponent/TextStyling.ts`
  - Text-specific helpers usage
  - Color, transform, alignment patterns

---

**Last Updated:** January 2025
**Maintained By:** Style Refactor Team

**Questions or Issues?** Refer to the [Style Standards Reference](STYLE-STANDARDS.md) or check existing component implementations for examples.
