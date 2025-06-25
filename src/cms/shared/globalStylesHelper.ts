import type {
    DisplaySettingsFragment,
    CompositionStructureNode,
    Maybe,
} from '../../../__generated/sdk.ts';

import { getDictionaryFromDisplaySettings } from '../../graphql/shared/displaySettingsHelpers.ts';

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

    // Handle background colors globally for all components
    cssClasses.push(...getBackgroundColorClasses(dictionary));

    return cssClasses;
}

/**
 * Get background color CSS classes based on daisyUI color variables
 * @param dictionary - Display settings dictionary
 * @returns Array of CSS classes for background colors
 */
export function getBackgroundColorClasses(dictionary: Record<string, string>): string[] {
    const backgroundColorKey = dictionary['backgroundColor'] || dictionary['sectionColor'];
    
    if (!backgroundColorKey) {
        return [];
    }

    switch (backgroundColorKey) {
        case 'transparent':
            // No background color applied for transparent
            return [];
        case 'base_100':
            return ['bg-base-100'];
        case 'base_200':
            return ['bg-base-200'];
        case 'base_300':
            return ['bg-base-300'];
        case 'primary':
            return ['bg-primary'];
        case 'secondary':
            return ['bg-secondary'];
        case 'accent':
            return ['bg-accent'];
        case 'neutral':
            return ['bg-neutral'];
        case 'info':
            return ['bg-info'];
        case 'success':
            return ['bg-success'];
        case 'warning':
            return ['bg-warning'];
        case 'error':
            return ['bg-error'];
        default:
            return [];
    }
}