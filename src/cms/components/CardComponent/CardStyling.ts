import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getHoverTextColorClass(displaySettings: DisplaySettingsFragment[]): string {
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    const colorValue = dictionary['backgroundColor'] || dictionary['sectionColor'];

    switch (colorValue) {
        case 'primary':   return 'group-hover:text-primary-content';
        case 'secondary': return 'group-hover:text-secondary-content';
        case 'accent':    return 'group-hover:text-accent-content';
        case 'neutral':   return 'group-hover:text-neutral-content';
        case 'info':      return 'group-hover:text-info-content';
        case 'success':   return 'group-hover:text-success-content';
        case 'warning':   return 'group-hover:text-warning-content';
        case 'error':     return 'group-hover:text-error-content';
        case 'base_100':
        case 'base_200':
        case 'base_300':  return 'group-hover:text-base-content';
        default:          return '';
    }
}

export function getBgFillClasses(displaySettings: DisplaySettingsFragment[]): string | null {
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    const hoverEffect = dictionary['backgroundColorHoverEffect'];

    if (!hoverEffect || hoverEffect === 'always') return null;

    const colorValue = dictionary['backgroundColor'] || dictionary['sectionColor'];
    if (!colorValue || colorValue === 'transparent') return null;

    const bgColorMap: Record<string, string> = {
        'base_100': 'bg-base-100',
        'base_200': 'bg-base-200',
        'base_300': 'bg-base-300',
        'primary': 'bg-primary',
        'secondary': 'bg-secondary',
        'accent': 'bg-accent',
        'neutral': 'bg-neutral',
        'info': 'bg-info',
        'success': 'bg-success',
        'warning': 'bg-warning',
        'error': 'bg-error',
    };

    const bgClass = bgColorMap[colorValue];
    if (!bgClass) return null;

    if (hoverEffect === 'on_hover') {
        return `${bgClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out`;
    }

    const originMap: Record<string, string> = {
        'up_left': 'origin-bottom-right',
        'up_right': 'origin-bottom-left',
        'down_right': 'origin-top-left',
        'down_left': 'origin-top-right',
    };

    const originClass = originMap[hoverEffect];
    if (!originClass) return null;

    return `${bgClass} ${originClass} scale-0 group-hover:scale-100 transition-transform duration-500 ease-out`;
}

export function getCardStyles(_displaySettings: DisplaySettingsFragment[]): {
} {
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
