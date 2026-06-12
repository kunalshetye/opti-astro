import SectionComponent from '../cms/compositions/Section/Section.astro';
import { ds, mockPayload } from './_mocks.ts';

export default { component: SectionComponent };

const base = { contentPayload: mockPayload };

// ── Node factories ─────────────────────────────────────────────────────────
// Mirrors the Optimizely composition tree: Section → Row → Column → items.
// _Components.astro dispatches on component._metadata.types[0].

let _uid = 0;
const uid = () => String(++_uid);

function textNode(content, headingType = 'h3') {
    return {
        key: `text-${uid()}`,
        component: {
            __typename: 'Text',
            _metadata: { types: ['Text'] },
            Content: content,
        },
        displaySettings: [ds('headingType', headingType), ds('showAs', 'heading'), ds('color', 'default')],
        displayTemplateKey: 'TextStyles',
    };
}

function paraNode(text) {
    return {
        key: `para-${uid()}`,
        component: {
            __typename: 'Paragraph',
            _metadata: { types: ['Paragraph'] },
            Text: { __typename: 'SearchableRichText', html: `<p>${text}</p>` },
        },
        displaySettings: [ds('paragraph_alignment', 'full_width')],
        displayTemplateKey: 'DefaultParagraph',
    };
}

function btnNode(label, style = 'standard', type = 'primary') {
    return {
        key: `btn-${uid()}`,
        component: {
            __typename: 'Button',
            _metadata: { types: ['Button'] },
            ButtonLabel: label,
            ButtonLink: {
                __typename: 'Link', text: label, title: label, target: '_self',
                url: { __typename: 'ContentUrl', base: '/', default: '/', hierarchical: '/', type: null },
            },
        },
        displaySettings: [ds('buttonStyle', style), ds('buttonType', type), ds('buttonSize', 'medium')],
        displayTemplateKey: 'DefaultButton',
    };
}

function col(items, settings = []) {
    return {
        key: `col-${uid()}`,
        nodeType: 'column',
        displayTemplateKey: 'DefaultColumn',
        displaySettings: settings,
        nodes: items,
    };
}

function row(cols, settings = []) {
    return {
        key: `row-${uid()}`,
        displayTemplateKey: 'DefaultRow',
        displaySettings: settings,
        nodes: cols,
    };
}

function section(rows, settings = []) {
    return {
        key: `section-${uid()}`,
        nodeType: 'section',
        displayTemplateKey: 'DefaultSection',
        displaySettings: settings,
        nodes: rows,
    };
}

// Shorthand: a column pre-filled with heading + body paragraph (+ optional CTA)
function contentCol(heading, body, cta = null, colSettings = []) {
    const nodes = [textNode(heading, 'h3'), paraNode(body)];
    if (cta) nodes.push(btnNode(cta));
    return col(nodes, colSettings);
}

const LOREM = 'Optimizely brings together content management, experimentation, and commerce in a unified platform built for scale.';
const LOREM_SHORT = 'Deliver personalized experiences with AI-driven insights.';

// ── Column count / layout patterns ────────────────────────────────────────

export const OneColumn = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Single column layout', LOREM, 'Learn more'),
            ]),
        ], [ds('gridWidth', 'default'), ds('vSpacing', 'default')]),
    },
};

export const TwoColumnsEqual = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Content management', LOREM_SHORT, 'Get started'),
                contentCol('Experimentation', LOREM_SHORT, 'Learn more'),
            ], [ds('contentSpacing', 'medium')]),
        ], [ds('gridWidth', 'default')]),
    },
};

export const ThreeColumnsEqual = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Manage', LOREM_SHORT, 'Explore'),
                contentCol('Experiment', LOREM_SHORT, 'Explore'),
                contentCol('Personalize', LOREM_SHORT, 'Explore'),
            ], [ds('contentSpacing', 'medium')]),
        ], [ds('gridWidth', 'default')]),
    },
};

export const FourColumnsEqual = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Analytics', LOREM_SHORT),
                contentCol('Campaigns', LOREM_SHORT),
                contentCol('Commerce', LOREM_SHORT),
                contentCol('Content', LOREM_SHORT),
            ], [ds('contentSpacing', 'small')]),
        ], [ds('gridWidth', 'default')]),
    },
};

// ── Asymmetric column spans (feature + sidebar) ────────────────────────────

export const TwoThirdsOneThird = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Main feature area', LOREM, 'Get started', [ds('gridSpan', 'span8')]),
                contentCol('Quick links', LOREM_SHORT, null, [ds('gridSpan', 'span4')]),
            ], [ds('contentSpacing', 'large')]),
        ], [ds('gridWidth', 'default')]),
    },
};

export const OneThirdTwoThirds = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Sidebar', LOREM_SHORT, null, [ds('gridSpan', 'span4')]),
                contentCol('Main content area', LOREM, 'Read more', [ds('gridSpan', 'span8')]),
            ], [ds('contentSpacing', 'large')]),
        ], [ds('gridWidth', 'default')]),
    },
};

export const OneFourthThreeFourths = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Nav', LOREM_SHORT, null, [ds('gridSpan', 'span3')]),
                contentCol('Primary content', LOREM, 'Continue', [ds('gridSpan', 'span9')]),
            ], [ds('contentSpacing', 'medium')]),
        ], [ds('gridWidth', 'default')]),
    },
};

// ── Row horizontal spacing ────────────────────────────────────────────────

export const RowSpacingNone = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Column A', LOREM_SHORT),
                contentCol('Column B', LOREM_SHORT),
                contentCol('Column C', LOREM_SHORT),
            ], [ds('contentSpacing', 'none')]),
        ], [ds('gridWidth', 'default')]),
    },
};

export const RowSpacingLarge = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Column A', LOREM_SHORT),
                contentCol('Column B', LOREM_SHORT),
                contentCol('Column C', LOREM_SHORT),
            ], [ds('contentSpacing', 'large')]),
        ], [ds('gridWidth', 'default')]),
    },
};

export const RowSpacingXL = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Column A', LOREM_SHORT),
                contentCol('Column B', LOREM_SHORT),
            ], [ds('contentSpacing', 'xl')]),
        ], [ds('gridWidth', 'default')]),
    },
};

// ── Row vertical alignment (visible when columns have different heights) ──

export const RowAlignCenter = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Tall column', LOREM + ' ' + LOREM, 'Go'),
                contentCol('Short column', LOREM_SHORT),
            ], [ds('contentSpacing', 'medium'), ds('showAsRowFrom', 'md'), ds('alignItems', 'center')]),
        ], [ds('gridWidth', 'default')]),
    },
};

export const RowAlignEnd = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Tall column', LOREM + ' ' + LOREM, 'Go'),
                contentCol('Short column', LOREM_SHORT),
            ], [ds('contentSpacing', 'medium'), ds('showAsRowFrom', 'md'), ds('alignItems', 'end')]),
        ], [ds('gridWidth', 'default')]),
    },
};

// ── Section background colors (sectionColor) ─────────────────────────────

export const BackgroundBase200 = {
    args: {
        ...base,
        grid: section([
            row([contentCol('Base-200 background', LOREM_SHORT, 'Call to action')]),
        ], [ds('gridWidth', 'default'), ds('vSpacing', 'default'), ds('sectionColor', 'base_200')]),
    },
};

export const BackgroundPrimary = {
    args: {
        ...base,
        grid: section([
            row([contentCol('Primary background', LOREM_SHORT, 'Call to action')]),
        ], [ds('gridWidth', 'default'), ds('vSpacing', 'default'), ds('sectionColor', 'primary')]),
    },
};

export const BackgroundAccent = {
    args: {
        ...base,
        grid: section([
            row([contentCol('Accent background', LOREM_SHORT, 'Call to action')]),
        ], [ds('gridWidth', 'default'), ds('vSpacing', 'default'), ds('sectionColor', 'accent')]),
    },
};

export const BackgroundNeutral = {
    args: {
        ...base,
        grid: section([
            row([contentCol('Neutral background', LOREM_SHORT, 'Call to action')]),
        ], [ds('gridWidth', 'default'), ds('vSpacing', 'default'), ds('sectionColor', 'neutral')]),
    },
};

// ── Section widths ────────────────────────────────────────────────────────

export const WidthFull = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Full width section', LOREM_SHORT),
                contentCol('Edge-to-edge container', LOREM_SHORT),
            ], [ds('contentSpacing', 'medium')]),
        ], [ds('gridWidth', 'full'), ds('sectionColor', 'base_200')]),
    },
};

export const WidthNarrow = {
    args: {
        ...base,
        grid: section([
            row([contentCol('Narrow section (max-w-3xl)', LOREM, 'Get started')]),
        ], [ds('gridWidth', 'narrow'), ds('sectionColor', 'base_200')]),
    },
};

export const WidthWide = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Wide section (max-w-7xl)', LOREM_SHORT),
                contentCol('More breathing room', LOREM_SHORT),
                contentCol('On either side', LOREM_SHORT),
            ], [ds('contentSpacing', 'medium')]),
        ], [ds('gridWidth', 'wide'), ds('sectionColor', 'base_200')]),
    },
};

// ── Section vertical spacing ──────────────────────────────────────────────

export const SpacingSmall = {
    args: {
        ...base,
        grid: section([
            row([contentCol('Small vertical spacing', LOREM_SHORT)]),
        ], [ds('gridWidth', 'default'), ds('vSpacing', 'small'), ds('sectionColor', 'base_200')]),
    },
};

export const SpacingLarge = {
    args: {
        ...base,
        grid: section([
            row([contentCol('Large vertical spacing', LOREM_SHORT)]),
        ], [ds('gridWidth', 'default'), ds('vSpacing', 'large'), ds('sectionColor', 'base_200')]),
    },
};

// ── Column backgrounds ────────────────────────────────────────────────────

export const ColumnBackgrounds = {
    args: {
        ...base,
        grid: section([
            row([
                contentCol('Primary column', LOREM_SHORT, null, [ds('backgroundColor', 'primary')]),
                contentCol('Accent column', LOREM_SHORT, null, [ds('backgroundColor', 'accent')]),
                contentCol('Neutral column', LOREM_SHORT, null, [ds('backgroundColor', 'neutral')]),
            ], [ds('contentSpacing', 'none')]),
        ], [ds('gridWidth', 'full')]),
    },
};

// ── Two rows stacked ──────────────────────────────────────────────────────

export const TwoRowsStacked = {
    args: {
        ...base,
        grid: section([
            row([
                col([textNode('Section heading', 'h2')], [ds('justifyContent', 'center'), ds('alignContent', 'center')]),
            ]),
            row([
                contentCol('Feature one', LOREM_SHORT, 'Learn more'),
                contentCol('Feature two', LOREM_SHORT, 'Learn more'),
                contentCol('Feature three', LOREM_SHORT, 'Learn more'),
            ], [ds('contentSpacing', 'medium'), ds('verticalSpacing', 'medium')]),
        ], [ds('gridWidth', 'default'), ds('sectionColor', 'base_200'), ds('vSpacing', 'default')]),
    },
};
