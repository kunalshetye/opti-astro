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
    ds('buttonRadius', 'none'),
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

// ── Hover effects ─────────────────────────────────────────────────────────

export const HoverZoomSubtle = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textBelowCard' },
        displaySettings: [...defaultSettings, ds('hoverEffect', 'zoom_subtle')],
    },
};

export const HoverZoom = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: mockImageRef(IMAGES.abstract) },
        displaySettings: [
            ds('hoverEffect', 'zoom'),
            ds('textAlign', 'left'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'none'),
        ],
    },
};

export const HoverNone = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textBelowCard' },
        displaySettings: [
            ds('hoverEffect', 'none'),
            ds('textAlign', 'left'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
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

// ── Split ratio variants ───────────────────────────────────────────────────

export const SplitOneThirdTwoThirds = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textOnLeft', Asset: mockImageRef(IMAGES.portrait) },
        displaySettings: [
            ds('containerWidth', 'fullSplit'),
            ds('assetWidth', 'w_1_3'),
            ds('contentWidth', 'w_2_3'),
            ds('assetVerticalAlign', 'center'),
            ds('contentVerticalAlign', 'center'),
            ds('hoverEffect', 'none'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

export const SplitTwoFifthsThreeFifths = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textOnRight', Asset: mockImageRef(IMAGES.office) },
        displaySettings: [
            ds('containerWidth', 'fullSplit'),
            ds('assetWidth', 'w_2_5'),
            ds('contentWidth', 'w_3_5'),
            ds('assetVerticalAlign', 'center'),
            ds('contentVerticalAlign', 'center'),
            ds('hoverEffect', 'none'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'secondary'),
        ],
    },
};

export const SplitTwoThirdsOneThird = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textOnLeft', Asset: mockImageRef(IMAGES.landscape) },
        displaySettings: [
            ds('containerWidth', 'fullSplit'),
            ds('assetWidth', 'w_2_3'),
            ds('contentWidth', 'w_1_3'),
            ds('assetVerticalAlign', 'center'),
            ds('contentVerticalAlign', 'center'),
            ds('hoverEffect', 'none'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

// ── Vertical alignment ─────────────────────────────────────────────────────

export const AssetAlignTop = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textOnRight', Asset: mockImageRef(IMAGES.portrait) },
        displaySettings: [
            ds('containerWidth', 'fullSplit'),
            ds('assetWidth', 'w_1_2'),
            ds('contentWidth', 'w_1_2'),
            ds('assetVerticalAlign', 'start'),
            ds('contentVerticalAlign', 'start'),
            ds('hoverEffect', 'none'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

export const AssetAlignBottom = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textOnRight', Asset: mockImageRef(IMAGES.portrait) },
        displaySettings: [
            ds('containerWidth', 'fullSplit'),
            ds('assetWidth', 'w_1_2'),
            ds('contentWidth', 'w_1_2'),
            ds('assetVerticalAlign', 'end'),
            ds('contentVerticalAlign', 'end'),
            ds('hoverEffect', 'none'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

// ── Text alignment ─────────────────────────────────────────────────────────

export const TextAlignLeft   = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('textAlign', 'left'),    ds('backgroundColor', 'base_200'), ds('buttonStyle', 'standard'), ds('buttonType', 'primary')] } };
export const TextAlignCenter = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('textAlign', 'center'),  ds('backgroundColor', 'base_200'), ds('buttonStyle', 'standard'), ds('buttonType', 'primary')] } };
export const TextAlignRight  = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('textAlign', 'right'),   ds('backgroundColor', 'base_200'), ds('buttonStyle', 'standard'), ds('buttonType', 'primary')] } };
export const TextAlignJustify = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('textAlign', 'justify'), ds('backgroundColor', 'base_200'), ds('buttonStyle', 'standard'), ds('buttonType', 'primary')] } };

// ── Text transforms ────────────────────────────────────────────────────────

export const TransformButtonUppercase = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null },
        displaySettings: [
            ds('transform', 'uppercase'),
            ds('textAlign', 'left'),
            ds('backgroundColor', 'base_200'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

export const TransformButtonCapitalize = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null },
        displaySettings: [
            ds('transform', 'capitalize'),
            ds('textAlign', 'left'),
            ds('backgroundColor', 'base_200'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

export const TransformHeaderUppercase = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: mockImageRef(IMAGES.landscape) },
        displaySettings: [
            ds('transformHeader', 'uppercase'),
            ds('textAlign', 'left'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

export const TransformHeaderCapitalize = {
    args: {
        ...base,
        data: { ...sharedData, Heading: 'streamline your workflow', DisplayAs: 'textBelowCard', Asset: mockImageRef(IMAGES.landscape) },
        displaySettings: [
            ds('transformHeader', 'capitalize'),
            ds('textAlign', 'left'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
        ],
    },
};

// ── Button action ──────────────────────────────────────────────────────────

export const BouncyButtons = {
    args: {
        ...base,
        data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: mockImageRef(IMAGES.city) },
        displaySettings: [
            ds('hoverEffect', 'zoom_subtle'),
            ds('textAlign', 'center'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'lg'),
            ds('buttonRadius', 'full'),
            ds('buttonAction', 'bouncy'),
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

export const BgBase100     = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('backgroundColor', 'base_100'),  ds('textAlign', 'left'), ds('buttonStyle', 'standard'), ds('buttonType', 'primary')] } };
export const BgBase200     = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('backgroundColor', 'base_200'),  ds('textAlign', 'left'), ds('buttonStyle', 'standard'), ds('buttonType', 'primary')] } };
export const BgBase300     = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('backgroundColor', 'base_300'),  ds('textAlign', 'left'), ds('buttonStyle', 'standard'), ds('buttonType', 'primary')] } };
export const BgPrimary     = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('backgroundColor', 'primary'),   ds('textAlign', 'left'), ds('buttonStyle', 'soft'),     ds('buttonType', 'primary')] } };
export const BgSecondary   = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('backgroundColor', 'secondary'), ds('textAlign', 'left'), ds('buttonStyle', 'soft'),     ds('buttonType', 'secondary')] } };
export const BgAccent      = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('backgroundColor', 'accent'),    ds('textAlign', 'left'), ds('buttonStyle', 'soft'),     ds('buttonType', 'accent')] } };
export const BgNeutral     = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('backgroundColor', 'neutral'),   ds('textAlign', 'left'), ds('buttonStyle', 'soft'),     ds('buttonType', 'neutral')] } };
export const BgInfo        = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('backgroundColor', 'info'),      ds('textAlign', 'left'), ds('buttonStyle', 'soft'),     ds('buttonType', 'info')] } };
export const BgSuccess     = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('backgroundColor', 'success'),   ds('textAlign', 'left'), ds('buttonStyle', 'soft'),     ds('buttonType', 'success')] } };
export const BgWarning     = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('backgroundColor', 'warning'),   ds('textAlign', 'left'), ds('buttonStyle', 'soft'),     ds('buttonType', 'warning')] } };
export const BgError       = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('backgroundColor', 'error'),     ds('textAlign', 'left'), ds('buttonStyle', 'soft'),     ds('buttonType', 'error')] } };
export const BgTransparent = { args: { ...base, data: { ...sharedData, DisplayAs: 'textBelowCard', Asset: null }, displaySettings: [ds('backgroundColor', 'transparent'), ds('textAlign', 'left'), ds('buttonStyle', 'standard'), ds('buttonType', 'primary')] } };
