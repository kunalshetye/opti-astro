import TextComponent from '../cms/components/TextComponent/Text.astro';
import { ds, mockPayload } from './_mocks.ts';

export default {
    component: TextComponent,
};

const base = { key: 'text', contentPayload: mockPayload };

export const H1Default = {
    args: {
        ...base,
        data: { __typename: 'Text', Content: 'The future of digital experience' },
        displaySettings: [ds('headingType', 'h1'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'default')],
    },
};

export const H2Centered = {
    args: {
        ...base,
        data: { __typename: 'Text', Content: 'Why choose Optimizely?' },
        displaySettings: [ds('headingType', 'h2'), ds('showAs', 'heading'), ds('textAlign', 'center'), ds('color', 'default')],
    },
};

export const H3Primary = {
    args: {
        ...base,
        data: { __typename: 'Text', Content: 'Key features at a glance' },
        displaySettings: [ds('headingType', 'h3'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'primary')],
    },
};

export const H4Secondary = {
    args: {
        ...base,
        data: { __typename: 'Text', Content: 'Getting started guide' },
        displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'secondary')],
    },
};

export const PlainParagraph = {
    args: {
        ...base,
        data: { __typename: 'Text', Content: 'This is a plain paragraph element with default styling applied.' },
        displaySettings: [ds('headingType', 'plain'), ds('showAs', 'element'), ds('textAlign', 'left'), ds('color', 'default')],
    },
};

export const UppercaseAccent = {
    args: {
        ...base,
        data: { __typename: 'Text', Content: 'Featured solutions' },
        displaySettings: [ds('headingType', 'h3'), ds('showAs', 'heading'), ds('transform', 'uppercase'), ds('textAlign', 'center'), ds('color', 'accent')],
    },
};

export const JustifiedText = {
    args: {
        ...base,
        data: { __typename: 'Text', Content: 'Optimizely is the leading digital experience platform for B2B and B2C brands seeking to deliver impactful experiences at scale.' },
        displaySettings: [ds('headingType', 'plain'), ds('showAs', 'element'), ds('textAlign', 'justify'), ds('color', 'default')],
    },
};
