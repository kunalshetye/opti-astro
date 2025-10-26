import type { DisplaySettingsFragment } from '../../../../__generated/sdk';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers';

export interface CarouselRowStyleConfig {
    carouselMode: 'standard' | 'content';
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

    // Use individual settings for items per view
    const itemsDesktop = itemsMap[settingsDict['itemsPerViewDesktop']] || 3;
    const itemsTablet = itemsMap[settingsDict['itemsPerViewTablet']] || 2;
    const itemsMobile = itemsMap[settingsDict['itemsPerViewMobile']] || 1;

    return {
        // Carousel mode
        carouselMode: carouselMode as 'standard' | 'content',

        // Height settings - different defaults based on mode
        carouselHeight: heightMap[settingsDict['carouselHeight']] || (isContentCarousel ? 'h-auto' : 'h-96'),

        // Content carousel specific settings (only used when mode = 'content')
        itemsPerViewDesktop: itemsDesktop,
        itemsPerViewTablet: itemsTablet,
        itemsPerViewMobile: itemsMobile,
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
