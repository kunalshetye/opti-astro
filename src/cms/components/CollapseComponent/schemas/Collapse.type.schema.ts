import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Collapse component schema
export const CollapseComponentDefinition = ComponentSchema({
  key: 'Collapse',
  displayName: 'Collapse',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [
    "elementEnabled"
  ],
  properties: {
      "Heading": {
        "type": "string",
        "displayName": "Heading",
        "description": "",
        "localized": true,
        "required": false,
        "group": "Information",
        "sortOrder": 0,
        "editorSettings": {},
        "indexingType": "searchable"
      },
      "Body": {
        "type": "string",
        "displayName": "Body",
        "description": "",
        "localized": true,
        "required": false,
        "group": "Information",
        "sortOrder": 0,
        "editorSettings": {},
        "format": "html",
        "indexingType": "searchable"
      }
    },
});
