import CallToActionComponent from '../cms/components/CallToActionComponent/CallToAction.astro';
import { ds, mockLink, mockPayload } from './_mocks.ts';

export default {
    component: CallToActionComponent,
};

const base = { key: 'cta', contentPayload: mockPayload, displayTemplateKey: 'DefaultCallToAction' };

// ── Styles ────────────────────────────────────────────────────────────────

export const SingleLink = {
    args: {
        ...base,
        data: { __typename: 'CallToAction', Links: [mockLink('Get started for free', '/signup')] },
        displaySettings: [
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'lg'),
            ds('buttonRadius', 'full'),
            ds('buttonWidth', 'auto'),
            ds('buttonAction', 'bouncy'),
        ],
    },
};

export const MultipleLinks = {
    args: {
        ...base,
        data: {
            __typename: 'CallToAction',
            Links: [mockLink('Start free trial', '/trial'), mockLink('Watch demo', '/demo'), mockLink('Contact sales', '/contact')],
        },
        displaySettings: [
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'none'),
        ],
    },
};

export const Soft = {
    args: {
        ...base,
        data: { __typename: 'CallToAction', Links: [mockLink('Learn more', '/learn'), mockLink('View pricing', '/pricing')] },
        displaySettings: [
            ds('buttonStyle', 'soft'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'md'),
        ],
    },
};

export const OutlineStyle = {
    args: {
        ...base,
        data: { __typename: 'CallToAction', Links: [mockLink('View documentation', '/docs'), mockLink('See pricing', '/pricing')] },
        displaySettings: [
            ds('buttonStyle', 'outline'),
            ds('buttonType', 'secondary'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'xl'),
        ],
    },
};

export const DashStyle = {
    args: {
        ...base,
        data: { __typename: 'CallToAction', Links: [mockLink('Buy now', '/buy'), mockLink('Compare plans', '/plans')] },
        displaySettings: [
            ds('transform', 'uppercase'),
            ds('buttonStyle', 'dash'),
            ds('buttonType', 'accent'),
            ds('buttonSize', 'lg'),
            ds('buttonWidth', 'w_12rem'),
        ],
    },
};

export const NeutralStyle = {
    args: {
        ...base,
        data: { __typename: 'CallToAction', Links: [mockLink('Go back', '/back')] },
        displaySettings: [
            ds('buttonStyle', 'neutral'),
            ds('buttonType', 'neutral'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'none'),
        ],
    },
};

export const LinkStyle = {
    args: {
        ...base,
        data: { __typename: 'CallToAction', Links: [mockLink('Read the docs', '/docs'), mockLink('View changelog', '/changelog')] },
        displaySettings: [
            ds('buttonStyle', 'link'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
            ds('buttonWidth', 'auto'),
        ],
    },
};

export const GhostLinks = {
    args: {
        ...base,
        data: { __typename: 'CallToAction', Links: [mockLink('Learn more', '/learn')] },
        displaySettings: [ds('buttonStyle', 'ghost'), ds('buttonType', 'neutral'), ds('buttonSize', 'sm'), ds('transform', 'lowercase')],
    },
};

export const WideStyle = {
    args: {
        ...base,
        data: { __typename: 'CallToAction', Links: [mockLink('Join the waitlist', '/waitlist')] },
        displaySettings: [
            ds('buttonStyle', 'wide'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'lg'),
            ds('buttonRadius', 'none'),
        ],
    },
};

export const DisabledStyle = {
    args: {
        ...base,
        data: { __typename: 'CallToAction', Links: [mockLink('Coming soon', '/soon')] },
        displaySettings: [
            ds('buttonStyle', 'disabled'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'medium'),
        ],
    },
};

// ── Sizes ─────────────────────────────────────────────────────────────────

export const SizeXS         = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Sign up', '/signup')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'xs'),         ds('buttonWidth', 'auto')] } };
export const SizeSM         = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Sign up', '/signup')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'sm'),         ds('buttonWidth', 'auto')] } };
export const SizeMD         = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Sign up', '/signup')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'medium'),     ds('buttonWidth', 'auto')] } };
export const SizeLG         = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Sign up', '/signup')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'lg'),         ds('buttonWidth', 'auto')] } };
export const SizeXL         = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Sign up', '/signup')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'xl'),         ds('buttonWidth', 'auto')] } };
export const SizeResponsive = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Sign up', '/signup')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'responsive'), ds('buttonWidth', 'auto')] } };

// ── Radius ────────────────────────────────────────────────────────────────

export const RadiusNone = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Get started', '/start')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'lg'), ds('buttonRadius', 'none')] } };
export const RadiusXS   = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Get started', '/start')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'lg'), ds('buttonRadius', 'xs')] } };
export const RadiusSM   = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Get started', '/start')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'lg'), ds('buttonRadius', 'sm')] } };
export const RadiusMD   = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Get started', '/start')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'lg'), ds('buttonRadius', 'md')] } };
export const RadiusLG   = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Get started', '/start')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'lg'), ds('buttonRadius', 'lg')] } };
export const RadiusXL   = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Get started', '/start')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'lg'), ds('buttonRadius', 'xl')] } };
export const Radius2XL  = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Get started', '/start')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'lg'), ds('buttonRadius', 'xl2')] } };
export const Radius3XL  = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Get started', '/start')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'lg'), ds('buttonRadius', 'xl3')] } };
export const Radius4XL  = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Get started', '/start')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'lg'), ds('buttonRadius', 'xl4')] } };
export const RadiusFull = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('Get started', '/start')] }, displaySettings: [ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'lg'), ds('buttonRadius', 'full')] } };

// ── Hover action ──────────────────────────────────────────────────────────

export const HoverStatic = {
    args: {
        ...base,
        data: { __typename: 'CallToAction', Links: [mockLink('No hover effect', '/start')] },
        displaySettings: [
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'lg'),
            ds('buttonRadius', 'full'),
            ds('buttonAction', 'static'),
            ds('buttonWidth', 'auto'),
        ],
    },
};

export const HoverBouncy = {
    args: {
        ...base,
        data: { __typename: 'CallToAction', Links: [mockLink('Bouncy hover effect', '/start')] },
        displaySettings: [
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'primary'),
            ds('buttonSize', 'lg'),
            ds('buttonRadius', 'full'),
            ds('buttonAction', 'bouncy'),
            ds('buttonWidth', 'auto'),
        ],
    },
};

// ── Text transform ────────────────────────────────────────────────────────

export const TransformUppercase  = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('buy now', '/buy')]        }, displaySettings: [ds('transform', 'uppercase'),  ds('buttonStyle', 'standard'), ds('buttonType', 'error'),   ds('buttonSize', 'lg'), ds('buttonWidth', 'auto')] } };
export const TransformLowercase  = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('LEARN MORE', '/learn')]    }, displaySettings: [ds('transform', 'lowercase'),  ds('buttonStyle', 'ghost'),    ds('buttonType', 'neutral'), ds('buttonSize', 'sm'), ds('buttonWidth', 'auto')] } };
export const TransformCapitalize = { args: { ...base, data: { __typename: 'CallToAction', Links: [mockLink('get started today', '/go')] }, displaySettings: [ds('transform', 'capitalize'), ds('buttonStyle', 'standard'), ds('buttonType', 'primary'), ds('buttonSize', 'lg'), ds('buttonWidth', 'auto')] } };
