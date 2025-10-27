import type { VerticalAlignment, HorizontalAlignment, GridColumns } from './types';

/**
 * Convert vertical alignment setting to Tailwind align-items class
 *
 * @param alignment - Vertical alignment key from CMS settings
 * @returns Tailwind align-items class
 *
 * @example
 * getVerticalAlignmentClass('center') // Returns 'items-center'
 * getVerticalAlignmentClass('stretch') // Returns 'items-stretch'
 */
export function getVerticalAlignmentClass(alignment: string | undefined | null): string {
    if (!alignment) return 'items-stretch';  // Default

    const alignmentMap: Record<string, string> = {
        'start': 'items-start',
        'center': 'items-center',
        'end': 'items-end',
        'stretch': 'items-stretch',
        'baseline': 'items-baseline',
    };

    return alignmentMap[alignment] || 'items-stretch';
}

/**
 * Convert horizontal alignment setting to Tailwind justify-items class
 *
 * @param alignment - Horizontal alignment key from CMS settings
 * @returns Tailwind justify-items class
 *
 * @example
 * getHorizontalAlignmentClass('center') // Returns 'justify-items-center'
 * getHorizontalAlignmentClass('start') // Returns 'justify-items-start'
 */
export function getHorizontalAlignmentClass(alignment: string | undefined | null): string {
    if (!alignment) return 'justify-items-start';  // Default

    const alignmentMap: Record<string, string> = {
        'start': 'justify-items-start',
        'center': 'justify-items-center',
        'end': 'justify-items-end',
    };

    return alignmentMap[alignment] || 'justify-items-start';
}

/**
 * Convert justify content setting to Tailwind justify-content class
 *
 * @param justify - Justify content key from CMS settings
 * @returns Tailwind justify-content class
 *
 * @example
 * getJustifyContentClass('center') // Returns 'justify-center'
 * getJustifyContentClass('space-between') // Returns 'justify-between'
 */
export function getJustifyContentClass(justify: string | undefined | null): string {
    if (!justify) return 'justify-start';  // Default

    const justifyMap: Record<string, string> = {
        'start': 'justify-start',
        'center': 'justify-center',
        'end': 'justify-end',
        'between': 'justify-between',
        'around': 'justify-around',
        'evenly': 'justify-evenly',
    };

    return justifyMap[justify] || 'justify-start';
}

/**
 * Convert align items setting to Tailwind align-items class
 * Similar to getVerticalAlignmentClass but different naming
 *
 * @param align - Align items key from CMS settings
 * @returns Tailwind align-items class
 */
export function getAlignItemsClass(align: string | undefined | null): string {
    return getVerticalAlignmentClass(align);
}

/**
 * Convert align content setting to Tailwind align-content class
 *
 * @param align - Align content key from CMS settings
 * @returns Tailwind align-content class
 *
 * @example
 * getAlignContentClass('center') // Returns 'content-center'
 */
export function getAlignContentClass(align: string | undefined | null): string {
    if (!align) return 'content-start';  // Default

    const alignMap: Record<string, string> = {
        'start': 'content-start',
        'center': 'content-center',
        'end': 'content-end',
        'between': 'content-between',
        'around': 'content-around',
        'evenly': 'content-evenly',
    };

    return alignMap[align] || 'content-start';
}

/**
 * Convert self alignment setting to Tailwind self-align class
 * Used for individual item alignment within grid/flex containers
 *
 * @param alignment - Self alignment key from CMS settings
 * @returns Tailwind self-align class
 *
 * @example
 * getSelfAlignmentClass('center') // Returns 'self-center'
 * getSelfAlignmentClass('end') // Returns 'self-end'
 */
export function getSelfAlignmentClass(alignment: string | undefined | null): string {
    if (!alignment) return 'self-center';  // Default

    const alignmentMap: Record<string, string> = {
        'start': 'self-start',
        'center': 'self-center',
        'end': 'self-end',
        'stretch': 'self-stretch',
    };

    return alignmentMap[alignment] || 'self-center';
}

/**
 * Convert grid columns setting to Tailwind grid-template-columns class
 * Handles both standard and legacy naming (c1/col1, etc.)
 *
 * @param columns - Grid columns key from CMS settings
 * @returns Tailwind grid-cols class or empty string
 *
 * @example
 * getGridColumnsClass('col3') // Returns 'grid-cols-3'
 * getGridColumnsClass('c4') // Returns 'grid-cols-4' (legacy support)
 * getGridColumnsClass('auto') // Returns '' (auto layout)
 */
export function getGridColumnsClass(columns: string | undefined | null): string {
    if (!columns || columns === 'auto') return '';  // Auto layout, no fixed columns

    const columnsMap: Record<string, string> = {
        'auto': '',
        // Standard naming
        'col1': 'grid-cols-1',
        'col2': 'grid-cols-2',
        'col3': 'grid-cols-3',
        'col4': 'grid-cols-4',
        'col5': 'grid-cols-5',
        'col6': 'grid-cols-6',
        // Legacy GridStyles naming
        'c1': 'grid-cols-1',
        'c2': 'grid-cols-2',
        'c3': 'grid-cols-3',
        'c4': 'grid-cols-4',
    };

    return columnsMap[columns] || '';
}

/**
 * Convert grid column span setting to Tailwind col-span class
 *
 * @param span - Column span (1-12 or 'auto')
 * @returns Tailwind col-span class or empty string
 *
 * @example
 * getGridColumnSpanClass('6') // Returns 'col-span-6'
 * getGridColumnSpanClass('auto') // Returns 'col-auto'
 * getGridColumnSpanClass(6) // Returns 'col-span-6' (also accepts numbers)
 */
export function getGridColumnSpanClass(span: string | number | undefined | null): string {
    if (!span || span === 'auto') return 'col-auto';

    const spanValue = typeof span === 'number' ? span : parseInt(span, 10);

    if (isNaN(spanValue) || spanValue < 1 || spanValue > 12) {
        return 'col-auto';
    }

    return `col-span-${spanValue}`;
}

/**
 * Convert grid row span setting to Tailwind row-span class
 *
 * @param span - Row span (1-6 or 'auto')
 * @returns Tailwind row-span class or empty string
 *
 * @example
 * getGridRowSpanClass('2') // Returns 'row-span-2'
 * getGridRowSpanClass('auto') // Returns 'row-auto'
 */
export function getGridRowSpanClass(span: string | number | undefined | null): string {
    if (!span || span === 'auto') return 'row-auto';

    const spanValue = typeof span === 'number' ? span : parseInt(span, 10);

    if (isNaN(spanValue) || spanValue < 1 || spanValue > 6) {
        return 'row-auto';
    }

    return `row-span-${spanValue}`;
}

/**
 * Convert grid auto flow setting to Tailwind class
 *
 * @param flow - Grid auto flow key from CMS settings
 * @returns Tailwind grid-flow class
 *
 * @example
 * getGridAutoFlowClass('row') // Returns 'grid-flow-row'
 * getGridAutoFlowClass('dense') // Returns 'grid-flow-dense'
 */
export function getGridAutoFlowClass(flow: string | undefined | null): string {
    if (!flow) return 'grid-flow-row';  // Default

    const flowMap: Record<string, string> = {
        'row': 'grid-flow-row',
        'col': 'grid-flow-col',
        'column': 'grid-flow-col',
        'dense': 'grid-flow-dense',
        'row-dense': 'grid-flow-row-dense',
        'col-dense': 'grid-flow-col-dense',
    };

    return flowMap[flow] || 'grid-flow-row';
}

/**
 * Convert content alignment setting to combined positioning classes
 * Used by Column component for unified content alignment
 *
 * @param alignment - Content alignment key from CMS settings
 * @returns Array of Tailwind classes for positioning
 *
 * @example
 * getContentAlignmentClasses('center') // Returns ['justify-center', 'items-center']
 * getContentAlignmentClasses('top-left') // Returns ['justify-start', 'items-start']
 */
export function getContentAlignmentClasses(alignment: string | undefined | null): string[] {
    if (!alignment) return ['justify-start', 'items-start'];  // Top-left default

    const alignmentClassMap: Record<string, string[]> = {
        'top-left': ['justify-start', 'items-start'],
        'top': ['justify-center', 'items-start'],
        'top-right': ['justify-end', 'items-start'],
        'left': ['justify-start', 'items-center'],
        'center': ['justify-center', 'items-center'],
        'right': ['justify-end', 'items-center'],
        'bottom-left': ['justify-start', 'items-end'],
        'bottom': ['justify-center', 'items-end'],
        'bottom-right': ['justify-end', 'items-end'],
    };

    return alignmentClassMap[alignment] || ['justify-start', 'items-start'];
}

/**
 * Check if edge-to-edge mode is enabled based on CMS settings
 * Checks multiple setting keys that can indicate edge-to-edge mode:
 * - gridWidth === 'edgeToEdge' (Sections)
 * - containerPadding === 'none' (Components)
 * - containerWidth === 'edgeToEdge' (Alternative naming)
 *
 * @param dictionary - Display settings dictionary from CMS
 * @returns True if edge-to-edge mode should be enabled
 *
 * @example
 * const dict = { gridWidth: 'edgeToEdge' };
 * isEdgeToEdgeMode(dict) // Returns true
 *
 * const dict2 = { containerPadding: 'none' };
 * isEdgeToEdgeMode(dict2) // Returns true
 */
export function isEdgeToEdgeMode(dictionary: Record<string, string>): boolean {
    return (
        dictionary['gridWidth'] === 'edgeToEdge' ||
        dictionary['containerPadding'] === 'none' ||
        dictionary['containerWidth'] === 'edgeToEdge'
    );
}

/**
 * Get container padding classes based on CMS settings
 * Returns responsive padding classes unless edge-to-edge mode is enabled
 *
 * @param dictionary - Display settings dictionary from CMS
 * @returns Tailwind padding classes or empty string for edge-to-edge
 *
 * @example
 * const dict = { containerPadding: 'default' };
 * getContainerPaddingClasses(dict) // Returns 'p-2 sm:p-3 md:p-4'
 *
 * const edgeDict = { containerPadding: 'none' };
 * getContainerPaddingClasses(edgeDict) // Returns ''
 */
export function getContainerPaddingClasses(dictionary: Record<string, string>): string {
    if (isEdgeToEdgeMode(dictionary)) {
        return '';
    }
    return 'p-2 sm:p-3 md:p-4';
}
