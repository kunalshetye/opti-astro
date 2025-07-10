import { StyleSchema } from '../../../../lib/schema-registry.js';
import { CardComponentDefinition } from './Card.type.schema.js';

// Auto-registering Card Default style schema
export const CardDefaultStylesStyleDefinition = StyleSchema({
  key: 'CardDefaultStyles',
  displayName: 'Card Default',
  contentType: CardComponentDefinition.key,
  isDefault: false,
  settings: {
      backgroundColor: {
        displayName: 'Background Color for the Card',
        editor: '',
        sortOrder: 10,
        choices: {
          bg6CD7E4: {
            displayName: '#6CD7E4',
            sortOrder: 10,
          },
        },
      },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeCardDefaultStylesStyleToJSON() {
  return JSON.parse(JSON.stringify(CardDefaultStylesStyleDefinition));
}
