import { contentType } from '@episerver/cms-sdk';

export const Collapse = contentType({
  key: 'Collapse',
  displayName: 'Collapse',
  description: '',
  baseType: '_component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [
    'elementEnabled'
  ],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      indexingType: 'searchable',
    },
    Body: {
      type: 'string',
      format: 'html',
      displayName: 'Body',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      indexingType: 'searchable',
    }
  }
});