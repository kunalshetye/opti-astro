import { StyleSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Row Carousel style schema
export const CarouselRowStyleDefinition = StyleSchema({
  key: 'CarouselRow',
  displayName: 'Row Carousel',
  nodeType: 'row',
  isDefault: false,
  settings: {},
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeCarouselRowStyleToJSON() {
  return JSON.parse(JSON.stringify(CarouselRowStyleDefinition));
}
