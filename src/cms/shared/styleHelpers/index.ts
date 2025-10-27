/**
 * Centralized Style Helper Library
 *
 * This library provides a single source of truth for converting CMS style settings
 * to Tailwind CSS classes. All component styling conversions should use these helpers
 * to ensure consistency and maintainability.
 *
 * @example
 * ```typescript
 * import { getButtonStyleClass, getBackgroundColorClass } from '@/cms/shared/styleHelpers';
 *
 * const buttonClasses = [
 *   getButtonStyleClass(settings['buttonStyle']),
 *   getButtonSizeClass(settings['buttonSize'])
 * ].filter(Boolean);
 * ```
 */

// Export all types
export type * from './types';

// Color helpers
export {
    getBackgroundColorClass,
    getTextColorClass,
    getHeroTextColorClass,
    getDividerColorClass,
    getDirectTextColorClass,
} from './colorHelpers';

// Text helpers
export {
    getTextTransformClass,
    getTextAlignmentClass,
    getTextSizeClass,
    getFontWeightClass,
} from './textHelpers';

// Button helpers
export {
    getButtonStyleClass,
    getButtonTypeClass,
    getButtonSizeClass,
    getButtonWidthClass,
    getButtonRadiusClass,
    getButtonActionClass,
    getButtonClasses,
} from './buttonHelpers';

// Border radius helpers
export {
    getBorderRadiusClass,
    getRoundedCornersClass,
} from './borderRadiusHelpers';

// Spacing helpers
export {
    getGapClass,
    getMarginClass,
    getPaddingClass,
    getContentSpacingClasses,
    getRowGapClass,
} from './spacingHelpers';

// Layout helpers
export {
    getVerticalAlignmentClass,
    getHorizontalAlignmentClass,
    getJustifyContentClass,
    getAlignItemsClass,
    getAlignContentClass,
    getSelfAlignmentClass,
    getGridColumnsClass,
    getGridColumnSpanClass,
    getGridRowSpanClass,
    getGridAutoFlowClass,
    getContentAlignmentClasses,
} from './layoutHelpers';

// Effect helpers
export {
    getHoverEffectClass,
    getShadowClass,
    getHoverShadowClass,
    getOpacityClass,
    getBackgroundTintClasses,
    getTransitionDurationClass,
    getAnimationClass,
} from './effectHelpers';

// Image helpers
export {
    getImageFitClass,
    getImagePositionClass,
    getAspectRatioClass,
    getImageLoadingStrategy,
    getImageFilterClass,
    getImageClasses,
} from './imageHelpers';

/**
 * Utility function to filter and join CSS classes
 * Removes falsy values and joins into a single string
 *
 * @param classes - Array of class strings or falsy values
 * @returns Joined class string
 *
 * @example
 * joinClasses(['btn', 'btn-primary', '', null, 'rounded-lg'])
 * // Returns 'btn btn-primary rounded-lg'
 */
export function joinClasses(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

/**
 * Utility function to conditionally include CSS classes
 *
 * @param condition - Boolean condition
 * @param trueClass - Class to use if true
 * @param falseClass - Class to use if false (optional)
 * @returns Appropriate class or empty string
 *
 * @example
 * conditionalClass(isActive, 'bg-primary', 'bg-secondary')
 * // Returns 'bg-primary' if isActive is true, 'bg-secondary' otherwise
 */
export function conditionalClass(
    condition: boolean,
    trueClass: string,
    falseClass?: string
): string {
    return condition ? trueClass : (falseClass || '');
}

/**
 * Utility to merge classes from display settings
 * Filters out empty strings and joins classes
 *
 * @param classArrays - Multiple arrays of classes
 * @returns Single array of valid classes
 *
 * @example
 * mergeClasses(
 *   ['btn', 'btn-primary'],
 *   ['rounded-lg', ''],
 *   getButtonClasses(settings)
 * )
 * // Returns ['btn', 'btn-primary', 'rounded-lg', ...]
 */
export function mergeClasses(...classArrays: (string | string[])[]): string[] {
    const flattened = classArrays.flat();
    return flattened.filter((cls): cls is string => Boolean(cls));
}
