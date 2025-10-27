import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';
import {
    getBackgroundTintClasses,
    getTextAlignmentClass,
    getJustifyContentClass,
    getTextColorClass,
    getImageFitClass
} from '../../shared/styleHelpers/index.ts';

export function getHeroStyles(displaySettings: DisplaySettingsFragment[]): {
    backgroundOpacityClass: string;
    textClasses: string[];
    justifyClass: string;
    heightClass: string;
    imageFitClass: string;
} {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);

    // Background tint using centralized helper
    const tintClasses = getBackgroundTintClasses(settings['background_tint_level'], 'neutral');
    const backgroundOpacityClass = tintClasses[0] || 'bg-neutral/60';

    // Text placement and alignment
    const textPlacement = settings['text_placement'] ?? 'center';
    const textClasses: string[] = [];
    const textAlignClass = getTextAlignmentClass(textPlacement);
    if (textAlignClass) {
        textClasses.push(textAlignClass);
    }
    const justifyClass = getJustifyContentClass(textPlacement) || 'justify-center';

    // Text color using centralized helper
    const textColor = settings['text_color'] ?? 'white';
    const textColorClass = getTextColorClass(textColor);
    if (textColorClass) {
        textClasses.push(textColorClass);
    } else if (textColor === 'white') {
        textClasses.push('text-white');
    }

    // Hero height (component-specific)
    const heroHeight = settings['hero_height'] ?? 'h_48rem';
    let heightClass = '';
    switch (heroHeight) {
        case 'h_18rem':
            heightClass = 'h-[18rem]';
            break;
        case 'h_28rem':
            heightClass = 'h-[28rem]';
            break;
        case 'h_38rem':
            heightClass = 'h-[38rem]';
            break;
        case 'h_48rem':
            heightClass = 'h-[48rem]';
            break;
        default:
            heightClass = 'h-[48rem]';
            break;
    }

    // Image fit using centralized helper
    const imageFitClass = getImageFitClass(settings['image_fit']) || 'object-cover';

    return { backgroundOpacityClass, textClasses, justifyClass, heightClass, imageFitClass };
}
