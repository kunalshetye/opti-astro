import type { CompositionStructureNode } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';
import { getRowGapClass } from '../../shared/styleHelpers/index.ts';

export function getSectionStyles(grid: CompositionStructureNode): string[] {
    const displaySettings = grid.displaySettings;
    // @ts-ignore
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    let cssClasses: string[] = [];
    switch (grid.displayTemplateKey) {
        case 'DefaultGrid':
            // Handle DefaultGrid (used for components as sections)
            switch (dictionary['gridWidth']) {
                case 'default':
                    cssClasses.push('container mx-auto px-8');
                    break;
                case 'full':
                    cssClasses.push('w-full');
                    break;
                case 'narrow':
                    cssClasses.push('max-w-3xl w-full mx-auto px-8');
                    break;
                case 'wide':
                    cssClasses.push('max-w-7xl w-full mx-auto px-8');
                    break;
                case 'edgeToEdge':
                    cssClasses.push('w-full max-w-full');
                    break;
            }

            // Vertical spacing for DefaultGrid
            switch (dictionary['vSpacing']) {
                case 'default':
                    cssClasses.push('my-8');
                    break;
                case 'small':
                    cssClasses.push('py-4 md:py-8 lg:py-12');
                    break;
                case 'large':
                    cssClasses.push('py-8 md:py-16 lg:py-24');
                    break;
            }
            break;
        case 'DefaultSection':
            // Component-specific width options (keep as-is)
            switch (dictionary['gridWidth']) {
                case 'default':
                    cssClasses.push('container mx-auto px-8');
                    break;
                case 'full':
                    cssClasses.push('w-full');
                    break;
                case 'narrow':
                    cssClasses.push('max-w-3xl w-full mx-auto px-8');
                    break;
                case 'wide':
                    cssClasses.push('max-w-7xl w-full mx-auto px-8');
                    break;
                case 'edgeToEdge':
                    cssClasses.push('w-full max-w-full');
                    break;
            }

            // Component-specific responsive vertical spacing (keep as-is)
            switch (dictionary['vSpacing']) {
                case 'default':
                    cssClasses.push('my-8');
                    break;
                case 'small':
                    cssClasses.push('py-4 md:py-8 lg:py-12');
                    break;
                case 'large':
                    cssClasses.push('py-8 md:py-16 lg:py-24');
                    break;
            }

            // Grid row gap using centralized helper
            const rowGap = dictionary['rowGap'];
            if (rowGap === 'none') {
                cssClasses.push('gap-y-0');  // Explicit zero gap
            } else {
                const rowGapClass = getRowGapClass(rowGap) || 'gap-y-4';  // Default medium gap
                cssClasses.push(rowGapClass);
            }

            // Background color is now handled by globalStylesHelper
            break;
        default:
            cssClasses.push('vb:NoStyles');
            break;
    }

    return cssClasses;
}
