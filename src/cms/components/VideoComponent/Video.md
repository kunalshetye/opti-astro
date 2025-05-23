# Video Component

## Description

The Video component renders video content with extensive customization options including aspect ratios, rounded corners, and playback controls. It supports both auto-playing background videos and interactive videos with user controls.

## Usage

The Video component is perfect for product demonstrations, background videos, embedded content, tutorials, or any video content that requires specific styling and playback behavior.

### Content Fields

- **Video**: Video asset with URL for playback

## Styles

### Visual Builder Style Options

#### Video Default
- **Aspect Ratio**: Original, 16:9, 4:3, 1:1, 3:4, 9:16
- **Show Player Controls**: Yes, No
- **Start Playback Automatically**: Yes, No
- **Loop Video**: Yes, No
- **Mute Audio**: Yes, No
- **Rounded Corners**: None, Small, Medium, Large, Huge, Full

## Screenshot

*[Placeholder for Video component screenshot showing different aspect ratios and control options]*

## Files

- `Video.astro` - Main component implementation
- `video.graphql` - GraphQL fragment for component data
- `DefaultVideo.opti-style.json` - CMS style configuration

## Implementation Notes

- Uses HTML5 video element with modern attributes
- Includes `playsinline` for iOS compatibility
- Smart defaults for background vs interactive videos
- Style system provides extensive visual customization
- Responsive design with configurable aspect ratios
- Optimized for both mobile and desktop playback
- Supports Optimizely's video optimization and CDN
- Graceful handling of different video formats
- Accessibility-friendly with proper video semantics