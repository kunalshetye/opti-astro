---
name: cms-component-builder
description: Build Optimizely CMS components for Astro v5. Use when creating/modifying components, pages, experiences, or working with GraphQL fragments, opti-type.json, or opti-style.json files
---

# CMS Component Builder

Build production-ready Optimizely CMS components with proper GraphQL integration, daisyUI styling, and TypeScript type safety.

## When to Use

Trigger this skill when:
- Creating new components (Button, Card, Hero, etc.), pages (ArticlePage, LandingPage), or experiences
- Modifying `.opti-type.json` or `.opti-style.json` files
- Working with GraphQL fragments (`.graphql` or `.dam.graphql` files)
- Integrating components into `allComponents.graphql` or `_Component.astro`
- Debugging component rendering or GraphQL type issues

## Quick Start

Creating a new "Testimonial" component:

```bash
# 1. Create component directory
mkdir -p src/cms/components/TestimonialComponent

# 2. Create required files
src/cms/components/TestimonialComponent/
├── Testimonial.astro              # Component template
├── Testimonial.opti-type.json     # Content type
├── Testimonial.opti-style.json    # Styles
├── testimonial.graphql            # Base fragment
└── testimonial.dam.graphql        # DAM fragment
```

## Required Files

Every component needs exactly **5 files**:

### 1. `.astro` - Component Template
```typescript
---
import type { TestimonialFragment } from '@/graphql/__generated/graphql';

interface Props {
    data: TestimonialFragment;
}

const { data } = Astro.props;
---

<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <p class="text-lg italic">{data.Quote}</p>
        <div class="card-actions justify-end">
            <p class="font-bold">{data.Author}</p>
        </div>
    </div>
</div>
```

### 2. `.opti-type.json` - Content Type
See `CONTENTTYPE-GUIDE.md` for complete guide on creating content types.

### 3. `.opti-style.json` - Style Definitions
See `STYLE-GUIDE.md` for complete guide on creating style definitions.

### 4. `.graphql` + `.dam.graphql` - GraphQL Fragments

**ALWAYS create both versions.** See `GRAPHQL-PATTERNS.md` for complete details.

**Base (`testimonial.graphql`):**
```graphql
fragment Testimonial on Testimonial {
    Quote { html }
    Author
    AuthorTitle
    AuthorImage {
        ...ContentUrl
    }
}
```

**DAM (`testimonial.dam.graphql`):**
```graphql
fragment Testimonial on Testimonial {
    Quote { html }
    Author
    AuthorTitle
    AuthorImage {
        ...ContentUrl
        ...ContentReferenceItem
    }
}
```

## Component Integration

### 1. Add to allComponents.graphql

```graphql
fragment AllComponentsExceptGrid on _IComponent {
    ...Text
    ...Button
    ...Testimonial  # Add your component here
}
```

**Important:** Add to `AllComponentsExceptGrid`, NOT `AllComponents`

### 2. Sync to CMS & Generate Types

```bash
# Push content type and styles to CMS
yarn type:push ComponentName
yarn style:push StyleName

# ⚠️ Wait ~10 seconds for Optimizely Graph to sync

# Then generate TypeScript types
yarn codegen
```

### 3. Verify Integration

Check `__generated/graphql.ts` for your component type.

## Component Locations

- **Components:** `src/cms/components/` - Reusable UI (Button, Card, Hero)
- **Pages:** `src/cms/pages/` - Page types (ArticlePage, LandingPage)
- **Experiences:** `src/cms/experiences/` - Experience templates
- **Compositions:** `src/cms/compositions/` - Layout elements (Row, Column)

## GraphQL Shared Fragments

Quick reference (full details in `GRAPHQL-PATTERNS.md`):

- `LinkUrl` - Links with url, title, target, text
- `ContentUrl` - Content reference URLs
- `LinkCollection` - Simple link arrays
- `ContentReferenceItem` - DAM metadata (`.dam.graphql` only)
- `DisplaySettings` - Display/styling settings
- `PageUrl` - Page metadata

**Rich text fields:** Always use `{ html }`:
```graphql
Body { html }
Description { html }
```

## Styling with daisyUI + TailwindCSS

**Prefer daisyUI components:**
```html
<button class="btn btn-primary btn-lg">
<div class="card card-compact">
<div class="hero min-h-screen">
```

**Use theme variables:**
```html
<div class="bg-base-100 text-base-content">
```

**Mobile-first responsive:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Workflow

1. **Create Files**
   - `.astro`, `.opti-type.json`, `.opti-style.json`
   - **Both** `.graphql` and `.dam.graphql` fragments

2. **Integrate**
   - Add fragment to `allComponents.graphql` (or appropriate aggregation file)

3. **Sync with CMS**
   ```bash
   yarn type:push ComponentName    # Push content type
   yarn style:push StyleName        # Push styles
   # ⚠️ WAIT ~10 seconds for Graph sync before codegen
   ```

4. **Generate Types**
   ```bash
   yarn codegen  # Run AFTER Graph sync completes
   ```

5. **Verify**
   - Check TypeScript types in `__generated/graphql.ts`
   - Test component rendering
   - Validate responsive behavior

## Verification Checklist

Before completing, ensure:
- ✓ All 5 required files created
- ✓ Both `.graphql` and `.dam.graphql` fragments created
- ✓ Fragment added to `allComponents.graphql`
- ✓ Content type and styles pushed to CMS
- ✓ Waited ~10 seconds for Graph sync
- ✓ `yarn codegen` runs successfully
- ✓ Component uses daisyUI classes consistently
- ✓ TypeScript props match generated types
- ✓ Responsive design implemented
- ✓ No TypeScript errors

## Resources

All guides are bundled with this skill for quick reference:

- **GraphQL Patterns:** See `GRAPHQL-PATTERNS.md` for:
  - Complete fragment syntax and structure
  - DAM vs non-DAM differences
  - Real-world examples from existing components
  - Shared fragment catalog
  - Integration patterns

- **Content Type Creation:** See `CONTENTTYPE-GUIDE.md` for:
  - Content type structure and syntax
  - Property definitions and types
  - Display settings configuration
  - Real-world examples

- **Style Creation:** See `STYLE-GUIDE.md` for:
  - Style definition structure
  - Display settings mapping to CSS classes
  - daisyUI and TailwindCSS patterns
  - Responsive variants

## Common Patterns

**Component with links:**
```graphql
Links {
    ...LinkCollection
}
```

**Component with images:**
```graphql
# Base
Image {
    ...ContentUrl
}

# DAM
Image {
    ...ContentUrl
    ...ContentReferenceItem
}
```

**Component with metadata:**
```graphql
_metadata {
    types
    displayName
}
```

---

Remember: Every component must be production-ready with complete integration, proper types, and consistent styling.
