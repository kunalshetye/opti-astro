import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getImageElementStyles(
    displaySettings: DisplaySettingsFragment[]
): string[] {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);

    enum portraitAspectRatioClasses {
        square = 'aspect-square',
        banner = 'aspect-[1/4]',
        photo = 'aspect-[2/3]',
        monitor = 'aspect-[3/4]',
        widescreen = 'aspect-[9/16]',
    }

    enum landscapeAspectRatioClasses {
        square = 'aspect-square',
        banner = 'aspect-[4/1]',
        photo = 'aspect-[3/2]',
        monitor = 'aspect-[4/3]',
        widescreen = 'aspect-[16/9]',
    }

    enum roundedCornersClasses {
        small = 'rounded',
        medium = 'rounded-md',
        large = 'rounded-lg',
        huge = 'rounded-[40px]',
        full = 'rounded-full',
        none = '',
    }

    const cssClasses: string[] = ['relative w-full overflow-hidden not-prose'];
    // const isPortrait = displaySettings['orientation'] == 'portrait';
    // cssClasses.push(
    //     (isPortrait
    //         ? portraitAspectRatioClasses[settings['aspectRatio']]
    //         : landscapeAspectRatioClasses[settings['aspectRatio']]) ?? ''
    // ); //Add aspect ratio
    // cssClasses.push(roundedCornersClasses[settings['roundedCorners']] ?? ''); // Add rounded corners
    return cssClasses;
}
