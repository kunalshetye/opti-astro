import { contentType } from '@episerver/cms-sdk';

export const Carousel = contentType({
  key: 'Carousel',
  displayName: 'Carousel',
  description: '',
  baseType: '_component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [
    'sectionEnabled',
    'elementEnabled'
  ],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'Carousel section heading',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -100,
      indexingType: 'searchable',
    },
    Link: {
      type: 'link',
      displayName: 'Link',
      description: 'Optional link for the heading',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: -50,
    },
    Assets: {
      type: 'array',
      format: 'LinkCollection',
      displayName: 'Assets',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      editorSettings: {},
      items: {
        type: 'link'
      }
    }
  }
});