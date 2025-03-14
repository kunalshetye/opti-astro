import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getHeadingElementStyles(
    displaySettings: DisplaySettingsFragment[]
): string[] {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);
    let cssClasses: string[] = [];
    switch (settings['textAlign']) {
        case 'left':
            cssClasses.push('text-left mr-auto');
            break;
        case 'center':
            cssClasses.push('text-center mx-auto');
            break;
        case 'right':
            cssClasses.push('text-right ml-auto');
            break;
        case 'justify':
            cssClasses.push('text-justify');
            break;
        default:
            break;
    }
    switch (settings['transform']) {
        case 'uppercase':
            cssClasses.push('uppercase');
            break;
        case 'lowercase':
            cssClasses.push('lowercase');
            break;
        case 'capitalize':
            cssClasses.push('capitalize');
            break;
    }
    switch (settings['headingType']) {
        case 'h1':
            cssClasses.push('font-bold my-0');
            cssClasses.push('text-[4.8rem]');
            cssClasses.push('lg:text-[6.4rem]');
            cssClasses.push('xl:text-[7.2rem]');
            break;
        case 'h2':
            cssClasses.push('font-bold my-0');
            cssClasses.push('text-[4.2rem]');
            cssClasses.push('lg:text-[4.8rem]');
            cssClasses.push('xl:text-[6.4rem]');
            break;
        case 'h3':
            cssClasses.push('font-bold my-0');
            cssClasses.push('text-[3.6rem]');
            cssClasses.push('lg:text-[4.2rem]');
            cssClasses.push('xl:text-[4.8rem]');
            break;
        case 'h4':
            cssClasses.push('font-bold my-0');
            cssClasses.push('text-[3.6rem]');
            cssClasses.push('lg:text-[3.8rem]');
            cssClasses.push('xl:text-[4.2rem]');
            break;
        case 'h5':
            cssClasses.push('font-bold my-0');
            cssClasses.push('text-[3.6rem]');
            cssClasses.push('lg:text-[3.0rem]');
            cssClasses.push('xl:text-[3.2rem]');
            break;
        case 'h6':
            cssClasses.push('font-bold my-0');
            break;
        case 'plain':
            cssClasses.push('my-0');
            break;
    }
    return cssClasses;
}
