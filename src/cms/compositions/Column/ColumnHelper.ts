import type { CompositionStructureNode } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getColumnStyles(column: CompositionStructureNode) {
    const displaySettings = column.displaySettings;
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    // console.log(column.displayTemplateKey);
    // console.log(dictionary);

    let cssClasses: string[] = [];

    // Grid Column Span - Controls how many columns this Column spans in the parent Row's grid
    // Maps to TailwindCSS col-span-* classes
    const GridSpanClasses = {
        'auto': 'md:col-span-1',
        'span1': 'md:col-span-1',
        'span2': 'md:col-span-2',
        'span3': 'md:col-span-3',
        'span4': 'md:col-span-4',
        'span5': 'md:col-span-5',
        'span6': 'md:col-span-6',
        'span7': 'md:col-span-7',
        'span8': 'md:col-span-8',
        'span9': 'md:col-span-9',
        'span10': 'md:col-span-10',
        'span11': 'md:col-span-11',
        'span12': 'md:col-span-12',
    };

    // Apply grid span based on gridSpan setting
    const gridSpan = dictionary['gridSpan'] || 'auto';
    if (GridSpanClasses[gridSpan]) {
        cssClasses.push(GridSpanClasses[gridSpan]);
    }

    // Explicit Grid Column Placement (NEW)
    // Allows precise positioning within the parent Row's grid
    const gridColumnStart = dictionary['gridColumnStart'];
    if (gridColumnStart && gridColumnStart !== 'auto') {
        cssClasses.push(`md:col-start-${gridColumnStart}`);
    }

    const gridColumnEnd = dictionary['gridColumnEnd'];
    if (gridColumnEnd && gridColumnEnd !== 'auto') {
        cssClasses.push(`md:col-end-${gridColumnEnd}`);
    }

    // Explicit Grid Row Placement (NEW)
    // Allows columns to span multiple rows in the parent Row's grid
    const gridRowStart = dictionary['gridRowStart'];
    if (gridRowStart && gridRowStart !== 'auto') {
        cssClasses.push(`md:row-start-${gridRowStart}`);
    }

    const gridRowEnd = dictionary['gridRowEnd'];
    if (gridRowEnd && gridRowEnd !== 'auto') {
        cssClasses.push(`md:row-end-${gridRowEnd}`);
    }

    // Grid Area Names (NEW)
    // For named grid areas defined in parent Row's gridTemplateAreas
    const gridArea = dictionary['gridArea'];
    if (gridArea && gridArea !== 'none') {
        cssClasses.push(`[grid-area:${gridArea}]`);
    }

    switch (column.displayTemplateKey) {
        case 'DefaultColumn':
            // Content Spacing - Column's internal content spacing
            // Column uses grid internally to stack components vertically
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

            // Justify Content - Horizontal alignment of content within the column
            switch (dictionary['justifyContent']) {
                case 'center':
                    cssClasses.push('justify-center justify-items-center');
                    break;
                case 'end':
                    cssClasses.push('justify-end justify-items-end');
                    break;
                default:
                    cssClasses.push('justify-start justify-items-start');
                    break;
            }

            // Align Content - Vertical alignment of content within the column
            switch (dictionary['alignContent']) {
                case 'center':
                    cssClasses.push('content-center items-center');
                    break;
                case 'end':
                    cssClasses.push('content-end items-end');
                    break;
                default:
                    cssClasses.push('content-start items-start');
                    break;
            }

            // Visibility Controls - Responsive visibility
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

            // Minimum Width - Ensures column doesn't shrink below a certain width
            switch (dictionary['minWidth']) {
                case 'small':
                    cssClasses.push('lg:min-w-[24rem]');
                    break;
                case 'medium':
                    cssClasses.push('lg:min-w-[48rem]');
                    break;
                case 'large':
                    cssClasses.push('lg:min-w-[64rem]');
                    break;
            }

            // Background color is now handled by globalStylesHelper

            // Overflow Handling
            cssClasses.push('relative top-0');
            let useChildContainer = false;
            switch (dictionary['overflow']) {
                case 'right':
                    useChildContainer = true;
                    cssClasses.push('left-0');
                    break;
                case 'left':
                    useChildContainer = true;
                    cssClasses.push('right-0');
                    break;
                case 'clip':
                    cssClasses.push('overflow-hidden');
                    break;
            }

            break;
        case 'CardColumn':
            // CardColumn supports grid span and custom background colors
            // Apply grid span (already handled above)

            // Card-specific background colors
            switch (dictionary['colBackgroundColor']) {
                case 'white':
                    cssClasses.push('bg-white');
                    break;
                case 'blue':
                    cssClasses.push('bg-blue-500');
                    break;
                case 'dark_blue':
                    cssClasses.push('bg-blue-900');
                    break;
                case 'orange':
                    cssClasses.push('bg-orange-500');
                    break;
                case 'green':
                    cssClasses.push('bg-green-500');
                    break;
                case 'red':
                    cssClasses.push('bg-red-500');
                    break;
                case 'purple':
                    cssClasses.push('bg-purple-500');
                    break;
            }

            // Item ordering on small screens
            switch (dictionary['itemOrderOnSmallScreen']) {
                case 'last':
                    cssClasses.push('order-last md:order-none');
                    break;
                default:
                    // normal - no additional classes needed
                    break;
            }

            break;
        default:
            cssClasses.push('vb:NoStyles');
            break;
    }

    return cssClasses;
}
