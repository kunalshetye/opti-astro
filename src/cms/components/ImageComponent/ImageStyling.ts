import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getImageElementStyles(
    displaySettings: DisplaySettingsFragment[]
): string[] {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);

    const portraitAspectRatioClasses = {
        square: 'aspect-square',
        banner: 'aspect-[1/4]',
        photo: 'aspect-[2/3]',
        monitor: 'aspect-[3/4]',
        widescreen: 'aspect-[9/16]',
    } as const;

    const landscapeAspectRatioClasses = {
        default: 'aspect-auto',
        square: 'aspect-square',
        banner: 'aspect-[4/1]',
        photo: 'aspect-[3/2]',
        monitor: 'aspect-[4/3]',
        widescreen: 'aspect-[16/9]',
    } as const;

    const roundedCornersClasses = {
        small: 'rounded',
        medium: 'rounded-md',
        large: 'rounded-lg',
        xlarge: 'rounded-xl',
        x3large: 'rounded-3xl',
        huge: 'rounded-[40px]',
        xhuge: 'rounded-[80px]',
        full: 'rounded-full',
        none: '',
    } as const;

    const cssClasses: string[] = ['relative w-full object-cover not-prose'];
    const isPortrait = settings['orientation'] == 'portrait';
    cssClasses.push(
        (isPortrait
            ? portraitAspectRatioClasses[settings['aspectRatio'] as keyof typeof portraitAspectRatioClasses]
            : landscapeAspectRatioClasses[settings['aspectRatio'] as keyof typeof landscapeAspectRatioClasses]) ?? ''
    ); //Add aspect ratio

    cssClasses.push(roundedCornersClasses[settings['roundedCorners'] as keyof typeof roundedCornersClasses] ?? ''); // Add rounded corners
    return cssClasses;
}
