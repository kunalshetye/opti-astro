import { ComponentSchema } from '../../../lib/schema-registry.js';

// Auto-registering Card component schema
export const CardComponentDefinition = ComponentSchema({
  key: 'Card',
  displayName: 'Card',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -100,
      editorSettings: {},
      indexingType: 'searchable',
    },
    SubHeading: {
      type: 'string',
      displayName: 'Sub Heading',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -50,
      editorSettings: {},
      indexingType: 'searchable',
    },
    Body: {
      type: 'string',
      displayName: 'Body',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -25,
      editorSettings: {},
      format: 'html',
      indexingType: 'searchable',
    },
    DisplayAs: {
      type: 'string',
      displayName: 'Display As',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      editorSettings: {},
      format: 'selectOne',
      enum: {
        values: [
          {
            displayName: 'Text Below Card',
            value: 'textBelowCard',
          },
          {
            displayName: 'Text Above Card',
            value: 'textAboveCard',
          },
          {
            displayName: 'Text On Left',
            value: 'textOnLeft',
          },
          {
            displayName: 'Text On Right',
            value: 'textOnRight',
          }
        ],
      },
    },
    Asset: {
      type: 'contentReference',
      displayName: 'Asset',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      editorSettings: {},
      allowedTypes: ['Image'],
      restrictedTypes: [],
    },
    Links: {
      type: 'array',
      displayName: 'Links',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 200,
      editorSettings: {},
      format: 'LinkCollection',
      items: {
        type: 'component',
        contentType: 'link',
      },
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeCardToJSON() {
  return JSON.parse(JSON.stringify(CardComponentDefinition));
}
