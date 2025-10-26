# Optimizely CMS Content Type Creation Guide

This guide provides comprehensive instructions for creating `.opti-type.json` files based on the Optimizely CMS Content API Preview 3 specification.

## Table of Contents
- [Overview](#overview)
- [File Structure](#file-structure)
- [Root Properties](#root-properties)
- [Property Types](#property-types)
- [Property Validation](#property-validation)
- [Advanced Features](#advanced-features)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

## Overview

Content types in Optimizely CMS define the structure and behavior of content items. Each content type is defined in a `.opti-type.json` file that maps to the CMS ContentType API schema.

## File Structure

```json
{
  "key": "ComponentName",
  "displayName": "Display Name",
  "description": "Optional description",
  "baseType": "Component",
  "sortOrder": 100,
  "mayContainTypes": [],
  "mediaFileExtensions": [],
  "compositionBehaviors": [],
  "properties": {}
}
```

## Root Properties

### `key` (Required)
- **Type**: `string`
- **Pattern**: `^[A-Za-z][_0-9A-Za-z]+$`
- **Max Length**: 255 characters
- **Min Length**: 2 characters
- **Rules**:
  - Must start with a letter (A-Z or a-z)
  - Can contain letters, numbers, and underscores
  - Cannot contain spaces or special characters
- **Example**: `"HeroSection"`, `"ButtonComponent"`, `"Article_Page"`

### `displayName` (Optional)
- **Type**: `string`
- **Max Length**: 255 characters
- **Description**: Human-readable name shown in the CMS UI
- **Example**: `"Hero Section"`, `"Call to Action Button"`

### `description` (Optional)
- **Type**: `string`
- **Max Length**: 255 characters
- **Description**: Brief description of the content type's purpose
- **Example**: `"A hero section with image, heading, and CTA"`

### `baseType` (Required for non-contracts)
- **Type**: `string`
- **Description**: The base content type this type inherits from
- **Common Values**:
  - `"Component"` - For reusable components
  - `"Element"` - For composition elements
  - `"Page"` - For page types
  - `"Block"` - For block types
  - `"Media"` - For media types
  - `"Experience"` - For experience types
- **Note**: Required for all content types except contracts

### `source` (Read-only)
- **Type**: `string`
- **Description**: System-managed field indicating the source of the content type
- **Note**: Do not include in `.opti-type.json` files

### `sortOrder` (Optional)
- **Type**: `integer`
- **Format**: `int32`
- **Description**: Controls the display order in CMS UI
- **Default**: System-assigned if not specified
- **Example**: `100`

### `mayContainTypes` (Optional)
- **Type**: `array` of `string`
- **Pattern per item**: `^[_A-Za-z][:_0-9A-Za-z]+$`
- **Max Length per item**: 255 characters
- **Min Length per item**: 2 characters
- **Description**: Specifies which content types can be created within containers of this type
- **Example**: `["TextBlock", "ImageBlock", "VideoBlock"]`

### `mediaFileExtensions` (Optional)
- **Type**: `array` of `string`
- **Description**: File extensions this media type can handle (for media types only)
- **Example**: `["jpg", "png", "gif", "webp"]`

### `compositionBehaviors` (Optional)
- **Type**: `array` of `string`
- **Allowed Values**:
  - `"sectionEnabled"` - Can be used as a section in compositions
  - `"elementEnabled"` - Can be used as an element in compositions
  - `"formsElementEnabled"` - Can be used in forms
- **Description**: Specifies how this content type can be used in visual editing
- **Example**: `["sectionEnabled", "elementEnabled"]`

## Property Types

Properties are defined in the `properties` object as key-value pairs where the key is the property name and the value is a `ContentTypeProperty` object.

### Property Definition Structure

```json
{
  "properties": {
    "propertyName": {
      "type": "string",
      "displayName": "Property Display Name",
      "description": "Property description",
      "required": false,
      "localized": true,
      "group": "Content",
      "sortOrder": 10
    }
  }
}
```

### Core Property Fields

#### `type` (Required)
- **Type**: `string`
- **Max Length**: 50 characters
- **Allowed Values**:
  - `"string"` - Text values
  - `"url"` - URL values
  - `"boolean"` - True/false values
  - `"integer"` - Whole numbers
  - `"float"` - Decimal numbers
  - `"dateTime"` - Date and time values
  - `"contentReference"` - Reference to another content item
  - `"content"` - Embedded content item
  - `"binary"` - Binary data (files, images)
  - `"link"` - Link with text and URL
  - `"richText"` - Rich text editor content
  - `"json"` - JSON data
  - `"array"` - List of items
  - `"component"` - Embedded component

#### `format` (Optional)
- **Type**: `string` | `null`
- **Description**: References a PropertyFormat key for semantic meaning
- **Example**: `"Email"`, `"PhoneNumber"`, `"PostalCode"`
- **Note**: PropertyFormats are defined separately in the CMS

#### `contentType` (Optional)
- **Type**: `string` | `null`
- **Pattern**: `^[_A-Za-z][:_0-9A-Za-z]+$`
- **Max Length**: 255 characters
- **Min Length**: 2 characters
- **Description**: For `type: "component"`, specifies which component type can be embedded
- **Example**: `"ButtonComponent"`

#### `displayName` (Optional)
- **Type**: `string`
- **Max Length**: 255 characters
- **Description**: Human-readable name for the property in CMS UI

#### `description` (Optional)
- **Type**: `string`
- **Max Length**: 2000 characters
- **Description**: Help text shown to editors

#### `localized` (Optional)
- **Type**: `boolean`
- **Default**: `false`
- **Description**:
  - `true` - Property values are unique per locale
  - `false` - Property values are shared across all locales

#### `required` (Optional)
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether the property must have a value

#### `group` (Optional)
- **Type**: `string`
- **Description**: PropertyGroup key to organize properties in the CMS UI
- **Example**: `"Content"`, `"Metadata"`, `"Settings"`
- **Note**: PropertyGroups are defined separately in the CMS

#### `sortOrder` (Optional)
- **Type**: `integer`
- **Format**: `int32`
- **Description**: Controls property display order within a group

#### `indexingType` (Optional)
- **Type**: `string`
- **Allowed Values**:
  - `"disabled"` - Not indexed
  - `"queryable"` - Indexed for filtering/sorting
  - `"searchable"` - Indexed for full-text search
- **Description**: Controls how the property is indexed in the search engine

## Property Validation

### Numeric Validation

#### `minimum` (Optional)
- **Applicable Types**: `integer`, `float`, `dateTime`
- **Type**: Matches the property type
- **Description**: Minimum allowed value
- **Example**:
  ```json
  {
    "type": "integer",
    "minimum": 0
  }
  ```

#### `maximum` (Optional)
- **Applicable Types**: `integer`, `float`, `dateTime`
- **Type**: Matches the property type
- **Description**: Maximum allowed value
- **Example**:
  ```json
  {
    "type": "integer",
    "minimum": 1,
    "maximum": 100
  }
  ```

### String Validation

#### `minLength` (Optional)
- **Applicable Types**: `string`, `url`, `richText`
- **Type**: `integer`
- **Format**: `int32`
- **Minimum**: `0`
- **Description**: Minimum string length
- **Example**:
  ```json
  {
    "type": "string",
    "minLength": 3
  }
  ```

#### `maxLength` (Optional)
- **Applicable Types**: `string`, `url`, `richText`
- **Type**: `integer`
- **Format**: `int32`
- **Minimum**: `0`
- **Description**: Maximum string length
- **Example**:
  ```json
  {
    "type": "string",
    "maxLength": 255
  }
  ```

#### `pattern` (Optional)
- **Applicable Types**: `string`, `url`
- **Type**: `string`
- **Format**: `regex`
- **Description**: Regular expression pattern for validation
- **Example**:
  ```json
  {
    "type": "string",
    "pattern": "^[A-Z][a-z]+$"
  }
  ```

### Enumeration Validation

#### `enum` (Optional)
- **Applicable Types**: `string`, `integer`, `float`, `dateTime`
- **Type**: `array` of `EnumerationValue` objects
- **Description**: Restricts values to a predefined list
- **Example**:
  ```json
  {
    "type": "string",
    "enum": [
      {
        "value": "small",
        "displayName": "Small"
      },
      {
        "value": "medium",
        "displayName": "Medium"
      },
      {
        "value": "large",
        "displayName": "Large"
      }
    ]
  }
  ```

### Array Validation

#### `minItems` (Optional)
- **Applicable Type**: `array`
- **Type**: `integer`
- **Format**: `int32`
- **Minimum**: `0`
- **Description**: Minimum number of items in the array

#### `maxItems` (Optional)
- **Applicable Type**: `array`
- **Type**: `integer`
- **Format**: `int32`
- **Minimum**: `0`
- **Description**: Maximum number of items in the array

#### `allowedTypes` (Optional)
- **Applicable Types**: `array`, `contentReference`
- **Type**: `array` of `string`
- **Description**: Content types or base types that can be referenced
- **Example**: `["Page", "Block"]`

#### `restrictedTypes` (Optional)
- **Applicable Types**: `array`, `contentReference`
- **Type**: `array` of `string`
- **Description**: Content types or base types that cannot be referenced
- **Example**: `["MediaType"]`

### Image Properties

#### `imageDescriptor` (Optional)
- **Applicable Type**: `binary` (for images)
- **Type**: `object`
- **Properties**:
  - `width` (integer, min: 0) - Image width in pixels
  - `height` (integer, min: 0) - Image height in pixels
  - `pregenerated` (boolean) - Generate on upload vs. on-demand
- **Example**:
  ```json
  {
    "type": "binary",
    "imageDescriptor": {
      "width": 1920,
      "height": 1080,
      "pregenerated": true
    }
  }
  ```

## Advanced Features

### Array Properties

Arrays can contain items of various types. Define array items using the `items` property.

#### Array Item Structure

```json
{
  "type": "array",
  "items": {
    "type": "string",
    "format": null,
    "contentType": null,
    "minimum": null,
    "maximum": null,
    "minLength": 0,
    "maxLength": 255,
    "pattern": null,
    "enum": [],
    "allowedTypes": [],
    "restrictedTypes": []
  },
  "minItems": 1,
  "maxItems": 10
}
```

#### Supported Array Item Types

- `"string"`, `"url"`, `"boolean"`, `"integer"`, `"float"`, `"dateTime"`
- `"contentReference"`, `"content"`, `"binary"`, `"link"`, `"richText"`, `"json"`, `"component"`

#### Array Item Validation

Array items support the same validation as regular properties:
- `minimum` / `maximum` (for numeric and date types)
- `minLength` / `maxLength` (for string types)
- `pattern` (for string types)
- `enum` (for predefined values)
- `allowedTypes` / `restrictedTypes` (for reference types)
- `format` (for semantic types)
- `contentType` (for component types)

### Component Properties

Embedded components allow nesting content structures.

```json
{
  "heroContent": {
    "type": "component",
    "contentType": "HeroComponent",
    "displayName": "Hero Content",
    "required": true
  }
}
```

### Content Reference Properties

References allow linking to other content items.

```json
{
  "relatedArticles": {
    "type": "array",
    "displayName": "Related Articles",
    "items": {
      "type": "contentReference",
      "allowedTypes": ["ArticlePage", "BlogPost"]
    },
    "minItems": 0,
    "maxItems": 5
  }
}
```

## Best Practices

### Naming Conventions

1. **Content Type Keys**:
   - Use PascalCase: `HeroSection`, `ButtonComponent`
   - Be descriptive but concise
   - Avoid abbreviations unless widely understood

2. **Property Names**:
   - Use camelCase: `heading`, `buttonText`, `backgroundColor`
   - Use clear, semantic names
   - Avoid technical jargon when possible

3. **Display Names**:
   - Use natural language: `"Heading"`, `"Button Text"`, `"Background Color"`
   - Keep concise (under 50 characters)
   - Use sentence case

### Organization

1. **Property Groups**:
   - Group related properties together
   - Common groups: `"Content"`, `"Settings"`, `"Metadata"`, `"SEO"`
   - Use consistent group names across content types

2. **Sort Order**:
   - Assign sort orders in increments of 10 or 100
   - Leave gaps for future insertions
   - Most important properties first

### Validation

1. **Be Specific**:
   - Use `minLength`/`maxLength` for strings
   - Use `minimum`/`maximum` for numbers
   - Use `enum` for predefined choices

2. **Provide Guidance**:
   - Add helpful `description` text
   - Use `required` judiciously
   - Consider default values in your component code

### Localization

1. **Content vs. Settings**:
   - `localized: true` for user-facing content (text, images)
   - `localized: false` for technical settings (IDs, colors, layouts)

2. **References**:
   - Consider if references should vary by locale
   - Use locale-specific content when appropriate

### Performance

1. **Indexing**:
   - Use `indexingType: "queryable"` for filterable properties
   - Use `indexingType: "searchable"` for full-text search
   - Use `indexingType: "disabled"` for technical/internal properties

2. **Images**:
   - Set appropriate dimensions in `imageDescriptor`
   - Use `pregenerated: true` for common sizes
   - Use `pregenerated: false` for rare/dynamic sizes

## Common Patterns

### Simple Text Component

```json
{
  "key": "Heading",
  "displayName": "Heading",
  "baseType": "Component",
  "compositionBehaviors": ["elementEnabled"],
  "properties": {
    "text": {
      "type": "string",
      "displayName": "Heading Text",
      "required": true,
      "localized": true,
      "maxLength": 255,
      "indexingType": "searchable"
    },
    "level": {
      "type": "string",
      "displayName": "Heading Level",
      "enum": [
        { "value": "h1", "displayName": "H1" },
        { "value": "h2", "displayName": "H2" },
        { "value": "h3", "displayName": "H3" }
      ]
    }
  }
}
```

### Component with Image

```json
{
  "key": "ImageCard",
  "displayName": "Image Card",
  "baseType": "Component",
  "compositionBehaviors": ["elementEnabled"],
  "properties": {
    "image": {
      "type": "contentReference",
      "displayName": "Image",
      "description": "Card image (recommended 800x600)",
      "required": true,
      "allowedTypes": ["ImageMedia"]
    },
    "heading": {
      "type": "string",
      "displayName": "Heading",
      "required": true,
      "localized": true,
      "maxLength": 100
    },
    "description": {
      "type": "richText",
      "displayName": "Description",
      "localized": true,
      "maxLength": 500
    }
  }
}
```

### Component with Array of Items

```json
{
  "key": "FeatureList",
  "displayName": "Feature List",
  "baseType": "Component",
  "properties": {
    "features": {
      "type": "array",
      "displayName": "Features",
      "minItems": 1,
      "maxItems": 6,
      "items": {
        "type": "component",
        "contentType": "FeatureItem"
      }
    }
  }
}
```

### Page Type with SEO

```json
{
  "key": "ArticlePage",
  "displayName": "Article Page",
  "baseType": "Page",
  "properties": {
    "title": {
      "type": "string",
      "displayName": "Title",
      "required": true,
      "localized": true,
      "group": "Content",
      "sortOrder": 10,
      "maxLength": 255,
      "indexingType": "searchable"
    },
    "body": {
      "type": "richText",
      "displayName": "Body Content",
      "required": true,
      "localized": true,
      "group": "Content",
      "sortOrder": 20,
      "indexingType": "searchable"
    },
    "metaTitle": {
      "type": "string",
      "displayName": "Meta Title",
      "localized": true,
      "group": "SEO",
      "sortOrder": 10,
      "maxLength": 60
    },
    "metaDescription": {
      "type": "string",
      "displayName": "Meta Description",
      "localized": true,
      "group": "SEO",
      "sortOrder": 20,
      "maxLength": 160
    },
    "publishDate": {
      "type": "dateTime",
      "displayName": "Publish Date",
      "required": true,
      "group": "Metadata",
      "sortOrder": 10,
      "indexingType": "queryable"
    }
  }
}
```

### Container Type

```json
{
  "key": "Folder",
  "displayName": "Folder",
  "baseType": "Page",
  "mayContainTypes": [
    "ArticlePage",
    "LandingPage",
    "Folder"
  ],
  "properties": {
    "name": {
      "type": "string",
      "displayName": "Folder Name",
      "required": true,
      "maxLength": 255
    }
  }
}
```

## API Operations

Content types are managed through the following API endpoints:

- `POST /contenttypes` - Create a new content type
- `GET /contenttypes` - List content types
- `GET /contenttypes/{key}` - Get a specific content type
- `PATCH /contenttypes/{key}` - Update a content type (with merge-patch+json)
- `DELETE /contenttypes/{key}` - Delete a content type

### Important Headers

- `If-Match` / `If-Unmodified-Since` - Conditional updates (prevent conflicts)
- `cms-ignore-data-loss-warnings` - Allow destructive changes (use with caution)

### Status Codes

- `200 OK` - Success
- `201 Created` - New content type created
- `304 Not Modified` - Content not changed (with If-None-Match)
- `400 Bad Request` - Validation error
- `403 Forbidden` - Permission denied
- `404 Not Found` - Content type not found
- `412 Precondition Failed` - If-Match condition failed

## Read-Only Fields

The following fields are managed by the system and should not be included in `.opti-type.json` files:

- `source` - System-assigned source identifier
- `created` - Creation timestamp
- `createdBy` - Creator username
- `lastModified` - Last modification timestamp
- `lastModifiedBy` - Last modifier username

## Validation Rules Summary

| Field | Type | Min | Max | Pattern | Required |
|-------|------|-----|-----|---------|----------|
| key | string | 2 | 255 | `^[A-Za-z][_0-9A-Za-z]+$` | Yes |
| displayName | string | 0 | 255 | - | No |
| description | string | 0 | 255 | - | No |
| baseType | string | - | - | - | Yes* |
| Property.displayName | string | 0 | 255 | - | No |
| Property.description | string | 0 | 2000 | - | No |
| Property.contentType | string | 2 | 255 | `^[_A-Za-z][:_0-9A-Za-z]+$` | No |
| mayContainTypes[] | string | 2 | 255 | `^[_A-Za-z][:_0-9A-Za-z]+$` | No |

*Required for all except contracts

## Troubleshooting

### Common Errors

1. **Invalid key pattern**:
   - Error: Key doesn't match pattern
   - Fix: Ensure key starts with letter, contains only alphanumerics and underscores

2. **Missing baseType**:
   - Error: baseType is required
   - Fix: Add `"baseType": "Component"` (or appropriate base type)

3. **Invalid property type**:
   - Error: Type not recognized
   - Fix: Use one of the supported property types

4. **Array validation mismatch**:
   - Error: Items don't match item type
   - Fix: Ensure `items.type` matches the array content

5. **Component type not found**:
   - Error: contentType reference invalid
   - Fix: Verify the referenced content type exists in CMS

### Debugging Tips

1. Validate JSON syntax first
2. Check key naming patterns
3. Verify all required fields are present
4. Test property validation rules
5. Use CMS API error messages for specific issues
