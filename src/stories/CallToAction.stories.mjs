import CallToActionComponent from '../cms/components/CallToActionComponent/CallToAction.astro';
import { ds, mockLink, mockPayload } from './_mocks.ts';

export default {
    component: CallToActionComponent,
};

const base = { key: 'cta', contentPayload: mockPayload, displayTemplateKey: 'DefaultCallToAction' };

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
            ds('buttonRadius', 'standard'),
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

export const GhostLinks = {
    args: {
        ...base,
        data: { __typename: 'CallToAction', Links: [mockLink('Learn more', '/learn')] },
        displaySettings: [ds('buttonStyle', 'ghost'), ds('buttonType', 'neutral'), ds('buttonSize', 'sm'), ds('transform', 'lowercase')],
    },
};

export const UppercaseDash = {
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
