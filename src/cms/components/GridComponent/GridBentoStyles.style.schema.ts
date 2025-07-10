import { StyleSchema } from '../../../lib/schema-registry.js';
import { GridComponentDefinition } from './Grid.type.schema.js';

// Auto-registering Grid Bento style schema
export const GridBentoStylesStyleDefinition = StyleSchema({
  key: 'GridBentoStyles',
  displayName: 'Grid Bento',
  contentType: GridComponentDefinition.key,
  isDefault: false,
  settings: {
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeGridBentoStylesStyleToJSON() {
  return JSON.parse(JSON.stringify(GridBentoStylesStyleDefinition));
}
