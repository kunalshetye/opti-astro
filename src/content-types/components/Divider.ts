import { contentType } from '@episerver/cms-sdk';

export const Divider = contentType({
  key: 'Divider',
  displayName: 'Divider',
  description: 'Divider component, to separate content vertically or horizontally',
  baseType: '_component',
  sortOrder: 0,
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    DividerText: {
      type: 'string',
      displayName: 'Divider Text',
      description: 'Text to show on divider line',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 10
    },
    DividerDirection: {
      type: 'string',
      displayName: 'Divider Direction',
      description: 'Direction the divider line will be displayed',
      localized: false,
      required: true,
      group: 'Information',
      sortOrder: 20,
      enum: [
        { displayName: 'Horizontal Divider Line', value: 'horizontal' },
        { displayName: 'Vertical Divider Line', value: 'vertical' }
      ]
    }
  }
});