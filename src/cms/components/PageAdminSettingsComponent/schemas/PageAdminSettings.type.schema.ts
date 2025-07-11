import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Page Admin Settings component schema
export const PageAdminSettingsComponentDefinition = ComponentSchema({
  key: 'PageAdminSettings',
  displayName: 'Page Admin Settings',
  description: 'Admin properties for pages/experiences',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [],
  properties: {
      "EnableExternalPreview": {
        "type": "boolean",
        "displayName": "Enable External Preview Link",
        "description": "Select to enable external (non-CMS) preview link for draft content",
        "localized": false,
        "required": false,
        "group": "Information",
        "sortOrder": 10,
        "editorSettings": {}
      }
    },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializePageAdminSettingsToJSON() {
  return JSON.parse(JSON.stringify(PageAdminSettingsComponentDefinition));
}
