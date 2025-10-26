/**
 * Locale utility helpers for GraphQL integration
 * Provides locale format conversion for Optimizely Graph API
 */

import type { ContentPayload } from '../graphql/shared/ContentPayload';

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
export type GetOptimizelySdk = (contentPayload: ContentPayload) => OptimizelySdk;

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
 * Simplified content fetching for GraphQL
 * Queries GraphQL for content in the current locale only
 * Relies on Astro's i18n fallback system to handle locale fallbacks via rewrites
 *
 * @param getOptimizelySdk - Function to get the Optimizely SDK instance
 * @param contentPayload - Content payload with locale already set
 * @param urlBase - Base URL
 * @param urlPath - URL path
 * @param enableDebugLogs - Enable debug logging
 * @param variantKey - Optional variant key for A/B testing
 * @returns Content response and whether content was found
 */
export async function fetchContentByPath(
    getOptimizelySdk: GetOptimizelySdk,
    contentPayload: ContentPayload,
    urlBase: string,
    urlPath: string,
    enableDebugLogs: boolean = false,
    variantKey?: string | null
): Promise<{
    contentResponse: any;
    found: boolean;
}> {
    const urlPathNoSlash = urlPath.replace(/\/$/, '');

    // Query GraphQL for content in the current locale
    let contentByPathResponse;
    try {
        // Always log variant queries for debugging
        const shouldLogVariant = variantKey !== null && variantKey !== undefined;
        if (enableDebugLogs || shouldLogVariant) {
            console.log(`[GraphQL] 🔍 Query: locale=${contentPayload.loc}, url=${urlPath}, variant=${variantKey || 'none'}`);
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
            console.log(`[GraphQL] 📊 Response: key=${contentByPathResponse._Content?.item?._metadata?.key}, ver=${contentByPathResponse._Content?.item?._metadata?.version}, variant=${contentByPathResponse._Content?.item?._metadata?.variation || 'none'}`);
        }
    } catch (error) {
        if (enableDebugLogs || variantKey) {
            console.log(`[GraphQL] ❌ Query failed:`, error);
        }
        contentByPathResponse = { _Content: null };
    }

    const hasContent = !!(
        contentByPathResponse._Content &&
        contentByPathResponse._Content.item &&
        contentByPathResponse._Content.item._metadata?.key
    );

    return {
        contentResponse: contentByPathResponse,
        found: hasContent
    };
}
