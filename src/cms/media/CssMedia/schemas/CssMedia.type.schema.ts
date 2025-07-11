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

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeCssMediaToJSON() {
  return JSON.parse(JSON.stringify(CssMediaComponentDefinition));
}
