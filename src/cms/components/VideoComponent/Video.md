# Video Component

## Description

The Video component renders video content with extensive customization options including aspect ratios, rounded corners, and playback controls. It supports both auto-playing background videos and interactive videos with user controls.

## Usage

The Video component is perfect for product demonstrations, background videos, embedded content, tutorials, or any video content that requires specific styling and playback behavior.

### Component Structure

```typescript
interface VideoProps {
  data: VideoFragment;
  displaySettings: DisplaySettingsFragment[];
  contentPayload: ContentPayload;
}
```

### Content Fields

- **Video**: Video asset with URL for playback

### GraphQL Fragment

```graphql
fragment Video on Video {
    Video {
        url {
            default
        }
    }
}
```

## Styles

### Aspect Ratio Options
- **16:9**: `aspect-[16/9]` (landscape, standard video)
- **9:16**: `aspect-[9/16]` (portrait, mobile video)
- **4:3**: `aspect-[4/3]` (classic TV format)
- **3:4**: `aspect-[3/4]` (portrait photo format)
- **1:1**: `aspect-square` (square format)
- **Auto**: No aspect ratio constraint

### Rounded Corner Options
- **Small**: `rounded`
- **Medium**: `rounded-md`
- **Large**: `rounded-lg`
- **Huge**: `rounded-[40px]`
- **Full**: `rounded-full`
- **None**: No rounded corners

### Base Classes
- **Container**: `w-full object-cover`
- Additional classes applied based on display settings

### Playback Configuration

Video behavior is controlled by display settings:
- **showControls**: Enables/disables video controls
- **muted**: Audio muting (auto-enabled for autoplay)
- **loop**: Video looping behavior
- **autoPlay**: Automatic playback on load

#### Default Behavior (no controls)
- `autoPlay: true`
- `muted: true`
- `loop: true`
- Perfect for background videos

#### With Controls
- User-controlled playback
- Audio enabled by default
- Standard video player experience

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