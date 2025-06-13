import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';
import { getAccessibleAnimationClasses } from '../../shared/Animations.ts';

export function getCtaStyles(displaySettings: DisplaySettingsFragment[]): {
    animationClasses: string[];
    staggerDelay: number;
} {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);
    
    let cssClasses: string[] = [];

    // Note: button styles managed via: src\cms\components\ButtonComponent\ButtonStyling.ts

    // Get animation classes from the centralized animation system
    const animationClasses = getAccessibleAnimationClasses(displaySettings);
    
    // Get stagger delay for buttons
    const staggerSetting = settings['button_stagger'] || 'none';
    let staggerDelay = 0;
    
    switch (staggerSetting) {
        case 'short':
            staggerDelay = 100;
            break;
        case 'medium':
            staggerDelay = 200;
            break;
        case 'long':
            staggerDelay = 300;
            break;
        default:
            staggerDelay = 0;
            break;
    }
    
    return {
        animationClasses,
        staggerDelay,
    };
}
