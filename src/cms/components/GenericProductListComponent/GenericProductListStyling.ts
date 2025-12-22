import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

/**
 * Get layout classes based on layout mode
 */
export function getLayoutClasses(displaySettings: DisplaySettingsFragment[]): string {
    const settings = getDictionaryFromDisplaySettings(displaySettings);
    const layoutMode = settings['layoutMode'] ?? 'grid';

    if (layoutMode === 'carousel') {
        return 'splide'; // Use Splide.js for carousel
    }
    return 'grid'; // Default to grid
}

/**
 * Get grid columns class based on column count
 */
export function getGridColumnsClass(displaySettings: DisplaySettingsFragment[]): string {
    const settings = getDictionaryFromDisplaySettings(displaySettings);
    const columns = settings['gridColumns'] ?? 'c3';

    const columnsMap: Record<string, string> = {
        'c2': 'grid-cols-1 md:grid-cols-2',
        'c3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        'c4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    };
    return columnsMap[columns] || columnsMap['c3'];
}

/**
 * Get gap class based on gap size
 */
export function getGapClass(displaySettings: DisplaySettingsFragment[]): string {
    const settings = getDictionaryFromDisplaySettings(displaySettings);
    const gap = settings['gap'] ?? 'md';

    const gapMap: Record<string, string> = {
        'sm': 'gap-4',
        'md': 'gap-6',
        'lg': 'gap-8'
    };
    return gapMap[gap] || gapMap['md'];
}

/**
 * Get carousel item class for individual product cards
 */
export function getCarouselItemClass(): string {
    return 'flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 snap-start';
}

/**
 * Check if layout is carousel mode
 */
export function isCarouselLayout(displaySettings: DisplaySettingsFragment[]): boolean {
    const settings = getDictionaryFromDisplaySettings(displaySettings);
    const layoutMode = settings['layoutMode'] ?? 'grid';
    return layoutMode === 'carousel';
}

/**
 * Check if categories should be shown (only for grid mode)
 */
export function shouldShowCategories(displaySettings: DisplaySettingsFragment[]): boolean {
    const settings = getDictionaryFromDisplaySettings(displaySettings);
    const layoutMode = settings['layoutMode'] ?? 'grid';
    const showCategories = settings['showCategories'] ?? 'no';
    // Only show categories in grid mode
    return layoutMode === 'grid' && showCategories === 'yes';
}

/**
 * Check if filters should be shown (only for grid mode)
 */
export function shouldShowFilters(displaySettings: DisplaySettingsFragment[]): boolean {
    const settings = getDictionaryFromDisplaySettings(displaySettings);
    const layoutMode = settings['layoutMode'] ?? 'grid';
    const showFilters = settings['showFilters'] ?? 'no';
    // Only show filters in grid mode
    return layoutMode === 'grid' && showFilters === 'yes';
}
