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
    fallbackType: 'rewrite' as 'redirect' | 'rewrite',
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
 * Example: 'nb-no' -> 'nb_NO', 'pt-br' -> 'pt_BR', 'fr-ca' -> 'fr_CA'
 * Handles case conversion for region codes
 */
export function denormalizeLocale(locale: string): string {
    // First convert hyphens to underscores
    let result = locale.replace(/-/g, '_');
    
    // If there's a region part (after underscore), make it uppercase
    const parts = result.split('_');
    if (parts.length === 2) {
        result = parts[0].toLowerCase() + '_' + parts[1].toUpperCase();
    } else {
        result = result.toLowerCase();
    }
    
    return result;
}

/**
 * Check if a locale code looks valid (basic format validation)
 * Accepts patterns like: en, de, fr, en-US, pt-br, nb-no, zh-cn, etc.
 * Case-insensitive for the region part to handle both pt-BR and pt-br
 */
export function isValidLocale(locale: string): boolean {
    // Basic regex for locale format: 2-3 letters, optionally followed by dash and 2-3 letters/numbers (case-insensitive)
    const localePattern = /^[a-z]{2,3}(-[a-zA-Z0-9]{2,3})?$/i;
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
    let cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    // Ensure trailing slash for consistency with CMS
    if (!cleanPath.endsWith('/')) {
        cleanPath = cleanPath + '/';
    }
    
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

/**
 * Get fallback strategy details for a locale
 * Returns information needed to implement Astro i18n-style fallback
 */
export function getFallbackStrategy(locale: string): {
    fallbackLocale: string;
    fallbackType: 'redirect' | 'rewrite';
    needsFallback: boolean;
} {
    const config = getConfig();
    const fallbackLocale = getFallbackLocale(locale);
    
    return {
        fallbackLocale,
        fallbackType: config.fallbackType || 'rewrite',
        needsFallback: locale !== fallbackLocale && fallbackLocale !== config.defaultLocale
    };
}

/**
 * Apply Astro i18n-style fallback behavior
 * Returns either a Response (for redirect) or locale to use for content (for rewrite)
 */
export function applyFallbackStrategy(
    requestedLocale: string, 
    currentPath: string,
    hasContent: boolean
): { response?: Response; localeToUse?: string } {
    const config = getConfig();
    
    if (hasContent) {
        // Content exists for requested locale, no fallback needed
        return { localeToUse: requestedLocale };
    }
    
    const fallbackLocale = getFallbackLocale(requestedLocale);
    
    // If fallback is the same as requested, return 404
    if (fallbackLocale === requestedLocale) {
        return {};
    }
    
    if (config.fallbackType === 'redirect') {
        // Redirect strategy: redirect to fallback locale URL
        const fallbackPath = getPathWithoutLocale(currentPath);
        const fallbackUrl = getRelativeLocaleUrl(fallbackLocale, fallbackPath);
        
        return {
            response: new Response(null, {
                status: 302,
                headers: {
                    'Location': fallbackUrl
                }
            })
        };
    } else {
        // Rewrite strategy: serve fallback locale content at original URL
        return { localeToUse: fallbackLocale };
    }
}

/**
 * Complex fallback content resolution logic
 * Attempts to fetch content with fallback chain:
 * 1. Try requested locale
 * 2. Try configured fallback locale
 * 3. Try generic fallback (English)
 * Returns the content response and metadata about which locale was used
 */
export async function resolveContentWithFallback(
    getOptimizelySdk: any,
    contentPayload: any,
    urlBase: string,
    urlPath: string,
    requestedLocale: string,
    enableDebugLogs: boolean = false
): Promise<{
    contentResponse: any;
    actualLocaleUsed: string;
    shouldRedirect404: boolean;
}> {
    const urlPathNoSlash = urlPath.replace(/\/$/, '');
    
    // First, try to get content in the requested locale
    let contentByPathResponse;
    try {
        if (enableDebugLogs) {
            console.log(`🔍 Initial query: locale=${requestedLocale}, url=${urlPath}`);
        }
        contentByPathResponse = await getOptimizelySdk(contentPayload).contentByPath({
            base: urlBase,
            url: urlPath,
            urlNoSlash: urlPathNoSlash
        });
        if (enableDebugLogs) {
            console.log(`📊 Initial response: key=${contentByPathResponse._Content?.item?._metadata?.key}, ver=${contentByPathResponse._Content?.item?._metadata?.version}`);
        }
    } catch (error) {
        if (enableDebugLogs) {
            console.log(`❌ Initial query failed for ${requestedLocale}`);
        }
        contentByPathResponse = { _Content: null };
    }
    
    const hasContent = !!(
        contentByPathResponse._Content &&
        contentByPathResponse._Content.item &&
        contentByPathResponse._Content.item._metadata?.key
    );
    
    // If content found, return it
    if (hasContent) {
        return {
            contentResponse: contentByPathResponse,
            actualLocaleUsed: requestedLocale,
            shouldRedirect404: false
        };
    }
    
    // Apply fallback strategy
    const fallbackResult = applyFallbackStrategy(requestedLocale, urlPath, false);
    
    if (fallbackResult.response) {
        // Redirect strategy - let the caller handle the redirect
        return {
            contentResponse: null,
            actualLocaleUsed: requestedLocale,
            shouldRedirect404: false
        };
    }
    
    if (!fallbackResult.localeToUse) {
        // No fallback available
        return {
            contentResponse: null,
            actualLocaleUsed: requestedLocale,
            shouldRedirect404: true
        };
    }
    
    // Try fallback locale
    const fallbackPayload = { ...contentPayload };
    fallbackPayload.loc = localeToSdkLocale(fallbackResult.localeToUse);
    
    // Construct fallback URL with proper locale prefix
    const pathWithoutLocale = getPathWithoutLocale(urlPath);
    const fallbackUrlPath = getRelativeLocaleUrl(fallbackResult.localeToUse, pathWithoutLocale);
    const fallbackUrlPathNoSlash = fallbackUrlPath.replace(/\/$/, '');
    
    if (enableDebugLogs) {
        console.log(`🔄 Fallback query: locale=${fallbackResult.localeToUse}, url=${fallbackUrlPath}, pathWithoutLocale=${pathWithoutLocale}`);
    }
    
    const fallbackResponse = await getOptimizelySdk(fallbackPayload).contentByPath({
        base: urlBase,
        url: fallbackUrlPath,
        urlNoSlash: fallbackUrlPathNoSlash
    });
    
    if (fallbackResponse._Content?.item?._metadata?.key) {
        if (enableDebugLogs) {
            console.log(`📊 Fallback response: key=${fallbackResponse._Content.item._metadata.key}, ver=${fallbackResponse._Content.item._metadata.version}`);
        }
        return {
            contentResponse: fallbackResponse,
            actualLocaleUsed: fallbackResult.localeToUse,
            shouldRedirect404: false
        };
    }
    
    // Try generic fallback (English) if different from already tried fallback
    const config = getConfig();
    if (fallbackResult.localeToUse !== config.genericFallback) {
        const genericPayload = { ...contentPayload };
        genericPayload.loc = localeToSdkLocale(config.genericFallback);
        
        // Use the same fallback URL path but with English locale
        const genericFallbackResponse = await getOptimizelySdk(genericPayload).contentByPath({
            base: urlBase,
            url: fallbackUrlPath,
            urlNoSlash: fallbackUrlPathNoSlash
        });
        
        if (genericFallbackResponse._Content?.item?._metadata?.key) {
            if (enableDebugLogs) {
                console.log(`📊 Generic fallback response: key=${genericFallbackResponse._Content.item._metadata.key}`);
            }
            return {
                contentResponse: genericFallbackResponse,
                actualLocaleUsed: config.genericFallback,
                shouldRedirect404: false
            };
        }
    }
    
    // No content found in any fallback
    return {
        contentResponse: null,
        actualLocaleUsed: requestedLocale,
        shouldRedirect404: true
    };
}