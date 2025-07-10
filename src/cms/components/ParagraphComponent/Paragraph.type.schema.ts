import { ComponentSchema } from '../../../lib/schema-registry.js';

// Auto-registering Paragraph component schema
export const ParagraphComponentDefinition = ComponentSchema({
  key: 'Paragraph',
  displayName: 'Paragraph',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Text: {
      type: 'string',
      displayName: 'Text',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      editorSettings: {},
      format: 'html',
      indexingType: 'searchable',
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeParagraphToJSON() {
  return JSON.parse(JSON.stringify(ParagraphComponentDefinition));
}
