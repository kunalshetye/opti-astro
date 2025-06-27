import { contentType } from '@episerver/cms-sdk';

export const Grid = contentType({
  key: 'Grid',
  displayName: 'Grid',
  description: '',
  baseType: '_component',
  sortOrder: 0,
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    RichText: {
      type: 'richText',
      displayName: 'Rich Text',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -75,
      indexingType: 'searchable'
    },
    Items: {
      type: 'array',
      displayName: 'Items',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      items: {
        type: 'content'
      }
    }
  }
});