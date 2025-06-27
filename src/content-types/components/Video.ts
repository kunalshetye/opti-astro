import { contentType } from '@episerver/cms-sdk';

export const Video = contentType({
  key: 'Video',
  displayName: 'Video',
  description: 'Video',
  baseType: '_component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [
    'sectionEnabled',
    'elementEnabled'
  ],
  properties: {
    Video: {
      type: 'contentReference',
      displayName: 'Video',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 0,
      allowedTypes: [
        '_video'
      ],
      restrictedTypes: []
    },
    VideoPosterImage: {
      type: 'contentReference',
      displayName: 'Video Poster Image',
      description: 'Image shown before video is played (limited use if autoplay enabled)',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 20,
      allowedTypes: [
        '_image'
      ],
      restrictedTypes: []
    }
  }
});