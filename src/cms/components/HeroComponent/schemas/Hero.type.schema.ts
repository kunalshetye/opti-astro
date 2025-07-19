import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Hero component schema
export const HeroComponentDefinition = ComponentSchema({
  key: 'Hero',
  displayName: 'Hero',
  description: 'A flexible Hero Component',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [
    "sectionEnabled",
    "elementEnabled"
  ],
  properties: {
      "Video": {
        "type": "contentReference",
        "displayName": "Video",
        "description": "",
        "localized": true,
        "required": false,
        "group": "Information",
        "sortOrder": -200,
        "editorSettings": {},
        "allowedTypes": [
          "Video"
        ],
        "restrictedTypes": []
      },
      "Image": {
        "type": "contentReference",
        "displayName": "Image",
        "description": "",
        "localized": true,
        "required": false,
        "group": "Information",
        "sortOrder": -100,
        "editorSettings": {},
        "allowedTypes": [
          "Image"
        ],
        "restrictedTypes": []
      },
      "Heading": {
        "type": "string",
        "displayName": "Heading",
        "description": "",
        "localized": true,
        "required": false,
        "group": "Information",
        "sortOrder": -50,
        "editorSettings": {},
        "indexingType": "searchable"
      },
      "SubHeading": {
        "type": "string",
        "displayName": "Sub Heading",
        "description": "",
        "localized": true,
        "required": false,
        "group": "Information",
        "sortOrder": -25,
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
      },
      "Links": {
        "type": "array",
        "displayName": "Links",
        "description": "",
        "localized": true,
        "required": false,
        "group": "Information",
        "sortOrder": 0,
        "editorSettings": {},
        "items": {
          "type": "component",
          "contentType": "link"
        },
        "format": "LinkCollection"
      }
    },
});
