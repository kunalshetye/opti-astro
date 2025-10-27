import type { CompositionStructureNode } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getColumnStyles(column: CompositionStructureNode, parentColumnsPerRow: string = 'auto') {
    const displaySettings = column.displaySettings;
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);

    let cssClasses: string[] = [];

    // Handle column width
    const columnWidth = dictionary['columnWidth'];
    switch (columnWidth) {
        case 'full':
            cssClasses.push('w-full');
            break;
        case 'wide':
            cssClasses.push('max-w-7xl w-full mx-auto');
            break;
        case 'narrow':
            cssClasses.push('max-w-3xl w-full mx-auto');
            break;
        case 'edgeToEdge':
            cssClasses.push('w-full max-w-full');
            break;
        case 'default':
        default:
            // No additional width classes - inherit from parent
            break;
    }

    const gridSpan = dictionary['gridSpan'] ?? 'auto';

    // If parent Row has a specific columnsPerRow set AND this column's span is 'auto',
    // skip the span and let the grid auto-place it equally.
    // BUT if the column has an explicit span set (span1-span12), respect that.
    const shouldSkipSpan = parentColumnsPerRow !== 'auto' && gridSpan === 'auto';

    if (!shouldSkipSpan) {
        // Handle grid column span - simplified logic
        if (gridSpan && gridSpan.startsWith('span') && gridSpan !== 'auto') {
            // Extract number from 'span1', 'span2', etc.
            const spanNumber = gridSpan.replace('span', '');
            const spanValue = parseInt(spanNumber, 10);
            if (!isNaN(spanValue) && spanValue >= 1 && spanValue <= 12) {
                cssClasses.push(`md:col-span-${spanValue}`);
            } else {
                cssClasses.push('col-span-12');  // Fallback to full width
            }
        } else {
            // Auto or default case
            // FLEX MIGRATION NOTE:
            // Old flex behavior: md:flex-1 (columns grow equally to fill space)
            // New grid behavior: col-span-12 (full width, stacks vertically like flex)
            // For equal side-by-side columns: Use explicit spans (span6, span4, etc.)
            //   OR use Row gridTemplateMode='autoFit' for automatic equal distribution
            //   OR use Row columnsPerRow setting for fixed equal-width columns
            cssClasses.push('col-span-12');
        }
    }

    // Handle row span for vertical spanning - simplified logic
    const rowSpan = dictionary['rowSpan'];
    if (rowSpan && rowSpan.startsWith('span') && rowSpan !== 'auto') {
        // Extract number from 'span2', 'span3', etc.
        const spanNumber = rowSpan.replace('span', '');
        const spanValue = parseInt(spanNumber, 10);
        if (!isNaN(spanValue) && spanValue >= 2 && spanValue <= 6) {
            cssClasses.push(`md:row-span-${spanValue}`);
        }
        // Otherwise auto row span (single row) - no class needed
    }

    switch (column.displayTemplateKey) {
        case 'DefaultColumn':
            switch (dictionary['contentSpacing']) {
                case 'small':
                    cssClasses.push('gap-2 py-2');
                    break;
                case 'medium':
                    cssClasses.push('gap-4 py-4');
                    break;
                case 'large':
                    cssClasses.push('gap-8 py-8 lg:gap-8 lg:py-8');
                    break;
                case 'xl':
                    cssClasses.push('gap-12 py-12 lg:gap-24 lg:py-24');
                    break;
                case 'xxl':
                    cssClasses.push('gap-16 py-16 lg:gap-72 lg:py-72');
                    break;
                default:
                    cssClasses.push('gap-0 py-0');
                    break;
            }

            // Consolidated alignment - handles both horizontal and vertical
            switch (dictionary['alignment']) {
                case 'center':
                    cssClasses.push('justify-center justify-items-center content-center items-center');
                    break;
                case 'end':
                    cssClasses.push('justify-end justify-items-end content-end items-end');
                    break;
                default:
                    cssClasses.push('justify-start justify-items-start content-start items-start');
                    break;
            }

            switch (dictionary['showFrom']) {
                case 'fromSmall':
                    cssClasses.push('hidden sm:block');
                    break;
                case 'fromMedium':
                    cssClasses.push('hidden md:block');
                    break;
                case 'fromLarge':
                    cssClasses.push('hidden lg:block');
                    break;
            }

            // Background color is now handled by globalStylesHelper

            break;
        default:
            cssClasses.push('vb:NoStyles');
            break;
    }

    return cssClasses;
}
