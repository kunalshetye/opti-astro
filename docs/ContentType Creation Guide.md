# ContentType Creation Guide

This guide provides comprehensive documentation for creating opti-type.json files for Optimizely SaaS CMS components, based on the OpenAPI specifications and existing project patterns.

## File Structure

Content types are defined in `.opti-type.json` files alongside your component files with this structure:

```
src/cms/components/YourComponent/
├── YourComponent.astro
├── YourComponent.opti-type.json  ← This file
├── YourComponent.opti-style.json
└── YourComponent.graphql
```

## Basic Structure

```json
{
  "key": "ComponentName",
  "displayName": "Human Readable Name",
  "description": "Description of the component",
  "baseType": "component",
  "sortOrder": 0,
  "mayContainTypes": [],
  "mediaFileExtensions": [],
  "compositionBehaviors": ["elementEnabled"],
  "properties": {
    // Property definitions go here
  }
}
```

## Root Level Properties

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `key` | string | Unique identifier (2-255 chars, alphanumeric + underscore, must start with letter) | `"Button"` |
| `displayName` | string | Human-readable name (max 255 chars) | `"Button Component"` |
| `baseType` | string | Must be `"component"` for components | `"component"` |

### Optional Fields

| Field | Type | Description | Default | Example |
|-------|------|-------------|---------|---------|
| `description` | string | Component description (max 255 chars) | `""` | `"A flexible button component"` |
| `sortOrder` | integer | Display order in CMS | `0` | `10` |
| `mayContainTypes` | array | Content types this can contain | `[]` | `["Button", "Text"]` |
| `mediaFileExtensions` | array | Supported media file extensions | `[]` | `[".jpg", ".png"]` |
| `compositionBehaviors` | array | How component can be used in compositions | `[]` | `["elementEnabled", "sectionEnabled"]` |

### Base Types

Available base types:
- `component` - Standard component
- `page` - Page type
- `media` - Media type
- `image` - Image media
- `video` - Video media
- `folder` - Container type

### Composition Behaviors

Controls where the component can be used:
- `elementEnabled` - Can be used as page elements
- `sectionEnabled` - Can be used in sections  
- `formsElementEnabled` - Can be used in forms

## Property Types

Properties are defined in the `properties` object. Each property must have a unique key and specific structure based on its type.

### Basic Property Structure

```json
"PropertyName": {
  "type": "propertyType",
  "displayName": "Human Readable Name",
  "description": "Property description",
  "localized": true,
  "required": false,
  "group": "Information",
  "sortOrder": 10,
  "indexingType": "searchable",
  "editorSettings": {}
}
```

### Common Property Fields

| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `type` | string | Property data type | ✅ | `"string"` |
| `displayName` | string | Human-readable name (max 255 chars) | ❌ | `"Button Text"` |
| `description` | string | Property description (max 2000 chars) | ❌ | `"Text shown on the button"` |
| `localized` | boolean | Whether property supports localization | ❌ | `true` |
| `required` | boolean | Whether property is mandatory | ❌ | `false` |
| `group` | string | Property group for CMS organization | ❌ | `"Information"` |
| `sortOrder` | integer | Display order within group | ❌ | `10` |
| `indexingType` | string | Search engine indexing behavior | ❌ | `"searchable"` |
| `editorSettings` | object | Custom editor configuration | ❌ | `{}` |

### Indexing Types

- `disabled` - Not indexed
- `queryable` - Available for filtering
- `searchable` - Available for full-text search

## Detailed Property Types

### 1. String Properties

Basic text input fields.

```json
"Title": {
  "type": "string",
  "displayName": "Title",
  "description": "Component title",
  "localized": true,
  "required": true,
  "group": "Information",
  "sortOrder": 10,
  "indexingType": "searchable",
  "minLength": 1,
  "maxLength": 255,
  "pattern": "^[a-zA-Z0-9\\s]+$",
  "editorSettings": {}
}
```

**String-specific fields:**
- `format` - Property format key (e.g., `"shortString"`, `"html"`)
- `minLength` - Minimum character length
- `maxLength` - Maximum character length  
- `pattern` - Regex validation pattern
- `enum` - Predefined value options

**Example with HTML format:**
```json
"Description": {
  "type": "string",
  "format": "html",
  "displayName": "Description",
  "localized": true,
  "required": false,
  "indexingType": "searchable"
}
```

**Example with enumeration:**
```json
"Status": {
  "type": "string",
  "displayName": "Status",
  "required": true,
  "enum": [
    {
      "value": "active",
      "displayName": "Active"
    },
    {
      "value": "inactive", 
      "displayName": "Inactive"
    }
  ]
}
```

### 2. Boolean Properties

True/false toggle fields.

```json
"IsActive": {
  "type": "boolean",
  "displayName": "Is Active",
  "description": "Whether the component is active",
  "required": false,
  "group": "Settings",
  "sortOrder": 20
}
```

### 3. Integer Properties

Whole number fields.

```json
"ItemCount": {
  "type": "integer",
  "displayName": "Item Count",
  "description": "Number of items to display",
  "required": false,
  "minimum": 1,
  "maximum": 50,
  "group": "Settings",
  "sortOrder": 30
}
```

**Integer-specific fields:**
- `minimum` - Minimum allowed value
- `maximum` - Maximum allowed value
- `enum` - Predefined value options

### 4. Float Properties

Decimal number fields.

```json
"Rating": {
  "type": "float", 
  "displayName": "Rating",
  "description": "Product rating",
  "required": false,
  "minimum": 0.0,
  "maximum": 5.0,
  "group": "Information"
}
```

**Float-specific fields:**
- `minimum` - Minimum allowed value  
- `maximum` - Maximum allowed value
- `enum` - Predefined value options

### 5. DateTime Properties

Date and time picker fields.

```json
"PublishDate": {
  "type": "dateTime",
  "displayName": "Publish Date",
  "description": "When to publish the content",
  "required": false,
  "minimum": "2024-01-01T00:00:00Z",
  "maximum": "2025-12-31T23:59:59Z",
  "group": "Publishing"
}
```

**DateTime-specific fields:**
- `minimum` - Earliest allowed date/time
- `maximum` - Latest allowed date/time

### 6. URL Properties

URL input fields with validation.

```json
"ExternalLink": {
  "type": "url",
  "displayName": "External Link",
  "description": "Link to external resource",
  "required": false,
  "group": "Links"
}
```

### 7. ContentReference Properties

References to other content items.

```json
"FeaturedImage": {
  "type": "contentReference",
  "displayName": "Featured Image",
  "description": "Main image for the component",
  "localized": true,
  "required": false,
  "group": "Assets",
  "allowedTypes": ["Image", "ImageMedia"],
  "restrictedTypes": []
}
```

**ContentReference-specific fields:**
- `allowedTypes` - Array of allowed content type keys
- `restrictedTypes` - Array of restricted content type keys

### 8. Component Properties

Embedded component instances.

```json
"CallToAction": {
  "type": "component",
  "contentType": "Button",
  "displayName": "Call to Action Button",
  "description": "Button for the component",
  "localized": false,
  "required": true,
  "group": "Actions"
}
```

**Component-specific fields:**
- `contentType` - Required content type key for the component

### 9. Content Properties

Full content item references.

```json
"RelatedArticle": {
  "type": "content",
  "displayName": "Related Article",
  "description": "Link to related article",
  "required": false,
  "allowedTypes": ["ArticlePage"],
  "restrictedTypes": ["LandingPage"]
}
```

**Content-specific fields:**
- `allowedTypes` - Array of allowed content type keys
- `restrictedTypes` - Array of restricted content type keys

### 10. Binary Properties

File upload fields.

```json
"Document": {
  "type": "binary",
  "displayName": "Document",
  "description": "PDF or document file",
  "required": false,
  "group": "Files",
  "imageDescriptor": {
    "width": 1200,
    "height": 800,
    "pregenerated": true
  }
}
```

**Binary-specific fields:**
- `imageDescriptor` - Image processing configuration
  - `width` - Target width in pixels
  - `height` - Target height in pixels  
  - `pregenerated` - Whether to generate on upload vs on-demand

### 11. Rich Text Properties

WYSIWYG editor fields.

```json
"Content": {
  "type": "richText",
  "displayName": "Rich Content",
  "description": "Rich text content with formatting",
  "localized": true,
  "required": false,
  "indexingType": "searchable"
}
```

### 12. JSON Properties

Structured data fields.

```json
"Metadata": {
  "type": "json",
  "displayName": "Metadata",
  "description": "Custom JSON metadata",
  "required": false
}
```

### 13. Array Properties

Collections of items.

```json
"Tags": {
  "type": "array",
  "format": "StringCollection",
  "displayName": "Tags",
  "description": "List of tags",
  "localized": true,
  "required": false,
  "minItems": 0,
  "maxItems": 10,
  "items": {
    "type": "string",
    "minLength": 1,
    "maxLength": 50
  }
}
```

**Array-specific fields:**
- `minItems` - Minimum number of items
- `maxItems` - Maximum number of items
- `items` - Configuration for array items

**Array item types:**
- String items: `{"type": "string"}`
- Integer items: `{"type": "integer"}`
- Float items: `{"type": "float"}`
- DateTime items: `{"type": "dateTime"}`
- URL items: `{"type": "url"}`
- Boolean items: `{"type": "boolean"}`
- ContentReference items: `{"type": "contentReference", "allowedTypes": ["Image"]}`
- Content items: `{"type": "content", "allowedTypes": ["ArticlePage"]}`
- Component items: `{"type": "component", "contentType": "Button"}`

**Example component array:**
```json
"Buttons": {
  "type": "array",
  "format": "ComponentCollection",
  "displayName": "Buttons",
  "description": "Collection of buttons",
  "minItems": 1,
  "maxItems": 5,
  "items": {
    "type": "component",
    "contentType": "Button"
  }
}
```

## Advanced Features

### Property Groups

Organize properties into logical groups in the CMS interface:

```json
"properties": {
  "Title": {
    "type": "string",
    "group": "Content",
    "sortOrder": 10
  },
  "IsEnabled": {
    "type": "boolean", 
    "group": "Settings",
    "sortOrder": 10
  }
}
```

Common group names:
- `Information` - Basic content fields
- `Settings` - Configuration options
- `Assets` - Media and files
- `Links` - URL and reference fields
- `Publishing` - Publish/schedule options

### Validation

Add validation rules to ensure data quality:

```json
"Email": {
  "type": "string",
  "pattern": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
  "minLength": 5,
  "maxLength": 255
}
```

### Localization

Control which properties can be localized:

```json
"Title": {
  "type": "string",
  "localized": true  // Can be translated
},
"SortOrder": {
  "type": "integer", 
  "localized": false // Same across all locales
}
```

## Complete Example

Here's a comprehensive example combining multiple property types:

```json
{
  "key": "ProductCard",
  "displayName": "Product Card",
  "description": "A card component displaying product information",
  "baseType": "component",
  "sortOrder": 0,
  "compositionBehaviors": ["elementEnabled", "sectionEnabled"],
  "properties": {
    "ProductName": {
      "type": "string",
      "displayName": "Product Name",
      "description": "Name of the product",
      "localized": true,
      "required": true,
      "group": "Content",
      "sortOrder": 10,
      "indexingType": "searchable",
      "minLength": 1,
      "maxLength": 255
    },
    "Description": {
      "type": "string",
      "format": "html",
      "displayName": "Description", 
      "description": "Product description with HTML formatting",
      "localized": true,
      "required": false,
      "group": "Content",
      "sortOrder": 20,
      "indexingType": "searchable"
    },
    "Price": {
      "type": "float",
      "displayName": "Price",
      "description": "Product price",
      "required": true,
      "minimum": 0.01,
      "maximum": 99999.99,
      "group": "Pricing",
      "sortOrder": 10
    },
    "IsOnSale": {
      "type": "boolean",
      "displayName": "On Sale",
      "description": "Whether product is currently on sale",
      "required": false,
      "group": "Pricing",
      "sortOrder": 20
    },
    "ProductImage": {
      "type": "contentReference",
      "displayName": "Product Image",
      "description": "Main product image",
      "localized": false,
      "required": true,
      "group": "Assets",
      "sortOrder": 10,
      "allowedTypes": ["Image", "ImageMedia"],
      "restrictedTypes": []
    },
    "Category": {
      "type": "string",
      "displayName": "Category",
      "required": true,
      "group": "Classification", 
      "enum": [
        {
          "value": "electronics",
          "displayName": "Electronics"
        },
        {
          "value": "clothing", 
          "displayName": "Clothing"
        },
        {
          "value": "books",
          "displayName": "Books" 
        }
      ]
    },
    "Tags": {
      "type": "array",
      "displayName": "Tags",
      "description": "Product tags for filtering",
      "localized": true,
      "required": false,
      "group": "Classification",
      "sortOrder": 20,
      "minItems": 0,
      "maxItems": 10,
      "items": {
        "type": "string",
        "minLength": 1,
        "maxLength": 50
      }
    },
    "CallToAction": {
      "type": "component",
      "contentType": "Button",
      "displayName": "Purchase Button",
      "description": "Button for purchasing the product",
      "localized": false,
      "required": true,
      "group": "Actions",
      "sortOrder": 10
    }
  }
}
```

## Best Practices

1. **Use descriptive keys and display names** that clearly identify the property's purpose
2. **Group related properties** using consistent group names across components
3. **Set appropriate sort orders** to organize fields logically in the CMS
4. **Add helpful descriptions** to guide content editors
5. **Use validation** (min/max, patterns, required) to ensure data quality
6. **Consider localization needs** - content typically localized, settings typically not
7. **Use appropriate indexing** - searchable for content, queryable for filters
8. **Leverage property formats** for specialized input types (HTML, short strings, etc.)
9. **Be specific with allowed/restricted types** for references to maintain content integrity
10. **Test thoroughly** in the CMS interface to ensure good editor experience

## Common Patterns

### Image with Alt Text
```json
"HeroImage": {
  "type": "contentReference",
  "displayName": "Hero Image",
  "allowedTypes": ["Image"]
},
"ImageAltText": {
  "type": "string",
  "displayName": "Image Alt Text",
  "description": "Alternative text for accessibility",
  "localized": true
}
```

### Optional Content with Toggle
```json
"ShowSidebar": {
  "type": "boolean",
  "displayName": "Show Sidebar"
},
"SidebarContent": {
  "type": "string",
  "format": "html",
  "displayName": "Sidebar Content",
  "description": "Only used if Show Sidebar is enabled"
}
```

### Multi-language Links
```json
"Links": {
  "type": "array",
  "displayName": "Navigation Links",
  "localized": true,
  "items": {
    "type": "component",
    "contentType": "Link"
  }
}
```

This guide covers all supported property types and configurations based on the OpenAPI specifications. Use it as a reference when creating new content types for your Optimizely SaaS CMS components.