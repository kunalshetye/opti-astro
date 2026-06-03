import CardComponent from '../cms/components/CardComponent/Card.astro';
import { ds, IMAGES, mockImageRef, mockLink, mockPayload } from './_mocks.ts';

export default {
    component: CardComponent,
};

const sharedData = {
    __typename: 'Card',
    Heading: 'Streamline your workflow',
    SubHeading: 'Built for modern teams',
    Body: { __typename: 'SearchableRichText', html: '<p>Connect your tools, automate processes, and deliver experiences that convert — all from one place.</p>' },
    Asset: mockImageRef(IMAGES.landscape),
    Links: [mockLink('Learn more', '/features')],
};

const defaultSettings = [
    ds('hoverEffect', 'zoom_subtle'),
    ds('textAlign', 'left'),
    ds('buttonStyle', 'standard'),
    ds('buttonType', 'primary'),
    ds('buttonSize', 'medium'),
    ds('buttonRadius', 'standard'),
];

const base = { key: 'card', contentPayload: mockPayload, displayTemplateKey: 'DefaultCard' };

// ── Layout modes (content-type DisplayAs field) ────────────────────────────

export const TextBelowCard = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textBelowCard' },
        displaySettings: defaultSettings,
    },
};

export const TextAboveCard = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textAboveCard' },
        displaySettings: defaultSettings,
    },
};

export const TextOnRight = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textOnRight', Asset: mockImageRef(IMAGES.office) },
        displaySettings: defaultSettings,
    },
};

export const TextOnLeft = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textOnLeft', Asset: mockImageRef(IMAGES.nature) },
        displaySettings: defaultSettings,
    },
};

export const HoverOverlay = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'hover', Asset: mockImageRef(IMAGES.city) },
        displaySettings: [
            ds('imageTintLevel', 'o_40'),
            ds('overlayTintLevel', 'o_75'),
            ds('textAlign', 'center'),
            ds('buttonStyle', 'outline'),
            ds('buttonType', 'primary'),
            ds('buttonRadius', 'full'),
        ],
    },
};

// ── Full-split variants (50/50 edge-to-edge) ──────────────────────────────

export const FullSplitTextOnRight = {
    args: {
        ...base,
        data: {
            ...sharedData,
            DisplayAs: 'textOnRight',
            Heading: 'Enterprise-grade personalization',
            Body: { __typename: 'SearchableRichText', html: '<p>Deliver the right experience to the right person at exactly the right moment with AI-powered recommendations.</p>' },
            Asset: mockImageRef(IMAGES.abstract),
        },
        displaySettings: [
            ds('containerWidth', 'fullSplit'),
            ds('assetWidth', 'w_1_2'),
            ds('contentWidth', 'w_1_2'),
            ds('assetVerticalAlign', 'center'),
            ds('contentVerticalAlign', 'center'),
            ds('hoverEffect', 'none'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

export const FullSplitTextOnLeft = {
    args: {
        ...base,
        data: {
            ...sharedData,
            DisplayAs: 'textOnLeft',
            Heading: 'Content meets commerce',
            Body: { __typename: 'SearchableRichText', html: '<p>Unify your content strategy and commerce operations in a single, cohesive platform built for scale.</p>' },
            Asset: mockImageRef(IMAGES.city),
        },
        displaySettings: [
            ds('containerWidth', 'fullSplit'),
            ds('assetWidth', 'w_1_2'),
            ds('contentWidth', 'w_1_2'),
            ds('assetVerticalAlign', 'center'),
            ds('contentVerticalAlign', 'center'),
            ds('backgroundColor', 'primary'),
            ds('hoverEffect', 'none'),
            ds('buttonStyle', 'soft'),
            ds('buttonType', 'primary'),
        ],
    },
};

// ── No-image variants ─────────────────────────────────────────────────────

export const NoImageTextBelow = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null },
        displaySettings: [
            ds('backgroundColor', 'base_200'),
            ds('textAlign', 'left'),
            ds('buttonStyle', 'soft'),
            ds('buttonType', 'secondary'),
        ],
    },
};
