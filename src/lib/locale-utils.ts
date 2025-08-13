/**
 * Custom locale utilities to replace Astro's built-in i18n system
 * Provides dynamic locale support that works with CMS-defined languages
 * No dependency on SDK - truly dynamic locale detection
 */

// Default configuration - will be overridden by astro.config.mjs settings
let localeConfig = {
    defaultLocale: 'en',
    fallback: {} as Record<string, string>,
    genericFallback: 'en',
    prefixDefaultLocale: false,
};

// Flag to track if config has been loaded
let configLoaded = false;

// Load configuration from astro.config.mjs
async function loadLocaleConfig() {
    if (!configLoaded) {
        try {
            // Import the locale configuration from astro.config.mjs
            const config = await import('../../astro.config.mjs');
            if (config.localeConfig) {
                localeConfig = { ...localeConfig, ...config.localeConfig };
            }
        } catch (error) {
            console.warn('Could not load locale config from astro.config.mjs, using defaults');
        }
        configLoaded = true;
    }
    return localeConfig;
}

// Initialize config (call this once at startup)
export async function initializeLocaleConfig() {
    return await loadLocaleConfig();
}

// Get current config (synchronous)
function getConfig() {
    return localeConfig;
}

// Export default locale for backward compatibility
export const DEFAULT_LOCALE = localeConfig.defaultLocale;

/**
 * Convert GraphQL API locale format (with underscores) to URL-friendly format (with hyphens)
 * Example: 'nb_NO' -> 'nb-NO'
 */
export function normalizeLocale(locale: string): string {
    return locale.replace(/_/g, '-');
}

/**
 * Convert URL-friendly locale format back to GraphQL API format
 * Example: 'nb-NO' -> 'nb_NO'
 */
export function denormalizeLocale(locale: string): string {
    return locale.replace(/-/g, '_');
}

/**
 * Check if a locale code looks valid (basic format validation)
 * Accepts patterns like: en, de, fr, en-US, nb-NO, zh-CN, etc.
 */
export function isValidLocale(locale: string): boolean {
    // Basic regex for locale format: 2-3 letters, optionally followed by dash and 2-3 letters/numbers
    const localePattern = /^[a-z]{2,3}(-[A-Z0-9]{2,3})?$/;
    return localePattern.test(locale);
}

/**
 * Extract locale from URL pathname
 * Supports patterns like:
 * - /en/path -> 'en'
 * - /de/about -> 'de'  
 * - /path -> configured default locale (no locale prefix)
 */
export function getLocaleFromPath(pathname: string): string {
    const config = getConfig();
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length === 0) {
        return config.defaultLocale;
    }
    
    const potentialLocale = segments[0];
    
    if (isValidLocale(potentialLocale)) {
        return potentialLocale;
    }
    
    return config.defaultLocale;
}

/**
 * Get current locale from Astro context
 * Fallback to extracting from URL if context is not available
 */
export function getCurrentLocale(astroContext?: { url?: URL }): string {
    if (astroContext?.url) {
        return getLocaleFromPath(astroContext.url.pathname);
    }
    
    // Fallback for when called outside Astro context
    if (typeof window !== 'undefined') {
        return getLocaleFromPath(window.location.pathname);
    }
    
    const config = getConfig();
    return config.defaultLocale;
}

/**
 * Generate locale-aware URL
 * Uses configuration from astro.config.mjs
 */
export function getRelativeLocaleUrl(locale: string | undefined, path: string): string {
    const config = getConfig();
    // Normalize inputs
    const normalizedLocale = locale ? normalizeLocale(locale) : config.defaultLocale;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    // Check if we should prefix default locale based on configuration
    if (normalizedLocale === config.defaultLocale && !config.prefixDefaultLocale) {
        return cleanPath;
    }
    
    // Add locale prefix
    return `/${normalizedLocale}${cleanPath}`;
}

/**
 * Remove locale prefix from path
 * Useful for getting the base path without locale
 */
export function getPathWithoutLocale(pathname: string): string {
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length === 0) {
        return '/';
    }
    
    const potentialLocale = segments[0];
    
    if (isValidLocale(potentialLocale)) {
        // Remove locale segment and reconstruct path
        const pathSegments = segments.slice(1);
        return pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '/';
    }
    
    return pathname;
}

/**
 * Get fallback locale for a given locale
 * Uses configured fallbacks from astro.config.mjs
 */
export function getFallbackLocale(locale: string): string {
    const config = getConfig();
    
    // Check if there's a specific fallback configured for this locale
    if (config.fallback[locale]) {
        return config.fallback[locale];
    }
    
    // Check if the locale is the default locale
    if (locale === config.defaultLocale) {
        return config.defaultLocale;
    }
    
    // Use generic fallback
    return config.genericFallback;
}

/**
 * Convert locale to GraphQL API format
 * Simply converts hyphens to underscores - no SDK dependency
 */
export function localeToSdkLocale(locale: string): string {
    return denormalizeLocale(locale);
}

/**
 * Generate alternative locale URLs for language switching
 * Since we don't have a predefined list of locales, this function
 * can be used with a list of locales passed from the CMS
 */
export function getAlternativeLocaleUrls(currentPath: string, availableLocales: string[]): Array<{locale: string, url: string}> {
    const basePath = getPathWithoutLocale(currentPath);
    
    return availableLocales.map(locale => ({
        locale,
        url: getRelativeLocaleUrl(locale, basePath)
    }));
}