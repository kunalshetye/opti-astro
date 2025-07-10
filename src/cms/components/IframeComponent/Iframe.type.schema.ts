import { ComponentSchema } from '../../../lib/schema-registry.js';

// Auto-registering iframe component schema
export const IframeComponentDefinition = ComponentSchema({
  key: 'Iframe',
  displayName: 'iframe',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Title: {
      type: 'string',
      displayName: 'Title',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 5,
      editorSettings: {},
      format: 'shortString',
      indexingType: 'searchable',
    },
    IframePageUrl: {
      type: 'string',
      displayName: 'Page URL',
      description: 'URL of content to be iframed',
      localized: false,
      required: true,
      group: 'Information',
      sortOrder: 10,
      editorSettings: {},
      format: 'shortString',
    },
    ManualHeight: {
      type: 'integer',
      displayName: 'Height (px)',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 40,
      editorSettings: {},
      minimum: 1,
    },
    Width: {
      type: 'string',
      displayName: 'Width (Default: full width)',
      description: 'Note: displayed at 100% for small breakpoints',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 50,
      editorSettings: {},
      format: 'selectOne',
      enum: {
        values: [
          {
            displayName: 'Full (Default)',
            value: 'w-full',
          },
          {
            displayName: '3/4',
            value: 'w-3/4',
          },
          {
            displayName: '2/3',
            value: 'w-2/3',
          },
          {
            displayName: '1/2',
            value: 'w-1/2',
          },
          {
            displayName: '1/3',
            value: 'w-1/3',
          },
          {
            displayName: '1/4',
            value: 'w-1/4',
          }
        ],
      },
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeIframeToJSON() {
  return JSON.parse(JSON.stringify(IframeComponentDefinition));
}
