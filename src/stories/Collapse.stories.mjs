import CollapseComponent from '../cms/components/CollapseComponent/Collapse.astro';
import { mockPayload } from './_mocks.ts';

export default {
    component: CollapseComponent,
};

const base = { key: 'collapse', contentPayload: mockPayload, displaySettings: [] };

export const Default = {
    args: {
        ...base,
        data: {
            __typename: 'Collapse',
            Heading: 'What is Optimizely?',
            Body: { __typename: 'SearchableRichText', html: '<p>Optimizely is a leading digital experience platform that helps businesses create, deliver, and optimize digital experiences across web, mobile, and other channels.</p>' },
        },
    },
};

export const LongContent = {
    args: {
        ...base,
        data: {
            __typename: 'Collapse',
            Heading: 'How does content management work?',
            Body: {
                __typename: 'SearchableRichText',
                html: '<p>Optimizely\'s CMS provides powerful tools for creating and managing digital content:</p><ul><li><strong>Visual editing</strong> — Edit content directly on the page</li><li><strong>Content modeling</strong> — Define structured content types</li><li><strong>Multi-channel delivery</strong> — Publish to web, mobile, and more</li><li><strong>Localization</strong> — Manage content in multiple languages</li></ul>',
            },
        },
    },
};

export const NoBody = {
    args: {
        ...base,
        data: { __typename: 'Collapse', Heading: 'Is there a free trial available?', Body: null },
    },
};
