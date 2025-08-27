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
    switch (settings['color']) {
        case 'primary':
            cssClasses.push('text-primary');
            break;
        case 'secondary':
            cssClasses.push('text-secondary');
            break;
        case 'accent':
            cssClasses.push('text-accent');
            break;
        case 'neutral':
            cssClasses.push('text-neutral');
            break;
        case 'base100':
            cssClasses.push('text-base-100');
            break;
        case 'base200':
            cssClasses.push('text-base-200');
            break;
        case 'base300':
            cssClasses.push('text-base-300');
            break;
        case 'info':
            cssClasses.push('text-info');
            break;
        case 'success':
            cssClasses.push('text-success');
            break;
        case 'warning':
            cssClasses.push('text-warning');
            break;
        case 'error':
            cssClasses.push('text-error');
            break;
    }
    return cssClasses;
}
