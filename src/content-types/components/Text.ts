import { contentType } from '@episerver/cms-sdk';

export const Text = contentType({
  key: 'Text',
  displayName: 'Text',
  description: '',
  baseType: '_component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Content: {
      type: 'string',
      displayName: 'Content',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0
    }
  }
});