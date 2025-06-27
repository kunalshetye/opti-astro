import { contentType } from '@episerver/cms-sdk';

export const CallToAction = contentType({
  key: 'CallToAction',
  displayName: 'Call To Action',
  description: '',
  baseType: '_component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Links: {
      type: 'array',
      displayName: 'Links',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      items: {
        type: 'link'
      }
    }
  }
});