import { ComponentSchema } from '../../../lib/schema-registry.js';

// Auto-registering Article List component schema
export const ArticleListComponentDefinition = ComponentSchema({
  key: 'ArticleList',
  displayName: 'Article List',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Title: {
      type: 'string',
      displayName: 'Title',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      editorSettings: {},
      indexingType: 'searchable',
    },
    NumberOfArticles: {
      type: 'integer',
      displayName: 'Number of Articles to Show',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 100,
      editorSettings: {},
      minimum: 1,
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeArticleListToJSON() {
  return JSON.parse(JSON.stringify(ArticleListComponentDefinition));
}
