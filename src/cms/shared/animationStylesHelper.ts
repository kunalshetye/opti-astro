import type { DisplaySettingsFragment, CompositionStructureNode } from '../../../__generated/sdk';
import { getDictionaryFromDisplaySettings } from '../../graphql/shared/displaySettingsHelpers';

export interface animationStylesConfig {
    aosAnimationClass: string;
}

const aosAnimationClassMap: Record<string, string> = {
    'none': '',
    'fade_up': 'fade-up',
    'fade_down': 'fade-down',
    'fade_left': 'fade-left',
    'fade_right': 'fade-right',
    'fade_up_right': 'fade-up-right',
    'fade_up_left': 'fade-up-left',
    'fade_down_right': 'fade-down-right',
    'fade_down_left': 'fade-down-left',
    'flip_left': 'flip-left',
    'flip_right': 'flip-right',
    'flip_up': 'flip-up',
    'flip_down': 'flip-down',
    'slide_left': 'slide-left',
    'slide_right': 'slide-right',
    'slide_up': 'slide-up',
    'slide_down': 'slide-down',
    'zoom_in': 'zoom-in',
    'zoom_in_up': 'zoom-in-up',
    'zoom_in_down': 'zoom-in-down',
    'zoom_in_left': 'zoom-in-left',
    'zoom_in_right': 'zoom-in-right',
    'zoom_out': 'zoom-out',
    'zoom_out_up': 'zoom-out-up',
    'zoom_out_down': 'zoom-out-down',
    'zoom_out_left': 'zoom-out-left',
    'zoom_out_right': 'zoom-out-right'
};

export function getAnimationStyles(row: CompositionStructureNode) {
    const displaySettings = row.displaySettings;
    const settingsDict = getDictionaryFromDisplaySettings(displaySettings);

    return {
        aosAnimationClass: aosAnimationClassMap[settingsDict['aosAnimation']] || ''
    };
}
