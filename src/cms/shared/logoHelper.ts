export function getClassForLogo(resolution: string | undefined | null): string {
    const logoResolution = resolution ?? '8';
    let logoSizeCss = '';
    switch (logoResolution) {
        case '16':
            logoSizeCss = 'h-16';
            break;
        case '32':
            logoSizeCss = 'h-32';
            break;
        default:
            logoSizeCss = 'h-8';
            break;
    }
    return logoSizeCss;
}
