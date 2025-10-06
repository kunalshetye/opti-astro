import type { DisplaySettingsFragment } from '../../../../__generated/sdk';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers';

export interface CarouselRowStyleConfig {
    carouselMode: 'standard' | 'content';
    carouselWidth: string;
    carouselHeight: string;
    itemsPerViewDesktop: number;
    itemsPerViewTablet: number;
    itemsPerViewMobile: number;
    spaceBetween: number;
    showNavigation: boolean;
    showPagination: boolean;
    enableAutoplay: boolean;
    autoplayDelay: number;
    enableLoop: boolean;
    transitionSpeed: number;
}

const widthMap: Record<string, string> = {
        'full': 'w-full',
        'container': 'container mx-auto px-8',
        'max7xl': 'max-w-7xl w-full mx-auto px-8',
        'max6xl': 'max-w-6xl w-full mx-auto px-8',
        'max5xl': 'max-w-5xl w-full mx-auto px-8',
        'max4xl': 'max-w-4xl w-full mx-auto px-8',
        'max3xl': 'max-w-3xl w-full mx-auto px-8',
        'max2xl': 'max-w-2xl w-full mx-auto px-8',
        'maxXl': 'max-w-xl w-full mx-auto px-8',
        'maxLg': 'max-w-lg w-full mx-auto px-8',
        'maxMd': 'max-w-md w-full mx-auto px-8',
        'maxSm': 'max-w-sm w-full mx-auto px-8',
        'maxXs': 'max-w-xs w-full mx-auto px-8',
        'inherit': 'w-full',
};


const heightMap: Record<string, string> = {
    'h_auto': 'h-auto',
    'h_64': 'h-64',
    'h_80': 'h-80',
    'h_96': 'h-96',
    'h_112': 'h-112',
    'h_128': 'h-128',
    'h_144': 'h-144',
    'h_screen': 'h-screen'
};

const itemsMap: Record<string, number> = {
    'items1': 1,
    'items2': 2,
    'items3': 3,
    'items4': 4,
    'items5': 5
};

const spaceMap: Record<string, number> = {
    'space16': 16,
    'space24': 24,
    'space32': 32
};

const autoplayDelayMap: Record<string, number> = {
    'delay3s': 3000,
    'delay5s': 5000,
    'delay7s': 7000,
    'delay10s': 10000
};

const transitionSpeedMap: Record<string, number> = {
    'speed300': 300,
    'speed500': 500,
    'speed800': 800,
    'speed1000': 1000
};

export function getCarouselRowStyleConfig(
    displaySettings: DisplaySettingsFragment[]
): CarouselRowStyleConfig {
    const settingsDict = getDictionaryFromDisplaySettings(displaySettings);

    // Determine carousel mode
    const carouselMode = settingsDict['carouselMode'] || 'standard';
    const isContentCarousel = carouselMode === 'content';

    return {
        // Carousel mode
        carouselMode: carouselMode as 'standard' | 'content',

        // Width settings
        carouselWidth: widthMap[settingsDict['carouselWidth']] || 'w-full',

        // Height settings - different defaults based on mode
        carouselHeight: heightMap[settingsDict['carouselHeight']] || (isContentCarousel ? 'h-auto' : 'h-96'),

        // Content carousel specific settings (only used when mode = 'content')
        itemsPerViewDesktop: itemsMap[settingsDict['itemsPerViewDesktop']] || 3,
        itemsPerViewTablet: itemsMap[settingsDict['itemsPerViewTablet']] || 2,
        itemsPerViewMobile: itemsMap[settingsDict['itemsPerViewMobile']] || 1,
        spaceBetween: spaceMap[settingsDict['spaceBetween']] || 24,

        // Configuration from display settings
        showNavigation: settingsDict['showNavigation'] !== 'false',
        showPagination: settingsDict['showPagination'] !== 'false',
        enableAutoplay: settingsDict['autoplay'] === 'true',
        autoplayDelay: autoplayDelayMap[settingsDict['autoplayDelay']] || 5000,
        enableLoop: settingsDict['loop'] !== 'false',
        transitionSpeed: transitionSpeedMap[settingsDict['transitionSpeed']] || 500
    };
}
