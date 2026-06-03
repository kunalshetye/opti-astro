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

export const Large = {
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
        ],
    },
};

export const FullWidth = {
    args: {
        ...base,
        data: { ...base.data, ButtonLabel: 'Subscribe now' },
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'success'),
            ds('buttonSize', 'lg'),
            ds('buttonWidth', 'full'),
        ],
    },
};

export const Uppercase = {
    args: {
        ...base,
        data: { ...base.data, ButtonLabel: 'Buy now' },
        displayTemplateKey: 'DefaultButton',
        displaySettings: [
            ds('transform', 'uppercase'),
            ds('buttonStyle', 'standard'),
            ds('buttonType', 'error'),
            ds('buttonSize', 'medium'),
            ds('buttonRadius', 'xs'),
        ],
    },
};

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
