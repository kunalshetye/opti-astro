import type { DisplaySettingsFragment } from '../../../../__generated/sdk';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers';

export interface CarouselStyleConfig {
    carouselHeight: string;
    imageFit: string;
    carouselAlignment: string;
    itemsPerViewDesktop: number;
    itemsPerViewTablet: number;
    itemsPerViewMobile: number;
    spaceBetween: number;
    showNavigation: boolean;
    showPagination: boolean;
    enableAutoplay: boolean;
    autoplayDelay: number;
    enableLoop: boolean;
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

const imageFitMap: Record<string, string> = {
    'object_cover': 'object-cover',
    'object_contain': 'object-contain',
    'object_fill': 'object-fill'
};

const alignmentMap: Record<string, string> = {
    'full_width': 'w-full',
    'centered_large': 'max-w-6xl mx-auto',
    'centered_medium': 'max-w-4xl mx-auto',
    'centered_small': 'max-w-2xl mx-auto'
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

export function getCarouselStyleConfig(
    displaySettings: DisplaySettingsFragment[],
    displayTemplateKey?: string
): CarouselStyleConfig {
    const settingsDict = getDictionaryFromDisplaySettings(displaySettings);
    
    // Determine carousel mode from settings or fallback to template key
    const carouselMode = settingsDict['carouselMode'] || 
        (displayTemplateKey === 'ContentCarousel' ? 'content' : 'standard');
    const isContentCarousel = carouselMode === 'content';

    return {
        // Height settings - different defaults based on mode
        carouselHeight: heightMap[settingsDict['carousel_height']] || (isContentCarousel ? 'h-auto' : 'h-96'),
        
        // Image fit settings
        imageFit: imageFitMap[settingsDict['image_fit']] || 'object-cover',
        
        // Alignment settings
        carouselAlignment: alignmentMap[settingsDict['carousel_alignment']] || 'w-full',
        
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
        enableLoop: settingsDict['loop'] !== 'false'
    };
}

export function getCarouselMode(displaySettings: DisplaySettingsFragment[], displayTemplateKey?: string): 'standard' | 'content' {
    const settingsDict = getDictionaryFromDisplaySettings(displaySettings);
    const carouselMode = settingsDict['carouselMode'] || 
        (displayTemplateKey === 'ContentCarousel' ? 'content' : 'standard');
    return carouselMode as 'standard' | 'content';
}