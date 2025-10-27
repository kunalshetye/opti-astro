import type { HoverEffect, Shadow, OpacityLevel } from './types';

/**
 * Convert hover effect setting to Tailwind transition/transform classes
 *
 * @param effect - Hover effect key from CMS settings
 * @returns Tailwind transition classes or empty string
 *
 * @example
 * getHoverEffectClass('zoom') // Returns 'transition-transform duration-300 hover:scale-110'
 * getHoverEffectClass('zoom_subtle') // Returns 'transition-transform duration-300 hover:scale-105'
 * getHoverEffectClass('none') // Returns '' (no hover effect)
 */
export function getHoverEffectClass(effect: string | undefined | null): string {
    if (!effect || effect === 'none') return '';

    const effectMap: Record<string, string> = {
        'none': '',
        'zoom_subtle': 'transition-transform duration-300 hover:scale-105',
        'zoom': 'transition-transform duration-300 hover:scale-110',
        'lift': 'transition-transform duration-300 hover:-translate-y-1',
        'glow': 'transition-shadow duration-300 hover:shadow-lg',
    };

    return effectMap[effect] || '';
}

/**
 * Convert shadow setting to Tailwind shadow class
 *
 * @param shadow - Shadow size key from CMS settings
 * @returns Tailwind shadow class or empty string
 *
 * @example
 * getShadowClass('md') // Returns 'shadow-md'
 * getShadowClass('lg') // Returns 'shadow-lg'
 * getShadowClass('none') // Returns 'shadow-none'
 */
export function getShadowClass(shadow: string | undefined | null): string {
    if (!shadow || shadow === 'none') return 'shadow-none';

    const shadowMap: Record<string, string> = {
        'none': 'shadow-none',
        'sm': 'shadow-sm',
        'md': 'shadow-md',
        'lg': 'shadow-lg',
        'xl': 'shadow-xl',
        '2xl': 'shadow-2xl',
    };

    return shadowMap[shadow] || 'shadow-none';
}

/**
 * Convert hover shadow setting to Tailwind hover shadow class
 * Combines with transition for smooth effect
 *
 * @param shadow - Shadow size key from CMS settings
 * @returns Tailwind classes for hover shadow effect
 *
 * @example
 * getHoverShadowClass('lg') // Returns 'transition-shadow duration-300 hover:shadow-lg'
 */
export function getHoverShadowClass(shadow: string | undefined | null): string {
    if (!shadow || shadow === 'none') return '';

    const shadowMap: Record<string, string> = {
        'none': '',
        'sm': 'transition-shadow duration-300 hover:shadow-sm',
        'md': 'transition-shadow duration-300 hover:shadow-md',
        'lg': 'transition-shadow duration-300 hover:shadow-lg',
        'xl': 'transition-shadow duration-300 hover:shadow-xl',
        '2xl': 'transition-shadow duration-300 hover:shadow-2xl',
    };

    return shadowMap[shadow] || '';
}

/**
 * Convert opacity/tint level setting to Tailwind opacity class
 *
 * @param level - Opacity level key from CMS settings (o_0 to o_100)
 * @returns Tailwind opacity class or empty string
 *
 * @example
 * getOpacityClass('o_50') // Returns 'opacity-50'
 * getOpacityClass('o_75') // Returns 'opacity-75'
 * getOpacityClass('o_0') // Returns 'opacity-0'
 */
export function getOpacityClass(level: string | undefined | null): string {
    if (!level) return '';

    // Extract numeric value from 'o_XX' format
    const match = level.match(/^o_(\d+)$/);
    if (!match) return '';

    const value = match[1];

    // Map to Tailwind opacity scale
    const opacityMap: Record<string, string> = {
        '0': 'opacity-0',
        '10': 'opacity-10',
        '20': 'opacity-20',
        '30': 'opacity-30',
        '40': 'opacity-40',
        '50': 'opacity-50',
        '60': 'opacity-60',
        '70': 'opacity-70',
        '75': 'opacity-75',
        '80': 'opacity-80',
        '90': 'opacity-90',
        '100': 'opacity-100',
    };

    return opacityMap[value] || '';
}

/**
 * Convert background tint level to overlay classes
 * Used by Hero and Card components for image overlays
 *
 * @param level - Tint level key from CMS settings
 * @param color - Overlay color (default: 'black')
 * @returns Array of Tailwind classes for overlay
 *
 * @example
 * getBackgroundTintClasses('o_50') // Returns ['after:absolute', 'after:inset-0', 'after:bg-black', 'after:opacity-50']
 * getBackgroundTintClasses('o_75', 'primary') // Returns overlay classes with primary color
 */
export function getBackgroundTintClasses(
    level: string | undefined | null,
    color: string = 'black'
): string[] {
    if (!level || level === 'o_0') return [];  // No tint

    const opacityClass = getOpacityClass(level);
    if (!opacityClass) return [];

    const bgColorClass = color === 'black' ? 'after:bg-black' : `after:bg-${color}`;

    return [
        'relative',
        'after:absolute',
        'after:inset-0',
        bgColorClass,
        opacityClass.replace('opacity', 'after:opacity'),
        'after:pointer-events-none',
    ];
}

/**
 * Convert transition duration setting to Tailwind class
 *
 * @param duration - Duration key from CMS settings
 * @returns Tailwind duration class
 *
 * @example
 * getTransitionDurationClass('300') // Returns 'duration-300'
 * getTransitionDurationClass('fast') // Returns 'duration-150'
 */
export function getTransitionDurationClass(duration: string | undefined | null): string {
    if (!duration) return 'duration-300';  // Default

    const durationMap: Record<string, string> = {
        'fast': 'duration-150',
        'normal': 'duration-300',
        'slow': 'duration-500',
        '75': 'duration-75',
        '100': 'duration-100',
        '150': 'duration-150',
        '200': 'duration-200',
        '300': 'duration-300',
        '500': 'duration-500',
        '700': 'duration-700',
        '1000': 'duration-1000',
    };

    return durationMap[duration] || 'duration-300';
}

/**
 * Convert animation setting to Tailwind animation class
 *
 * @param animation - Animation key from CMS settings
 * @returns Tailwind animate class or empty string
 *
 * @example
 * getAnimationClass('pulse') // Returns 'animate-pulse'
 * getAnimationClass('bounce') // Returns 'animate-bounce'
 */
export function getAnimationClass(animation: string | undefined | null): string {
    if (!animation || animation === 'none') return '';

    const animationMap: Record<string, string> = {
        'none': '',
        'spin': 'animate-spin',
        'ping': 'animate-ping',
        'pulse': 'animate-pulse',
        'bounce': 'animate-bounce',
    };

    return animationMap[animation] || '';
}
