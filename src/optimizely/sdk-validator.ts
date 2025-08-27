/**
 * SDK Key validator for Optimizely Feature Experimentation
 * Validates SDK keys by checking if the datafile exists at Optimizely's CDN
 */

export interface SDKValidationResult {
    isValid: boolean;
    statusCode?: number;
    error?: string;
}

/**
 * Validates an Optimizely SDK key by making a HEAD request to the datafile endpoint
 * @param sdkKey - The SDK key to validate
 * @returns Promise with validation result
 */
export async function validateSDKKey(sdkKey: string | undefined): Promise<SDKValidationResult> {
    // Check for invalid inputs
    if (!sdkKey || sdkKey === 'undefined' || sdkKey === 'null' || sdkKey.trim() === '') {
        return {
            isValid: false,
            error: 'SDK key is missing or invalid',
        };
    }

    const datafileUrl = `https://cdn.optimizely.com/datafiles/${sdkKey}.json`;

    try {
        // Use HEAD method for efficiency - doesn't download the entire datafile
        const response = await fetch(datafileUrl, {
            method: 'HEAD',
            // Add a reasonable timeout
            signal: AbortSignal.timeout(5000),
        });

        // Check if the response is successful
        if (response.ok) {
            return {
                isValid: true,
                statusCode: response.status,
            };
        } else if (response.status === 404) {
            return {
                isValid: false,
                statusCode: response.status,
                error: 'SDK key not found. Please verify the SDK key is correct.',
            };
        } else {
            return {
                isValid: false,
                statusCode: response.status,
                error: `Unexpected response: ${response.status} ${response.statusText}`,
            };
        }
    } catch (error) {
        // Handle network errors, timeouts, etc.
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // Check if it was a timeout
        if (errorMessage.includes('abort') || errorMessage.includes('timeout')) {
            return {
                isValid: false,
                error: 'SDK validation timed out. Please check your network connection.',
            };
        }

        return {
            isValid: false,
            error: `Failed to validate SDK key: ${errorMessage}`,
        };
    }
}

/**
 * Validates an SDK key with caching to avoid excessive requests
 * Useful for development environments where the same SDK key is checked multiple times
 */
const validationCache = new Map<string, { result: SDKValidationResult; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function validateSDKKeyWithCache(sdkKey: string | undefined): Promise<SDKValidationResult> {
    if (!sdkKey || sdkKey === 'undefined' || sdkKey === 'null' || sdkKey.trim() === '') {
        return validateSDKKey(sdkKey);
    }

    const cached = validationCache.get(sdkKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        return cached.result;
    }

    const result = await validateSDKKey(sdkKey);
    
    // Only cache if we got a definitive result
    if (result.statusCode) {
        validationCache.set(sdkKey, { result, timestamp: now });
    }

    // Clean up old cache entries
    for (const [key, value] of validationCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
            validationCache.delete(key);
        }
    }

    return result;
}