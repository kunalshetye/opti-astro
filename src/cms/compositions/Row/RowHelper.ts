// @ts-nocheck

import type { CompositionStructureNode } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';
import {
    getGapClass,
    getAlignContentClass,
    getAlignItemsClass,
    getMarginClass,
    getGridAutoFlowClass,
} from '../../shared/styleHelpers/index.ts';

export function getRowStyles(row: CompositionStructureNode) {
    const displaySettings = row.displaySettings;
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);

    // Component-specific width classes (keep as-is)
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

    // Component-specific justify-items classes (includes 'stretch' not in centralized helper)
    enum JustifyItemsClasses {
        center = 'justify-items-center',
        end = 'justify-items-end',
        start = 'justify-items-start',
        stretch = 'justify-items-stretch',
    }

    // Component-specific auto column min width (keep as-is)
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

    // Gap handling - separate X and Y controls using centralized helpers
    const gapXClass = getGapClass(dictionary['gapX'], 'x') || 'gap-x-4';
    cssClasses.push(gapXClass);

    const gapYClass = getGapClass(dictionary['gapY'], 'y') || 'gap-y-4';
    cssClasses.push(gapYClass);

    // Grid template mode
    const showAsRowFrom = dictionary['showAsRowFrom'] ?? 'md';
    const columnsPerRow = dictionary['columnsPerRow'] ?? 'auto';

    // Check if columnsPerRow is set (takes precedence over gridTemplateMode)
    if (columnsPerRow !== 'auto') {
        // Fixed number of equal-width columns
        // Convert col1, col2, col3, etc. to actual numbers
        const numColumns = columnsPerRow.replace('col', '');
        cssClasses.push(`grid-cols-1 ${showAsRowFrom}:grid-cols-${numColumns}`);
    } else {
        // Use gridTemplateMode
        const gridTemplateMode = dictionary['gridTemplateMode'] ?? 'fixed';

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
    }

    // Grid auto flow using centralized helper
    const gridAutoFlow = dictionary['gridAutoFlow'] ?? 'row';
    const gridAutoFlowClass = getGridAutoFlowClass(gridAutoFlow);
    cssClasses.push(gridAutoFlowClass);

    // Alignment using centralized and component-specific helpers
    cssClasses.push(JustifyItemsClasses[dictionary['justifyContent']] ?? 'justify-items-start');

    const alignContentClass = getAlignContentClass(dictionary['alignContent']);
    if (alignContentClass && alignContentClass !== 'content-start') {
        cssClasses.push(alignContentClass);
    }

    const verticalSpacingClass = getMarginClass(dictionary['verticalSpacing'], 'y');
    if (verticalSpacingClass) {
        cssClasses.push(verticalSpacingClass);
    }

    // Add responsive vertical alignment based on showAsRowFrom breakpoint
    const rowBreakpoint = dictionary['showAsRowFrom'] ?? 'md';
    const alignItems = dictionary['alignItems'];
    if (alignItems && alignItems !== 'start') {
        const alignItemsClass = getAlignItemsClass(alignItems);
        if (alignItemsClass && alignItemsClass !== 'items-start') {
            // Apply alignment when in grid mode
            cssClasses.push(`${rowBreakpoint}:${alignItemsClass}`);
        }
    }

    // Background color is now handled by globalStylesHelper
    return cssClasses;
}
