import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Carousel component schema
export const CarouselComponentDefinition = ComponentSchema({
  key: 'Carousel',
  displayName: 'Carousel',
  description: '',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'Carousel section heading',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -100,
      editorSettings: {},
      indexingType: 'searchable',
    },
    Link: {
      type: 'component',
      displayName: 'Link',
      description: 'Optional link for the heading',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: -50,
      editorSettings: {},
      contentType: 'link',
    },
    Assets: {
      type: 'array',
      displayName: 'Assets',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      editorSettings: {},
      format: 'LinkCollection',
      items: {
        type: 'component',
        contentType: 'link',
      },
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeCarouselToJSON() {
  return JSON.parse(JSON.stringify(CarouselComponentDefinition));
}
