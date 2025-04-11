// Define layout patterns based on number of elements
export const getLayoutPattern = (count: number) => {
    switch (count) {
        case 1:
            return [12]; // One full-width card
        case 2:
            return [8, 4]; // Left large, right small
        case 3:
            return [8, 4, 12]; // 2-row layout
        case 4:
            return [8, 4, 5, 7]; // 2-row mixed layout
        case 5:
            return [12, 4, 8, 5, 7]; // Mixed layout
        case 6:
            return [8, 4, 6, 6, 4, 8]; // Balanced layout
        case 7:
            return [8, 4, 5, 7, 4, 4, 4]; // Mixed sizes
        case 8:
            return [6, 6, 4, 8, 8, 4, 6, 6]; // Balanced with variety
        case 9:
            return [12, 4, 8, 5, 7, 4, 4, 4, 12]; // Symmetric layout
        case 10:
            return [6, 6, 4, 8, 8, 4, 4, 4, 4, 12]; // Mixed layout
        case 11:
            return [12, 6, 6, 4, 8, 8, 4, 4, 4, 4, 12]; // Bookended layout
        case 12:
            return [4, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4]; // Even distribution
        default:
            // For more than 12 elements, create a repeating pattern
            const basePattern = [8, 4, 5, 7, 6, 6, 4, 8, 4, 4, 4, 12];
            const pattern = [];

            // Fill the pattern to match the count
            for (let i = 0; i < count; i++) {
                pattern.push(basePattern[i % basePattern.length]);
            }

            return pattern;
    }
};

export const cssMdClasses: Record<number, string> = {
    12: 'md:col-span-12',
    11: 'md:col-span-11',
    10: 'md:col-span-10',
    9: 'md:col-span-9',
    8: 'md:col-span-8',
    7: 'md:col-span-7',
    6: 'md:col-span-6',
    5: 'md:col-span-5',
    4: 'md:col-span-4',
    3: 'md:col-span-3',
    2: 'md:col-span-2',
    1: 'md:col-span-1',
};

export const cssClasses: Record<number, string> = {
    12: 'col-span-12',
    11: 'col-span-11',
    10: 'col-span-10',
    9: 'col-span-9',
    8: 'col-span-8',
    7: 'col-span-7',
    6: 'col-span-6',
    5: 'col-span-5',
    4: 'col-span-4',
    3: 'col-span-3',
    2: 'col-span-2',
    1: 'col-span-1',
};
