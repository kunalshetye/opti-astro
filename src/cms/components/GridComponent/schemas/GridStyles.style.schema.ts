import { StyleSchema } from '../../../../lib/schema-registry.js';
import { GridComponentDefinition } from './Grid.type.schema.js';

// Auto-registering Grid Default style schema
export const GridStylesStyleDefinition = StyleSchema({
  key: 'GridStyles',
  displayName: 'Grid Default',
  contentType: GridComponentDefinition.key,
  isDefault: true,
  settings: {
      "columnsOnDesktop": {
        "displayName": "Columns on Desktop",
        "editor": "",
        "sortOrder": 10,
        "choices": {
          "c1": {
            "displayName": "1",
            "sortOrder": 10
          },
          "c2": {
            "displayName": "2",
            "sortOrder": 20
          },
          "c3": {
            "displayName": "3",
            "sortOrder": 30
          },
          "c4": {
            "displayName": "4",
            "sortOrder": 40
          }
        }
      },
      "columnsOnTablet": {
        "displayName": "Columns on Tablet",
        "editor": "",
        "sortOrder": 20,
        "choices": {
          "c1": {
            "displayName": "1",
            "sortOrder": 10
          },
          "c2": {
            "displayName": "2",
            "sortOrder": 20
          },
          "c3": {
            "displayName": "3",
            "sortOrder": 30
          },
          "c4": {
            "displayName": "4",
            "sortOrder": 40
          }
        }
      },
      "columnsOnMobile": {
        "displayName": "Columns on Mobile",
        "editor": "",
        "sortOrder": 30,
        "choices": {
          "c1": {
            "displayName": "1",
            "sortOrder": 10
          },
          "c2": {
            "displayName": "2",
            "sortOrder": 20
          },
          "c3": {
            "displayName": "3",
            "sortOrder": 30
          },
          "c4": {
            "displayName": "4",
            "sortOrder": 40
          }
        }
      }
    },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeGridStylesStyleToJSON() {
  return JSON.parse(JSON.stringify(GridStylesStyleDefinition));
}
