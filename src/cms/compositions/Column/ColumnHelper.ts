import type { CompositionStructureNode } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getColumnStyles(column: CompositionStructureNode) {
    const displaySettings = column.displaySettings;
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    // console.log(column.displayTemplateKey);
    // console.log(dictionary);

    let cssClasses: string[] = [];
    switch (column.displayTemplateKey) {
        case 'DefaultColumn':
            switch (dictionary['contentSpacing']) {
                case 'small':
                    cssClasses.push('gap-2 py-2');
                    break;
                case 'medium':
                    cssClasses.push('gap-4 py-4');
                    break;
                case 'large':
                    cssClasses.push('gap-8 py-8 lg:gap-8 lg:py-8');
                    break;
                case 'xl':
                    cssClasses.push('gap-12 py-12 lg:gap-24 lg:py-24');
                    break;
                case 'xxl':
                    cssClasses.push('gap-16 py-16 lg:gap-72 lg:py-72');
                    break;
                default:
                    cssClasses.push('gap-0 py-0');
                    break;
            }

            switch (dictionary['justifyContent']) {
                case 'center':
                    cssClasses.push('justify-center justify-items-center');
                    break;
                case 'end':
                    cssClasses.push('justify-end justify-items-end');
                    break;
                default:
                    cssClasses.push('justify-start justify-items-start');
                    break;
            }

            switch (dictionary['alignContent']) {
                case 'center':
                    cssClasses.push('content-center items-center');
                    break;
                case 'end':
                    cssClasses.push('content-end items-end');
                    break;
                default:
                    cssClasses.push('content-start items-start');
                    break;
            }

            // switch (dictionary['alignItems']) {
            //     case 'center':
            //         cssClasses.push('items-center');
            //         break;
            //     case 'end':
            //         cssClasses.push('items-end');
            //         break;
            //     default:
            //         cssClasses.push('items-start');
            //         break;
            // }

            switch (dictionary['showFrom']) {
                case 'fromSmall':
                    cssClasses.push('hidden sm:block');
                    break;
                case 'fromMedium':
                    cssClasses.push('hidden md:block');
                    break;
                case 'fromLarge':
                    cssClasses.push('hidden lg:block');
                    break;
            }

            switch (dictionary['minWidth']) {
                case 'small':
                    cssClasses.push('lg:min-w-[24rem]');
                    break;
                case 'medium':
                    cssClasses.push('lg:min-w-[48rem]');
                    break;
                case 'large':
                    cssClasses.push('lg:min-w-[64rem]');
                    break;
            }

            cssClasses.push('relative top-0');
            let useChildContainer = false;
            switch (dictionary['overflow']) {
                case 'right':
                    useChildContainer = true;
                    cssClasses.push('left-0');
                    break;
                case 'left':
                    useChildContainer = true;
                    cssClasses.push('right-0');
                    break;
                case 'clip':
                    cssClasses.push('overflow-hidden');
                    break;
            }

            break;
        default:
            cssClasses.push('vb:NoStyles');
            break;
    }

    return cssClasses;
}
