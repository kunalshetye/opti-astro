import { contentType } from '@episerver/cms-sdk';

export const Card = contentType({
  key: 'Card',
  displayName: 'Card',
  description: '',
  baseType: '_component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -100
    },
    SubHeading: {
      type: 'string',
      displayName: 'Sub Heading',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -50
    },
    Body: {
      type: 'string',
      format: 'html',
      displayName: 'Body',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -25
    },
    DisplayAs: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Display As',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      enum: [
        {
          displayName: 'Text Below Card',
          value: 'textBelowCard'
        },
        {
          displayName: 'Text Above Card',
          value: 'textAboveCard'
        },
        {
          displayName: 'Text On Left',
          value: 'textOnLeft'
        },
        {
          displayName: 'Text On Right',
          value: 'textOnRight'
        }
      ]
    },
    Asset: {
      type: 'contentReference',
      displayName: 'Asset',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      allowedTypes: ['_image'],
      restrictedTypes: []
    },
    Links: {
      type: 'array',
      displayName: 'Links',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 200,
      items: {
        type: 'link'
      }
    }
  }
});