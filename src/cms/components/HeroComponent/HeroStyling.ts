import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getHeroStyles(displaySettings: DisplaySettingsFragment[]): {
    backgroundOpacityClass: string;
    textClasses: string[];
    justifyClass: string;
    heightClass: string;
} {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);
    const backgroundTintLevel = settings['background_tint_level'] ?? '60';
    let backgroundOpacityClass = '';
    switch (backgroundTintLevel) {
        case 'o_0':
            backgroundOpacityClass = 'bg-black/0';
            break;
        case 'o_10':
            backgroundOpacityClass = 'bg-black/10';
            break;
        case 'o_20':
            backgroundOpacityClass = 'bg-black/20';
            break;
        case 'o_30':
            backgroundOpacityClass = 'bg-black/30';
            break;
        case 'o_40':
            backgroundOpacityClass = 'bg-black/40';
            break;
        case 'o_50':
            backgroundOpacityClass = 'bg-black/50';
            break;
        case 'o_60':
            backgroundOpacityClass = 'bg-black/60';
            break;
        case 'o_70':
            backgroundOpacityClass = 'bg-black/70';
            break;
        case 'o_80':
            backgroundOpacityClass = 'bg-black/80';
            break;
        case 'o_90':
            backgroundOpacityClass = 'bg-black/90';
            break;
        case 'o_100':
            backgroundOpacityClass = 'bg-black/100';
            break;
        default:
            backgroundOpacityClass = 'bg-black/60';
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
            textClasses.push('text-white');
            break;
        case 'black':
            textClasses.push('text-black');
            break;
        default:
            textClasses.push('text-white');
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
    return { backgroundOpacityClass, textClasses, justifyClass, heightClass };
}
