import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';
import { getAccessibleAnimationClasses } from '../../shared/Animations.ts';

export function getCardStyles(displaySettings: DisplaySettingsFragment[]): {
    animationClasses: string[];
} {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);
    
    let cssClasses: string[] = [];

    // Note: button styles managed via: src\cms\components\ButtonComponent\ButtonStyling.ts
    
    // Get animation classes from the centralized animation system
    const animationClasses = getAccessibleAnimationClasses(displaySettings);

    return { animationClasses };
}
