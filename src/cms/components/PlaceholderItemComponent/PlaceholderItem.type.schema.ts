import { ComponentSchema } from '../../../lib/schema-registry.js';

// Auto-registering PlaceholderItem component schema
export const PlaceholderItemComponentDefinition = ComponentSchema({
  key: 'PlaceholderItem',
  displayName: 'PlaceholderItem',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [],
  properties: {
    Key: {
      type: 'string',
      displayName: 'Key',
      description: '',
      localized: false,
      required: true,
      group: 'Information',
      sortOrder: 0,
      editorSettings: {},
    },
    Value: {
      type: 'string',
      displayName: 'Value',
      description: '',
      localized: true,
      required: true,
      group: 'Information',
      sortOrder: 0,
      editorSettings: {},
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializePlaceholderItemToJSON() {
  return JSON.parse(JSON.stringify(PlaceholderItemComponentDefinition));
}
