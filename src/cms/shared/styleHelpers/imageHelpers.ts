import type { ImageFit } from './types';

/**
 * Convert image fit setting to Tailwind object-fit class
 *
 * @param fit - Image fit key from CMS settings
 * @returns Tailwind object-fit class
 *
 * @example
 * getImageFitClass('object_cover') // Returns 'object-cover'
 * getImageFitClass('object_contain') // Returns 'object-contain'
 */
export function getImageFitClass(fit: string | undefined | null): string {
    if (!fit) return 'object-cover';  // Default

    const fitMap: Record<string, string> = {
        'object_cover': 'object-cover',
        'object_contain': 'object-contain',
        'object_fill': 'object-fill',
        'object_none': 'object-none',
        'object_scale_down': 'object-scale-down',
        // Legacy naming support
        'cover': 'object-cover',
        'contain': 'object-contain',
        'fill': 'object-fill',
        'none': 'object-none',
        'scale-down': 'object-scale-down',
    };

    return fitMap[fit] || 'object-cover';
}

/**
 * Convert image position setting to Tailwind object-position class
 *
 * @param position - Image position key from CMS settings
 * @returns Tailwind object-position class
 *
 * @example
 * getImagePositionClass('center') // Returns 'object-center'
 * getImagePositionClass('top') // Returns 'object-top'
 */
export function getImagePositionClass(position: string | undefined | null): string {
    if (!position) return 'object-center';  // Default

    const positionMap: Record<string, string> = {
        'center': 'object-center',
        'top': 'object-top',
        'top_right': 'object-top-right',
        'right': 'object-right',
        'bottom_right': 'object-bottom-right',
        'bottom': 'object-bottom',
        'bottom_left': 'object-bottom-left',
        'left': 'object-left',
        'top_left': 'object-top-left',
    };

    return positionMap[position] || 'object-center';
}

/**
 * Convert aspect ratio setting to Tailwind aspect class
 *
 * @param ratio - Aspect ratio key from CMS settings
 * @returns Tailwind aspect-ratio class
 *
 * @example
 * getAspectRatioClass('16/9') // Returns 'aspect-video'
 * getAspectRatioClass('1/1') // Returns 'aspect-square'
 */
export function getAspectRatioClass(ratio: string | undefined | null): string {
    if (!ratio || ratio === 'auto') return '';  // No fixed aspect ratio

    const ratioMap: Record<string, string> = {
        'auto': '',
        '1/1': 'aspect-square',
        'square': 'aspect-square',
        '16/9': 'aspect-video',
        'video': 'aspect-video',
        '4/3': 'aspect-4/3',
        '21/9': 'aspect-21/9',
        '3/2': 'aspect-3/2',
        '2/3': 'aspect-2/3',
    };

    return ratioMap[ratio] || '';
}

/**
 * Convert image loading strategy to HTML loading attribute value
 *
 * @param loading - Loading strategy key from CMS settings
 * @returns Loading attribute value ('lazy', 'eager', or undefined)
 *
 * @example
 * getImageLoadingStrategy('lazy') // Returns 'lazy'
 * getImageLoadingStrategy('eager') // Returns 'eager'
 */
export function getImageLoadingStrategy(loading: string | undefined | null): 'lazy' | 'eager' | undefined {
    if (!loading || loading === 'auto') return undefined;  // Browser default

    const loadingMap: Record<string, 'lazy' | 'eager' | undefined> = {
        'auto': undefined,
        'lazy': 'lazy',
        'eager': 'eager',
    };

    return loadingMap[loading];
}

/**
 * Convert image filter setting to Tailwind filter classes
 *
 * @param filter - Filter key from CMS settings
 * @returns Tailwind filter class or empty string
 *
 * @example
 * getImageFilterClass('grayscale') // Returns 'grayscale'
 * getImageFilterClass('blur_sm') // Returns 'blur-sm'
 */
export function getImageFilterClass(filter: string | undefined | null): string {
    if (!filter || filter === 'none') return '';

    const filterMap: Record<string, string> = {
        'none': '',
        'grayscale': 'grayscale',
        'sepia': 'sepia',
        'blur_sm': 'blur-sm',
        'blur': 'blur',
        'blur_lg': 'blur-lg',
        'brightness_50': 'brightness-50',
        'brightness_75': 'brightness-75',
        'brightness_125': 'brightness-125',
        'brightness_150': 'brightness-150',
        'contrast_50': 'contrast-50',
        'contrast_125': 'contrast-125',
        'contrast_150': 'contrast-150',
        'saturate_0': 'saturate-0',
        'saturate_50': 'saturate-50',
        'saturate_150': 'saturate-150',
        'invert': 'invert',
    };

    return filterMap[filter] || '';
}

/**
 * Get combined image styling classes
 * Convenience function that applies multiple image helpers at once
 *
 * @param settings - Object containing all image style settings
 * @returns Array of Tailwind classes
 *
 * @example
 * getImageClasses({
 *   fit: 'object_cover',
 *   position: 'center',
 *   aspectRatio: '16/9',
 *   borderRadius: 'md'
 * })
 * // Returns ['object-cover', 'object-center', 'aspect-video', 'rounded-md']
 */
export function getImageClasses(settings: {
    fit?: string | null;
    position?: string | null;
    aspectRatio?: string | null;
    filter?: string | null;
}): string[] {
    return [
        getImageFitClass(settings.fit),
        getImagePositionClass(settings.position),
        getAspectRatioClass(settings.aspectRatio),
        getImageFilterClass(settings.filter),
    ].filter(Boolean);
}
