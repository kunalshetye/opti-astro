/**
 * Locale utility helpers for GraphQL integration
 * Provides locale format conversion for Optimizely Graph API
 */

import { getRelativeLocaleUrl } from 'astro:i18n';

/**
 * Astro i18n configuration interface
 */
export interface AstroI18nConfig {
    i18n: {
        locales: string[];
        defaultLocale: string;
        routing?: {
            prefixDefaultLocale?: boolean;
            fallbackType?: string;
        };
        fallback?: Record<string, string>;
    };
}

/**
 * GraphQL content payload interface
 */
export interface ContentPayload {
    loc: string;
    [key: string]: any;
}

/**
 * Optimizely SDK methods interface
 */
export interface OptimizelySdk {
    contentByPath: (params: {
        base: string;
        url: string;
        urlNoSlash: string;
    }) => Promise<any>;
    contentByPathVariant: (params: {
        base: string;
        url: string;
        urlNoSlash: string;
        variation: string;
    }) => Promise<any>;
}

/**
 * Function type for getting Optimizely SDK with payload
 */
export type GetOptimizelySdk = (payload: ContentPayload) => OptimizelySdk;

/**
 * Convert URL-friendly locale format to GraphQL API format
 * Examples:
 * - 2-part: 'fr-ca' -> 'fr_CA', 'pt-br' -> 'pt_BR'
 * - 3-part: 'zh-Hans-HK' -> 'zh_Hans_HK', 'zh-Hant-TW' -> 'zh_Hant_TW'
 * Handles case conversion for language, script, and region codes
 */
export function localeToSdkLocale(locale: string): string {
    // First convert hyphens to underscores
    let result = locale.replace(/-/g, '_');

    // Split into parts
    const parts = result.split('_');

    if (parts.length === 2) {
        // 2-part locale: language-region (e.g., 'fr_CA')
        result = parts[0].toLowerCase() + '_' + parts[1].toUpperCase();
    } else if (parts.length === 3) {
        // 3-part locale: language-script-region (e.g., 'zh_Hans_HK')
        // Language: lowercase, Script: preserve case, Region: uppercase
        result = parts[0].toLowerCase() + '_' + parts[1] + '_' + parts[2].toUpperCase();
    } else {
        // Single part locale: just lowercase
        result = result.toLowerCase();
    }

    return result;
}

/**
 * Convert GraphQL API locale format to URL-friendly format
 * Example: 'nb_NO' -> 'nb-NO'
 */
export function normalizeLocale(locale: string): string {
    return locale.replace(/_/g, '-');
}

/**
 * Get fallback locale for content fetching
 * Uses Astro's i18n configuration
 */
export function getFallbackLocale(locale: string, config: AstroI18nConfig): string {
    // Check if there's a specific fallback configured for this locale
    if (config.i18n.fallback && config.i18n.fallback[locale]) {
        return config.i18n.fallback[locale];
    }

    // Check if the locale is the default locale
    if (locale === config.i18n.defaultLocale) {
        return config.i18n.defaultLocale;
    }

    // Use default locale as generic fallback
    return config.i18n.defaultLocale;
}

/**
 * Get the complete fallback chain for a locale from Astro config
 * Returns an array of locales to try in order
 */
export function getFallbackChain(locale: string, config: AstroI18nConfig, visited: Set<string> = new Set()): string[] {
    const chain: string[] = [];

    // Prevent infinite loops
    if (visited.has(locale)) {
        return chain;
    }
    visited.add(locale);

    // Check if there's a specific fallback configured for this locale
    if (config.i18n.fallback && config.i18n.fallback[locale]) {
        const fallback = config.i18n.fallback[locale];
        chain.push(fallback);
        // Recursively get the fallback chain for the fallback locale
        chain.push(...getFallbackChain(fallback, config, visited));
    } else if (locale !== config.i18n.defaultLocale) {
        // If no specific fallback, use default locale
        chain.push(config.i18n.defaultLocale);
    }

    return chain;
}

/**
 * Remove locale prefix from path
 * Useful for getting the base path without locale
 */
export function getPathWithoutLocale(pathname: string, locales: string[]): string {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
        return '/';
    }

    const potentialLocale = segments[0];

    // Check if first segment is a known locale
    if (locales.includes(potentialLocale)) {
        // Remove locale segment and reconstruct path
        const pathSegments = segments.slice(1);
        return pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '/';
    }

    return pathname;
}

/**
 * Simplified content fallback resolution for GraphQL
 * Attempts to fetch content with fallback chain
 * Relies on Astro's i18n for routing, only handles GraphQL content fetching
 */
export async function resolveContentWithFallback(
    getOptimizelySdk: GetOptimizelySdk,
    contentPayload: ContentPayload,
    urlBase: string,
    urlPath: string,
    requestedLocale: string,
    config: AstroI18nConfig,
    enableDebugLogs: boolean = false,
    variantKey?: string | null
): Promise<{
    contentResponse: any;
    actualLocaleUsed: string;
    shouldRedirect404: boolean;
}> {
    const urlPathNoSlash = urlPath.replace(/\/$/, '');

    // First, try to get content in the requested locale
    let contentByPathResponse;
    try {
        // Always log variant queries for debugging
        const shouldLogVariant = variantKey !== null && variantKey !== undefined;
        if (enableDebugLogs || shouldLogVariant) {
            console.log(`[GraphQL] 🔍 Initial query: locale=${requestedLocale}, url=${urlPath}, variant=${variantKey || 'none'}`);
        }

        // Use variant query if variantKey is provided
        if (variantKey) {
            console.log(`[GraphQL Variant] Executing contentByPathVariant query with:`, {
                base: urlBase,
                url: urlPath,
                urlNoSlash: urlPathNoSlash,
                variation: variantKey,
                locale: contentPayload.loc
            });

            contentByPathResponse = await getOptimizelySdk(contentPayload).contentByPathVariant({
                base: urlBase,
                url: urlPath,
                urlNoSlash: urlPathNoSlash,
                variation: variantKey
            });

            console.log(`[GraphQL Variant] Response received:`, {
                hasContent: !!contentByPathResponse._Content?.item,
                key: contentByPathResponse._Content?.item?._metadata?.key,
                variation: contentByPathResponse._Content?.item?._metadata?.variation,
                locale: contentByPathResponse._Content?.item?._metadata?.locale
            });
        } else {
            contentByPathResponse = await getOptimizelySdk(contentPayload).contentByPath({
                base: urlBase,
                url: urlPath,
                urlNoSlash: urlPathNoSlash
            });
        }

        if (enableDebugLogs || shouldLogVariant) {
            console.log(`[GraphQL] 📊 Initial response: key=${contentByPathResponse._Content?.item?._metadata?.key}, ver=${contentByPathResponse._Content?.item?._metadata?.version}, variant=${contentByPathResponse._Content?.item?._metadata?.variation || 'none'}`);
        }
    } catch (error) {
        if (enableDebugLogs || variantKey) {
            console.log(`[GraphQL] ❌ Initial query failed for ${requestedLocale}`, error);
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

    // Get the complete fallback chain from Astro config
    const fallbackChain = getFallbackChain(requestedLocale, config);
    const pathWithoutLocale = getPathWithoutLocale(urlPath, config.i18n.locales);

    if (enableDebugLogs) {
        console.log(`🔄 Fallback chain for ${requestedLocale}: ${fallbackChain.join(' -> ')}`);
    }

    // Try each locale in the fallback chain
    for (const fallbackLocale of fallbackChain) {
        const fallbackPayload = { ...contentPayload };
        fallbackPayload.loc = localeToSdkLocale(fallbackLocale);

        // Construct fallback URL with proper locale prefix using Astro's i18n helper
        const fallbackUrlPath = getRelativeLocaleUrl(fallbackLocale, pathWithoutLocale);
        const fallbackUrlPathNoSlash = fallbackUrlPath.replace(/\/$/, '');

        if (enableDebugLogs || variantKey) {
            console.log(`[GraphQL] 🔄 Trying fallback: locale=${fallbackLocale}, url=${fallbackUrlPath}, variant=${variantKey || 'none'}`);
        }

        try {
            // Use variant query if variantKey is provided
            const fallbackResponse = variantKey
                ? await getOptimizelySdk(fallbackPayload).contentByPathVariant({
                    base: urlBase,
                    url: fallbackUrlPath,
                    urlNoSlash: fallbackUrlPathNoSlash,
                    variation: variantKey
                })
                : await getOptimizelySdk(fallbackPayload).contentByPath({
                    base: urlBase,
                    url: fallbackUrlPath,
                    urlNoSlash: fallbackUrlPathNoSlash
                });

            if (fallbackResponse._Content?.item?._metadata?.key) {
                if (enableDebugLogs || variantKey) {
                    console.log(`[GraphQL] 📊 Fallback successful: locale=${fallbackLocale}, key=${fallbackResponse._Content.item._metadata.key}, variant=${fallbackResponse._Content.item._metadata.variation || 'none'}`);
                }
                return {
                    contentResponse: fallbackResponse,
                    actualLocaleUsed: fallbackLocale,
                    shouldRedirect404: false
                };
            }
        } catch (error) {
            if (enableDebugLogs || variantKey) {
                console.log(`[GraphQL] ❌ Fallback failed for ${fallbackLocale}:`, error);
            }
        }
    }

    // No content found in any fallback
    return {
        contentResponse: null,
        actualLocaleUsed: requestedLocale,
        shouldRedirect404: true
    };
}
