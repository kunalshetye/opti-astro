import type { SpacingSize } from './types';

/**
 * Convert gap setting to Tailwind gap class
 *
 * @param gap - Gap size key from CMS settings
 * @param direction - Gap direction: 'x' (horizontal), 'y' (vertical), or 'both' (default)
 * @returns Tailwind gap class or empty string
 *
 * @example
 * getGapClass('medium') // Returns 'gap-4' (1rem = 4 * 0.25rem)
 * getGapClass('large', 'x') // Returns 'gap-x-8'
 * getGapClass('small', 'y') // Returns 'gap-y-2'
 */
export function getGapClass(
    gap: string | undefined | null,
    direction: 'x' | 'y' | 'both' = 'both'
): string {
    if (!gap || gap === 'none') return '';

    // Map CMS gap sizes to Tailwind spacing scale
    const gapMap: Record<string, string> = {
        'none': '',
        'small': '2',      // 0.5rem = 8px
        'medium': '4',     // 1rem = 16px
        'large': '8',      // 2rem = 32px
        'xl': '12',        // 3rem = 48px
        'xxl': '24',       // 6rem = 96px
    };

    const sizeValue = gapMap[gap];
    if (!sizeValue) return '';

    // Build class based on direction
    const prefix = direction === 'both' ? 'gap' : `gap-${direction}`;
    return `${prefix}-${sizeValue}`;
}

/**
 * Convert vertical spacing setting to Tailwind margin class
 *
 * @param spacing - Spacing size key from CMS settings
 * @param direction - Margin direction: 'top', 'bottom', 'y' (top+bottom), 'all'
 * @returns Tailwind margin class or empty string
 *
 * @example
 * getMarginClass('medium', 'y') // Returns 'my-4'
 * getMarginClass('large', 'top') // Returns 'mt-8'
 * getMarginClass('verylarge', 'bottom') // Returns 'mb-20 lg:mb-40'
 */
export function getMarginClass(
    spacing: string | undefined | null,
    direction: 'top' | 'bottom' | 'y' | 'x' | 'all' = 'y'
): string {
    if (!spacing || spacing === 'none') return '';

    const spacingMap: Record<string, string> = {
        'none': '',
        'small': '2',      // 0.5rem
        'medium': '4',     // 1rem
        'large': '8',      // 2rem
        'verylarge': '20 lg:40',  // Special: 5rem / 10rem responsive
    };

    const sizeValue = spacingMap[spacing];
    if (!sizeValue) return '';

    // Handle responsive verylarge spacing
    if (spacing === 'verylarge') {
        const prefix = direction === 'all' ? 'm' : direction === 'y' ? 'my' : direction === 'x' ? 'mx' : `m${direction[0]}`;
        return `${prefix}-${sizeValue}`;
    }

    // Standard margin class
    const prefix = direction === 'all' ? 'm' : direction === 'y' ? 'my' : direction === 'x' ? 'mx' : `m${direction[0]}`;
    return `${prefix}-${sizeValue}`;
}

/**
 * Convert padding setting to Tailwind padding class
 *
 * @param padding - Padding size key from CMS settings
 * @param direction - Padding direction: 'all', 'x', 'y', 'top', 'bottom', 'left', 'right'
 * @returns Tailwind padding class or empty string
 *
 * @example
 * getPaddingClass('medium') // Returns 'p-4'
 * getPaddingClass('large', 'x') // Returns 'px-8'
 * getPaddingClass('small', 'top') // Returns 'pt-2'
 */
export function getPaddingClass(
    padding: string | undefined | null,
    direction: 'all' | 'x' | 'y' | 'top' | 'bottom' | 'left' | 'right' = 'all'
): string {
    if (!padding || padding === 'none') return '';

    const paddingMap: Record<string, string> = {
        'none': '',
        'small': '2',      // 0.5rem
        'medium': '4',     // 1rem
        'large': '8',      // 2rem
        'xl': '12',        // 3rem
        'xxl': '24',       // 6rem
    };

    const sizeValue = paddingMap[padding];
    if (!sizeValue) return '';

    // Build class based on direction
    const prefix = direction === 'all' ? 'p' : direction === 'x' || direction === 'y' ? `p${direction}` : `p${direction[0]}`;
    return `${prefix}-${sizeValue}`;
}

/**
 * Convert column content spacing setting to combined gap and padding classes
 * Used by Column component
 *
 * @param spacing - Content spacing size key from CMS settings
 * @returns Array of Tailwind classes for gap and padding
 *
 * @example
 * getContentSpacingClasses('medium') // Returns ['gap-4', 'p-4']
 * getContentSpacingClasses('xl') // Returns ['gap-12', 'p-12', 'lg:p-24']
 */
export function getContentSpacingClasses(spacing: string | undefined | null): string[] {
    if (!spacing || spacing === 'none') return [];

    const spacingClassMap: Record<string, string[]> = {
        'none': [],
        'small': ['gap-2', 'p-2'],
        'medium': ['gap-4', 'p-4'],
        'large': ['gap-8', 'p-8'],
        'xl': ['gap-12', 'p-12', 'lg:p-24'],
        'xxl': ['gap-16', 'p-16', 'lg:p-72'],
    };

    return spacingClassMap[spacing] || [];
}

/**
 * Convert Section row gap setting to Tailwind gap class
 * Used by Section composition
 *
 * @param gap - Gap size key from CMS settings
 * @returns Tailwind gap class
 */
export function getRowGapClass(gap: string | undefined | null): string {
    return getGapClass(gap, 'y');  // Vertical gap between rows
}
