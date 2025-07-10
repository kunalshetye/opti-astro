import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Menu Item component schema
export const MenuItemComponentDefinition = ComponentSchema({
  key: 'MenuItem',
  displayName: 'Menu Item',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: [],
  properties: {
    SubMenuItems: {
      type: 'array',
      displayName: 'Sub Menu Items',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      editorSettings: {},
      items: {
        type: 'content',
        allowedTypes: ['MenuItem'],
        restrictedTypes: [],
      },
    },
    Link: {
      type: 'component',
      displayName: 'Link',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 0,
      editorSettings: {},
      contentType: 'link',
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeMenuItemToJSON() {
  return JSON.parse(JSON.stringify(MenuItemComponentDefinition));
}
