import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';
import { getTextAlignmentClass, getTextTransformClass, getVerticalAlignmentClass } from '../../shared/styleHelpers/index.ts';

export function getCardStyles(displaySettings: DisplaySettingsFragment[]): string[] {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);

    const cssClasses: string[] = [];

    // Note: button styles managed via: src\cms\components\ButtonComponent\ButtonStyling.ts

    return cssClasses;
}

export function getCardTextAlignmentStyle(displaySettings: DisplaySettingsFragment[]): string {
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    return getTextAlignmentClass(dictionary['textAlign']) || 'text-left';
}

export function getCardHeaderStyles(displaySettings: DisplaySettingsFragment[]): string {
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    // Support both 'headerTextTransform' and legacy 'transformHeader'
    const transform = dictionary['headerTextTransform'] || dictionary['transformHeader'];
    return getTextTransformClass(transform) || 'normal-case';
}

export function getAssetVerticalAlignClass(displaySettings: DisplaySettingsFragment[]): string {
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    return getVerticalAlignmentClass(dictionary['assetVerticalAlign'], 'self') || 'self-center';
}

export function getContentVerticalAlignClass(displaySettings: DisplaySettingsFragment[]): string {
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    return getVerticalAlignmentClass(dictionary['contentVerticalAlign'], 'self') || 'self-center';
}
