export function getAssetWidthClass(dictionary: Record<string, string>): string {
    const widthValue = dictionary['assetWidth'];
    switch (widthValue) {
        case 'flex_1': return 'flex-1';
        case 'w_1_4': return 'w-1/4';
        case 'w_1_3': return 'w-1/3';
        case 'w_2_5': return 'w-2/5';
        case 'w_1_2': return 'w-1/2';
        case 'w_3_5': return 'w-3/5';
        case 'w_2_3': return 'w-2/3';
        case 'w_3_4': return 'w-3/4';
        default: return 'flex-1';
    }
}

export function getMdAssetWidthClass(dictionary: Record<string, string>): string {
    const widthValue = dictionary['assetWidth'];
    switch (widthValue) {
        case 'flex_1': return 'md:flex-1';
        case 'w_1_4': return 'md:w-1/4';
        case 'w_1_3': return 'md:w-1/3';
        case 'w_2_5': return 'md:w-2/5';
        case 'w_1_2': return 'md:w-1/2';
        case 'w_3_5': return 'md:w-3/5';
        case 'w_2_3': return 'md:w-2/3';
        case 'w_3_4': return 'md:w-3/4';
        default: return 'md:w-1/2';
    }
}

export function getContentWidthClass(dictionary: Record<string, string>): string {
    const widthValue = dictionary['contentWidth'];
    switch (widthValue) {
        case 'flex_1': return 'flex-1';
        case 'w_1_4': return 'w-1/4';
        case 'w_1_3': return 'w-1/3';
        case 'w_2_5': return 'w-2/5';
        case 'w_1_2': return 'w-1/2';
        case 'w_3_5': return 'w-3/5';
        case 'w_2_3': return 'w-2/3';
        case 'w_3_4': return 'w-3/4';
        default: return 'flex-1';
    }
}

export function getMdContentWidthClass(dictionary: Record<string, string>): string {
    const widthValue = dictionary['contentWidth'];
    switch (widthValue) {
        case 'flex_1': return 'md:flex-1';
        case 'w_1_4': return 'md:w-1/4';
        case 'w_1_3': return 'md:w-1/3';
        case 'w_2_5': return 'md:w-2/5';
        case 'w_1_2': return 'md:w-1/2';
        case 'w_3_5': return 'md:w-3/5';
        case 'w_2_3': return 'md:w-2/3';
        case 'w_3_4': return 'md:w-3/4';
        default: return 'md:w-1/2';
    }
}
