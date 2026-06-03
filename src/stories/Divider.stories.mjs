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

export const HorizontalWithTextEnd = {
    args: {
        ...base,
        data: { __typename: 'Divider', DividerText: 'end label', DividerDirection: 'horizontal' },
        displaySettings: [
            ds('dividerColor', 'secondary'),
            ds('textColor', 'secondary'),
            ds('textPosition', 'end'),
            ds('dividerLineThickness', 'thickness_2'),
            ds('dividerLineMargin', 'margin_4'),
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

// ── Text transform ────────────────────────────────────────────────────────

export const TransformLowercase = {
    args: {
        ...base,
        data: { __typename: 'Divider', DividerText: 'OR CONTINUE WITH', DividerDirection: 'horizontal' },
        displaySettings: [
            ds('dividerColor', 'neutral'),
            ds('textColor', 'neutral'),
            ds('textPosition', 'middle'),
            ds('transform', 'lowercase'),
            ds('dividerLineThickness', 'thickness_1'),
        ],
    },
};

export const TransformCapitalize = {
    args: {
        ...base,
        data: { __typename: 'Divider', DividerText: 'read more below', DividerDirection: 'horizontal' },
        displaySettings: [
            ds('dividerColor', 'primary'),
            ds('textColor', 'primary'),
            ds('textPosition', 'start'),
            ds('transform', 'capitalize'),
            ds('dividerLineThickness', 'thickness_2'),
        ],
    },
};

// ── Colors ────────────────────────────────────────────────────────────────

export const ColorDefault   = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'default'),   ds('dividerLineThickness', 'thickness_2')] } };
export const ColorNeutral   = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'neutral'),   ds('dividerLineThickness', 'thickness_2')] } };
export const ColorPrimary   = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'primary'),   ds('dividerLineThickness', 'thickness_2')] } };
export const ColorSecondary = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'secondary'), ds('dividerLineThickness', 'thickness_2')] } };
export const ColorAccent    = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'accent'),    ds('dividerLineThickness', 'thickness_2')] } };
export const ColorSuccess   = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'success'),   ds('dividerLineThickness', 'thickness_2')] } };
export const ColorWarning   = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'warning'),   ds('dividerLineThickness', 'thickness_2')] } };
export const ColorInfo      = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'info'),      ds('dividerLineThickness', 'thickness_2')] } };

// ── Thickness ─────────────────────────────────────────────────────────────

export const ThicknessDefault  = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'primary'), ds('dividerLineThickness', 'default')] } };
export const ThicknessXThin    = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'primary'), ds('dividerLineThickness', 'thickness_1')] } };
export const ThicknessMedium   = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'primary'), ds('dividerLineThickness', 'thickness_2')] } };
export const ThicknessXMedium  = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'primary'), ds('dividerLineThickness', 'thickness_3')] } };
export const ThicknessThick    = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'primary'), ds('dividerLineThickness', 'thickness_4')] } };
export const ThicknessXThick   = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'primary'), ds('dividerLineThickness', 'thickness_5')] } };
export const ThicknessMega     = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'primary'), ds('dividerLineThickness', 'thickness_8')] } };
export const ThicknessJumbo    = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'primary'), ds('dividerLineThickness', 'thickness_10')] } };

// ── Length (horizontal only) ──────────────────────────────────────────────

export const LengthFull      = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'primary'), ds('dividerLineThickness', 'thickness_3'), ds('dividerLineLength', 'default')] } };
export const LengthThreeQuarters = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'primary'), ds('dividerLineThickness', 'thickness_3'), ds('dividerLineLength', 'length_34')] } };
export const LengthHalf      = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'accent'),  ds('dividerLineThickness', 'thickness_3'), ds('dividerLineLength', 'length_12')] } };
export const LengthOneThird  = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'accent'),  ds('dividerLineThickness', 'thickness_4'), ds('dividerLineLength', 'length_13')] } };
export const LengthOneFourth = { args: { ...base, data: { __typename: 'Divider', DividerText: null, DividerDirection: 'horizontal' }, displaySettings: [ds('dividerColor', 'secondary'), ds('dividerLineThickness', 'thickness_5'), ds('dividerLineLength', 'length_14')] } };

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
