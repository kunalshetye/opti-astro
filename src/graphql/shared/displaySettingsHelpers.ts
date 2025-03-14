import type {
    CompositionDisplaySetting,
    DisplaySettingsFragment,
    Maybe,
} from '../../../__generated/sdk.ts';

export function getDictionaryFromDisplaySettings(
    displaySettings:
        | Maybe<Maybe<DisplaySettingsFragment>>[]
        | Maybe<Maybe<CompositionDisplaySetting>>[]
        | undefined
        | null
): Record<string, string> {
    const dictionary: Record<string, string> = {};
    if (dictionary === undefined || dictionary === null) return dictionary;
    displaySettings?.forEach((setting) => {
        if (setting?.key && setting?.value) {
            dictionary[setting.key] = setting.value;
        }
    });
    return dictionary;
}
