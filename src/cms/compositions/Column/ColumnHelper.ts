import type { CompositionStructureNode } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getColumnStyles(column: CompositionStructureNode, parentColumnsPerRow: string = 'auto') {
    const displaySettings = column.displaySettings;
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);

    let cssClasses: string[] = [];

    const gridSpan = dictionary['gridSpan'] ?? 'auto';

    // If parent Row has a specific columnsPerRow set AND this column's span is 'auto',
    // skip the span and let the grid auto-place it equally.
    // BUT if the column has an explicit span set (span1-span12), respect that.
    const shouldSkipSpan = parentColumnsPerRow !== 'auto' && gridSpan === 'auto';

    if (!shouldSkipSpan) {
        // Handle grid column span - convert from basis to col-span
        switch (gridSpan) {
        case 'span1':
            cssClasses.push('md:col-span-1');
            break;
        case 'span2':
            cssClasses.push('md:col-span-2');
            break;
        case 'span3':
            cssClasses.push('md:col-span-3');
            break;
        case 'span4':
            cssClasses.push('md:col-span-4');
            break;
        case 'span5':
            cssClasses.push('md:col-span-5');
            break;
        case 'span6':
            cssClasses.push('md:col-span-6');
            break;
        case 'span7':
            cssClasses.push('md:col-span-7');
            break;
        case 'span8':
            cssClasses.push('md:col-span-8');
            break;
        case 'span9':
            cssClasses.push('md:col-span-9');
            break;
        case 'span10':
            cssClasses.push('md:col-span-10');
            break;
        case 'span11':
            cssClasses.push('md:col-span-11');
            break;
        case 'span12':
            cssClasses.push('md:col-span-12');
            break;
        case 'auto':
        default:
            // FLEX MIGRATION NOTE:
            // Old flex behavior: md:flex-1 (columns grow equally to fill space)
            // New grid behavior: col-span-12 (full width, stacks vertically like flex)
            // For equal side-by-side columns: Use explicit spans (span6, span4, etc.)
            //   OR use Row gridTemplateMode='autoFit' for automatic equal distribution
            //   OR use Row columnsPerRow setting for fixed equal-width columns
            cssClasses.push('col-span-12');
            break;
        }
    }

    // Handle row span for vertical spanning
    switch (dictionary['rowSpan']) {
        case 'span2':
            cssClasses.push('md:row-span-2');
            break;
        case 'span3':
            cssClasses.push('md:row-span-3');
            break;
        case 'span4':
            cssClasses.push('md:row-span-4');
            break;
        case 'span5':
            cssClasses.push('md:row-span-5');
            break;
        case 'span6':
            cssClasses.push('md:row-span-6');
            break;
        case 'auto':
        default:
            // Auto row span (single row)
            break;
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
