# Optimizely CMS Display Template (Style) Creation Guide

This guide provides comprehensive instructions for creating `.opti-style.json` files based on the Optimizely CMS Content API Preview 3 specification.

## Table of Contents
- [Overview](#overview)
- [File Structure](#file-structure)
- [Root Properties](#root-properties)
- [Display Settings](#display-settings)
- [Display Setting Choices](#display-setting-choices)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Integration with TailwindCSS](#integration-with-tailwindcss)

## Overview

Display templates (styles) in Optimizely CMS define visual presentation options for content types. Each display template is defined in a `.opti-style.json` file that maps to the CMS DisplayTemplate API schema.

Display templates allow editors to choose different visual styles for content without changing the content structure, enabling design flexibility while maintaining content integrity.

## File Structure

```json
{
  "key": "TemplateName",
  "displayName": "Template Display Name",
  "nodeType": "Component",
  "baseType": null,
  "contentType": "SpecificContentType",
  "isDefault": false,
  "settings": {}
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
- **Example**: `"HeroDefault"`, `"ButtonPrimary"`, `"Card_Elevated"`

### `displayName` (Required)
- **Type**: `string`
- **Max Length**: 255 characters
- **Min Length**: 1 character
- **Description**: Human-readable name shown in the CMS UI
- **Example**: `"Hero - Default"`, `"Primary Button"`, `"Elevated Card"`

### `nodeType` (Optional)
- **Type**: `string` | `null`
- **Pattern**: `^[A-Za-z][_0-9A-Za-z]+$`
- **Max Length**: 50 characters
- **Min Length**: 2 characters
- **Description**: Limits template to a specific node type in the visual editor
- **Common Values**: `"Component"`, `"Element"`, `"Section"`
- **Note**: Only one of `nodeType`, `baseType`, or `contentType` should be specified

### `baseType` (Optional)
- **Type**: `string` | `null`
- **Description**: Limits template to all content types with a specific base type
- **Example**: `"Component"`, `"Page"`, `"Block"`
- **Use Case**: Create templates that apply to all pages or all components
- **Note**: Only one of `nodeType`, `baseType`, or `contentType` should be specified

### `contentType` (Optional)
- **Type**: `string` | `null`
- **Pattern**: `^[A-Za-z][_0-9A-Za-z]+$`
- **Max Length**: 255 characters
- **Min Length**: 2 characters
- **Description**: Limits template to a specific content type
- **Example**: `"HeroSection"`, `"ButtonComponent"`
- **Use Case**: Create multiple style variations for a single component type
- **Note**: Only one of `nodeType`, `baseType`, or `contentType` should be specified

### `isDefault` (Optional)
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Marks this template as the default for its associated type
- **Note**: Only one template per type combination should be marked as default

### `created` (Read-only)
- **Type**: `string`
- **Format**: `date-time`
- **Description**: Timestamp when the template was created
- **Note**: System-managed, do not include in `.opti-style.json`

### `createdBy` (Read-only)
- **Type**: `string`
- **Description**: Username of the creator
- **Note**: System-managed, do not include in `.opti-style.json`

### `lastModified` (Read-only)
- **Type**: `string`
- **Format**: `date-time`
- **Description**: Timestamp when the template was last modified
- **Note**: System-managed, do not include in `.opti-style.json`

### `lastModifiedBy` (Read-only)
- **Type**: `string`
- **Description**: Username of the last modifier
- **Note**: System-managed, do not include in `.opti-style.json`

## Display Settings

Display settings are defined in the `settings` object as key-value pairs where the key is the setting name and the value is a `DisplaySetting` object.

### Setting Definition Structure

```json
{
  "settings": {
    "settingName": {
      "displayName": "Setting Display Name",
      "editor": "DropDown",
      "sortOrder": 10,
      "choices": {}
    }
  }
}
```

### `displayName` (Required)
- **Type**: `string`
- **Max Length**: 255 characters
- **Min Length**: 1 character
- **Description**: Human-readable name for the setting shown in CMS UI
- **Example**: `"Button Size"`, `"Text Alignment"`, `"Background Color"`

### `editor` (Optional)
- **Type**: `string`
- **Max Length**: 50 characters
- **Description**: Suggested editor type for the CMS UI
- **Common Values**:
  - `"DropDown"` - Dropdown selector (most common)
  - `"RadioButtons"` - Radio button group
  - `"Buttons"` - Button group selector
  - `"ColorPicker"` - Color picker
  - `"Slider"` - Slider control
- **Note**: The CMS may override this based on the number of choices

### `sortOrder` (Optional)
- **Type**: `integer`
- **Format**: `int32`
- **Description**: Controls the display order of settings in the CMS UI
- **Best Practice**: Use increments of 10 or 100 to allow for future insertions
- **Example**: `10`, `20`, `30`

### `choices` (Required)
- **Type**: `object` (dictionary)
- **Description**: Available options for this setting
- **Structure**: Key-value pairs where the key is the choice identifier and the value is a `DisplaySettingChoice` object

## Display Setting Choices

Each choice within a display setting represents one selectable option.

### Choice Definition Structure

```json
{
  "choices": {
    "choiceKey": {
      "displayName": "Choice Display Name",
      "sortOrder": 10
    }
  }
}
```

### `displayName` (Required)
- **Type**: `string`
- **Max Length**: 255 characters
- **Min Length**: 1 character
- **Description**: Human-readable name for the choice shown in CMS UI
- **Example**: `"Small"`, `"Left Aligned"`, `"Primary Blue"`

### `sortOrder` (Optional)
- **Type**: `integer`
- **Format**: `int32`
- **Description**: Controls the display order of choices within the setting
- **Best Practice**: Use increments of 10 to allow for future insertions
- **Example**: `10`, `20`, `30`

## Best Practices

### Naming Conventions

1. **Template Keys**:
   - Use PascalCase: `ButtonPrimary`, `HeroDefault`, `CardMinimal`
   - Include content type name for clarity: `Button_Primary`, `Hero_Default`
   - Be descriptive: `NavigationHorizontal` vs. `Nav1`

2. **Template Display Names**:
   - Use natural language: `"Primary Button"`, `"Hero - Default"`
   - Include component name: `"Hero - Minimal"` vs. just `"Minimal"`
   - Keep concise but clear (under 40 characters)

3. **Setting Keys**:
   - Use camelCase: `size`, `alignment`, `backgroundColor`
   - Be specific: `buttonSize` vs. `size` when clarity needed
   - Use semantic names: `textAlignment` vs. `align`

4. **Choice Keys**:
   - Use lowercase or camelCase: `small`, `leftAligned`, `primaryBlue`
   - Match common CSS values when applicable: `left`, `center`, `right`
   - Be concise but clear: `lg` vs. `large` (choose consistently)

### Template Organization

1. **Template Scope**:
   - **Specific (`contentType`)**: Most common, one template per component type
   - **Generic (`baseType`)**: Use for cross-component settings (e.g., all components)
   - **Visual (`nodeType`)**: Use for visual editor node types

2. **Default Templates**:
   - Always create a default template for each content type
   - Keep default templates simple and widely applicable
   - Use `"isDefault": true` for the primary template

3. **Setting Organization**:
   - Group related settings by assigning sequential sortOrder values
   - Most important settings first (lower sortOrder)
   - Visual settings before technical settings

### Setting Design

1. **Number of Choices**:
   - Keep choices manageable (3-7 options ideal)
   - Too many choices overwhelm editors
   - Consider breaking complex settings into multiple simpler ones

2. **Choice Names**:
   - Use consistent terminology across templates
   - Match design system naming (if applicable)
   - Provide visual context in names: `"Large (48px)"` vs. just `"Large"`

3. **Editor Selection**:
   - `"DropDown"` - Default for most settings
   - `"RadioButtons"` or `"Buttons"` - For 2-4 important choices
   - Consistent editor types for similar settings across templates

### Maintainability

1. **Documentation**:
   - Document choice values in code comments
   - Maintain mapping documentation for CSS classes
   - Include examples in display names when helpful

2. **Consistency**:
   - Use same setting keys across related templates
   - Standardize choice keys (e.g., always `small`, `medium`, `large`)
   - Maintain consistent sortOrder patterns

3. **Versioning**:
   - Consider template evolution (add choices, don't remove)
   - Use new templates for major redesigns
   - Deprecate old templates rather than delete

## Common Patterns

### Simple Button Template

```json
{
  "key": "ButtonPrimary",
  "displayName": "Button - Primary",
  "contentType": "Button",
  "isDefault": true,
  "settings": {
    "size": {
      "displayName": "Size",
      "editor": "DropDown",
      "sortOrder": 10,
      "choices": {
        "sm": {
          "displayName": "Small",
          "sortOrder": 10
        },
        "md": {
          "displayName": "Medium",
          "sortOrder": 20
        },
        "lg": {
          "displayName": "Large",
          "sortOrder": 30
        }
      }
    }
  }
}
```

### Card Template with Multiple Settings

```json
{
  "key": "CardDefault",
  "displayName": "Card - Default",
  "contentType": "Card",
  "isDefault": true,
  "settings": {
    "elevation": {
      "displayName": "Elevation",
      "editor": "RadioButtons",
      "sortOrder": 10,
      "choices": {
        "flat": {
          "displayName": "Flat",
          "sortOrder": 10
        },
        "raised": {
          "displayName": "Raised",
          "sortOrder": 20
        },
        "floating": {
          "displayName": "Floating",
          "sortOrder": 30
        }
      }
    },
    "padding": {
      "displayName": "Padding",
      "editor": "DropDown",
      "sortOrder": 20,
      "choices": {
        "compact": {
          "displayName": "Compact",
          "sortOrder": 10
        },
        "normal": {
          "displayName": "Normal",
          "sortOrder": 20
        },
        "spacious": {
          "displayName": "Spacious",
          "sortOrder": 30
        }
      }
    },
    "borderRadius": {
      "displayName": "Corner Radius",
      "editor": "DropDown",
      "sortOrder": 30,
      "choices": {
        "none": {
          "displayName": "None",
          "sortOrder": 10
        },
        "sm": {
          "displayName": "Small",
          "sortOrder": 20
        },
        "md": {
          "displayName": "Medium",
          "sortOrder": 30
        },
        "lg": {
          "displayName": "Large",
          "sortOrder": 40
        }
      }
    }
  }
}
```

### Hero Section Template

```json
{
  "key": "HeroDefault",
  "displayName": "Hero - Default",
  "contentType": "HeroSection",
  "isDefault": true,
  "settings": {
    "height": {
      "displayName": "Height",
      "editor": "DropDown",
      "sortOrder": 10,
      "choices": {
        "small": {
          "displayName": "Small (400px)",
          "sortOrder": 10
        },
        "medium": {
          "displayName": "Medium (600px)",
          "sortOrder": 20
        },
        "large": {
          "displayName": "Large (800px)",
          "sortOrder": 30
        },
        "fullscreen": {
          "displayName": "Full Screen",
          "sortOrder": 40
        }
      }
    },
    "textAlignment": {
      "displayName": "Text Alignment",
      "editor": "Buttons",
      "sortOrder": 20,
      "choices": {
        "left": {
          "displayName": "Left",
          "sortOrder": 10
        },
        "center": {
          "displayName": "Center",
          "sortOrder": 20
        },
        "right": {
          "displayName": "Right",
          "sortOrder": 30
        }
      }
    },
    "overlay": {
      "displayName": "Background Overlay",
      "editor": "DropDown",
      "sortOrder": 30,
      "choices": {
        "none": {
          "displayName": "None",
          "sortOrder": 10
        },
        "light": {
          "displayName": "Light",
          "sortOrder": 20
        },
        "medium": {
          "displayName": "Medium",
          "sortOrder": 30
        },
        "dark": {
          "displayName": "Dark",
          "sortOrder": 40
        }
      }
    }
  }
}
```

### Generic Base Type Template

```json
{
  "key": "ComponentDefault",
  "displayName": "Component - Default Spacing",
  "baseType": "Component",
  "isDefault": false,
  "settings": {
    "marginTop": {
      "displayName": "Top Margin",
      "editor": "DropDown",
      "sortOrder": 10,
      "choices": {
        "none": {
          "displayName": "None",
          "sortOrder": 10
        },
        "sm": {
          "displayName": "Small",
          "sortOrder": 20
        },
        "md": {
          "displayName": "Medium",
          "sortOrder": 30
        },
        "lg": {
          "displayName": "Large",
          "sortOrder": 40
        }
      }
    },
    "marginBottom": {
      "displayName": "Bottom Margin",
      "editor": "DropDown",
      "sortOrder": 20,
      "choices": {
        "none": {
          "displayName": "None",
          "sortOrder": 10
        },
        "sm": {
          "displayName": "Small",
          "sortOrder": 20
        },
        "md": {
          "displayName": "Medium",
          "sortOrder": 30
        },
        "lg": {
          "displayName": "Large",
          "sortOrder": 40
        }
      }
    }
  }
}
```

### Multiple Templates for One Component

```json
// Primary variant
{
  "key": "ButtonPrimary",
  "displayName": "Button - Primary",
  "contentType": "Button",
  "isDefault": true,
  "settings": {
    "size": {
      "displayName": "Size",
      "editor": "DropDown",
      "sortOrder": 10,
      "choices": {
        "sm": { "displayName": "Small", "sortOrder": 10 },
        "md": { "displayName": "Medium", "sortOrder": 20 },
        "lg": { "displayName": "Large", "sortOrder": 30 }
      }
    }
  }
}

// Secondary variant
{
  "key": "ButtonSecondary",
  "displayName": "Button - Secondary",
  "contentType": "Button",
  "isDefault": false,
  "settings": {
    "size": {
      "displayName": "Size",
      "editor": "DropDown",
      "sortOrder": 10,
      "choices": {
        "sm": { "displayName": "Small", "sortOrder": 10 },
        "md": { "displayName": "Medium", "sortOrder": 20 },
        "lg": { "displayName": "Large", "sortOrder": 30 }
      }
    }
  }
}

// Outlined variant
{
  "key": "ButtonOutlined",
  "displayName": "Button - Outlined",
  "contentType": "Button",
  "isDefault": false,
  "settings": {
    "size": {
      "displayName": "Size",
      "editor": "DropDown",
      "sortOrder": 10,
      "choices": {
        "sm": { "displayName": "Small", "sortOrder": 10 },
        "md": { "displayName": "Medium", "sortOrder": 20 },
        "lg": { "displayName": "Large", "sortOrder": 30 }
      }
    }
  }
}
```

## Integration with TailwindCSS

In this Astro v5 + Optimizely CMS project, display template settings map to TailwindCSS classes through the `globalStylesHelper.ts` utility.

### Mapping Structure

Each template is mapped in the style helper file:

```typescript
// src/cms/shared/globalStylesHelper.ts
export const styleMap = {
  ButtonPrimary: {
    size: {
      sm: 'btn-sm px-4 py-2 text-sm',
      md: 'btn-md px-6 py-3 text-base',
      lg: 'btn-lg px-8 py-4 text-lg'
    }
  },
  CardDefault: {
    elevation: {
      flat: 'shadow-none',
      raised: 'shadow-md',
      floating: 'shadow-xl'
    },
    padding: {
      compact: 'p-2',
      normal: 'p-4',
      spacious: 'p-8'
    },
    borderRadius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg'
    }
  }
};
```

### Workflow

1. **Define Template** - Create `.opti-style.json` with settings and choices
2. **Map to CSS** - Add corresponding TailwindCSS classes in `globalStylesHelper.ts`
3. **Push to CMS** - Run `yarn style:push TemplateName`
4. **Use in Component** - Reference style mapping in `.astro` component files

### Design Considerations

1. **Setting Granularity**:
   - Create settings that map cleanly to CSS properties
   - Avoid overlapping settings (e.g., `padding` vs. `paddingTop`/`paddingBottom`)
   - Group related styles into single settings when possible

2. **Choice Values**:
   - Use choice keys that match or resemble CSS values
   - Maintain consistency with TailwindCSS naming: `sm`, `md`, `lg`, `xl`
   - Consider responsive variants in choice design

3. **Template Variants**:
   - Use separate templates for major style variations (Primary, Secondary, Outlined)
   - Use settings within templates for minor variations (size, spacing)
   - Balance between template count and setting complexity

### Example Component Integration

```astro
---
// Button.astro
import { getStyleClasses } from '@/cms/shared/globalStylesHelper';

const { displaySettings, contentLink } = Astro.props;
const templateKey = displaySettings?._meta?.key || 'ButtonPrimary';
const styleClasses = getStyleClasses(templateKey, displaySettings);
---

<button class={styleClasses}>
  <slot />
</button>
```

## API Operations

Display templates are managed through the following API endpoints:

- `POST /displaytemplates` - Create a new display template
- `GET /displaytemplates` - List display templates
- `GET /displaytemplates/{key}` - Get a specific display template
- `PATCH /displaytemplates/{key}` - Update a display template (with merge-patch+json)
- `DELETE /displaytemplates/{key}` - Delete a display template

### Important Headers

- `If-Match` / `If-Unmodified-Since` - Conditional updates (prevent conflicts)
- `If-None-Match` / `If-Modified-Since` - Conditional retrieval
- `ETag` - Entity tag for version tracking
- `Last-Modified` - Last modification timestamp

### Status Codes

- `200 OK` - Success
- `201 Created` - New display template created
- `304 Not Modified` - Template not changed (with If-None-Match)
- `400 Bad Request` - Validation error
- `403 Forbidden` - Permission denied
- `404 Not Found` - Display template not found
- `412 Precondition Failed` - If-Match condition failed

## Advanced Patterns

### Responsive Design Settings

```json
{
  "key": "HeroResponsive",
  "displayName": "Hero - Responsive",
  "contentType": "HeroSection",
  "isDefault": false,
  "settings": {
    "mobileHeight": {
      "displayName": "Mobile Height",
      "editor": "DropDown",
      "sortOrder": 10,
      "choices": {
        "small": { "displayName": "Small", "sortOrder": 10 },
        "medium": { "displayName": "Medium", "sortOrder": 20 },
        "large": { "displayName": "Large", "sortOrder": 30 }
      }
    },
    "desktopHeight": {
      "displayName": "Desktop Height",
      "editor": "DropDown",
      "sortOrder": 20,
      "choices": {
        "small": { "displayName": "Small", "sortOrder": 10 },
        "medium": { "displayName": "Medium", "sortOrder": 20 },
        "large": { "displayName": "Large", "sortOrder": 30 },
        "fullscreen": { "displayName": "Full Screen", "sortOrder": 40 }
      }
    }
  }
}
```

### Color Scheme Settings

```json
{
  "key": "SectionColorful",
  "displayName": "Section - Colorful",
  "contentType": "Section",
  "isDefault": false,
  "settings": {
    "colorScheme": {
      "displayName": "Color Scheme",
      "editor": "DropDown",
      "sortOrder": 10,
      "choices": {
        "light": { "displayName": "Light", "sortOrder": 10 },
        "dark": { "displayName": "Dark", "sortOrder": 20 },
        "brand": { "displayName": "Brand Colors", "sortOrder": 30 },
        "accent": { "displayName": "Accent Colors", "sortOrder": 40 }
      }
    },
    "contrast": {
      "displayName": "Contrast",
      "editor": "DropDown",
      "sortOrder": 20,
      "choices": {
        "low": { "displayName": "Low", "sortOrder": 10 },
        "medium": { "displayName": "Medium", "sortOrder": 20 },
        "high": { "displayName": "High", "sortOrder": 30 }
      }
    }
  }
}
```

### Layout Variations

```json
{
  "key": "ContentBlockFlexible",
  "displayName": "Content Block - Flexible Layout",
  "contentType": "ContentBlock",
  "isDefault": false,
  "settings": {
    "layout": {
      "displayName": "Layout",
      "editor": "RadioButtons",
      "sortOrder": 10,
      "choices": {
        "imageLeft": { "displayName": "Image Left", "sortOrder": 10 },
        "imageRight": { "displayName": "Image Right", "sortOrder": 20 },
        "imageTop": { "displayName": "Image Top", "sortOrder": 30 },
        "imageBottom": { "displayName": "Image Bottom", "sortOrder": 40 }
      }
    },
    "imageRatio": {
      "displayName": "Image Ratio",
      "editor": "DropDown",
      "sortOrder": 20,
      "choices": {
        "square": { "displayName": "1:1 Square", "sortOrder": 10 },
        "landscape": { "displayName": "16:9 Landscape", "sortOrder": 20 },
        "portrait": { "displayName": "4:5 Portrait", "sortOrder": 30 }
      }
    }
  }
}
```

## Validation Rules Summary

| Field | Type | Min | Max | Pattern | Required |
|-------|------|-----|-----|---------|----------|
| key | string | 2 | 255 | `^[A-Za-z][_0-9A-Za-z]+$` | Yes |
| displayName | string | 1 | 255 | - | Yes |
| nodeType | string | 2 | 50 | `^[A-Za-z][_0-9A-Za-z]+$` | No |
| contentType | string | 2 | 255 | `^[A-Za-z][_0-9A-Za-z]+$` | No |
| Setting.displayName | string | 1 | 255 | - | Yes |
| Setting.editor | string | 0 | 50 | - | No |
| Choice.displayName | string | 1 | 255 | - | Yes |

## Troubleshooting

### Common Errors

1. **Invalid key pattern**:
   - Error: Key doesn't match pattern
   - Fix: Ensure key starts with letter, contains only alphanumerics and underscores

2. **Missing displayName**:
   - Error: displayName is required
   - Fix: Add displayName to template, settings, or choices

3. **Empty choices**:
   - Error: Settings must have at least one choice
   - Fix: Add at least one choice to each setting

4. **Multiple scope filters**:
   - Error: Cannot specify nodeType, baseType, and contentType together
   - Fix: Choose only one scope filter

5. **Missing content type**:
   - Error: contentType reference invalid
   - Fix: Verify the referenced content type exists in CMS

### Debugging Tips

1. Validate JSON syntax first
2. Check key naming patterns
3. Verify all required fields (displayName) are present
4. Test template selection in CMS UI
5. Verify CSS mapping in globalStylesHelper.ts
6. Use CMS API error messages for specific issues

## Migration and Versioning

### Adding New Choices

Safe to add anytime:
```json
{
  "settings": {
    "size": {
      "choices": {
        "sm": { "displayName": "Small", "sortOrder": 10 },
        "md": { "displayName": "Medium", "sortOrder": 20 },
        "lg": { "displayName": "Large", "sortOrder": 30 },
        "xl": { "displayName": "Extra Large", "sortOrder": 40 }
      }
    }
  }
}
```

### Removing Choices

Handle with care - existing content may reference removed choices:
1. Add new choices first
2. Migrate content to new choices
3. Remove old choices only after content migration

### Renaming Templates

Create new template rather than renaming:
1. Create new template with new key
2. Migrate content to new template
3. Deprecate old template
4. Remove old template after migration

## Summary

Display templates provide a powerful way to give content editors visual control while maintaining design consistency. Key takeaways:

1. **One template per style variant** - Use separate templates for major variations
2. **Settings for minor variations** - Use settings within templates for size, color, spacing
3. **Consistent naming** - Follow patterns across all templates
4. **Map to CSS** - Ensure every choice maps to TailwindCSS classes
5. **Default template** - Always provide a sensible default
6. **Limited choices** - Keep choices manageable (3-7 options)
7. **Clear labels** - Use descriptive display names
8. **Proper scoping** - Use contentType for specific templates, baseType for generic

By following these guidelines, you'll create maintainable, editor-friendly display templates that integrate seamlessly with your Astro + Optimizely CMS project.
