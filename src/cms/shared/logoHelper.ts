export function getClassForLogo(resolution: string | undefined | null): string {
    const logoResolution = resolution ?? '8';
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
        default:
            logoSizeCss = 'h-8';
            break;
    }
    return logoSizeCss;
}
