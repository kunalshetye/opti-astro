import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getHeroStyles(displaySettings: DisplaySettingsFragment[]): {
    backgroundOpacityClass: string;
    textClasses: string[];
    justifyClass: string;
    heightClass: string;
    imageFitClass: string;
} {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);
    const backgroundTintLevel = settings['background_tint_level'] ?? '60';
    let backgroundOpacityClass = '';
    switch (backgroundTintLevel) {
        case 'o_0':
            backgroundOpacityClass = 'bg-neutral/0';
            break;
        case 'o_10':
            backgroundOpacityClass = 'bg-neutral/10';
            break;
        case 'o_20':
            backgroundOpacityClass = 'bg-neutral/20';
            break;
        case 'o_30':
            backgroundOpacityClass = 'bg-neutral/30';
            break;
        case 'o_40':
            backgroundOpacityClass = 'bg-neutral/40';
            break;
        case 'o_50':
            backgroundOpacityClass = 'bg-neutral/50';
            break;
        case 'o_60':
            backgroundOpacityClass = 'bg-neutral/60';
            break;
        case 'o_70':
            backgroundOpacityClass = 'bg-neutral/70';
            break;
        case 'o_80':
            backgroundOpacityClass = 'bg-neutral/80';
            break;
        case 'o_90':
            backgroundOpacityClass = 'bg-neutral/90';
            break;
        case 'o_100':
            backgroundOpacityClass = 'bg-neutral/100';
            break;
        default:
            backgroundOpacityClass = 'bg-neutral/60';
            break;
    }

    const textPlacemenTintLevel = settings['text_placement'] ?? 'center';
    let justifyClass = '';
    let textClasses = [];
    switch (textPlacemenTintLevel) {
        case 'left':
            textClasses.push('text-left');
            justifyClass = 'justify-start';
            break;
        case 'right':
            textClasses.push('text-right');
            justifyClass = 'justify-end';
            break;
        default:
            textClasses.push('text-center');
            justifyClass = 'justify-center';
            break;
    }

    const textColor = settings['text_color'] ?? 'white';
    switch (textColor) {
        case 'white':
            textClasses.push('text-base-100');
            break;
        case 'black':
            textClasses.push('text-base-content');
            break;
        default:
            textClasses.push('text-base-100');
            break;
    }
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
    const imageFit = settings['image_fit'] ?? 'object_cover';
    let imageFitClass = '';
    switch (imageFit) {
        case 'object_cover':
            imageFitClass = 'object-cover';
            break;
        case 'object_contain':
            imageFitClass = 'object-contain';
            break;
        case 'object_fill':
            imageFitClass = 'object-fill';
            break;
        default:
            imageFitClass = 'object-cover';
            break;
    }
    
    return { backgroundOpacityClass, textClasses, justifyClass, heightClass, imageFitClass };
}
