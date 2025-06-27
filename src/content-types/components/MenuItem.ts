import { contentType } from '@episerver/cms-sdk';

export const MenuItem = contentType({
  key: 'MenuItem',
  displayName: 'Menu Item',
  description: '',
  baseType: '_component',
  sortOrder: 0,
  properties: {
    SubMenuItems: {
      type: 'array',
      displayName: 'Sub Menu Items',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      items: {
        type: 'content'
      }
    },
    Link: {
      type: 'link',
      displayName: 'Link',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 0
    }
  }
});