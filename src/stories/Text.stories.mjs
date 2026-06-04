import TextComponent from '../cms/components/TextComponent/Text.astro';
import { ds, mockPayload } from './_mocks.ts';

export default {
    component: TextComponent,
};

const base = { key: 'text', contentPayload: mockPayload };

// ── Heading levels ────────────────────────────────────────────────────────

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

export const H5 = {
    args: {
        ...base,
        data: { __typename: 'Text', Content: 'Section subsection heading' },
        displaySettings: [ds('headingType', 'h5'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'default')],
    },
};

export const H6 = {
    args: {
        ...base,
        data: { __typename: 'Text', Content: 'Fine-print label or caption' },
        displaySettings: [ds('headingType', 'h6'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'default')],
    },
};

export const PlainParagraph = {
    args: {
        ...base,
        data: { __typename: 'Text', Content: 'This is a plain paragraph element with default styling applied.' },
        displaySettings: [ds('headingType', 'plain'), ds('showAs', 'element'), ds('textAlign', 'left'), ds('color', 'default')],
    },
};

// ── Text alignment ────────────────────────────────────────────────────────

export const AlignLeft    = { args: { ...base, data: { __typename: 'Text', Content: 'Left-aligned heading text' },    displaySettings: [ds('headingType', 'h3'), ds('showAs', 'heading'), ds('textAlign', 'left'),    ds('color', 'default')] } };
export const AlignCenter  = { args: { ...base, data: { __typename: 'Text', Content: 'Center-aligned heading text' },  displaySettings: [ds('headingType', 'h3'), ds('showAs', 'heading'), ds('textAlign', 'center'),  ds('color', 'default')] } };
export const AlignRight   = { args: { ...base, data: { __typename: 'Text', Content: 'Right-aligned heading text' },   displaySettings: [ds('headingType', 'h3'), ds('showAs', 'heading'), ds('textAlign', 'right'),   ds('color', 'default')] } };
export const AlignJustify = { args: { ...base, data: { __typename: 'Text', Content: 'Optimizely is the leading digital experience platform for B2B and B2C brands seeking to deliver impactful experiences at scale.' }, displaySettings: [ds('headingType', 'plain'), ds('showAs', 'element'), ds('textAlign', 'justify'), ds('color', 'default')] } };

// ── Text transform ────────────────────────────────────────────────────────

export const TransformUppercase  = { args: { ...base, data: { __typename: 'Text', Content: 'Featured solutions' },      displaySettings: [ds('headingType', 'h3'), ds('showAs', 'heading'), ds('transform', 'uppercase'),  ds('textAlign', 'center'), ds('color', 'accent')] } };
export const TransformLowercase  = { args: { ...base, data: { __typename: 'Text', Content: 'All Lowercase Content' },    displaySettings: [ds('headingType', 'h3'), ds('showAs', 'heading'), ds('transform', 'lowercase'),  ds('textAlign', 'left'),   ds('color', 'default')] } };
export const TransformCapitalize = { args: { ...base, data: { __typename: 'Text', Content: 'capitalize every word here' }, displaySettings: [ds('headingType', 'h3'), ds('showAs', 'heading'), ds('transform', 'capitalize'), ds('textAlign', 'left'),   ds('color', 'default')] } };

// ── Colors ────────────────────────────────────────────────────────────────

export const ColorDefault   = { args: { ...base, data: { __typename: 'Text', Content: 'Default color'   }, displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'default')] } };
export const ColorPrimary   = { args: { ...base, data: { __typename: 'Text', Content: 'Primary color'   }, displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'primary')] } };
export const ColorSecondary = { args: { ...base, data: { __typename: 'Text', Content: 'Secondary color' }, displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'secondary')] } };
export const ColorAccent    = { args: { ...base, data: { __typename: 'Text', Content: 'Accent color'    }, displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'accent')] } };
export const ColorNeutral   = { args: { ...base, data: { __typename: 'Text', Content: 'Neutral color'   }, displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'neutral')] } };
export const ColorBase100   = { args: { ...base, data: { __typename: 'Text', Content: 'Base 100 color'  }, displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'base100')] } };
export const ColorBase200   = { args: { ...base, data: { __typename: 'Text', Content: 'Base 200 color'  }, displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'base200')] } };
export const ColorBase300   = { args: { ...base, data: { __typename: 'Text', Content: 'Base 300 color'  }, displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'base300')] } };
export const ColorInfo      = { args: { ...base, data: { __typename: 'Text', Content: 'Info color'      }, displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'info')] } };
export const ColorSuccess   = { args: { ...base, data: { __typename: 'Text', Content: 'Success color'   }, displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'success')] } };
export const ColorWarning   = { args: { ...base, data: { __typename: 'Text', Content: 'Warning color'   }, displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'warning')] } };
export const ColorError     = { args: { ...base, data: { __typename: 'Text', Content: 'Error color'     }, displaySettings: [ds('headingType', 'h4'), ds('showAs', 'heading'), ds('textAlign', 'left'), ds('color', 'error')] } };

// ── Justified text ────────────────────────────────────────────────────────

export const JustifiedText = {
    args: {
        ...base,
        data: { __typename: 'Text', Content: 'Optimizely is the leading digital experience platform for B2B and B2C brands seeking to deliver impactful experiences at scale.' },
        displaySettings: [ds('headingType', 'plain'), ds('showAs', 'element'), ds('textAlign', 'justify'), ds('color', 'default')],
    },
};

export const UppercaseAccent = {
    args: {
        ...base,
        data: { __typename: 'Text', Content: 'Featured solutions' },
        displaySettings: [ds('headingType', 'h3'), ds('showAs', 'heading'), ds('transform', 'uppercase'), ds('textAlign', 'center'), ds('color', 'accent')],
    },
};
