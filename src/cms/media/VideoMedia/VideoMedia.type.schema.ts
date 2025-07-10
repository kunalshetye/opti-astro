import { ComponentSchema } from '../../../lib/schema-registry.js';

// Auto-registering Video media component schema
export const VideoMediaComponentDefinition = ComponentSchema({
  key: 'VideoMedia',
  displayName: 'Video media',
  description: 'Used for video assets.',
  baseType: 'video',
  sortOrder: 520,
  mayContainTypes: [],
  mediaFileExtensions: ['avi', 'av1', 'flv', 'm4v', 'mkv', 'mov', 'mp4', 'mp4v', 'mpg', 'ogg', 'ogv', 'qt', 'vc1', 'vob', 'webm', 'wmv'],
  compositionBehaviors: [],
  properties: {
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeVideoMediaToJSON() {
  return JSON.parse(JSON.stringify(VideoMediaComponentDefinition));
}
