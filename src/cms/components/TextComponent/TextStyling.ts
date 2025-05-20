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
    return cssClasses;
}
