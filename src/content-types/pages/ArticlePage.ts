import { contentType } from '@episerver/cms-sdk';

export const ArticlePage = contentType({
  key: 'ArticlePage',
  displayName: 'Article',
  description: '',
  baseType: '_page',
  sortOrder: 0,
  mayContainTypes: ['*'],
  mediaFileExtensions: [],
  compositionBehaviors: [],
  properties: {
    PromoImage: {
      type: 'contentReference',
      displayName: 'Promo Image',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -100,
      allowedTypes: ['_image'],
      restrictedTypes: []
    },
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0
    },
    SubHeading: {
      type: 'string',
      displayName: 'Sub Heading',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0
    },
    Author: {
      type: 'string',
      format: 'shortString',
      displayName: 'Author',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 100
    },
    AuthorEmail: {
      type: 'string',
      displayName: 'Author Email',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 150
    },
    Body: {
      type: 'string',
      format: 'html',
      displayName: 'Body',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 200
    }
    // SeoSettings removed for now - would need actual PageSeoSettings contentType object
  }
});