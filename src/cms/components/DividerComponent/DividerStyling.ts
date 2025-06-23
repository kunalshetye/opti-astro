import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getDividerElementStyles(
    displaySettings: DisplaySettingsFragment[],
    direction: String = 'horizontal'
): string[] {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);
    let cssClasses: string[] = [];
    
    switch (settings['dividerColor']) {
        case 'default':
            cssClasses.push('');
            break;
        case 'neutral':
            cssClasses.push('divider-neutral');
            break;
        case 'primary':
            cssClasses.push('divider-primary');
            break;
        case 'secondary':
            cssClasses.push('divider-secondary');
            break;
        case 'accent':
            cssClasses.push('divider-accent');
            break;
        case 'success':
            cssClasses.push('divider-success');
            break;
        case 'warning':
            cssClasses.push('divider-warning');
            break;
        case 'info':
            cssClasses.push('divider-info');
            break;
        default:
            break;
    }

    switch (settings['textColor']) {
        case 'default':
            cssClasses.push('');
            break;
        case 'neutral':
            cssClasses.push('text-neutral');
            break;
        case 'primary':
            cssClasses.push('text-primary');
            break;
        case 'secondary':
            cssClasses.push('text-secondary');
            break;
        case 'accent':
            cssClasses.push('text-accent');
            break;
        case 'success':
            cssClasses.push('text-success');
            break;
        case 'warning':
            cssClasses.push('text-warning');
            break;
        case 'info':
            cssClasses.push('text-info');
            break;
        default:
            break;
    }

    switch (settings['transform']) {
        case 'uppercase':
            cssClasses.push('uppercase');
            break;
        case 'lowercase':
            cssClasses.push('lowercase');
            break;
        case 'capitalize':
            cssClasses.push('capitalize');
            break;
    }

    switch (settings['textPosition']) {
        case 'start':
            cssClasses.push('divider-start');
            break;
        case 'end':
            cssClasses.push('divider-end');
            break;
    }

    const allThicknessesHorizontal  : { [key: string]: any } = {
        thickness_1: 'before:h-1 after:h-1',
        thickness_2: 'before:h-2 after:h-2',
        thickness_3: 'before:h-3 after:h-3',
        thickness_4: 'before:h-4 after:h-4',
        thickness_5: 'before:h-5 after:h-5',
        thickness_8: 'before:h-8 after:h-8',
        thickness_10: 'before:h-10 after:h-10'
    }
    const allThicknessesVertical  : { [key: string]: any } = {
        thickness_1: 'before:!w-1 after:!w-1',
        thickness_2: 'before:!w-2 after:!w-2',
        thickness_3: 'before:!w-3 after:!w-3',
        thickness_4: 'before:!w-4 after:!w-4',
        thickness_5: 'before:!w-5 after:!w-5',
        thickness_8: 'before:!w-8 after:!w-8',
        thickness_10: 'before:!w-10 after:!w-10'
    }
    if(settings['dividerLineThickness'] && settings['dividerLineThickness'] !== 'default' && settings['dividerLineThickness'] !== '') {
        const dividerLineThicknessClass = direction === 'horizontal' ?
            `${allThicknessesHorizontal[settings['dividerLineThickness']]}` :
            `${allThicknessesVertical[settings['dividerLineThickness']]}`;
    cssClasses.push(`${dividerLineThicknessClass}`);
    }

    const allMarginsHorizontal : { [key: string]: any } = {
        margin_2: 'my-2',
        margin_3: 'my-3',
        margin_4: 'my-4',
        margin_6: 'my-6',
        margin_8: 'my-8',
        margin_10: 'my-10',
        margin_12: 'my-12',
        margin_16: 'my-16',
        margin_20: 'my-20'
    }
    const allMarginsVertical : { [key: string]: any } = {
        margin_2: 'mx-2',
        margin_3: 'mx-3',
        margin_4: 'mx-4',
        margin_6: 'mx-6',
        margin_8: 'mx-8',
        margin_10: 'mx-10',
        margin_12: 'mx-12',
        margin_16: 'mx-16',
        margin_20: 'mx-20'
    }
    if(settings['dividerLineMargin'] && settings['dividerLineMargin'] !== 'default' && settings['dividerLineMargin'] !== '') {
        const dividerLineMarginClass = direction === 'horizontal' ? 
            `${allMarginsHorizontal[settings['dividerLineMargin']]}` :
            `${allMarginsVertical[settings['dividerLineMargin']]}`;
        cssClasses.push(`${dividerLineMarginClass}`);
    }

    const allLengthsHorizontal : { [key: string]: any } = {
        length_56: 'w-5/6',
        length_46: 'w-4/5',
        length_34: 'w-3/4',
        length_23: 'w-2/3',
        length_35: 'w-3/5',
        length_12: 'w-1/2',
        length_25: 'w-2/5',
        length_13: 'w-1/3',
        length_14: 'w-1/4',
        length_15: 'w-1/5',
        length_16: 'w-1/6'
    }
    const allLengthsVertical : { [key: string]: any } = {
        length_56: 'h-5/6',
        length_46: 'h-4/5',
        length_34: 'h-3/4',
        length_23: 'h-2/3',
        length_35: 'h-3/5',
        length_12: 'h-1/2',
        length_25: 'h-2/5',
        length_13: 'h-1/3',
        length_14: 'h-1/4',
        length_15: 'h-1/5',
        length_16: 'h-1/6'
    }
    if(settings['dividerLineLength'] && settings['dividerLineLength'] !== 'default' && settings['dividerLineLength'] !== '') {
        const dividerLineLengthClass = direction === 'horizontal' ? 
            `mx-auto ${allLengthsHorizontal[settings['dividerLineLength']]}` :
            `my-auto ${allLengthsVertical[settings['dividerLineLength']]}`;
        cssClasses.push(`${dividerLineLengthClass}`);
    }

    return cssClasses;
}
