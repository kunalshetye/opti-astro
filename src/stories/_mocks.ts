import type { ContentPayload } from '../graphql/shared/ContentPayload';
import type { DisplaySettingsFragment } from '../../__generated/sdk';

export const mockPayload: ContentPayload = {
    key: 'story',
    loc: 'en',
    ver: '',
    ctx: '',
    preview_token: '',
    types: [],
};

export const ds = (key: string, value: string): DisplaySettingsFragment => ({
    __typename: 'CompositionDisplaySetting',
    key,
    value,
});

export const mockImageRef = (url: string) => ({
    __typename: 'ContentReference' as const,
    url: { __typename: 'ContentUrl' as const, default: url, hierarchical: url },
    item: null as any,
});

export const mockLink = (text: string, href = '/') => ({
    __typename: 'Link' as const,
    text,
    title: text,
    target: '_self' as string | null,
    url: {
        __typename: 'ContentUrl' as const,
        base: href,
        default: href,
        hierarchical: href,
        type: null as string | null,
    },
});

export const IMAGES = {
    landscape: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200',
    portrait: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
    office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    abstract: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=1200',
    nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
    city: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200',
};
