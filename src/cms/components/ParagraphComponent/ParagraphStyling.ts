import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export interface ParagraphStyleConfig {
    paragraphAlignment: string;
}


const alignmentMap: Record<string, string> = {
    'full_width': 'w-full',
    'centered_large': 'max-w-6xl mx-auto',
    'centered_medium': 'max-w-4xl mx-auto',
    'centered_small': 'max-w-2xl mx-auto'
};

export function getParagraphStyleConfig(
    displaySettings: DisplaySettingsFragment[],
    displayTemplateKey?: string
): ParagraphStyleConfig {
    const settingsDict = getDictionaryFromDisplaySettings(displaySettings);
    
    return {
        // Alignment settings
        paragraphAlignment: alignmentMap[settingsDict['paragraph_alignment']] || 'w-full',
    };
}