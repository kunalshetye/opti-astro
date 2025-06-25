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

    enum VerticalSpacingClasses {
        small = 'my-2',
        medium = 'my-4',
        large = 'my-8',
        verylarge = 'lg:my-40 my-20',
        none = 'my-0',
    }

    enum BackgroundColorClasses {
        base_100 = 'bg-base-100',
        base_200 = 'bg-base-200',
        base_300 = 'bg-base-300',
        primary = 'bg-primary',
        secondary = 'bg-secondary',
        accent = 'bg-accent',
        neutral = 'bg-neutral',
        info = 'bg-info',
        success = 'bg-success',
        warning = 'bg-warning',
        error = 'bg-error',
    }

    let cssClasses = [];
    cssClasses.push(ContentSpacingClasses[dictionary['contentSpacing']] ?? '');
    cssClasses.push(JustifyContentClasses[dictionary['justifyContent']] ?? '');
    cssClasses.push(AlignContentClasses[dictionary['alignContent']] ?? '');
    cssClasses.push(
        VerticalSpacingClasses[dictionary['verticalSpacing']] ?? ''
    );
    cssClasses.push(RowFromClasses[dictionary['showAsRowFrom']] ?? '');
    cssClasses.push(BackgroundColorClasses[dictionary['backgroundColor']] ?? '');
    return cssClasses;
}
