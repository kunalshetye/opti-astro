import { contentType } from '@episerver/cms-sdk';

export const Button = contentType({
  key: 'Button',
  displayName: 'Button',
  description: 'Single Button',
  baseType: '_component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['elementEnabled'],
  properties: {
    ButtonLabel: {
      type: 'string',
      format: 'shortString',
      displayName: 'Button Label',
      description: 'Button Label',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 10
    },
    ButtonLink: {
      type: 'link',
      displayName: 'Button Link',
      description: 'Content the button is linking to',
      localized: false,
      required: true,
      group: 'Information',
      sortOrder: 20
    }
  }
});