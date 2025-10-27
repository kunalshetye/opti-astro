import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';
import { getButtonClasses, getTextTransformClass } from '../../shared/styleHelpers/index.ts';

export function getButtonStyles(displaySettings: DisplaySettingsFragment[], needButtonType: Boolean = true): string[] {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);

    const cssClasses: string[] = [];

    // Button text transform
    const textTransformClass = getTextTransformClass(settings['textTransform'] || settings['transform']);
    if (textTransformClass) {
        cssClasses.push(textTransformClass);
    }

    // All button styling using centralized helpers
    const buttonClasses = getButtonClasses({
        buttonStyle: settings['buttonStyle'],
        buttonType: settings['buttonType'],
        buttonSize: settings['buttonSize'],
        buttonWidth: settings['buttonWidth'],
        buttonRadius: settings['buttonRadius'],
        buttonAction: settings['buttonAction']
    }, { includeType: needButtonType });

    cssClasses.push(...buttonClasses);

    return cssClasses;
}
