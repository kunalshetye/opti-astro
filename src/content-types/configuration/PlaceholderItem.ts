import { contentType } from '@episerver/cms-sdk';

export const PlaceholderItem = contentType({
  key: 'PlaceholderItem',
  displayName: 'PlaceholderItem',
  description: '',
  baseType: '_component',
  sortOrder: 0,
  properties: {
    Key: {
      type: 'string',
      displayName: 'Key',
      description: '',
      localized: false,
      required: true,
      group: 'Information',
      sortOrder: 0
    },
    Value: {
      type: 'string',
      displayName: 'Value',
      description: '',
      localized: true,
      required: true,
      group: 'Information',
      sortOrder: 0
    }
  }
});