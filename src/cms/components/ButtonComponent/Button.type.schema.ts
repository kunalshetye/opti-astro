import { ComponentSchema } from '../../../lib/schema-registry.js';

// Auto-registering Button component schema
export const ButtonComponentDefinition = ComponentSchema({
  key: 'Button',
  displayName: 'Button',
  description: 'Single Button',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['elementEnabled'],
  properties: {
    ButtonLabel: {
      type: 'string',
      displayName: 'Button Label',
      description: 'Button Label',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 10,
      editorSettings: {},
      format: 'shortString',
      indexingType: 'searchable',
    },
    ButtonLink: {
      type: 'component',
      displayName: 'Button Link',
      description: 'Content the button is linking to',
      localized: false,
      required: true,
      group: 'Information',
      sortOrder: 20,
      editorSettings: {},
      contentType: 'link',
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeButtonToJSON() {
  return JSON.parse(JSON.stringify(ButtonComponentDefinition));
}
