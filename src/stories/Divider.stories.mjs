import DividerComponent from '../cms/components/DividerComponent/Divider.astro';
import FlexRow from './_FlexRow.astro';
import { ds, mockPayload } from './_mocks.ts';

export default {
    component: DividerComponent,
};

const base = { key: 'divider', contentPayload: mockPayload };

// ── Horizontal (content-type direction) ──────────────────────────────────

export const HorizontalDefault = {
    args: {
        ...base,
        data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' },
        displaySettings: [ds('dividerColor', 'default'), ds('dividerLineThickness', 'default'), ds('dividerLineMargin', 'default')],
    },
};

export const HorizontalWithTextCenter = {
    args: {
        ...base,
        data: { __typename: 'Divider', DividerText: 'or', DividerDirection: 'horizontal' },
        displaySettings: [
            ds('dividerColor', 'neutral'),
            ds('textColor', 'neutral'),
            ds('textPosition', 'middle'),
            ds('dividerLineThickness', 'thickness_2'),
            ds('dividerLineMargin', 'margin_4'),
        ],
    },
};

export const HorizontalWithTextStart = {
    args: {
        ...base,
        data: { __typename: 'Divider', DividerText: 'Section title', DividerDirection: 'horizontal' },
        displaySettings: [
            ds('dividerColor', 'primary'),
            ds('textColor', 'primary'),
            ds('textPosition', 'start'),
            ds('dividerLineThickness', 'thickness_3'),
            ds('dividerLineMargin', 'margin_6'),
        ],
    },
};

export const HorizontalBoldPrimary = {
    args: {
        ...base,
        data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' },
        displaySettings: [
            ds('dividerColor', 'primary'),
            ds('dividerLineThickness', 'thickness_5'),
            ds('dividerLineMargin', 'margin_8'),
            ds('dividerLineLength', 'length_13'),
        ],
    },
};

export const HorizontalAccentShort = {
    args: {
        ...base,
        data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' },
        displaySettings: [
            ds('dividerColor', 'accent'),
            ds('dividerLineThickness', 'thickness_4'),
            ds('dividerLineMargin', 'margin_3'),
            ds('dividerLineLength', 'length_14'),
        ],
    },
};

export const HorizontalUppercaseLabel = {
    args: {
        ...base,
        data: { __typename: 'Divider', DividerText: 'featured', DividerDirection: 'horizontal' },
        displaySettings: [
            ds('dividerColor', 'secondary'),
            ds('textColor', 'secondary'),
            ds('textPosition', 'middle'),
            ds('transform', 'uppercase'),
            ds('dividerLineThickness', 'thickness_1'),
        ],
    },
};

// ── Vertical (content-type direction) ────────────────────────────────────

const flexRow = [{ component: FlexRow }];

export const VerticalDefault = {
    decorators: flexRow,
    args: {
        ...base,
        data: { __typename: 'Divider', DividerText: null, DividerDirection: 'vertical' },
        displaySettings: [ds('dividerColor', 'default'), ds('dividerLineThickness', 'default'), ds('dividerLineMargin', 'default')],
    },
};

export const VerticalWithText = {
    decorators: flexRow,
    args: {
        ...base,
        data: { __typename: 'Divider', DividerText: 'or', DividerDirection: 'vertical' },
        displaySettings: [
            ds('dividerColor', 'neutral'),
            ds('textColor', 'neutral'),
            ds('textPosition', 'middle'),
            ds('dividerLineThickness', 'thickness_2'),
        ],
    },
};

export const VerticalPrimary = {
    decorators: flexRow,
    args: {
        ...base,
        data: { __typename: 'Divider', DividerText: null, DividerDirection: 'vertical' },
        displaySettings: [
            ds('dividerColor', 'primary'),
            ds('dividerLineThickness', 'thickness_4'),
        ],
    },
};
