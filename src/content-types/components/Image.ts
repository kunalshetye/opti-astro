import { contentType } from '@episerver/cms-sdk';

export const Image = contentType({
  key: 'Image',
  displayName: 'Image',
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
    AltText: {
      type: 'string',
      displayName: 'Alt Text',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: -200,
      indexingType: 'searchable',
      editorSettings: {}
    },
    Image: {
      type: 'contentReference',
      displayName: 'Image',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: -100,
      allowedTypes: [
        '_image'
      ],
      restrictedTypes: []
    }
  }
});