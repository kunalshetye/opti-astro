import { contentType } from '@episerver/cms-sdk';

export const Hero = contentType({
  key: 'Hero',
  displayName: 'Hero',
  description: 'A flexible Hero Component',
  baseType: '_component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Video: {
      type: 'contentReference',
      displayName: 'Video',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -200,
      allowedTypes: ['_video'],
      restrictedTypes: []
    },
    Image: {
      type: 'contentReference',
      displayName: 'Image',
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
      sortOrder: -50
    },
    SubHeading: {
      type: 'string',
      displayName: 'Sub Heading',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -25
    },
    Body: {
      type: 'string',
      format: 'html',
      displayName: 'Body',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0
    },
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