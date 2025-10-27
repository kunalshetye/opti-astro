import type { TextTransform, TextAlignment } from './types';

/**
 * Convert text transform setting to Tailwind class
 * Handles both new ('normal') and legacy ('keep', 'normal_case') naming
 *
 * @param transform - Text transform key from CMS settings
 * @returns Tailwind text transform class or empty string
 *
 * @example
 * getTextTransformClass('uppercase') // Returns 'uppercase'
 * getTextTransformClass('normal') // Returns '' (no transform)
 * getTextTransformClass('keep') // Returns '' (legacy support, same as 'normal')
 */
export function getTextTransformClass(transform: string | undefined | null): string {
    if (!transform) return '';

    const transformMap: Record<string, string> = {
        'normal': '',
        'keep': '',  // Legacy: same as 'normal'
        'normal_case': '',  // Legacy Card header: same as 'normal'
        'uppercase': 'uppercase',
        'lowercase': 'lowercase',
        'capitalize': 'capitalize',
    };

    return transformMap[transform] || '';
}

/**
 * Convert text alignment setting to Tailwind class
 *
 * @param alignment - Text alignment key from CMS settings
 * @returns Tailwind text alignment class
 *
 * @example
 * getTextAlignmentClass('center') // Returns 'text-center'
 * getTextAlignmentClass('left') // Returns 'text-left'
 */
export function getTextAlignmentClass(alignment: string | undefined | null): string {
    if (!alignment) return 'text-left';  // Default

    const alignmentMap: Record<string, string> = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right',
        'justify': 'text-justify',
    };

    return alignmentMap[alignment] || 'text-left';
}

/**
 * Convert text size setting to Tailwind class
 * Used by Text component
 *
 * @param size - Text size key
 * @returns Tailwind text size class
 */
export function getTextSizeClass(size: string | undefined | null): string {
    if (!size) return '';

    const sizeMap: Record<string, string> = {
        'xs': 'text-xs',
        'sm': 'text-sm',
        'base': 'text-base',
        'lg': 'text-lg',
        'xl': 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
        '7xl': 'text-7xl',
        '8xl': 'text-8xl',
        '9xl': 'text-9xl',
    };

    return sizeMap[size] || '';
}

/**
 * Convert font weight setting to Tailwind class
 *
 * @param weight - Font weight key
 * @returns Tailwind font weight class
 */
export function getFontWeightClass(weight: string | undefined | null): string {
    if (!weight) return '';

    const weightMap: Record<string, string> = {
        'thin': 'font-thin',
        'extralight': 'font-extralight',
        'light': 'font-light',
        'normal': 'font-normal',
        'medium': 'font-medium',
        'semibold': 'font-semibold',
        'bold': 'font-bold',
        'extrabold': 'font-extrabold',
        'black': 'font-black',
    };

    return weightMap[weight] || '';
}
