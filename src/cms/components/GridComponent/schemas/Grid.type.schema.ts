import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Grid component schema
export const GridComponentDefinition = ComponentSchema({
  key: 'Grid',
  displayName: 'Grid',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [
    "sectionEnabled"
  ],
  properties: {
      "RichText": {
        "type": "string",
        "displayName": "Rich Text",
        "description": "",
        "localized": true,
        "required": false,
        "group": "Information",
        "sortOrder": -75,
        "editorSettings": {},
        "format": "html",
        "indexingType": "searchable"
      },
      "Items": {
        "type": "array",
        "displayName": "Items",
        "description": "",
        "localized": true,
        "required": false,
        "group": "Information",
        "sortOrder": 0,
        "editorSettings": {},
        "items": {
          "type": "content",
          "allowedTypes": [],
          "restrictedTypes": []
        }
      }
    },
});
