import { ComponentSchema } from '../../../lib/schema-registry.js';

// Auto-registering Image media component schema
export const ImageMediaComponentDefinition = ComponentSchema({
  key: 'ImageMedia',
  displayName: 'Image media',
  description: 'Used for image assets.',
  baseType: 'image',
  sortOrder: 510,
  mayContainTypes: [],
  mediaFileExtensions: ['jpg', 'jpeg', 'jpe', 'ico', 'gif', 'bmp', 'heif', 'png', 'svg', 'tiff', 'webp'],
  compositionBehaviors: [],
  properties: {
    AltText: {
      type: 'string',
      displayName: 'Alt text',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 10,
      editorSettings: {},
      format: 'shortString',
      indexingType: 'searchable',
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeImageMediaToJSON() {
  return JSON.parse(JSON.stringify(ImageMediaComponentDefinition));
}
