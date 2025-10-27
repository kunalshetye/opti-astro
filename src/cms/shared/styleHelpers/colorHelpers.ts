import type { ThemeColor } from './types';

/**
 * Convert backgroundColor setting to Tailwind background color class
 *
 * @param color - Color key from CMS settings (transparent, base_100, primary, etc.)
 * @returns Tailwind background color class (bg-primary, bg-base-100, etc.) or empty string
 *
 * @example
 * getBackgroundColorClass('primary') // Returns 'bg-primary'
 * getBackgroundColorClass('base_200') // Returns 'bg-base-200'
 * getBackgroundColorClass('transparent') // Returns '' (no class applied)
 */
export function getBackgroundColorClass(color: string | undefined | null): string {
    if (!color) return '';

    const colorMap: Record<string, string> = {
        'transparent': '',  // No background color applied
        'base_100': 'bg-base-100',
        'base_200': 'bg-base-200',
        'base_300': 'bg-base-300',
        'primary': 'bg-primary',
        'secondary': 'bg-secondary',
        'accent': 'bg-accent',
        'neutral': 'bg-neutral',
        'info': 'bg-info',
        'success': 'bg-success',
        'warning': 'bg-warning',
        'error': 'bg-error',
    };

    return colorMap[color] || '';
}

/**
 * Convert backgroundColor to corresponding text content color class
 * Maps semantic color backgrounds to their content color variants for proper contrast
 *
 * @param color - Color key from CMS settings
 * @returns Tailwind text color class for proper contrast (text-primary-content, etc.) or empty string
 *
 * @example
 * getTextColorClass('primary') // Returns 'text-primary-content'
 * getTextColorClass('base_200') // Returns 'text-base-content'
 * getTextColorClass('transparent') // Returns '' (no override)
 */
export function getTextColorClass(color: string | undefined | null): string {
    if (!color) return '';

    const textColorMap: Record<string, string> = {
        'transparent': '',  // No text color override
        'base_100': 'text-base-content',
        'base_200': 'text-base-content',
        'base_300': 'text-base-content',
        'primary': 'text-primary-content',
        'secondary': 'text-secondary-content',
        'accent': 'text-accent-content',
        'neutral': 'text-neutral-content',
        'info': 'text-info-content',
        'success': 'text-success-content',
        'warning': 'text-warning-content',
        'error': 'text-error-content',
    };

    return textColorMap[color] || '';
}

/**
 * Convert hero-specific text color setting to Tailwind class
 * Used by Hero component which has additional color options like 'white', 'black', 'default'
 *
 * @param textColor - Text color key from Hero CMS settings
 * @returns Tailwind text color class or empty string
 *
 * @example
 * getHeroTextColorClass('white') // Returns 'text-white'
 * getHeroTextColorClass('primary') // Returns 'text-primary'
 * getHeroTextColorClass('default') // Returns '' (uses theme default)
 */
export function getHeroTextColorClass(textColor: string | undefined | null): string {
    if (!textColor || textColor === 'default') return '';

    const heroTextColorMap: Record<string, string> = {
        'default': '',
        'white': 'text-white',
        'black': 'text-black',
        'neutral': 'text-neutral',
        'primary': 'text-primary',
        'secondary': 'text-secondary',
        'accent': 'text-accent',
        'info': 'text-info',
        'success': 'text-success',
        'warning': 'text-warning',
        'error': 'text-error',
    };

    return heroTextColorMap[textColor] || '';
}

/**
 * Legacy support: Convert divider color setting to Tailwind class
 * Used by Divider component
 *
 * @param color - Divider color key
 * @returns Tailwind divider color class
 */
export function getDividerColorClass(color: string | undefined | null): string {
    if (!color) return 'divider-neutral';  // Default

    const dividerColorMap: Record<string, string> = {
        'neutral': 'divider-neutral',
        'primary': 'divider-primary',
        'secondary': 'divider-secondary',
        'accent': 'divider-accent',
    };

    return dividerColorMap[color] || 'divider-neutral';
}

/**
 * Convert raw color name to text color class
 * Used for components like Text, Divider that have direct text color options
 *
 * @param color - Color name
 * @returns Tailwind text color class
 */
export function getDirectTextColorClass(color: string | undefined | null): string {
    if (!color) return '';

    const directTextColorMap: Record<string, string> = {
        'primary': 'text-primary',
        'secondary': 'text-secondary',
        'accent': 'text-accent',
        'neutral': 'text-neutral',
        'base_content': 'text-base-content',
        'info': 'text-info',
        'success': 'text-success',
        'warning': 'text-warning',
        'error': 'text-error',
        'white': 'text-white',
        'black': 'text-black',
    };

    return directTextColorMap[color] || '';
}
