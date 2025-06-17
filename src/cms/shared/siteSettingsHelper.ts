import type { MenuItem } from '../../../__generated/sdk';

export function getMenuItems(item: MenuItem) {
    console.log('item', item);
}

export function getClassForLogo(resolution: string | undefined | null): string {
    const logoResolution = resolution ?? '12';
    let logoSizeCss = '';
    switch (logoResolution) {
        case '32':
            logoSizeCss = 'h-32';
            break;
        case '16':
            logoSizeCss = 'h-16';
            break;
        case '12':
            logoSizeCss = 'h-12';
            break;
        case '10':
            logoSizeCss = 'h-10';
            break;
        case '8':
            logoSizeCss = 'h-8';
            break;
        default:
            logoSizeCss = 'h-12';
            break;
    }
    return logoSizeCss;
}
