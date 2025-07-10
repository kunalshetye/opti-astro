import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Image component schema
export const ImageComponentDefinition = ComponentSchema({
  key: 'Image',
  displayName: 'Image',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    AltText: {
      type: 'string',
      displayName: 'Alt Text',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: -200,
      editorSettings: {},
      indexingType: 'searchable',
    },
    Image: {
      type: 'contentReference',
      displayName: 'Image',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: -100,
      editorSettings: {},
      allowedTypes: ['Image'],
      restrictedTypes: [],
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeImageToJSON() {
  return JSON.parse(JSON.stringify(ImageComponentDefinition));
}
