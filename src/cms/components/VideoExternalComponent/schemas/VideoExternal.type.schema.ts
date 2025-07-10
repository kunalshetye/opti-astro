import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering Video (External) component schema
export const VideoExternalComponentDefinition = ComponentSchema({
  key: 'VideoExternal',
  displayName: 'Video (External)',
  description: 'External video streaming - supports YouTube and Vimeo',
  baseType: 'component',
  sortOrder: 0,
  mayContainTypes: [],
  mediaFileExtensions: [],
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Provider: {
      type: 'string',
      displayName: 'Video Provider',
      description: 'Video streaming provider (YouTube, Vimeo)',
      localized: false,
      required: true,
      group: 'Information',
      sortOrder: 10,
      editorSettings: {},
      format: 'selectOne',
      enum: {
        values: [
          {
            displayName: 'YouTube',
            value: 'youtube',
          },
          {
            displayName: 'Vimeo',
            value: 'vimeo',
          }
        ],
      },
    },
    Video: {
      type: 'string',
      displayName: 'Video URL or ID',
      description: 'Video URL or ID',
      localized: false,
      required: true,
      group: 'Information',
      sortOrder: 20,
      editorSettings: {},
      format: 'shortString',
      indexingType: 'searchable',
    },
    Poster: {
      type: 'contentReference',
      displayName: 'Video Poster',
      description: 'Video Poster - shown before video plays',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 30,
      editorSettings: {},
      allowedTypes: ['Image'],
      restrictedTypes: [],
    },
    PlayLabel: {
      type: 'string',
      displayName: 'Play Button Text',
      description: 'Default: "Play"',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 40,
      editorSettings: {},
      format: 'shortString',
      indexingType: 'searchable',
    },
    DisplayWidth: {
      type: 'string',
      displayName: 'Display Width',
      description: '',
      localized: false,
      required: true,
      group: 'Information',
      sortOrder: 45,
      editorSettings: {},
      format: 'selectOne',
      enum: {
        values: [
          {
            displayName: '100% (Default)',
            value: '100%',
          },
          {
            displayName: '75%',
            value: '75%',
          },
          {
            displayName: '50%',
            value: '50%',
          },
          {
            displayName: '25%',
            value: '25%',
          }
        ],
      },
    },
    Params: {
      type: 'string',
      displayName: 'Video Player Parameters',
      description: 'See provider documentation for full feature list: https://developers.google.com/youtube/player_parameters#Parameters  https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Player-parameters-overview',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 50,
      editorSettings: {},
      format: 'shortString',
    },
  },
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serializeVideoExternalToJSON() {
  return JSON.parse(JSON.stringify(VideoExternalComponentDefinition));
}
