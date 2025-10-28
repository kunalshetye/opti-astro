// @ts-nocheck

import type { CompositionStructureNode } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getRowStyles(row: CompositionStructureNode) {
    const displaySettings = row.displaySettings;
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);

    // COLUMN LAYOUT OPTIONS - Easy column configurations
    enum ColumnLayoutClasses {
        'col12_grid' = 'grid-cols-1 md:grid-cols-12', // Default flexible grid (was: 12-column-grid)
        'col_1' = 'grid-cols-1', // (was: 1-column)
        'col_2' = 'grid-cols-1 md:grid-cols-2', // (was: 2-columns)
        'col_3' = 'grid-cols-1 md:grid-cols-3', // (was: 3-columns)
        'col_4' = 'grid-cols-1 md:grid-cols-4', // (was: 4-columns)
        'col_6' = 'grid-cols-1 md:grid-cols-6', // (was: 6-columns)
        'auto_fit' = 'grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]', // (was: auto-fit)
    }

    // ROW GAP OPTIONS - Vertical spacing between rows
    enum RowGapClasses {
        none = 'gap-y-0',
        small = 'gap-y-2',
        medium = 'gap-y-4',
        large = 'gap-y-6',
        xl = 'gap-y-8',
        xxl = 'gap-y-12',
        xxxl = 'gap-y-16',
        xxxxl = 'gap-y-24',
    }

    // COLUMN GAP OPTIONS - Horizontal spacing between columns
    enum ColumnGapClasses {
        none = 'gap-x-0',
        small = 'gap-x-2',
        medium = 'gap-x-4',
        large = 'gap-x-6',
        xl = 'gap-x-8',
        xxl = 'gap-x-12',
        xxxl = 'gap-x-16',
        xxxxl = 'gap-x-24',
    }

    // RESPONSIVE COLUMN OVERRIDES - Mobile/Tablet/Desktop specific columns
    enum MobileColumnsClasses {
        'c1' = 'sm:grid-cols-1', // (was: 1)
        'c2' = 'sm:grid-cols-2', // (was: 2)
        'c3' = 'sm:grid-cols-3', // (was: 3)
    }

    enum TabletColumnsClasses {
        'c2' = 'md:grid-cols-2', // (was: 2)
        'c3' = 'md:grid-cols-3', // (was: 3)
        'c4' = 'md:grid-cols-4', // (was: 4)
    }

    enum DesktopColumnsClasses {
        'c3' = 'lg:grid-cols-3', // (was: 3)
        'c4' = 'lg:grid-cols-4', // (was: 4)
        'c5' = 'lg:grid-cols-5', // (was: 5)
        'c6' = 'lg:grid-cols-6', // (was: 6)
    }

    // ALIGNMENT OPTIONS - Grid-specific alignment
    enum AlignItemsClasses {
        start = 'items-start',
        center = 'items-center',
        end = 'items-end',
        stretch = 'items-stretch',
    }

    enum JustifyItemsClasses {
        start = 'justify-items-start',
        center = 'justify-items-center',
        end = 'justify-items-end',
        stretch = 'justify-items-stretch',
    }

    enum AlignContentClasses {
        start = 'content-start',
        center = 'content-center',
        end = 'content-end',
        stretch = 'content-stretch',
    }

    enum JustifyContentClasses {
        start = 'justify-start',
        center = 'justify-center',
        end = 'justify-end',
        stretch = 'justify-stretch',
    }

    // VERTICAL SPACING - Margin spacing around the row
    enum VerticalSpacingClasses {
        small = 'my-2',
        medium = 'my-4',
        large = 'my-8',
        verylarge = 'lg:my-40 my-20',
        none = 'my-0',
    }

    // WIDTH OPTIONS - Row width constraints
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

    // Apply column layout (priority feature)
    const columnLayout = dictionary['columnLayout'] || 'col12_grid';
    cssClasses.push(ColumnLayoutClasses[columnLayout] ?? ColumnLayoutClasses['col12_grid']);

    // Apply responsive column overrides if specified
    if (dictionary['mobileColumns']) {
        cssClasses.push(MobileColumnsClasses[dictionary['mobileColumns']] ?? '');
    }
    if (dictionary['tabletColumns']) {
        cssClasses.push(TabletColumnsClasses[dictionary['tabletColumns']] ?? '');
    }
    if (dictionary['desktopColumns']) {
        cssClasses.push(DesktopColumnsClasses[dictionary['desktopColumns']] ?? '');
    }

    // Apply separate row and column gaps
    // Check for new gap settings first, then fall back to legacy contentSpacing
    let rowGap = dictionary['rowGap'];
    let columnGap = dictionary['columnGap'];

    // Backward compatibility: Map old contentSpacing to both gaps if new settings not present
    if (!rowGap && !columnGap && dictionary['contentSpacing']) {
        const legacySpacing = dictionary['contentSpacing'];
        // Map old values to new gap values
        const spacingMap = {
            'none': 'none',
            'small': 'small',
            'medium': 'medium',
            'large': 'large',
            'xl': 'xl',
            'xxl': 'xxl',
        };
        rowGap = spacingMap[legacySpacing] || 'small';
        columnGap = spacingMap[legacySpacing] || 'small';
    }

    // Set default to 'small' if no gap value is provided
    if (!rowGap) {
        rowGap = 'small';
    }
    if (!columnGap) {
        columnGap = 'small';
    }

    cssClasses.push(RowGapClasses[rowGap] ?? '');
    cssClasses.push(ColumnGapClasses[columnGap] ?? '');

    // Apply alignment options
    if (dictionary['alignItems']) {
        cssClasses.push(AlignItemsClasses[dictionary['alignItems']] ?? '');
    }
    if (dictionary['justifyItems']) {
        cssClasses.push(JustifyItemsClasses[dictionary['justifyItems']] ?? '');
    }
    if (dictionary['alignContent']) {
        cssClasses.push(AlignContentClasses[dictionary['alignContent']] ?? '');
    }
    if (dictionary['justifyContent']) {
        cssClasses.push(JustifyContentClasses[dictionary['justifyContent']] ?? '');
    }

    // Apply vertical spacing (margin around the row)
    cssClasses.push(
        VerticalSpacingClasses[dictionary['verticalSpacing']] ?? ''
    );

    // Background color is handled by globalStylesHelper
    return cssClasses;
}
