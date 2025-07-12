import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Generic media component schema
export const GenericMediaComponentDefinition = ComponentSchema({
  key: 'GenericMedia',
  displayName: 'Generic media',
  description: 'Used for generic media without any dedicated content type.',
  baseType: 'media',
  sortOrder: 500,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [],
  properties: {},
});
