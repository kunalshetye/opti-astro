// @ts-nocheck

import type { CompositionStructureNode } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getRowStyles(row: CompositionStructureNode) {
    const displaySettings = row.displaySettings;
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);

    enum RowWidthClasses {
        full = 'w-full',
        container = 'container mx-auto px-8',
        max7xl = 'max-w-7xl w-full mx-auto px-8',
        max6xl = 'max-w-6xl w-full mx-auto px-8',
        max5xl = 'max-w-5xl w-full mx-auto px-8',
        max4xl = 'max-w-4xl w-full mx-auto px-8',
        max3xl = 'max-w-3xl w-full mx-auto px-8',
        max2xl = 'max-w-2xl w-full mx-auto px-8',
        maxXl = 'max-w-xl w-full mx-auto px-8',
        maxLg = 'max-w-lg w-full mx-auto px-8',
        maxMd = 'max-w-md w-full mx-auto px-8',
        maxSm = 'max-w-sm w-full mx-auto px-8',
        maxXs = 'max-w-xs w-full mx-auto px-8',
        inherit = '', // No additional width classes, inherit from parent
    }

    enum GapXClasses {
        none = 'gap-x-0',
        small = 'gap-x-2',
        medium = 'gap-x-4',
        large = 'gap-x-8',
        xl = 'gap-x-12',
        xxl = 'gap-x-24',
    }

    enum GapYClasses {
        none = 'gap-y-0',
        small = 'gap-y-2',
        medium = 'gap-y-4',
        large = 'gap-y-8',
        xl = 'gap-y-12',
        xxl = 'gap-y-24',
    }

    enum JustifyItemsClasses {
        center = 'justify-items-center',
        end = 'justify-items-end',
        start = 'justify-items-start',
        stretch = 'justify-items-stretch',
    }

    enum AlignContentClasses {
        center = 'content-center',
        end = 'content-end',
        start = 'content-start',
    }

    enum AlignItemsClasses {
        start = 'items-start',
        center = 'items-center',
        end = 'items-end',
        stretch = 'items-stretch',
        baseline = 'items-baseline',
    }

    enum VerticalSpacingClasses {
        small = 'my-2',
        medium = 'my-4',
        large = 'my-8',
        verylarge = 'lg:my-40 my-20',
        none = 'my-0',
    }

    enum GridAutoFlowClasses {
        row = 'grid-flow-row',
        dense = 'grid-flow-dense',
        column = 'grid-flow-col',
    }

    enum AutoColumnMinWidthClasses {
        small = '15rem',
        medium = '20rem',
        large = '25rem',
        xl = '30rem',
    }

    let cssClasses = [];

    // Apply width classes if specified, otherwise inherit from section
    if (dictionary['rowWidth'] && dictionary['rowWidth'] !== 'inherit') {
        cssClasses.push(RowWidthClasses[dictionary['rowWidth']] ?? '');
    }

    // Gap handling - separate X and Y controls
    if (dictionary['gapX']) {
        cssClasses.push(GapXClasses[dictionary['gapX']] ?? 'gap-x-4');
    } else {
        cssClasses.push('gap-x-4'); // Default horizontal gap
    }

    if (dictionary['gapY']) {
        cssClasses.push(GapYClasses[dictionary['gapY']] ?? 'gap-y-4');
    } else {
        cssClasses.push('gap-y-4'); // Default vertical gap
    }

    // Grid template mode
    const gridTemplateMode = dictionary['gridTemplateMode'] ?? 'fixed';
    const showAsRowFrom = dictionary['showAsRowFrom'] ?? 'md';

    switch (gridTemplateMode) {
        case 'fixed':
            // Traditional 12-column grid
            cssClasses.push(`grid-cols-1 ${showAsRowFrom}:grid-cols-12`);
            break;
        case 'autoFit': {
            // Auto-fit: cells shrink to fit content
            const minWidth = AutoColumnMinWidthClasses[dictionary['autoColumnMinWidth']] ?? '20rem';
            cssClasses.push(`grid-cols-1 ${showAsRowFrom}:grid-cols-[repeat(auto-fit,minmax(${minWidth},1fr))]`);
            break;
        }
        case 'autoFill': {
            // Auto-fill: cells maintain size even if empty
            const minWidth = AutoColumnMinWidthClasses[dictionary['autoColumnMinWidth']] ?? '20rem';
            cssClasses.push(`grid-cols-1 ${showAsRowFrom}:grid-cols-[repeat(auto-fill,minmax(${minWidth},1fr))]`);
            break;
        }
    }

    // Grid auto flow
    const gridAutoFlow = dictionary['gridAutoFlow'] ?? 'row';
    cssClasses.push(GridAutoFlowClasses[gridAutoFlow] ?? 'grid-flow-row');

    // Alignment
    cssClasses.push(JustifyItemsClasses[dictionary['justifyContent']] ?? 'justify-items-start');
    cssClasses.push(AlignContentClasses[dictionary['alignContent']] ?? '');
    cssClasses.push(VerticalSpacingClasses[dictionary['verticalSpacing']] ?? '');

    // Add responsive vertical alignment based on showAsRowFrom breakpoint
    const rowBreakpoint = dictionary['showAsRowFrom'] ?? 'md';
    const alignItems = dictionary['alignItems'];
    if (alignItems && alignItems !== 'start') {
        const alignItemsClass = AlignItemsClasses[alignItems];
        if (alignItemsClass) {
            // Apply alignment when in grid mode
            cssClasses.push(`${rowBreakpoint}:${alignItemsClass}`);
        }
    }

    // Background color is now handled by globalStylesHelper
    return cssClasses;
}
