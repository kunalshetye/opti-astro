import ParagraphComponent from '../cms/components/ParagraphComponent/Paragraph.astro';
import { ds, mockPayload } from './_mocks.ts';

export default {
    component: ParagraphComponent,
};

const richText = `
<h2>Platform overview</h2>
<p>Optimizely is the leading digital experience platform (DXP) that empowers teams to unlock digital potential through content, experimentation, and commerce.</p>
<p>Built for enterprise scale, Optimizely brings together:</p>
<ul>
    <li><strong>Content Management</strong> — Create and publish content at scale across every channel</li>
    <li><strong>Experimentation</strong> — Run A/B tests, feature flags, and personalization campaigns</li>
    <li><strong>Commerce</strong> — Build rich B2B and B2C commerce experiences</li>
</ul>
<blockquote>
    <p>"Optimizely helped us increase conversion rates by 34% in our first quarter." — Global Enterprise Customer</p>
</blockquote>
<p>Ready to <a href="/demo">see it in action</a>? Book a personalized demo today.</p>
`;

const base = { key: 'para', contentPayload: mockPayload };

export const FullWidth = {
    args: {
        ...base,
        data: { __typename: 'Paragraph', Text: { __typename: 'SearchableRichText', html: richText } },
        displaySettings: [ds('paragraph_alignment', 'full_width')],
    },
};

export const CenteredLarge = {
    args: {
        ...base,
        data: { __typename: 'Paragraph', Text: { __typename: 'SearchableRichText', html: richText } },
        displaySettings: [ds('paragraph_alignment', 'centered_large')],
    },
};

export const CenteredMedium = {
    args: {
        ...base,
        data: { __typename: 'Paragraph', Text: { __typename: 'SearchableRichText', html: richText } },
        displaySettings: [ds('paragraph_alignment', 'centered_medium')],
    },
};

export const CenteredSmall = {
    args: {
        ...base,
        data: { __typename: 'Paragraph', Text: { __typename: 'SearchableRichText', html: richText } },
        displaySettings: [ds('paragraph_alignment', 'centered_small')],
    },
};
