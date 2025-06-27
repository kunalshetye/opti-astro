import { contentType } from '@episerver/cms-sdk';

export const PlaceholdersConfiguration = contentType({
  key: 'PlaceholdersConfiguration',
  displayName: 'Placeholders Configuration',
  description: '',
  baseType: '_component',
  sortOrder: 0,
  properties: {
    Placeholders: {
      type: 'array',
      displayName: 'Placeholders',
      description: '',
      localized: true,
      required: true,
      group: 'Information',
      sortOrder: 0,
      items: {
        type: 'content'
      }
    },
    Domain: {
      type: 'string',
      displayName: 'Domain',
      description: '',
      localized: true,
      required: true,
      group: 'Information',
      sortOrder: 0,
      indexingType: 'queryable'
    }
  }
});