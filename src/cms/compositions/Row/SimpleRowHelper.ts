import type { CompositionStructureNode } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getSimpleRowStyles(row: CompositionStructureNode) {
    const displaySettings = row.displaySettings;
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);

    enum GapClasses {
        none = 'gap-0',
        small = 'gap-2',
        medium = 'gap-4',
        large = 'gap-8',
        xl = 'gap-12',
        xxl = 'gap-24',
    }

    enum HorizontalAlignmentClasses {
        center = 'justify-items-center',
        end = 'justify-items-end',
        start = 'justify-items-start',
    }

    enum VerticalAlignmentClasses {
        start = 'items-start',
        center = 'items-center',
        end = 'items-end',
        stretch = 'items-stretch',
    }

    enum VerticalSpacingClasses {
        small = 'my-2',
        medium = 'my-4',
        large = 'my-8',
        verylarge = 'lg:my-40 my-20',
        none = 'my-0',
    }

    let cssClasses = [];

    // Width is always inherited from Section (no override option)

    // Unified gap (applies to both horizontal and vertical)
    const gap = dictionary['gap'] ?? 'medium';
    cssClasses.push(GapClasses[gap as keyof typeof GapClasses] ?? 'gap-4');

    // Fixed 12-column grid (no template mode options)
    const showAsRowFrom = dictionary['showAsRowFrom'] ?? 'md';
    cssClasses.push(`grid-cols-1 ${showAsRowFrom}:grid-cols-12`);

    // Simple grid flow (always row)
    cssClasses.push('grid-flow-row');

    // Horizontal alignment
    const horizontalAlignment = dictionary['horizontalAlignment'] ?? 'start';
    cssClasses.push(HorizontalAlignmentClasses[horizontalAlignment as keyof typeof HorizontalAlignmentClasses] ?? 'justify-items-start');

    // Vertical alignment (responsive - only applies when in grid mode)
    const verticalAlignment = dictionary['verticalAlignment'] ?? 'stretch';
    const verticalAlignmentClass = VerticalAlignmentClasses[verticalAlignment as keyof typeof VerticalAlignmentClasses];
    if (verticalAlignmentClass) {
        cssClasses.push(`${showAsRowFrom}:${verticalAlignmentClass}`);
    }

    // Vertical spacing (margin)
    const verticalSpacing = dictionary['verticalSpacing'] ?? 'medium';
    cssClasses.push(VerticalSpacingClasses[verticalSpacing as keyof typeof VerticalSpacingClasses] ?? 'my-4');

    // Background color is now handled by globalStylesHelper
    return cssClasses;
}
