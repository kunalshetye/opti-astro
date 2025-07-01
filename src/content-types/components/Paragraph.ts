import { contentType } from '@episerver/cms-sdk';

export const Paragraph = contentType({
  key: 'Paragraph',
  displayName: 'Paragraph',
  description: '',
  baseType: '_component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Text: {
      type: 'string',
      format: 'html',
      displayName: 'Text',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0
    }
  }
});