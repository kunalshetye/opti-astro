import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';
import { getTextAlignmentClass, getTextTransformClass, getTextColorClass } from '../../shared/styleHelpers/index.ts';

export function getHeadingElementStyles(
    displaySettings: DisplaySettingsFragment[]
): string[] {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);
    const cssClasses: string[] = [];

    // Text alignment with margin utilities
    const textAlign = settings['textAlign'];
    const textAlignClass = getTextAlignmentClass(textAlign);
    if (textAlignClass) {
        cssClasses.push(textAlignClass);
        // Add margin utilities based on alignment
        if (textAlign === 'left') cssClasses.push('mr-auto');
        else if (textAlign === 'center') cssClasses.push('mx-auto');
        else if (textAlign === 'right') cssClasses.push('ml-auto');
    }

    // Text transform (support both 'textTransform' and legacy 'transform')
    const textTransformClass = getTextTransformClass(settings['textTransform'] || settings['transform']);
    if (textTransformClass) {
        cssClasses.push(textTransformClass);
    }

    // Text color (support both base_100 and legacy base100)
    const color = settings['color'];
    const normalizedColor = color?.replace(/base(\d+)/, 'base_$1'); // Convert base100 → base_100
    const textColorClass = getTextColorClass(normalizedColor);
    if (textColorClass) {
        cssClasses.push(textColorClass);
    }

    return cssClasses;
}
