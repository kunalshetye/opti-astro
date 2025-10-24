# GraphQL Fragment Patterns

This document describes the GraphQL fragment patterns used in the Optimizely Astro project.

## Component Fragment Structure

Every component must have a GraphQL fragment file matching this pattern:

```graphql
fragment ComponentName on ComponentType {
    PropertyName
    AnotherProperty {
        nestedField
    }
    ReferenceProperty {
        ...SharedFragment
    }
}
```

### Key Rules

1. **Fragment Name**: Must match the component name (PascalCase)
2. **Type**: Use `on TypeName` matching the content type definition
3. **Properties**: List all properties from the `.opti-type.json` file
4. **Shared Fragments**: Reference shared fragments using `...FragmentName` syntax

## Available Shared Fragments

Located in `src/cms/shared/fragments/`:

### URL Fragments

**LinkUrl** - Complete link information
```graphql
fragment LinkUrl on Link {
    url { default, hierarchical }
    title
    target
    text
}
```

**ContentUrl** - Content reference URLs
```graphql
fragment ContentUrl on ContentReference {
    url { default, hierarchical }
}
```

**LinkCollection** - Simplified link collection
```graphql
fragment LinkCollection on Link {
    text
    url { default }
}
```

**PageUrl** - Page URL information (in `src/cms/shared/fragments/pageUrl.graphql`)

### Display Settings

**DisplaySettings** - Display/styling settings
```graphql
fragment DisplaySettings on CompositionDisplaySetting {
    key
    value
}
```

### Media Fragments

Located in `src/cms/shared/fragments/`:
- **publicImageAsset.dam.graphql** - DAM image assets
- **publicVideoAsset.dam.graphql** - DAM video assets
- **contentReferenceItem.dam.graphql** - DAM content references

## Common Component Patterns

### Simple Component (Button)

```graphql
fragment Button on Button {
    ButtonLabel
    ButtonLink {
        ...LinkUrl
    }
}
```

### Component with Rich Content (Hero)

```graphql
fragment Hero on Hero {
    Video {
        ...ContentUrl
    }
    Image {
        ...ContentUrl
    }
    Heading
    SubHeading
    Body {
        html
    }
    Links {
        ...LinkCollection
    }
}
```

### Component with Display Options (Card)

```graphql
fragment Card on Card {
    DisplayAs
    Heading
    SubHeading
    Body {
        html
    }
    Asset {
        ...ContentUrl
    }
    Links {
        ...LinkCollection
    }
}
```

### Component with Content Area (Grid)

**SPECIAL**: Grid is separated in `allComponents.graphql` due to recursive rendering.

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

## Page Fragment Structure

Page fragments include metadata, content areas, and settings:

```graphql
fragment PageName on PageType {
    _metadata {
        ...PageUrl
        published
        displayName
    }
    TopContentArea {
        _metadata {
            types
        }
        ...ContentArea
    }
    MainContentArea {
        _metadata {
            types
        }
        ...ContentArea
    }
    SeoSettings {
        ...PageSeoSettingsProperty
    }
    PageAdminSettings {
        ...PageAdminSettingsProperty
    }
}
```

## Content Area Pattern

The `ContentArea` fragment is used for all content areas:

```graphql
fragment ContentArea on _IContent {
    ...AllComponents
    ...ArticlePageExcerpt
}
```

## Integration: Adding to allComponents.graphql

**Location**: `src/cms/components/allComponents.graphql`

Every new component fragment MUST be added here:

```graphql
fragment AllComponents on _IComponent {
    ...AllComponentsExceptGrid
    ...Grid
}

fragment AllComponentsExceptGrid on _IComponent {
    ...Text
    ...Image
    ...CallToAction
    ...Video
    ...Button
    ...Card
    ...Hero
    ...YourNewComponent  # Add here
}
```

**Important**:
- Add to `AllComponentsExceptGrid` (not `AllComponents`)
- Grid must remain separate for recursive rendering
- Order doesn't matter but alphabetical is preferred

## Rich Text Fields

For XHTML/rich text fields, always request the `html` property:

```graphql
Body {
    html
}
```

## Metadata Patterns

### Component Metadata

```graphql
_metadata {
    types
}
```

### Page Metadata

```graphql
_metadata {
    ...PageUrl
    published
    displayName
    key
    version
}
```

## Display Settings Usage

Display settings are included in experience queries for Row/Column styling:

```graphql
displaySettings {
    ...DisplaySettings
}
```

This is handled automatically by the experience query and doesn't need to be added to component fragments.

## DAM vs Non-DAM Fragments

This project supports both standard Optimizely content references and DAM (Digital Asset Management) enhanced references.

### When to Use DAM Fragments

**Use DAM fragments (`.dam.graphql`)** when:
- The CMS instance has Optimizely DAM enabled
- You need additional metadata from media assets (alt text, asset properties)
- You want to access `cmp_PublicImageAsset` or `cmp_PublicVideoAsset` types

**Use regular fragments (`.graphql`)** when:
- DAM is not enabled
- You only need the URL of content references
- Working with standard content references

### Key Differences

#### Non-DAM Fragment
```graphql
fragment Hero on Hero {
    Image {
        ...ContentUrl  # Only URL
    }
}
```

This provides:
- `url.default` - The content URL
- `url.hierarchical` - Hierarchical URL

#### DAM-Enabled Fragment
```graphql
fragment Hero on Hero {
    Image {
        ...ContentUrl           # URL
        ...ContentReferenceItem # Plus item metadata
    }
}
```

This provides everything above PLUS:
- `item.AltText` - Alternative text for images
- `item.Url` - Direct asset URL for DAM assets
- `item._metadata.displayName` - Content display name

### ContentReferenceItem Fragment

The `ContentReferenceItem` fragment provides access to the actual referenced content:

```graphql
fragment ContentReferenceItem on ContentReference {
    item {
        ... on ImageMedia {
            AltText
        }
        ... on cmp_PublicImageAsset {
            ...PublicImageAsset
        }
        ... on cmp_PublicVideoAsset {
            ...PublicVideoAsset
        }
        ... on _IContent {
            _metadata {
                displayName
            }
        }
    }
}
```

### DAM Asset Fragments

**PublicImageAsset** (`publicImageAsset.dam.graphql`):
```graphql
fragment PublicImageAsset on cmp_PublicImageAsset {
    AltText
    Url
}
```

**PublicVideoAsset** (`publicVideoAsset.dam.graphql`):
```graphql
fragment PublicVideoAsset on cmp_PublicVideoAsset {
    Url
}
```

### Real-World Examples

#### Card Component

**Non-DAM** (`card.graphql`):
```graphql
fragment Card on Card {
    Asset {
        ...ContentUrl
    }
}
```

**DAM-Enabled** (`card.dam.graphql`):
```graphql
fragment Card on Card {
    Asset {
        ...ContentUrl
        ...ContentReferenceItem  # Added for DAM
    }
}
```

#### Article Page

**Non-DAM** (`articlePage.graphql`):
```graphql
fragment ArticlePage on ArticlePage {
    PromoImage {
        ...ContentUrl
    }
}
```

**DAM-Enabled** (`articlePage.dam.graphql`):
```graphql
fragment ArticlePage on ArticlePage {
    PromoImage {
        ...ContentUrl
        ...ContentReferenceItem  # Added for DAM
    }
}
```

### Creating DAM-Compatible Components

When creating a new component that uses content references:

1. **Create the base fragment** (`component.graphql`):
```graphql
fragment MyComponent on MyComponent {
    Image {
        ...ContentUrl
    }
}
```

2. **Create the DAM version** (`component.dam.graphql`):
```graphql
fragment MyComponent on MyComponent {
    Image {
        ...ContentUrl
        ...ContentReferenceItem
    }
}
```

3. **Update allComponents.graphql** - Add only the base fragment:
```graphql
fragment AllComponentsExceptGrid on _IComponent {
    ...MyComponent
}
```

### Which Fragment is Used?

The project determines which fragment to use based on environment configuration:
- If DAM is enabled, `.dam.graphql` fragments are used
- If DAM is disabled, `.graphql` fragments are used

### Best Practice

**Always create both versions** if your component has content references (Image, Video, Asset properties):
- Base version (`.graphql`) for standard deployments
- DAM version (`.dam.graphql`) for DAM-enabled deployments

Only the base fragment name needs to be added to `allComponents.graphql` - the system handles switching between versions.

## Naming Conventions

- **Fragment name**: PascalCase, matches component name
- **File name**: camelCase, matches fragment name
- **Properties**: PascalCase (CMS convention)
- **Nested fields**: camelCase (GraphQL convention)

## Testing Your Fragment

After creating a GraphQL fragment:

1. Add it to `allComponents.graphql`
2. Run `yarn codegen` to generate TypeScript types
3. Check `__generated/graphql.ts` for your component type
4. Verify the Astro component props match the generated type

## Example: Creating a New Component Fragment

For a "Testimonial" component:

1. Create `src/cms/components/TestimonialComponent/testimonial.graphql`:

```graphql
fragment Testimonial on Testimonial {
    Quote {
        html
    }
    Author
    AuthorTitle
    AuthorImage {
        ...ContentUrl
    }
    Rating
}
```

2. Add to `src/cms/components/allComponents.graphql`:

```graphql
fragment AllComponentsExceptGrid on _IComponent {
    ...Text
    ...Button
    ...Testimonial  # Add this line
}
```

3. Run codegen:
```bash
yarn codegen
```

4. Use in Astro component:
```typescript
import type { TestimonialFragment } from '@/graphql/__generated/graphql';

interface Props {
    data: TestimonialFragment;
}
```
