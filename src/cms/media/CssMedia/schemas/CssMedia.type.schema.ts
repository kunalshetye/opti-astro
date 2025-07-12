import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering CSS File component schema
export const CssMediaComponentDefinition = ComponentSchema({
  key: 'CssMedia',
  displayName: 'CSS File',
  description: 'Used for CSS files',
  baseType: 'media',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [
    "css"
  ],
  compositionBehaviors: [],
  properties: {},
});
