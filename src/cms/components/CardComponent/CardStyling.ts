import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getCardStyles(displaySettings: DisplaySettingsFragment[]): {
} {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);
    
    let cssClasses: string[] = [];

    // Note: button styles managed via: src\cms\components\ButtonComponent\ButtonStyling.ts

    return cssClasses;
}

export function getCardTextAlignmentStyle(displaySettings: DisplaySettingsFragment[]): string {
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    const textAlign = dictionary['textAlign'];
    
    switch (textAlign) {
        case 'left': return 'text-left';
        case 'center': return 'text-center';
        case 'right': return 'text-right';
        case 'justify': return 'text-justify';
        default: return 'text-left';
    }
}

export function getCardHeaderStyles(displaySettings: DisplaySettingsFragment[]): string {
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    const transformHeader = dictionary['transformHeader'];
    
    switch (transformHeader) {
        case 'uppercase': return 'uppercase';
        case 'lowercase': return 'lowercase';
        case 'capitalize': return 'capitalize';
        case 'normal_case':
        default: return 'normal-case';
    }
}

export function getAssetVerticalAlignClass(displaySettings: DisplaySettingsFragment[]): string {
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    const assetVerticalAlign = dictionary['assetVerticalAlign'];
    
    switch (assetVerticalAlign) {
        case 'start': return 'self-start';
        case 'end': return 'self-end';
        case 'center':
        default: return 'self-center';
    }
}

export function getContentVerticalAlignClass(displaySettings: DisplaySettingsFragment[]): string {
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    const contentVerticalAlign = dictionary['contentVerticalAlign'];
    
    switch (contentVerticalAlign) {
        case 'start': return 'self-start';
        case 'end': return 'self-end';
        case 'center':
        default: return 'self-center';
    }
}
