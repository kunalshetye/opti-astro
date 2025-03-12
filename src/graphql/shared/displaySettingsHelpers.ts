import type { DisplaySettingsFragment } from '../../../__generated/sdk.ts';

export function getDictionaryFromDisplaySettings(
    displaySettings: DisplaySettingsFragment[]
): Record<string, string> {
    const dictionary: Record<string, string> = {};
    displaySettings?.forEach((setting) => {
        // @ts-ignore
        dictionary[setting.key] = setting.value;
    });
    return dictionary;
}
