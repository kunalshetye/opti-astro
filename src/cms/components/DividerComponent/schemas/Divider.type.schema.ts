import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Divider component schema
export const DividerComponentDefinition = ComponentSchema({
  key: 'Divider',
  displayName: 'Divider',
  description: 'Divider component, to separate content vertically or horizontally',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    DividerText: {
      type: 'string',
      displayName: 'Divider Text',
      description: 'Text to show on divider line',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 10,
      editorSettings: {},
      format: 'shortString',
    },
    DividerDirection: {
      type: 'string',
      displayName: 'Divider Direction',
      description: 'Direction the divider line will be displayed',
      localized: false,
      required: true,
      group: 'Information',
      sortOrder: 20,
      editorSettings: {},
      format: 'selectOne',
      enum: {
        values: [
          {
            displayName: 'Horizontal Divider Line',
            value: 'horizontal',
          },
          {
            displayName: 'Vertical Divider Line',
            value: 'vertical',
          }
        ],
      },
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeDividerToJSON() {
  return JSON.parse(JSON.stringify(DividerComponentDefinition));
}
