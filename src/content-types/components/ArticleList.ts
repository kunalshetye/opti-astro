import { contentType } from '@episerver/cms-sdk';

export const ArticleList = contentType({
  key: 'ArticleList',
  displayName: 'Article List',
  description: '',
  baseType: '_component',
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
      sortOrder: 0
    },
    NumberOfArticles: {
      type: 'integer',
      displayName: 'Number of Articles to Show',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 100,
      minimum: 1
    }
  }
});