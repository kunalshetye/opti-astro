import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Landing Page component schema
export const LandingPageComponentDefinition = ComponentSchema({
  key: 'LandingPage',
  displayName: 'Landing Page',
  description: '',
  baseType: 'page',
  sortOrder: 0,
  mayContainTypes: [
    "*"
  ],
  mediaFileExtensions: [],
  compositionBehaviors: [],
  properties: {
      "TopContentArea": {
        "type": "array",
        "displayName": "Top Content Area",
        "description": "",
        "localized": true,
        "required": false,
        "group": "Information",
        "sortOrder": -100,
        "editorSettings": {},
        "items": {
          "type": "content",
          "allowedTypes": [],
          "restrictedTypes": []
        }
      },
      "MainContentArea": {
        "type": "array",
        "displayName": "Main Content Area",
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
      },
      "SeoSettings": {
        "type": "component",
        "displayName": "SEO Settings",
        "description": "",
        "localized": false,
        "required": false,
        "group": "SeoSettings",
        "sortOrder": 0,
        "editorSettings": {},
        "contentType": "PageSeoSettings"
      },
      "PageAdminSettings": {
        "type": "component",
        "displayName": "Page Admin Settings",
        "description": "",
        "localized": false,
        "required": false,
        "group": "AdminSettings",
        "sortOrder": 10,
        "editorSettings": {},
        "contentType": "PageAdminSettings"
      }
    },
});
