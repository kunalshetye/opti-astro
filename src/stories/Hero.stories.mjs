import HeroComponent from '../cms/components/HeroComponent/Hero.astro';
import { ds, IMAGES, mockImageRef, mockLink, mockPayload } from './_mocks.ts';

export default {
    component: HeroComponent,
};

const links = [
    mockLink('Get started', '/get-started'),
    mockLink('Learn more', '/learn'),
];

export const WithImage = {
    args: {
        key: 'hero',
        contentPayload: mockPayload,
        data: {
            __typename: 'Hero',
            Heading: 'Build faster with Optimizely',
            SubHeading: 'The all-in-one platform for digital experience delivery',
            Image: mockImageRef(IMAGES.landscape),
            Video: null,
            Body: null,
            Links: links,
        },
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
            ds('buttonRadius', 'standard'),
        ],
    },
};

export const LeftAligned = {
    args: {
        key: 'hero',
        contentPayload: mockPayload,
        data: {
            __typename: 'Hero',
            Heading: 'Drive digital growth',
            SubHeading: 'Personalize every experience across your entire digital estate',
            Image: mockImageRef(IMAGES.office),
            Video: null,
            Body: { __typename: 'SearchableRichText', html: '<p>Optimizely brings together content management, experimentation, and personalization in one unified platform.</p>' },
            Links: [mockLink('Request a demo', '/demo')],
        },
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
        key: 'hero',
        contentPayload: mockPayload,
        data: {
            __typename: 'Hero',
            Heading: 'Content meets commerce',
            SubHeading: null,
            Image: mockImageRef(IMAGES.city),
            Video: null,
            Body: null,
            Links: [mockLink('Explore platform', '/platform'), mockLink('Contact sales', '/contact')],
        },
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

export const BackgroundColor = {
    args: {
        key: 'hero',
        contentPayload: mockPayload,
        data: {
            __typename: 'Hero',
            Heading: 'Start your free trial today',
            SubHeading: 'No credit card required. Cancel anytime.',
            Image: null,
            Video: null,
            Body: null,
            Links: [mockLink('Sign up free', '/signup')],
        },
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

export const NatureTall = {
    args: {
        key: 'hero',
        contentPayload: mockPayload,
        data: {
            __typename: 'Hero',
            Heading: 'Explore the world',
            SubHeading: 'Discover breathtaking destinations with our travel guides',
            Image: mockImageRef(IMAGES.nature),
            Video: null,
            Body: null,
            Links: [mockLink('Start exploring', '/explore')],
        },
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
