import ButtonComponent from '../cms/components/ButtonComponent/Button.astro';
import { ds, mockLink, mockPayload } from './_mocks.ts';

export default {
    component: ButtonComponent,
};

const base = {
    key: 'btn',
    contentPayload: mockPayload,
    data: {
        __typename: 'Button',
        ButtonLabel: 'Get started',
        ButtonLink: mockLink('Get started', '/get-started'),
    },
};

// ─── Styles ───────────────────────────────────────────────────────────────────

export const Default = {
    args: {
        ...base,
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'standard'),
            ds('buttonWidth', 'auto'),
        ],
    },
};

export const Soft = {
    args: {
        ...base,
        data: { ...base.data, ButtonLabel: 'Learn more' },
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('buttonStyle', 'soft'),
            ds('buttonType', 'secondary'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'standard'),
        ],
    },
};

export const Outline = {
    args: {
        ...base,
        data: { ...base.data, ButtonLabel: 'View details' },
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('buttonStyle', 'outline'),
            ds('buttonType', 'accent'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'full'),
        ],
    },
};

export const Dash = {
    args: {
        ...base,
        data: { ...base.data, ButtonLabel: 'Compare plans' },
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('buttonStyle', 'dash'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'standard'),
        ],
    },
};

export const NeutralStyle = {
    args: {
        ...base,
        data: { ...base.data, ButtonLabel: 'Go back' },
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('buttonStyle', 'neutral'),
            ds('buttonType', 'neutral'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'standard'),
        ],
    },
};

export const Link = {
    args: {
        ...base,
        data: { ...base.data, ButtonLabel: 'Read the docs' },
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('buttonStyle', 'link'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
            ds('buttonWidth', 'auto'),
        ],
    },
};

export const Ghost = {
    args: {
        ...base,
        data: { ...base.data, ButtonLabel: 'Skip for now' },
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('buttonStyle', 'ghost'),
            ds('buttonType', 'neutral'),
            ds('buttonSize', 'sm'),
        ],
    },
};

export const Wide = {
    args: {
        ...base,
        data: { ...base.data, ButtonLabel: 'Join the waitlist' },
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('buttonStyle', 'wide'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'standard'),
        ],
    },
};

export const Disabled = {
    args: {
        ...base,
        data: { ...base.data, ButtonLabel: 'Unavailable' },
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('buttonStyle', 'disabled'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'standard'),
        ],
    },
};

// ─── Types (Colors) ───────────────────────────────────────────────────────────

export const TypePrimary   = { args: { ...base, data: { ...base.data, ButtonLabel: 'Primary' },   displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonType', 'primary'),   ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const TypeSecondary = { args: { ...base, data: { ...base.data, ButtonLabel: 'Secondary' }, displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonType', 'secondary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const TypeNeutral   = { args: { ...base, data: { ...base.data, ButtonLabel: 'Neutral' },   displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonType', 'neutral'),   ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const TypeAccent    = { args: { ...base, data: { ...base.data, ButtonLabel: 'Accent' },    displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonType', 'accent'),    ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const TypeInfo      = { args: { ...base, data: { ...base.data, ButtonLabel: 'Info' },      displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonType', 'info'),      ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const TypeSuccess   = { args: { ...base, data: { ...base.data, ButtonLabel: 'Success' },   displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonType', 'success'),   ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const TypeWarning   = { args: { ...base, data: { ...base.data, ButtonLabel: 'Warning' },   displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonType', 'warning'),   ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const TypeError     = { args: { ...base, data: { ...base.data, ButtonLabel: 'Error' },     displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonType', 'error'),     ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const SizeXS         = { args: { ...base, data: { ...base.data, ButtonLabel: 'Extra Small' }, displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonSize', 'xs'),         ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const SizeSM         = { args: { ...base, data: { ...base.data, ButtonLabel: 'Small' },       displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonSize', 'sm'),         ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const SizeMD         = { args: { ...base, data: { ...base.data, ButtonLabel: 'Medium' },      displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonSize', 'medium'),     ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const SizeLG         = { args: { ...base, data: { ...base.data, ButtonLabel: 'Large' },       displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonSize', 'lg'),         ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const SizeXL         = { args: { ...base, data: { ...base.data, ButtonLabel: 'Extra Large' }, displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonSize', 'xl'),         ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const SizeResponsive = { args: { ...base, data: { ...base.data, ButtonLabel: 'Responsive' },  displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonSize', 'responsive'), ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };

// ─── Widths ───────────────────────────────────────────────────────────────────

export const Width6rem      = { args: { ...base, data: { ...base.data, ButtonLabel: 'Narrow' },     displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonWidth', 'w_6rem'),    ds('buttonType', 'primary'), ds('buttonStyle', 'standard')] } };
export const Width9rem      = { args: { ...base, data: { ...base.data, ButtonLabel: 'Medium' },     displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonWidth', 'w_9rem'),    ds('buttonType', 'primary'), ds('buttonStyle', 'standard')] } };
export const Width10rem     = { args: { ...base, data: { ...base.data, ButtonLabel: 'Standard' },   displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonWidth', 'w_10rem'),   ds('buttonType', 'primary'), ds('buttonStyle', 'standard')] } };
export const Width12rem     = { args: { ...base, data: { ...base.data, ButtonLabel: 'Wide' },       displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonWidth', 'w_12rem'),   ds('buttonType', 'primary'), ds('buttonStyle', 'standard')] } };
export const Width15rem     = { args: { ...base, data: { ...base.data, ButtonLabel: 'X-Wide' },     displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonWidth', 'w_15rem'),   ds('buttonType', 'primary'), ds('buttonStyle', 'standard')] } };
export const Width20rem     = { args: { ...base, data: { ...base.data, ButtonLabel: 'XX-Wide' },    displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonWidth', 'w_20rem'),   ds('buttonType', 'primary'), ds('buttonStyle', 'standard')] } };
export const WidthAuto      = { args: { ...base, data: { ...base.data, ButtonLabel: 'Auto' },       displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonWidth', 'auto'),      ds('buttonType', 'primary'), ds('buttonStyle', 'standard')] } };
export const WidthHalf      = { args: { ...base, data: { ...base.data, ButtonLabel: 'Half Width' }, displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonWidth', 'half'),      ds('buttonType', 'primary'), ds('buttonStyle', 'standard')] } };
export const WidthFull      = { args: { ...base, data: { ...base.data, ButtonLabel: 'Subscribe now' }, displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonWidth', 'full'),   ds('buttonType', 'success'), ds('buttonStyle', 'standard'), ds('buttonSize', 'lg')] } };
export const WidthResponsive = { args: { ...base, data: { ...base.data, ButtonLabel: 'Responsive Width' }, displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonWidth', 'responsive'), ds('buttonType', 'primary'), ds('buttonStyle', 'standard')] } };

// ─── Rounded Corners ──────────────────────────────────────────────────────────

export const RadiusSquare  = { args: { ...base, data: { ...base.data, ButtonLabel: 'Square' },          displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonRadius', 'standard'), ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const RadiusXS      = { args: { ...base, data: { ...base.data, ButtonLabel: 'XS Radius' },       displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonRadius', 'xs'),       ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const RadiusSM      = { args: { ...base, data: { ...base.data, ButtonLabel: 'SM Radius' },       displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonRadius', 'sm'),       ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const RadiusMD      = { args: { ...base, data: { ...base.data, ButtonLabel: 'MD Radius' },       displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonRadius', 'md'),       ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const RadiusLG      = { args: { ...base, data: { ...base.data, ButtonLabel: 'LG Radius' },       displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonRadius', 'lg'),       ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const RadiusXL      = { args: { ...base, data: { ...base.data, ButtonLabel: 'XL Radius' },       displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonRadius', 'xl'),       ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const Radius2XL     = { args: { ...base, data: { ...base.data, ButtonLabel: '2XL Radius' },      displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonRadius', 'xl2'),      ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const Radius3XL     = { args: { ...base, data: { ...base.data, ButtonLabel: '3XL Radius' },      displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonRadius', 'xl3'),      ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const Radius4XL     = { args: { ...base, data: { ...base.data, ButtonLabel: '4XL Radius' },      displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonRadius', 'xl4'),      ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const RadiusFull    = { args: { ...base, data: { ...base.data, ButtonLabel: 'Full Rounded' },    displayTemplateKey: 'DefaultButton', displaySettings: [ds('buttonRadius', 'full'),     ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };

// ─── Hover Effects ────────────────────────────────────────────────────────────

export const HoverStatic = {
    args: {
        ...base,
        data: { ...base.data, ButtonLabel: 'No effect' },
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'lg'),
            ds('buttonRadius', 'xl'),
            ds('buttonAction', 'static'),
            ds('buttonWidth', 'auto'),
        ],
    },
};

export const HoverBouncy = {
    args: {
        ...base,
        data: { ...base.data, ButtonLabel: 'Start free trial' },
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'lg'),
            ds('buttonRadius', 'xl'),
            ds('buttonAction', 'bouncy'),
            ds('buttonWidth', 'auto'),
        ],
    },
};

// ─── Text Transform ───────────────────────────────────────────────────────────

export const TransformAsEntered = { args: { ...base, data: { ...base.data, ButtonLabel: 'As Entered' },  displayTemplateKey: 'DefaultButton', displaySettings: [ds('transform', 'keep'),       ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };
export const TransformUppercase = { args: { ...base, data: { ...base.data, ButtonLabel: 'Buy now' },      displayTemplateKey: 'DefaultButton', displaySettings: [ds('transform', 'uppercase'), ds('buttonType', 'error'),   ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto'), ds('buttonRadius', 'xs')] } };
export const TransformLowercase = { args: { ...base, data: { ...base.data, ButtonLabel: 'Read More' },    displayTemplateKey: 'DefaultButton', displaySettings: [ds('transform', 'lowercase'), ds('buttonType', 'neutral'), ds('buttonStyle', 'ghost'),    ds('buttonWidth', 'auto')] } };
export const TransformCapitalize = { args: { ...base, data: { ...base.data, ButtonLabel: 'get started' }, displayTemplateKey: 'DefaultButton', displaySettings: [ds('transform', 'capitalize'), ds('buttonType', 'primary'), ds('buttonStyle', 'standard'), ds('buttonWidth', 'auto')] } };

// ─── Login Buttons ────────────────────────────────────────────────────────────

const loginBase = { ...base, data: { ...base.data, ButtonLabel: 'Sign in' }, displayTemplateKey: 'LoginButton' };

export const LoginGoogle     = { args: { ...loginBase, displaySettings: [ds('loginService', 'Google')] } };
export const LoginGitHub     = { args: { ...loginBase, displaySettings: [ds('loginService', 'GitHub')] } };
export const LoginEmail      = { args: { ...loginBase, displaySettings: [ds('loginService', 'Email')] } };
export const LoginMicrosoft  = { args: { ...loginBase, displaySettings: [ds('loginService', 'Microsoft')] } };
export const LoginApple      = { args: { ...loginBase, displaySettings: [ds('loginService', 'Apple')] } };
export const LoginFacebook   = { args: { ...loginBase, displaySettings: [ds('loginService', 'Facebook')] } };
export const LoginLinkedIn   = { args: { ...loginBase, displaySettings: [ds('loginService', 'LinkedIn')] } };
export const LoginSlack      = { args: { ...loginBase, displaySettings: [ds('loginService', 'Slack')] } };
export const LoginAmazon     = { args: { ...loginBase, displaySettings: [ds('loginService', 'Amazon')] } };
export const LoginXTwitter   = { args: { ...loginBase, displaySettings: [ds('loginService', 'xtwitter')] } };
