import { StyleSchema } from '../../../../lib/schema-registry.js';
import { GridComponentDefinition } from './Grid.type.schema.js';

// Auto-registering Grid Bento style schema
export const GridBentoStylesStyleDefinition = StyleSchema({
  key: 'GridBentoStyles',
  displayName: 'Grid Bento',
  contentType: GridComponentDefinition.key,
  isDefault: false,
  settings: {},
});
