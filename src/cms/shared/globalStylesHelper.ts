import type {
    DisplaySettingsFragment,
    CompositionStructureNode,
    Maybe,
} from '../../../__generated/sdk.ts';

import { getDictionaryFromDisplaySettings } from '../../graphql/shared/displaySettingsHelpers.ts';
import { getBackgroundColorClass as getCentralizedBgColor, getTextColorClass as getCentralizedTextColor } from './styleHelpers/colorHelpers.ts';

/**
 * Get background color class based on style setting
 * Supports both 'backgroundColor' and 'sectionColor' keys
 * WRAPPER: Delegates to centralized colorHelpers
 */
export function getBackgroundColorClass(dictionary: Record<string, string>): string {
    // Check both possible keys for background color
    const colorValue = dictionary['backgroundColor'] || dictionary['sectionColor'];
    return getCentralizedBgColor(colorValue);
}

/**
 * Get text color class based on background color setting
 * Maps background colors to their corresponding content colors
 * WRAPPER: Delegates to centralized colorHelpers
 */
export function getTextColorClass(dictionary: Record<string, string>): string {
    const colorValue = dictionary['backgroundColor'] || dictionary['sectionColor'];
    return getCentralizedTextColor(colorValue);
}

export function getGlobalStyles(component: 
        | Maybe<Maybe<DisplaySettingsFragment>>[]
        | CompositionStructureNode
        | undefined
        | null) {

    // Handle null or undefined component
    if (!component) {
        return [];
    }

    var settings;
    if ((component as CompositionStructureNode).displaySettings) {
        settings = (component as CompositionStructureNode).displaySettings as DisplaySettingsFragment[]
    } else {
        settings = (component as DisplaySettingsFragment[]);
    }

    const dictionary = getDictionaryFromDisplaySettings(settings);

    let cssClasses: string[] = [];

    // Add background color using the centralized function
    const backgroundColorClass = getBackgroundColorClass(dictionary);
    if (backgroundColorClass) {
        cssClasses.push(backgroundColorClass);
    }

    // Add text color based on background color
    const textColorClass = getTextColorClass(dictionary);
    if (textColorClass) {
        cssClasses.push(textColorClass);
    }

    return cssClasses;
}
