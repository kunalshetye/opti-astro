import { contentType } from '@episerver/cms-sdk';

export const GenericMedia = contentType({
  key: 'GenericMedia',
  displayName: 'Generic media',
  description: 'Used for generic media without any dedicated content type.',
  baseType: '_media',
  sortOrder: 500,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [],
  properties: {}
});