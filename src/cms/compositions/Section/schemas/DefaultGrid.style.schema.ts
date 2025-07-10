import { StyleSchema } from '../../../../lib/schema-registry.js';

// Auto-registering [DO NOT EXPORT]Default style schema
export const DefaultGridStyleDefinition = StyleSchema({
  key: 'DefaultGrid',
  displayName: '[DO NOT EXPORT]Default',
  baseType: 'section',
  isDefault: false,
  settings: {
      gridWidth: {
        displayName: 'Width',
        editor: '',
        sortOrder: 10,
        choices: {
          default: {
            displayName: 'Default',
            sortOrder: 10,
          },
          full: {
            displayName: 'Full width',
            sortOrder: 20,
          },
          wide: {
            displayName: 'Wide',
            sortOrder: 30,
          },
          narrow: {
            displayName: 'Narrow',
            sortOrder: 40,
          },
        },
      },
      vSpacing: {
        displayName: 'Vertical spacing',
        editor: '',
        sortOrder: 20,
        choices: {
          default: {
            displayName: 'Default',
            sortOrder: 10,
          },
          small: {
            displayName: 'Small',
            sortOrder: 20,
          },
          large: {
            displayName: 'Large',
            sortOrder: 30,
          },
        },
      },
      sectionColor: {
        displayName: 'Color',
        editor: '',
        sortOrder: 30,
        choices: {
          default: {
            displayName: 'Default',
            sortOrder: 10,
          },
          gray: {
            displayName: 'Gray',
            sortOrder: 20,
          },
          black: {
            displayName: 'Black',
            sortOrder: 30,
          },
          blue: {
            displayName: 'Blue',
            sortOrder: 40,
          },
        },
      },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeDefaultGridStyleToJSON() {
  return JSON.parse(JSON.stringify(DefaultGridStyleDefinition));
}
