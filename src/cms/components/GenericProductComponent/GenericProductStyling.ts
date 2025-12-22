import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

/**
 * Get image aspect ratio classes based on display settings
 */
export function getImageAspectRatioClasses(
    displaySettings: DisplaySettingsFragment[]
): string {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);

    const imageAspect = settings['imageAspect'] ?? 'square';

    const aspectRatioClasses: Record<string, string> = {
        square: 'aspect-square',
        portrait: 'aspect-[3/4]',
        landscape: 'aspect-[4/3]',
    };

    return aspectRatioClasses[imageAspect] ?? 'aspect-square';
}

/**
 * Get card style classes based on display settings
 */
export function getCardStyleClasses(
    displaySettings: DisplaySettingsFragment[]
): string {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);

    const cardStyle = settings['cardStyle'] ?? 'elevated';

    const cardStyleClasses: Record<string, string> = {
        elevated: 'shadow-xl hover:shadow-2xl',
        bordered: 'border-2 border-base-300',
        flat: 'shadow-none',
    };

    return cardStyleClasses[cardStyle] ?? 'shadow-xl hover:shadow-2xl';
}

/**
 * Get button type class based on display settings
 */
export function getButtonTypeClass(
    displaySettings: DisplaySettingsFragment[]
): string {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);

    const buttonStyle = settings['buttonStyle'] ?? 'primary';

    const buttonTypeClasses: Record<string, string> = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        accent: 'btn-accent',
        neutral: 'btn-neutral',
    };

    return buttonTypeClasses[buttonStyle] ?? 'btn-primary';
}

/**
 * Get button size class based on display settings
 */
export function getButtonSizeClass(
    displaySettings: DisplaySettingsFragment[]
): string {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);

    const buttonSize = settings['buttonSize'] ?? 'md';

    const buttonSizeClasses: Record<string, string> = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg',
    };

    return buttonSizeClasses[buttonSize] ?? '';
}
