import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Video component schema
export const VideoComponentDefinition = ComponentSchema({
  key: 'Video',
  displayName: 'Video',
  description: 'Video',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Video: {
      type: 'contentReference',
      displayName: 'Video',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 0,
      editorSettings: {},
      allowedTypes: ['Video'],
      restrictedTypes: [],
    },
    VideoPosterImage: {
      type: 'contentReference',
      displayName: 'Video Poster Image',
      description: 'Image shown before video is played (limited use if autoplay enabled)',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 20,
      editorSettings: {},
      allowedTypes: ['Image'],
      restrictedTypes: [],
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeVideoToJSON() {
  return JSON.parse(JSON.stringify(VideoComponentDefinition));
}
