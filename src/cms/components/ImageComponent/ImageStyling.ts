import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getImageElementStyles(
    displaySettings: DisplaySettingsFragment[]
): string[] {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);

    const displayAs = settings['displayAs'] ?? 'image';

    // If displaying as icon, use icon-specific styles
    if (displayAs === 'icon') {
        return getIconStyles(settings);
    }

    // Otherwise, use regular image styles
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

function getIconStyles(settings: Record<string, string>): string[] {
    const cssClasses: string[] = ['inline-block object-contain not-prose'];

    // Icon size classes
    const iconSizeClasses = {
        xs: 'w-4 h-4',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
        xxl: 'w-24 h-24',
        xxxl: 'w-32 h-32',
    } as const;

    const iconSize = settings['iconSize'] ?? 'md';
    cssClasses.push(iconSizeClasses[iconSize as keyof typeof iconSizeClasses] ?? iconSizeClasses.md);

    // Icon shape classes
    const iconShapeClasses = {
        none: '',
        rounded: 'rounded-lg',
        circle: 'rounded-full',
        square: 'rounded-none',
    } as const;

    const iconShape = settings['iconShape'] ?? 'none';
    if (iconShape !== 'none') {
        cssClasses.push(iconShapeClasses[iconShape as keyof typeof iconShapeClasses] ?? '');
    }

    // Add hover effect classes if needed
    cssClasses.push('transition-transform hover:scale-110');

    return cssClasses;
}
