import type { CompositionStructureNode } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getSectionStyles(grid: CompositionStructureNode): string[] {
    const displaySettings = grid.displaySettings;
    // @ts-ignore
    const dictionary = getDictionaryFromDisplaySettings(displaySettings);
    let cssClasses: string[] = [];
    switch (grid.displayTemplateKey) {
        case 'DefaultGrid':
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
            }
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
            switch (dictionary['sectionColor']) {
                case 'gray':
                    cssClasses.push('bg-gray-100');
                    break;
                case 'black':
                    cssClasses.push('bg-gray-950');
                    break;
                case 'blue':
                    cssClasses.push('bg-blue-700');
                    break;
            }
            break;
        default:
            cssClasses.push('vb:NoStyles');
            break;
    }

    return cssClasses;
}
