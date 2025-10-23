/**
 * Optimizely Feature Experimentation variant resolution helper
 * Handles the complete flow of getting variants and fetching variant content
 */

import { getOptimizelyClient } from './client';
import {
    updateUserInfo,
    updateContentInfo,
    addDebugError,
    type FXDebugInfo
} from './debug';
import { fetchContentByPath } from '../lib/locale-helpers';
import type { ContentPayload } from '../graphql/shared/ContentPayload';

export interface VariantResolutionResult {
    contentResponse: any;
    variantKey: string | null;
    isVariantContent: boolean;
}

/**
 * Resolve content variant using Optimizely FX SDK
 * @param astro - Astro global object for cookies and URL
 * @param defaultItem - The default content item to base the flag key on
 * @param contentPayload - GraphQL content payload
 * @param getOptimizelySdk - GraphQL SDK function
 * @param urlBase - Base URL
 * @param urlPath - URL path
 * @param lang - Current language/locale
 * @param defaultResult - Fallback content result
 * @param debugInfo - Debug information collector
 * @returns Promise with variant resolution result
 */
export async function resolveContentVariant(
    astro: any, // Astro global
    defaultItem: any,
    contentPayload: ContentPayload,
    getOptimizelySdk: any,
    urlBase: string,
    urlPath: string,
    lang: string,
    defaultResult: any,
    debugInfo: FXDebugInfo
): Promise<VariantResolutionResult> {
    let variantKey: string | null = null;
    let finalResult = defaultResult; // Default to the original content

    const optimizelyClient = await getOptimizelyClient(debugInfo);

    if (optimizelyClient && defaultItem?._metadata?.key) {
        // Get user ID from cookie or generate a new one
        const existingUserId = astro.cookies.get('optimizely_user_id')?.value;
        const userId = existingUserId || crypto.randomUUID();
        const isNewUser = !existingUserId;
        
        // Set cookie if new user
        if (isNewUser) {
            astro.cookies.set('optimizely_user_id', userId, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 365, // 1 year
                path: '/',
            });
        }

        // Create user context with attributes
        const userAttributes = {
            locale: lang,
            url: astro.url.pathname,
            host: astro.url.host,
            isNewUser: isNewUser,
        };
        
        // Update debug info with user data
        updateUserInfo(debugInfo, {
            id: userId,
            isNew: isNewUser,
            attributes: userAttributes
        });
        
        const user = optimizelyClient.createUserContext(userId, userAttributes);

        if (!user) {
            addDebugError(debugInfo, 'Failed to create user context');
        } else {
            // Construct flag key from content key
            const flagKey = `cms_${defaultItem._metadata.key?.replace("/", "")}`;
            
            updateContentInfo(debugInfo, { flagKey });
            
            const decision = user.decide(flagKey);
            
            // Update debug info with decision details
            updateContentInfo(debugInfo, { 
                decision: {
                    enabled: decision?.enabled || false,
                    variationKey: decision?.variables?.VariationKey,
                    flagKey: decision?.flagKey,
                    ruleKey: decision?.ruleKey,
                    reasons: decision?.reasons || []
                }
            });
            
            if (decision?.enabled && decision?.variables?.VariationKey) {
                variantKey = decision.variables?.VariationKey;
                
                updateContentInfo(debugInfo, { variantRequested: variantKey });

                // Fetch the variant content
                const variantResult = await fetchContentByPath(
                    getOptimizelySdk,
                    contentPayload,
                    urlBase,
                    urlPath,
                    true, // Enable debug logs for variant
                    variantKey
                );

                if (variantResult.found) {
                    finalResult = variantResult;
                    updateContentInfo(debugInfo, {
                        variantReceived: variantResult.contentResponse._Content.item._metadata.variation,
                        isVariantContent: true
                    });
                } else {
                    addDebugError(debugInfo, `Variant content not found for variant: ${variantKey}`);
                }
            } else if (decision?.enabled) {
                addDebugError(debugInfo, 'Flag is enabled but no variation key provided');
            }
        }
    } else {
        if (!optimizelyClient) {
            addDebugError(debugInfo, 'Optimizely client not available');
        }
        if (!defaultItem?._metadata?.key) {
            addDebugError(debugInfo, 'No content key available for flag construction');
        }
    }

    return {
        contentResponse: finalResult.contentResponse,
        variantKey,
        isVariantContent: !!variantKey && !!finalResult.contentResponse._Content.item._metadata.variation
    };
}