import { StyleSchema } from '../../../lib/schema-registry.js';
import { ParagraphComponentDefinition } from './Paragraph.type.schema.js';

// Auto-registering Paragraph style schema
export const DefaultParagraphStyleDefinition = StyleSchema({
  key: 'DefaultParagraph',
  displayName: 'Paragraph',
  contentType: ParagraphComponentDefinition.key,
  isDefault: true,
  settings: {
      paragraph_alignment: {
        displayName: 'Paragraph Alignment',
        editor: '',
        sortOrder: 10,
        choices: {
          full_width: {
            displayName: 'Full Width',
            sortOrder: 10,
          },
          centered_large: {
            displayName: 'Centered (Large)',
            sortOrder: 20,
          },
          centered_medium: {
            displayName: 'Centered (Medium)',
            sortOrder: 30,
          },
          centered_small: {
            displayName: 'Centered (Small)',
            sortOrder: 40,
          },
        },
      },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeDefaultParagraphStyleToJSON() {
  return JSON.parse(JSON.stringify(DefaultParagraphStyleDefinition));
}
