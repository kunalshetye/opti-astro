// @ts-nocheck

import type { CompositionStructureNode } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getRowStyles(row: CompositionStructureNode) {
    const displaySettings = row.displaySettings;
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);

    enum RowFromClasses {
        md = 'md:flex-row',
        lg = 'lg:flex-row',
        xl = 'xl:flex-row',
    }

    enum ContentSpacingClasses {
        small = 'gap-2',
        medium = 'gap-4',
        large = 'gap-4 lg:gap-8',
        xl = 'gap-4 lg:gap-24',
        xxl = 'gap-4 lg:gap-72',
        none = 'gap-0',
    }

    enum JustifyContentClasses {
        center = 'justify-center',
        end = 'justify-end',
        start = 'justify-start',
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

    let cssClasses = [];
    // Apply width classes if specified, otherwise inherit from section
    if (dictionary['rowWidth'] && dictionary['rowWidth'] !== 'inherit') {
        cssClasses.push(RowWidthClasses[dictionary['rowWidth']] ?? '');
    }
    cssClasses.push(ContentSpacingClasses[dictionary['contentSpacing']] ?? '');
    cssClasses.push(JustifyContentClasses[dictionary['justifyContent']] ?? '');
    cssClasses.push(AlignContentClasses[dictionary['alignContent']] ?? '');
    cssClasses.push(
        VerticalSpacingClasses[dictionary['verticalSpacing']] ?? ''
    );
    cssClasses.push(RowFromClasses[dictionary['showAsRowFrom']] ?? '');
    
    // Add responsive vertical alignment based on showAsRowFrom breakpoint
    const rowBreakpoint = dictionary['showAsRowFrom'] ?? 'md';
    const alignItems = dictionary['alignItems'];
    if (alignItems && alignItems !== 'start') {
        const alignItemsClass = AlignItemsClasses[alignItems];
        if (alignItemsClass) {
            // Apply alignment only when in row mode (horizontal layout)
            cssClasses.push(`${rowBreakpoint}:${alignItemsClass}`);
        }
    }
    // Background color is now handled by globalStylesHelper
    return cssClasses;
}
