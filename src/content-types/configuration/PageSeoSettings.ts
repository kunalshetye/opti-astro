import { contentType } from '@episerver/cms-sdk';

export const PageSeoSettings = contentType({
  key: 'PageSeoSettings',
  displayName: 'Page SEO Settings',
  description: '',
  baseType: '_component',
  sortOrder: 100,
  properties: {
    MetaTitle: {
      type: 'string',
      displayName: 'Meta title',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      indexingType: 'searchable'
    },
    MetaDescription: {
      type: 'string',
      displayName: 'Meta description',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 0,
      indexingType: 'searchable'
    },
    DisplayInMenu: {
      type: 'boolean',
      displayName: 'Display In Menu',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0
    },
    Indexing: {
      type: 'boolean',
      displayName: 'Disable Indexing (NOINDEX, NOFOLLOW)',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0
    },
    SharingImage: {
      type: 'contentReference',
      displayName: 'Sharing image',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 100
    },
    GraphType: {
      type: 'string',
      displayName: 'OpenGraph Type',
      description: '',
      localized: false,
      required: true,
      group: 'Information',
      sortOrder: 200,
      enum: [
        { displayName: 'Undefined', value: '-' },
        { displayName: 'Article', value: 'article' }
      ]
    }
  }
});