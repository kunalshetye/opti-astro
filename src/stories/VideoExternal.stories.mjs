import VideoExternalComponent from '../cms/components/VideoExternalComponent/VideoExternal.astro';
import { IMAGES, mockImageRef, mockPayload } from './_mocks.ts';

export default {
    component: VideoExternalComponent,
};

const base = { key: 'video-ext', contentPayload: mockPayload, displaySettings: [] };

// ── YouTube ───────────────────────────────────────────────────────────────

export const YouTubeFullWidth = {
    args: {
        ...base,
        data: {
            __typename: 'VideoExternal',
            Provider: 'youtube',
            VideoExternal: 'dQw4w9WgXcQ',
            DisplayWidth: '100%',
            PlayLabel: 'Play video',
            Params: '',
            Poster: mockImageRef(IMAGES.landscape),
        },
    },
};

export const YouTubeThreeQuarterWidth = {
    args: {
        ...base,
        data: {
            __typename: 'VideoExternal',
            Provider: 'youtube',
            VideoExternal: 'dQw4w9WgXcQ',
            DisplayWidth: '75%',
            PlayLabel: 'Play video',
            Params: '',
            Poster: null,
        },
    },
};

export const YouTubeHalfWidth = {
    args: {
        ...base,
        data: {
            __typename: 'VideoExternal',
            Provider: 'youtube',
            VideoExternal: 'dQw4w9WgXcQ',
            DisplayWidth: '50%',
            PlayLabel: 'Watch now',
            Params: 'rel=0&modestbranding=1',
            Poster: null,
        },
    },
};

export const YouTubeQuarterWidth = {
    args: {
        ...base,
        data: {
            __typename: 'VideoExternal',
            Provider: 'youtube',
            VideoExternal: 'dQw4w9WgXcQ',
            DisplayWidth: '25%',
            PlayLabel: 'Play',
            Params: '',
            Poster: null,
        },
    },
};

// ── Vimeo ─────────────────────────────────────────────────────────────────

export const VimeoFullWidth = {
    args: {
        ...base,
        data: {
            __typename: 'VideoExternal',
            Provider: 'vimeo',
            VideoExternal: '676247342',
            DisplayWidth: '100%',
            PlayLabel: 'Play video',
            Params: '',
            Poster: mockImageRef(IMAGES.abstract),
        },
    },
};

export const VimeoHalfWidth = {
    args: {
        ...base,
        data: {
            __typename: 'VideoExternal',
            Provider: 'vimeo',
            VideoExternal: '676247342',
            DisplayWidth: '50%',
            PlayLabel: 'Watch now',
            Params: '',
            Poster: null,
        },
    },
};
