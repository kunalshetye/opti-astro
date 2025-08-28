# Style Creation Guide

This guide provides comprehensive documentation for creating opti-style.json files for Optimizely SaaS CMS components, based on the OpenAPI specifications and existing project patterns.

## Overview

Style files define display templates that allow content editors to customize the visual appearance and behavior of components through the CMS interface. These styles map to CSS classes and are used by the `globalStylesHelper.ts` to generate appropriate TailwindCSS classes.

## File Structure

Style definitions are stored in `.opti-style.json` files alongside your component files:

```
src/cms/components/YourComponent/
├── YourComponent.astro
├── YourComponent.opti-type.json
├── YourComponent.opti-style.json  ← This file
└── YourComponent.graphql
```

## Basic Structure

```json
{
  "key": "StyleName",
  "displayName": "Human Readable Style Name",
  "contentType": "ComponentName",
  "isDefault": true,
  "settings": {
    // Display settings go here
  }
}
```

## Root Level Properties

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `key` | string | Unique style identifier (2-255 chars, alphanumeric + underscore, must start with letter) | `"DefaultButton"` |
| `displayName` | string | Human-readable style name (1-255 chars) | `"Button Default"` |
| `contentType` | string | Content type this style applies to (2-255 chars) | `"Button"` |

### Optional Fields

| Field | Type | Description | Default | Example |
|-------|------|-------------|---------|---------|
| `isDefault` | boolean | Whether this is the default style for the content type | `false` | `true` |
| `nodeType` | string | Node type this style applies to (2-50 chars) | `null` | `"component"` |
| `baseType` | string | Base type this style applies to | `null` | `"component"` |

## Display Settings Structure

Settings are defined in the `settings` object. Each setting represents a customization option available to content editors.

### Basic Setting Structure

```json
"settingKey": {
  "displayName": "Human Readable Name",
  "editor": "editorType",
  "sortOrder": 10,
  "choices": {
    "choiceKey": {
      "displayName": "Choice Name",
      "sortOrder": 10
    }
  }
}
```

### Setting Fields

| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `displayName` | string | Human-readable setting name (1-255 chars) | ✅ | `"Button Style"` |
| `editor` | string | Editor type hint (max 50 chars) | ❌ | `"dropdown"` |
| `sortOrder` | integer | Display order in CMS interface | ❌ | `10` |
| `choices` | object | Available options for this setting | ❌ | See below |

### Choice Structure

Each choice within a setting has:

| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `displayName` | string | Human-readable choice name (1-255 chars) | ✅ | `"Primary Button"` |
| `sortOrder` | integer | Display order within the setting | ❌ | `10` |

## Common Setting Patterns

### 1. Button Styles

```json
"buttonStyle": {
  "displayName": "Button Style",
  "editor": "",
  "sortOrder": 10,
  "choices": {
    "standard": {
      "displayName": "Standard (Default)",
      "sortOrder": 10
    },
    "soft": {
      "displayName": "Soft",
      "sortOrder": 20
    },
    "outline": {
      "displayName": "Outline (Transparent)",
      "sortOrder": 30
    },
    "ghost": {
      "displayName": "Ghost",
      "sortOrder": 40
    }
  }
}
```

### 2. Color Schemes

```json
"buttonType": {
  "displayName": "Button Color",
  "editor": "",
  "sortOrder": 20,
  "choices": {
    "primary": {
      "displayName": "Primary (Default)",
      "sortOrder": 10
    },
    "secondary": {
      "displayName": "Secondary",
      "sortOrder": 20
    },
    "accent": {
      "displayName": "Accent",
      "sortOrder": 30
    },
    "neutral": {
      "displayName": "Neutral",
      "sortOrder": 40
    },
    "info": {
      "displayName": "Info",
      "sortOrder": 50
    },
    "success": {
      "displayName": "Success",
      "sortOrder": 60
    },
    "warning": {
      "displayName": "Warning",
      "sortOrder": 70
    },
    "error": {
      "displayName": "Error",
      "sortOrder": 80
    }
  }
}
```

### 3. Sizing Options

```json
"buttonSize": {
  "displayName": "Button Size",
  "editor": "",
  "sortOrder": 30,
  "choices": {
    "xs": {
      "displayName": "Extra Small",
      "sortOrder": 10
    },
    "sm": {
      "displayName": "Small",
      "sortOrder": 20
    },
    "medium": {
      "displayName": "Medium (Default)",
      "sortOrder": 30
    },
    "lg": {
      "displayName": "Large",
      "sortOrder": 40
    },
    "xl": {
      "displayName": "X-Large",
      "sortOrder": 50
    }
  }
}
```

### 4. Width Controls

```json
"buttonWidth": {
  "displayName": "Button Width",
  "editor": "",
  "sortOrder": 40,
  "choices": {
    "w_6rem": {
      "displayName": "Narrow (6rem)",
      "sortOrder": 10
    },
    "w_10rem": {
      "displayName": "Standard (10rem) (Default)",
      "sortOrder": 20
    },
    "auto": {
      "displayName": "Auto (Dynamic)",
      "sortOrder": 30
    },
    "half": {
      "displayName": "Half Width",
      "sortOrder": 40
    },
    "full": {
      "displayName": "Full Width",
      "sortOrder": 50
    }
  }
}
```

### 5. Border Radius

```json
"buttonRadius": {
  "displayName": "Button Corners",
  "editor": "",
  "sortOrder": 50,
  "choices": {
    "standard": {
      "displayName": "Square (No Rounding)",
      "sortOrder": 10
    },
    "sm": {
      "displayName": "Small Radius",
      "sortOrder": 20
    },
    "md": {
      "displayName": "Medium Radius",
      "sortOrder": 30
    },
    "lg": {
      "displayName": "Large Radius",
      "sortOrder": 40
    },
    "full": {
      "displayName": "Fully Rounded",
      "sortOrder": 50
    }
  }
}
```

### 6. Text Transform

```json
"transform": {
  "displayName": "Text Transform",
  "editor": "",
  "sortOrder": 60,
  "choices": {
    "keep": {
      "displayName": "As entered",
      "sortOrder": 10
    },
    "uppercase": {
      "displayName": "Uppercase",
      "sortOrder": 20
    },
    "lowercase": {
      "displayName": "Lowercase",
      "sortOrder": 30
    },
    "capitalize": {
      "displayName": "Capitalize",
      "sortOrder": 40
    }
  }
}
```

### 7. Alignment Options

```json
"textAlign": {
  "displayName": "Text Alignment",
  "editor": "",
  "sortOrder": 70,
  "choices": {
    "left": {
      "displayName": "Left (Default)",
      "sortOrder": 10
    },
    "center": {
      "displayName": "Center",
      "sortOrder": 20
    },
    "right": {
      "displayName": "Right",
      "sortOrder": 30
    },
    "justify": {
      "displayName": "Justify",
      "sortOrder": 40
    }
  }
}
```

### 8. Vertical Alignment

```json
"verticalAlign": {
  "displayName": "Vertical Alignment",
  "editor": "",
  "sortOrder": 80,
  "choices": {
    "start": {
      "displayName": "Top",
      "sortOrder": 10
    },
    "center": {
      "displayName": "Center (Default)",
      "sortOrder": 20
    },
    "end": {
      "displayName": "Bottom",
      "sortOrder": 30
    }
  }
}
```

### 9. Background Colors

```json
"backgroundColor": {
  "displayName": "Background Color",
  "editor": "",
  "sortOrder": 90,
  "choices": {
    "transparent": {
      "displayName": "Transparent",
      "sortOrder": 5
    },
    "base_100": {
      "displayName": "Base 100",
      "sortOrder": 10
    },
    "base_200": {
      "displayName": "Base 200",
      "sortOrder": 20
    },
    "primary": {
      "displayName": "Primary",
      "sortOrder": 30
    },
    "secondary": {
      "displayName": "Secondary",
      "sortOrder": 40
    },
    "accent": {
      "displayName": "Accent",
      "sortOrder": 50
    }
  }
}
```

### 10. Opacity/Tint Levels

```json
"tintLevel": {
  "displayName": "Tint Level",
  "editor": "",
  "sortOrder": 100,
  "choices": {
    "o_0": {
      "displayName": "0 (No Tint)",
      "sortOrder": 0
    },
    "o_25": {
      "displayName": "25",
      "sortOrder": 25
    },
    "o_50": {
      "displayName": "50",
      "sortOrder": 50
    },
    "o_75": {
      "displayName": "75 (Default)",
      "sortOrder": 75
    },
    "o_100": {
      "displayName": "100",
      "sortOrder": 100
    }
  }
}
```

### 11. Hover Effects

```json
"hoverEffect": {
  "displayName": "Hover Effect",
  "editor": "",
  "sortOrder": 110,
  "choices": {
    "none": {
      "displayName": "None",
      "sortOrder": 10
    },
    "zoom": {
      "displayName": "Zoom",
      "sortOrder": 20
    },
    "zoom_subtle": {
      "displayName": "Zoom (Subtle) (Default)",
      "sortOrder": 30
    },
    "bounce": {
      "displayName": "Bounce",
      "sortOrder": 40
    }
  }
}
```

### 12. Layout Proportions

```json
"contentWidth": {
  "displayName": "Content Width",
  "editor": "",
  "sortOrder": 120,
  "choices": {
    "w_1_3": {
      "displayName": "One Third (33%)",
      "sortOrder": 10
    },
    "w_2_5": {
      "displayName": "Two Fifths (40%)",
      "sortOrder": 20
    },
    "flex_1": {
      "displayName": "Equal (50/50) (Default)",
      "sortOrder": 30
    },
    "w_3_5": {
      "displayName": "Three Fifths (60%)",
      "sortOrder": 40
    },
    "w_2_3": {
      "displayName": "Two Thirds (67%)",
      "sortOrder": 50
    }
  }
}
```

## Complete Example: Advanced Card Style

```json
{
  "key": "DefaultCard",
  "displayName": "Card Default",
  "contentType": "Card", 
  "isDefault": true,
  "settings": {
    "containerWidth": {
      "displayName": "Container Width",
      "editor": "",
      "sortOrder": 10,
      "choices": {
        "default": {
          "displayName": "Default (max-w-7xl)",
          "sortOrder": 10
        },
        "fullSplit": {
          "displayName": "Full Width (50/50 Split)",
          "sortOrder": 20
        }
      }
    },
    "hoverEffect": {
      "displayName": "Hover Effect",
      "editor": "",
      "sortOrder": 20,
      "choices": {
        "zoom_subtle": {
          "displayName": "Zoom (Subtle) (Default)",
          "sortOrder": 10
        },
        "zoom": {
          "displayName": "Zoom",
          "sortOrder": 20
        },
        "none": {
          "displayName": "None",
          "sortOrder": 30
        }
      }
    },
    "assetWidth": {
      "displayName": "Asset Width",
      "editor": "",
      "sortOrder": 30,
      "choices": {
        "w_1_3": {
          "displayName": "One Third (33%)",
          "sortOrder": 10
        },
        "flex_1": {
          "displayName": "Equal (50/50) (Default)",
          "sortOrder": 20
        },
        "w_2_3": {
          "displayName": "Two Thirds (67%)",
          "sortOrder": 30
        }
      }
    },
    "contentVerticalAlign": {
      "displayName": "Content Vertical Alignment",
      "editor": "",
      "sortOrder": 40,
      "choices": {
        "start": {
          "displayName": "Top",
          "sortOrder": 10
        },
        "center": {
          "displayName": "Center (Default)",
          "sortOrder": 20
        },
        "end": {
          "displayName": "Bottom",
          "sortOrder": 30
        }
      }
    },
    "textAlign": {
      "displayName": "Text Alignment", 
      "editor": "",
      "sortOrder": 50,
      "choices": {
        "left": {
          "displayName": "Left (Default)",
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
    "backgroundColor": {
      "displayName": "Card Background Color",
      "editor": "",
      "sortOrder": 60,
      "choices": {
        "transparent": {
          "displayName": "Transparent",
          "sortOrder": 10
        },
        "base_100": {
          "displayName": "Base 100",
          "sortOrder": 20
        },
        "primary": {
          "displayName": "Primary",
          "sortOrder": 30
        },
        "secondary": {
          "displayName": "Secondary",
          "sortOrder": 40
        }
      }
    }
  }
}
```

## Integration with TailwindCSS

The style choices map to TailwindCSS classes through the `globalStylesHelper.ts`. Common mapping patterns:

### Color Mapping
- `primary` → `btn-primary`, `bg-primary`, etc.
- `secondary` → `btn-secondary`, `bg-secondary`, etc.

### Size Mapping  
- `xs` → `btn-xs`, `text-xs`, etc.
- `sm` → `btn-sm`, `text-sm`, etc.
- `lg` → `btn-lg`, `text-lg`, etc.

### Width Mapping
- `w_6rem` → `w-24`
- `w_10rem` → `w-40` 
- `full` → `w-full`
- `flex_1` → `flex-1`

### Radius Mapping
- `sm` → `rounded-sm`
- `md` → `rounded-md`
- `full` → `rounded-full`

### Opacity Mapping
- `o_25` → `opacity-25`
- `o_50` → `opacity-50`
- `o_75` → `opacity-75`

## Best Practices

### 1. Consistent Naming

Use consistent choice keys across components:
```json
// Good - consistent across all components
"primary", "secondary", "accent"

// Avoid - inconsistent naming  
"main", "alternate", "highlight"
```

### 2. Logical Sort Orders

Use incremental sort orders (10, 20, 30) to allow insertion of new options:
```json
"choices": {
  "small": {"sortOrder": 10},
  "medium": {"sortOrder": 20},
  "large": {"sortOrder": 30}
  // Room to add "extra-large" at 40
}
```

### 3. Default Indicators

Clearly mark default choices in display names:
```json
"medium": {
  "displayName": "Medium (Default)",
  "sortOrder": 20
}
```

### 4. Descriptive Choice Names

Use descriptive names that indicate the visual result:
```json
"w_10rem": {
  "displayName": "Standard (10rem) (Default)",
  "sortOrder": 20
}
```

### 5. Logical Grouping

Group related settings with similar sort orders:
```json
// Typography group (10-50)
"textAlign": {"sortOrder": 10},
"transform": {"sortOrder": 20},
"fontSize": {"sortOrder": 30},

// Layout group (60-100) 
"width": {"sortOrder": 60},
"height": {"sortOrder": 70},
"spacing": {"sortOrder": 80}
```

### 6. Comprehensive Coverage

Provide options that cover common use cases:
```json
"buttonStyle": {
  "choices": {
    "standard": {},    // Default solid button
    "outline": {},     // Border only
    "ghost": {},       // Transparent with hover
    "link": {}         // Text-only link style
  }
}
```

### 7. Accessibility Considerations

Include options that support accessibility:
```json
"contrast": {
  "displayName": "Contrast Level",
  "choices": {
    "normal": {"displayName": "Normal"},
    "high": {"displayName": "High Contrast"}
  }
}
```

## Multiple Styles per Component

You can create multiple style files for the same component:

```
src/cms/components/Button/
├── Button.astro
├── Button.opti-type.json
├── DefaultButton.opti-style.json    ← Default style
├── LoginButton.opti-style.json      ← Specialized style
└── CallToActionButton.opti-style.json ← Another variant
```

Each style file should have:
- A unique `key`
- The same `contentType` 
- Only one should have `"isDefault": true`

## Common Editor Types

While the `editor` field is optional, you can specify editor types for better UX:

```json
"colorPicker": {
  "displayName": "Background Color",
  "editor": "colorPicker",
  "choices": {...}
},
"dropdown": {
  "displayName": "Size",
  "editor": "dropdown", 
  "choices": {...}
},
"radio": {
  "displayName": "Alignment",
  "editor": "radio",
  "choices": {...}
}
```

## Validation Rules

The OpenAPI specification defines these validation rules:

### Display Template
- `key`: 2-255 chars, alphanumeric + underscore, must start with letter
- `displayName`: 1-255 chars, required
- `contentType`: 2-255 chars, must match existing content type
- `nodeType`: 2-50 chars, alphanumeric + underscore, must start with letter

### Display Settings
- `displayName`: 1-255 chars, required
- `editor`: max 50 chars
- `sortOrder`: integer

### Display Setting Choices
- `displayName`: 1-255 chars, required  
- `sortOrder`: integer

This comprehensive guide covers all aspects of creating style definitions for Optimizely SaaS CMS components. Use it to create consistent, user-friendly styling options that integrate seamlessly with your TailwindCSS-based design system.