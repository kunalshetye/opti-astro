import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';
import { getBorderRadiusClass, getAspectRatioClass } from '../../shared/styleHelpers/index.ts';

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
    const cssClasses: string[] = ['relative w-full object-cover not-prose'];

    // Aspect ratio using centralized helper
    const aspectRatioClass = getAspectRatioClass(settings['aspectRatio']);
    if (aspectRatioClass) {
        cssClasses.push(aspectRatioClass);
    }

    // Border radius using centralized helper (support both 'borderRadius' and legacy 'roundedCorners')
    const borderRadiusClass = getBorderRadiusClass(
        settings['borderRadius'] || settings['roundedCorners'],
        'image'
    );
    if (borderRadiusClass) {
        cssClasses.push(borderRadiusClass);
    }

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
