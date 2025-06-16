import type { DisplaySettingsFragment } from '../../../__generated/sdk';
import { getDictionaryFromDisplaySettings } from '../../graphql/shared/displaySettingsHelpers';

// Animation configuration interfaces
export interface AnimationSettings {
    entrance?: string;
    hover?: string;
    scroll?: string;
    duration?: string;
    delay?: string;
    easing?: string;
}

export interface AnimationClasses {
    base: string[];
    entrance: string[];
    hover: string[];
    scroll: string[];
}

// Animation presets using custom CSS animations from global.css
export const ANIMATION_PRESETS = {
    entrance: {
        none: '',
        fade_in: 'animate-fade-in',
        slide_up: 'animate-slide-up',
        slide_down: 'animate-slide-down',
        slide_left: 'animate-slide-left',
        slide_right: 'animate-slide-right',
        scale_up: 'animate-scale-up',
        bounce_in: 'animate-bounce-in',
        typewriter: 'animate-typewriter',
        typewriter_cursor: 'animate-typewriter-cursor',
        typewriter_fast: 'animate-typewriter-fast',
        typewriter_slow: 'animate-typewriter-slow'
    },
    hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300',
        scale: 'hover:scale-105 transition-transform duration-300',
        scale_down: 'hover:scale-95 transition-transform duration-300',
        tilt: 'hover:rotate-3 transition-transform duration-300',
        bounce: 'hover:-translate-y-2 transition-all duration-300'
    },
    scroll: {
        none: '',
        fade_in_up: 'animate-slide-up',
        fade_in_down: 'animate-slide-down',
        fade_in_left: 'animate-slide-left',
        fade_in_right: 'animate-slide-right',
        scale_in: 'animate-scale-up',
        bounce_in: 'animate-bounce-in'
    },
    duration: {
        fast: 'animate-fade-in-fast',
        normal: '', // default
        slow: 'animate-fade-in-slow',
        slower: 'animate-fade-in-slow',
        slowest: 'animate-fade-in-slow',
        typewriter_fast: 'animate-typewriter-fast',
        typewriter_slow: 'animate-typewriter-slow'
    },
    delay: {
        none: '',
        short: 'delay-150',
        medium: 'delay-300',
        long: 'delay-500',
        longer: 'delay-700'
    },
    easing: {
        linear: '', // handled by keyframes
        ease: '',
        ease_in: '',
        ease_out: '',
        ease_in_out: '',
        bounce: '',
        elastic: ''
    }
};

/**
 * Extract animation settings from display settings
 */
export function getAnimationSettings(displaySettings: DisplaySettingsFragment[], animationProperty: string = 'animation_entrance'): AnimationSettings {
    const settings = getDictionaryFromDisplaySettings(displaySettings);
    
    return {
        entrance: settings[animationProperty] || 'none',
        hover: settings['animation_hover'] || 'none',
        scroll: settings['animation_scroll'] || 'none',
        duration: settings['animation_duration'] || 'normal',
        delay: settings['animation_delay'] || 'none',
        easing: settings['animation_easing'] || 'ease_out'
    };
}

/**
 * Generate animation classes based on animation settings
 */
export function getAnimationClasses(animationSettings: AnimationSettings): AnimationClasses {
    const base: string[] = [];
    const entrance: string[] = [];
    const hover: string[] = [];
    const scroll: string[] = [];

    // Add delay to base classes
    if (animationSettings.delay && animationSettings.delay !== 'none') {
        const delayClass = ANIMATION_PRESETS.delay[animationSettings.delay as keyof typeof ANIMATION_PRESETS.delay];
        if (delayClass) base.push(delayClass);
    }

    // Handle entrance animation with duration override
    if (animationSettings.entrance && animationSettings.entrance !== 'none') {
        let entranceClass = ANIMATION_PRESETS.entrance[animationSettings.entrance as keyof typeof ANIMATION_PRESETS.entrance];
        
        // Override with duration-specific class if needed
        if (animationSettings.duration && animationSettings.duration !== 'normal') {
            const durationClass = ANIMATION_PRESETS.duration[animationSettings.duration as keyof typeof ANIMATION_PRESETS.duration];
            if (durationClass) {
                entranceClass = durationClass;
            }
        }
        
        if (entranceClass) {
            entrance.push(entranceClass);
        }
    }

    // Add hover animation
    if (animationSettings.hover && animationSettings.hover !== 'none') {
        const hoverClass = ANIMATION_PRESETS.hover[animationSettings.hover as keyof typeof ANIMATION_PRESETS.hover];
        if (hoverClass) {
            hover.push(hoverClass);
        }
    }

    // Add scroll animation (same as entrance for now)
    if (animationSettings.scroll && animationSettings.scroll !== 'none') {
        const scrollClass = ANIMATION_PRESETS.scroll[animationSettings.scroll as keyof typeof ANIMATION_PRESETS.scroll];
        if (scrollClass) {
            scroll.push(scrollClass);
        }
    }

    return { base, entrance, hover, scroll };
}

/**
 * Convenience function to get all animation classes from display settings
 */
export function getAnimationClassesFromDisplaySettings(displaySettings: DisplaySettingsFragment[], animationProperty: string = 'animation_entrance'): AnimationClasses {
    const animationSettings = getAnimationSettings(displaySettings, animationProperty);
    return getAnimationClasses(animationSettings);
}

/**
 * Combine animation classes into a single array for class:list
 */
export function combineAnimationClasses(animationClasses: AnimationClasses): string[] {
    return [
        ...animationClasses.base,
        ...animationClasses.entrance,
        ...animationClasses.hover,
        ...animationClasses.scroll
    ].filter(cls => cls.length > 0);
}

/**
 * Get animation classes as a single space-separated string
 */
export function getAnimationClassString(displaySettings: DisplaySettingsFragment[]): string {
    const animationClasses = getAnimationClassesFromDisplaySettings(displaySettings);
    return combineAnimationClasses(animationClasses).join(' ');
}

/**
 * Check if reduced motion is preferred (for accessibility)
 * This can be used in components to conditionally apply animations
 */
export function shouldReduceMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Apply animations conditionally based on reduced motion preference
 */
export function getAccessibleAnimationClasses(displaySettings: DisplaySettingsFragment[], animationProperty: string = 'animation_entrance'): string[] {
    if (shouldReduceMotion()) {
        return ['motion-reduce:motion-opacity-in-0']; // Only apply opacity animation for reduced motion
    }
    return combineAnimationClasses(getAnimationClassesFromDisplaySettings(displaySettings, animationProperty));
}