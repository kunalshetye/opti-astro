import type {
    DisplaySettingsFragment,
    CompositionStructureNode,
    Maybe,
} from '../../../__generated/sdk.ts';

import { getDictionaryFromDisplaySettings } from '../../graphql/shared/displaySettingsHelpers.ts';

/**
 * Get background color class based on style setting
 * Supports both 'backgroundColor' and 'sectionColor' keys
 */
export function getBackgroundColorClass(dictionary: Record<string, string>): string {
    // Check both possible keys for background color
    const colorValue = dictionary['backgroundColor'] || dictionary['sectionColor'];
    
    switch (colorValue) {
        case 'transparent':
            return ''; // No background color applied
        case 'base_100':
            return 'bg-base-100';
        case 'base_200':
            return 'bg-base-200';
        case 'base_300':
            return 'bg-base-300';
        case 'primary':
            return 'bg-primary';
        case 'secondary':
            return 'bg-secondary';
        case 'accent':
            return 'bg-accent';
        case 'neutral':
            return 'bg-neutral';
        case 'info':
            return 'bg-info';
        case 'success':
            return 'bg-success';
        case 'warning':
            return 'bg-warning';
        case 'error':
            return 'bg-error';
        default:
            return ''; // No background color applied
    }
}

export function getGlobalStyles(component: 
        | Maybe<Maybe<DisplaySettingsFragment>>[]
        | CompositionStructureNode
        | undefined
        | null) {

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

    return cssClasses;
}
