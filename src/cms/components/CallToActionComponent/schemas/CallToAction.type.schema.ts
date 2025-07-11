import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Call To Action component schema
export const CallToActionComponentDefinition = ComponentSchema({
  key: 'CallToAction',
  displayName: 'Call To Action',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [
    "sectionEnabled",
    "elementEnabled"
  ],
  properties: {
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

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeCallToActionToJSON() {
  return JSON.parse(JSON.stringify(CallToActionComponentDefinition));
}
