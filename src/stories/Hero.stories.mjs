import HeroComponent from '../cms/components/HeroComponent/Hero.astro';
import { ds, IMAGES, mockImageRef, mockLink, mockPayload } from './_mocks.ts';

export default {
    component: HeroComponent,
};

const links = [
    mockLink('Get started', '/get-started'),
    mockLink('Learn more', '/learn'),
];

const base = { key: 'hero', contentPayload: mockPayload };

// ── Heights ───────────────────────────────────────────────────────────────

export const HeightSmall = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Quick announcement banner', SubHeading: 'New features are now live', Image: mockImageRef(IMAGES.abstract), Video: null, Body: null, Links: [mockLink('See what\'s new', '/changelog')] },
        displaySettings: [
            ds('hero_height', 'h_18rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'white'),
            ds('background_tint_level', 'o_50'),
            ds('image_fit', 'object_cover'),
            ds('buttonStyle', 'outline'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'full'),
        ],
    },
};

export const HeightMedium = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Start your free trial today', SubHeading: 'No credit card required. Cancel anytime.', Image: null, Video: null, Body: null, Links: [mockLink('Sign up free', '/signup')] },
        displaySettings: [
            ds('hero_height', 'h_28rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'white'),
            ds('backgroundColor', 'primary'),
            ds('buttonStyle', 'soft'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'lg'),
        ],
    },
};

export const WithImage = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Build faster with Optimizely', SubHeading: 'The all-in-one platform for digital experience delivery', Image: mockImageRef(IMAGES.landscape), Video: null, Body: null, Links: links },
        displaySettings: [
            ds('hero_height', 'h_38rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'white'),
            ds('background_tint_level', 'o_40'),
            ds('image_fit', 'object_cover'),
            ds('hoverEffect', 'zoom_subtle'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'none'),
        ],
    },
};

export const LeftAligned = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Drive digital growth', SubHeading: 'Personalize every experience across your entire digital estate', Image: mockImageRef(IMAGES.office), Video: null, Body: { __typename: 'SearchableRichText', html: '<p>Optimizely brings together content management, experimentation, and personalization in one unified platform.</p>' }, Links: [mockLink('Request a demo', '/demo')] },
        displaySettings: [
            ds('hero_height', 'h_48rem'),
            ds('text_placement', 'left'),
            ds('text_color', 'white'),
            ds('background_tint_level', 'o_50'),
            ds('image_fit', 'object_cover'),
            ds('hoverEffect', 'none'),
            ds('buttonStyle', 'soft'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'lg'),
            ds('buttonRadius', 'full'),
        ],
    },
};

export const RightAligned = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Content meets commerce', SubHeading: null, Image: mockImageRef(IMAGES.city), Video: null, Body: null, Links: [mockLink('Explore platform', '/platform'), mockLink('Contact sales', '/contact')] },
        displaySettings: [
            ds('hero_height', 'h_28rem'),
            ds('text_placement', 'right'),
            ds('text_color', 'white'),
            ds('background_tint_level', 'o_30'),
            ds('image_fit', 'object_cover'),
            ds('buttonStyle', 'outline'),
            ds('buttonType', 'primary'),
            ds('buttonRadius', 'xl'),
        ],
    },
};

export const NatureTall = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Explore the world', SubHeading: 'Discover breathtaking destinations with our travel guides', Image: mockImageRef(IMAGES.nature), Video: null, Body: null, Links: [mockLink('Start exploring', '/explore')] },
        displaySettings: [
            ds('hero_height', 'h_48rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'white'),
            ds('background_tint_level', 'o_20'),
            ds('image_fit', 'object_cover'),
            ds('hoverEffect', 'zoom'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'success'),
            ds('buttonSize', 'lg'),
            ds('buttonRadius', 'full'),
            ds('buttonAction', 'bouncy'),
        ],
    },
};

// ── Text color ────────────────────────────────────────────────────────────

export const TextColorDefault = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'The platform for growth', SubHeading: 'Built for teams that move fast', Image: null, Video: null, Body: null, Links: [mockLink('Get started', '/start')] },
        displaySettings: [
            ds('hero_height', 'h_28rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'default'),
            ds('backgroundColor', 'base_200'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

export const TextColorBlack = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Bold statement on light background', SubHeading: 'High contrast for readability', Image: mockImageRef(IMAGES.landscape), Video: null, Body: null, Links: [mockLink('Discover more', '/discover')] },
        displaySettings: [
            ds('hero_height', 'h_38rem'),
            ds('text_placement', 'left'),
            ds('text_color', 'black'),
            ds('background_tint_level', 'o_10'),
            ds('image_fit', 'object_cover'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'neutral'),
        ],
    },
};

export const TextColorPrimary = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Branded heading color', SubHeading: 'Using the primary brand color for text', Image: null, Video: null, Body: null, Links: [mockLink('Learn more', '/learn')] },
        displaySettings: [
            ds('hero_height', 'h_28rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'primary'),
            ds('backgroundColor', 'base_100'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

export const TextColorNeutral = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Neutral tone heading', SubHeading: 'Subtle and professional', Image: null, Video: null, Body: null, Links: [mockLink('Contact us', '/contact')] },
        displaySettings: [
            ds('hero_height', 'h_28rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'neutral'),
            ds('backgroundColor', 'base_200'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'neutral'),
        ],
    },
};

// ── Image fit ─────────────────────────────────────────────────────────────

export const ImageFitCover = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Cover (fills container)', SubHeading: 'Image may crop to fill the area', Image: mockImageRef(IMAGES.portrait), Video: null, Body: null, Links: [mockLink('See pricing', '/pricing')] },
        displaySettings: [
            ds('hero_height', 'h_38rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'white'),
            ds('background_tint_level', 'o_50'),
            ds('image_fit', 'object_cover'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

export const ImageFitContain = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Contain (full image visible)', SubHeading: 'Image shown in full — may have gaps', Image: mockImageRef(IMAGES.portrait), Video: null, Body: null, Links: [mockLink('See pricing', '/pricing')] },
        displaySettings: [
            ds('hero_height', 'h_38rem'),
            ds('text_placement', 'right'),
            ds('text_color', 'default'),
            ds('background_tint_level', 'o_0'),
            ds('image_fit', 'object_contain'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

export const ImageFitFill = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Fill (stretched to fit)', SubHeading: 'Image stretches to fill — may distort', Image: mockImageRef(IMAGES.portrait), Video: null, Body: null, Links: [mockLink('See pricing', '/pricing')] },
        displaySettings: [
            ds('hero_height', 'h_38rem'),
            ds('text_placement', 'left'),
            ds('text_color', 'white'),
            ds('background_tint_level', 'o_40'),
            ds('image_fit', 'object_fill'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

// ── Background colors (no image) ─────────────────────────────────────────

export const BgPrimary = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Start your free trial today', SubHeading: 'No credit card required. Cancel anytime.', Image: null, Video: null, Body: null, Links: [mockLink('Sign up free', '/signup')] },
        displaySettings: [
            ds('hero_height', 'h_28rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'white'),
            ds('backgroundColor', 'primary'),
            ds('buttonStyle', 'soft'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'lg'),
        ],
    },
};

export const BgSecondary = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Secondary brand hero', SubHeading: 'Great for secondary CTAs or campaign pages', Image: null, Video: null, Body: null, Links: [mockLink('View features', '/features')] },
        displaySettings: [
            ds('hero_height', 'h_28rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'white'),
            ds('backgroundColor', 'secondary'),
            ds('buttonStyle', 'soft'),
            ds('buttonType', 'secondary'),
            ds('buttonSize', 'lg'),
        ],
    },
};

export const BgNeutral = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Neutral background hero', SubHeading: 'Understated and professional', Image: null, Video: null, Body: null, Links: [mockLink('Contact us', '/contact')] },
        displaySettings: [
            ds('hero_height', 'h_28rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'white'),
            ds('backgroundColor', 'neutral'),
            ds('buttonStyle', 'soft'),
            ds('buttonType', 'neutral'),
        ],
    },
};

export const BgAccent = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Accent background hero', SubHeading: 'Eye-catching accent color for promotions', Image: null, Video: null, Body: null, Links: [mockLink('Shop now', '/shop')] },
        displaySettings: [
            ds('hero_height', 'h_28rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'white'),
            ds('backgroundColor', 'accent'),
            ds('buttonStyle', 'soft'),
            ds('buttonType', 'accent'),
        ],
    },
};

export const BgBase200 = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Light background hero', SubHeading: 'Subtle base-200 for content-first layouts', Image: null, Video: null, Body: null, Links: [mockLink('Read the docs', '/docs')] },
        displaySettings: [
            ds('hero_height', 'h_28rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'default'),
            ds('backgroundColor', 'base_200'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

// ── Hover effects ─────────────────────────────────────────────────────────

export const HoverZoomSubtle = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Subtle zoom on hover', SubHeading: null, Image: mockImageRef(IMAGES.landscape), Video: null, Body: null, Links: [mockLink('Explore', '/explore')] },
        displaySettings: [
            ds('hero_height', 'h_38rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'white'),
            ds('background_tint_level', 'o_40'),
            ds('image_fit', 'object_cover'),
            ds('hoverEffect', 'zoom_subtle'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

export const HoverZoom = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'Strong zoom on hover', SubHeading: null, Image: mockImageRef(IMAGES.nature), Video: null, Body: null, Links: [mockLink('Explore', '/explore')] },
        displaySettings: [
            ds('hero_height', 'h_38rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'white'),
            ds('background_tint_level', 'o_30'),
            ds('image_fit', 'object_cover'),
            ds('hoverEffect', 'zoom'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

export const HoverNone = {
    args: {
        ...base,
        data: { __typename: 'Hero', Heading: 'No hover effect', SubHeading: null, Image: mockImageRef(IMAGES.city), Video: null, Body: null, Links: [mockLink('Explore', '/explore')] },
        displaySettings: [
            ds('hero_height', 'h_38rem'),
            ds('text_placement', 'center'),
            ds('text_color', 'white'),
            ds('background_tint_level', 'o_40'),
            ds('image_fit', 'object_cover'),
            ds('hoverEffect', 'none'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};
