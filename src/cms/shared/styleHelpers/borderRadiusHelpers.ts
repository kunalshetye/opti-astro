import type { BorderRadius } from './types';

/**
 * Convert border radius setting to Tailwind class
 * Supports standard naming and legacy component-specific naming
 *
 * @param radius - Border radius key from CMS settings
 * @param component - Optional component identifier for legacy naming compatibility
 * @returns Tailwind rounded class or empty string
 *
 * @example
 * // Standard usage
 * getBorderRadiusClass('md') // Returns 'rounded-md'
 * getBorderRadiusClass('full') // Returns 'rounded-full'
 *
 * // Legacy button support
 * getBorderRadiusClass('standard') // Returns 'rounded-none' (old DefaultButton)
 *
 * // Legacy image support
 * getBorderRadiusClass('small', 'image') // Returns 'rounded-xs'
 * getBorderRadiusClass('xlarge', 'image') // Returns 'rounded-xl'
 */
export function getBorderRadiusClass(
    radius: string | undefined | null,
    component?: 'button' | 'image' | 'video' | 'card'
): string {
    if (!radius || radius === 'none') return 'rounded-none';

    // Standard naming (all components should use this)
    const standardRadiusMap: Record<string, string> = {
        'none': 'rounded-none',
        'xs': 'rounded-xs',
        'sm': 'rounded-sm',
        'md': 'rounded-md',
        'lg': 'rounded-lg',
        'xl': 'rounded-xl',
        'xl2': 'rounded-2xl',
        'xl3': 'rounded-3xl',
        'xl4': 'rounded-4xl',
        'full': 'rounded-full',
    };

    // Check standard naming first
    if (standardRadiusMap[radius]) {
        return standardRadiusMap[radius];
    }

    // Legacy button naming (DefaultButton used 'standard' for square corners)
    if (radius === 'standard') {
        return 'rounded-none';
    }

    // Legacy image/video naming
    const legacyImageRadiusMap: Record<string, string> = {
        'small': 'rounded-xs',     // DefaultImage: small → xs
        'medium': 'rounded-md',    // DefaultImage/Video: medium → md
        'large': 'rounded-lg',     // DefaultImage/Video: large → lg
        'xlarge': 'rounded-xl',    // DefaultImage: xlarge → xl
        'x3large': 'rounded-3xl',  // DefaultImage: x3large → xl3
        'huge': 'rounded-4xl',     // DefaultImage/Video: huge → xl4
        'xhuge': 'rounded-full',   // DefaultImage: xhuge → full
    };

    if (component === 'image' || component === 'video') {
        return legacyImageRadiusMap[radius] || 'rounded-none';
    }

    // If no match found, return empty string (no rounding)
    return '';
}

/**
 * Convert component-specific "roundedCorners" setting to Tailwind class
 * Wrapper for getBorderRadiusClass with semantic naming
 *
 * @param corners - Rounded corners key from CMS settings
 * @param component - Component identifier
 * @returns Tailwind rounded class
 */
export function getRoundedCornersClass(
    corners: string | undefined | null,
    component?: 'image' | 'video' | 'card'
): string {
    return getBorderRadiusClass(corners, component);
}
