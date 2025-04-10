export function convertRecordToStyles(
    records: Record<string, string>
): string[] {
    const cssClasses: string[] = [];
    switch (records['columnsOnDesktop']) {
        case 'c1':
            cssClasses.push('lg:grid-cols-1');
            break;
        case 'c2':
            cssClasses.push('lg:grid-cols-2');
            break;
        case 'c3':
            cssClasses.push('lg:grid-cols-3');
            break;
        case 'c4':
            cssClasses.push('lg:grid-cols-4');
            break;
        default:
            cssClasses.push('lg:grid-cols-3');
            break;
    }
    switch (records['columnsOnTablet']) {
        case 'c1':
            cssClasses.push('md:grid-cols-1');
            break;
        case 'c2':
            cssClasses.push('md:grid-cols-2');
            break;
        case 'c3':
            cssClasses.push('md:grid-cols-3');
            break;
        case 'c4':
            cssClasses.push('md:grid-cols-4');
            break;
        default:
            cssClasses.push('md:grid-cols-2');
            break;
    }
    switch (records['columnsOnMobile']) {
        case 'c1':
            cssClasses.push('grid-cols-1');
            break;
        case 'c2':
            cssClasses.push('grid-cols-2');
            break;
        case 'c3':
            cssClasses.push('grid-cols-3');
            break;
        case 'c4':
            cssClasses.push('grid-cols-4');
            break;
        default:
            cssClasses.push('grid-cols-1');
            break;
    }
    return cssClasses;
}
