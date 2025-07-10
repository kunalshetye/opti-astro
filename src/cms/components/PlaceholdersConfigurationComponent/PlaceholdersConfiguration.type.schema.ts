import { ComponentSchema } from '../../../lib/schema-registry.js';

// Auto-registering Placeholders Configuration component schema
export const PlaceholdersConfigurationComponentDefinition = ComponentSchema({
  key: 'PlaceholdersConfiguration',
  displayName: 'Placeholders Configuration',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [],
  properties: {
    Domain: {
      type: 'string',
      displayName: 'Domain',
      description: 'Domain (format: www.mysite.com) to use/apply these Placeholders',
      localized: true,
      required: true,
      group: 'Information',
      sortOrder: 10,
      editorSettings: {},
      indexingType: 'queryable',
      pattern: '^((([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})|localhost)(:[0-9]+)?$',
    },
    Placeholders: {
      type: 'array',
      displayName: 'Placeholders',
      description: '',
      localized: true,
      required: true,
      group: 'Information',
      sortOrder: 20,
      editorSettings: {},
      items: {
        type: 'content',
        allowedTypes: ['PlaceholderItem'],
        restrictedTypes: [],
      },
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializePlaceholdersConfigurationToJSON() {
  return JSON.parse(JSON.stringify(PlaceholdersConfigurationComponentDefinition));
}
