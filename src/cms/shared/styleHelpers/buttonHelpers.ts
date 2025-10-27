import type { ButtonStyle, ButtonType, ButtonSize, ButtonWidth, ButtonAction } from './types';

/**
 * Convert button style setting to Tailwind class
 *
 * @param buttonStyle - Button style key from CMS settings
 * @returns Tailwind button style class or empty string
 *
 * @example
 * getButtonStyleClass('soft') // Returns 'btn-soft'
 * getButtonStyleClass('outline') // Returns 'btn-outline'
 */
export function getButtonStyleClass(buttonStyle: string | undefined | null): string {
    if (!buttonStyle) return 'btn-standard';  // Default

    const styleMap: Record<string, string> = {
        'standard': 'btn-standard',
        'soft': 'btn-soft',
        'outline': 'btn-outline',
        'dash': 'btn-dash',
        'neutral': 'btn-neutral',
        'link': 'btn-link',
        'ghost': 'btn-ghost',
        'wide': 'btn-wide',
        'disabled': 'btn-disabled',
    };

    return styleMap[buttonStyle] || 'btn-standard';
}

/**
 * Convert button type/color setting to Tailwind class
 *
 * @param buttonType - Button color type key from CMS settings
 * @returns Tailwind button color class
 *
 * @example
 * getButtonTypeClass('primary') // Returns 'btn-primary'
 * getButtonTypeClass('success') // Returns 'btn-success'
 */
export function getButtonTypeClass(buttonType: string | undefined | null): string {
    if (!buttonType) return 'btn-primary';  // Default

    const typeMap: Record<string, string> = {
        'primary': 'btn-primary',
        'secondary': 'btn-secondary',
        'neutral': 'btn-neutral',
        'accent': 'btn-accent',
        'info': 'btn-info',
        'success': 'btn-success',
        'warning': 'btn-warning',
        'error': 'btn-error',
    };

    return typeMap[buttonType] || 'btn-primary';
}

/**
 * Convert button size setting to Tailwind class
 *
 * @param buttonSize - Button size key from CMS settings
 * @returns Tailwind button size class or empty string (medium is default, no class needed)
 *
 * @example
 * getButtonSizeClass('lg') // Returns 'btn-lg'
 * getButtonSizeClass('medium') // Returns '' (default size)
 * getButtonSizeClass('responsive') // Returns responsive classes
 */
export function getButtonSizeClass(buttonSize: string | undefined | null): string {
    if (!buttonSize || buttonSize === 'medium') return '';  // Medium is default

    const sizeMap: Record<string, string> = {
        'xs': 'btn-xs',
        'sm': 'btn-sm',
        'medium': '',  // Default size
        'lg': 'btn-lg',
        'xl': 'btn-xl',
        'responsive': 'btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl',
    };

    return sizeMap[buttonSize] || '';
}

/**
 * Convert button width setting to Tailwind width class
 *
 * @param buttonWidth - Button width key from CMS settings
 * @returns Tailwind width class
 *
 * @example
 * getButtonWidthClass('w_10rem') // Returns 'w-[10rem]'
 * getButtonWidthClass('full') // Returns 'btn-block'
 * getButtonWidthClass('responsive') // Returns responsive width classes
 */
export function getButtonWidthClass(buttonWidth: string | undefined | null): string {
    if (!buttonWidth) return 'w-[10rem]';  // Default: standard width

    const widthMap: Record<string, string> = {
        'w_6rem': 'w-[6rem]',
        'w_9rem': 'w-[9rem]',
        'w_10rem': 'w-[10rem]',
        'w_12rem': 'w-[12rem]',
        'w_15rem': 'w-[15rem]',
        'w_20rem': 'w-[20rem]',
        'auto': '',  // No fixed width
        'half': 'w-1/2',
        'full': 'btn-block',  // DaisyUI full-width class
        'responsive': 'btn-block sm:w-[9rem] md:w-[12rem] lg:w-[15rem] xl:w-[20rem]',
    };

    return widthMap[buttonWidth] || 'w-[10rem]';
}

/**
 * Convert button radius setting to Tailwind class
 * Handles both new standard naming and legacy 'standard' key
 *
 * @param buttonRadius - Button border radius key from CMS settings
 * @returns Tailwind rounded class or empty string
 *
 * @example
 * getButtonRadiusClass('md') // Returns 'rounded-md'
 * getButtonRadiusClass('none') // Returns 'rounded-none'
 * getButtonRadiusClass('standard') // Returns 'rounded-none' (legacy support)
 * getButtonRadiusClass('full') // Returns 'rounded-full'
 */
export function getButtonRadiusClass(buttonRadius: string | undefined | null): string {
    if (!buttonRadius) return '';

    const radiusMap: Record<string, string> = {
        'none': 'rounded-none',
        'standard': 'rounded-none',  // Legacy: DefaultButton used 'standard' for square
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

    return radiusMap[buttonRadius] || '';
}

/**
 * Convert button action/hover effect setting to Tailwind class
 *
 * @param buttonAction - Button action key from CMS settings
 * @returns Tailwind transition/transform classes or empty string
 *
 * @example
 * getButtonActionClass('bouncy') // Returns 'transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg'
 * getButtonActionClass('static') // Returns '' (no hover effect)
 */
export function getButtonActionClass(buttonAction: string | undefined | null): string {
    if (!buttonAction || buttonAction === 'static') return '';  // No animation

    const actionMap: Record<string, string> = {
        'static': '',
        'bouncy': 'transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg',
    };

    return actionMap[buttonAction] || '';
}

/**
 * Get complete button styling classes by combining all button settings
 * Convenience function that applies all button style helpers at once
 *
 * @param settings - Object containing all button style settings
 * @param options - Optional configuration
 * @returns Array of Tailwind classes
 *
 * @example
 * getButtonClasses({
 *   buttonStyle: 'soft',
 *   buttonType: 'primary',
 *   buttonSize: 'lg',
 *   buttonWidth: 'w_12rem',
 *   buttonRadius: 'md',
 *   buttonAction: 'bouncy'
 * })
 * // Returns ['btn-soft', 'btn-primary', 'btn-lg', 'w-[12rem]', 'rounded-md', 'transition-transform...']
 */
export function getButtonClasses(
    settings: {
        buttonStyle?: string | null;
        buttonType?: string | null;
        buttonSize?: string | null;
        buttonWidth?: string | null;
        buttonRadius?: string | null;
        buttonAction?: string | null;
        textTransform?: string | null;
    },
    options?: {
        includeType?: boolean;  // Default: true
    }
): string[] {
    const includeType = options?.includeType !== false;

    const classes = [
        settings.textTransform && settings.textTransform !== 'keep' && settings.textTransform !== 'normal'
            ? settings.textTransform
            : '',
        getButtonStyleClass(settings.buttonStyle),
        includeType ? getButtonTypeClass(settings.buttonType) : '',
        getButtonWidthClass(settings.buttonWidth),
        getButtonSizeClass(settings.buttonSize),
        getButtonRadiusClass(settings.buttonRadius),
        getButtonActionClass(settings.buttonAction),
    ];

    return classes.filter(Boolean);
}
