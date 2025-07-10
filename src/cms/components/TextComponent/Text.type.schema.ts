import { ComponentSchema } from '../../../lib/schema-registry.js';

// Auto-registering Text component schema
export const TextComponentDefinition = ComponentSchema({
  key: 'Text',
  displayName: 'Text',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Content: {
      type: 'string',
      displayName: 'Content',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      editorSettings: {},
      indexingType: 'searchable',
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeTextToJSON() {
  return JSON.parse(JSON.stringify(TextComponentDefinition));
}
