import type { CompositionStructureNode } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';
import {
    getGapClass,
    getHorizontalAlignmentClass,
    getVerticalAlignmentClass,
    getMarginClass,
} from '../../shared/styleHelpers/index.ts';

export function getSimpleRowStyles(row: CompositionStructureNode) {
    const displaySettings = row.displaySettings;
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);

    let cssClasses = [];

    // Width is always inherited from Section (no override option)

    // Unified gap (applies to both horizontal and vertical)
    const gap = dictionary['gap'] ?? 'medium';
    const gapClass = getGapClass(gap, 'both') || 'gap-4';
    cssClasses.push(gapClass);

    // Grid columns - either fixed column count or traditional 12-column grid
    const showAsRowFrom = dictionary['showAsRowFrom'] ?? 'md';
    const columnsPerRow = dictionary['columnsPerRow'] ?? 'auto';

    if (columnsPerRow === 'auto') {
        // Traditional 12-column grid where columns control their own spans
        cssClasses.push(`grid-cols-1 ${showAsRowFrom}:grid-cols-12`);
    } else {
        // Fixed number of equal-width columns
        // Convert col1, col2, col3, etc. to actual numbers
        const numColumns = columnsPerRow.replace('col', '');
        cssClasses.push(`grid-cols-1 ${showAsRowFrom}:grid-cols-${numColumns}`);
    }

    // Simple grid flow (always row)
    cssClasses.push('grid-flow-row');

    // Horizontal alignment using centralized helper
    const horizontalAlignment = dictionary['horizontalAlignment'] ?? 'start';
    const horizontalAlignClass = getHorizontalAlignmentClass(horizontalAlignment);
    cssClasses.push(horizontalAlignClass);

    // Vertical alignment (responsive - only applies when in grid mode)
    const verticalAlignment = dictionary['verticalAlignment'] ?? 'stretch';
    const verticalAlignClass = getVerticalAlignmentClass(verticalAlignment);
    if (verticalAlignClass) {
        cssClasses.push(`${showAsRowFrom}:${verticalAlignClass}`);
    }

    // Vertical spacing (margin) using centralized helper
    const verticalSpacing = dictionary['verticalSpacing'] ?? 'medium';
    const verticalSpacingClass = getMarginClass(verticalSpacing, 'y') || 'my-4';
    cssClasses.push(verticalSpacingClass);

    // Background color is now handled by globalStylesHelper
    return cssClasses;
}
