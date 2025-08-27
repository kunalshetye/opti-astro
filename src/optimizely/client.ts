import {
    createBatchEventProcessor,
    createInstance,
    createOdpManager,
    createPollingProjectConfigManager,
    type OptimizelySDK,
} from '@optimizely/optimizely-sdk';
import { updateSDKInfo, type FXDebugInfo } from './debug';
import { validateSDKKeyWithCache } from './sdk-validator';

// Initialize the Optimizely client
export async function createOptimizelyClient(
    debugInfo?: FXDebugInfo | null
): Promise<OptimizelySDK | null> {
    // Try both import.meta.env and process.env for better compatibility
    const sdkKey = import.meta.env.OPTIMIZELY_FX_SDK_KEY || process.env.OPTIMIZELY_FX_SDK_KEY;

    // Check for undefined, null, empty string, or "undefined" string
    if (!sdkKey || sdkKey === 'undefined' || sdkKey === 'null' || sdkKey.trim() === '') {
        if (debugInfo) {
            updateSDKInfo(debugInfo, {
                enabled: false,
                sdkKey: 'Not configured',
                error: 'OPTIMIZELY_FX_SDK_KEY not set or invalid',
            });
        }
        return null;
    }

    // Always show the trimmed SDK key for troubleshooting - just first 5 characters
    const trimmedKey = sdkKey.length > 5 ? sdkKey.substring(0, 5) + '...' : sdkKey;

    // Validate SDK key
    const validationResult = await validateSDKKeyWithCache(sdkKey);

    if (debugInfo) {
        updateSDKInfo(debugInfo, {
            enabled: validationResult.isValid, // Only enabled if key is valid
            sdkKey: trimmedKey,
            isValidKey: validationResult.isValid,
            validationError: validationResult.error,
        });
    }

    // If SDK key is invalid, don't proceed with client creation
    if (!validationResult.isValid) {
        if (debugInfo && validationResult.error) {
            // Add error message but don't change enabled status (already set above)
            updateSDKInfo(debugInfo, {
                error: `Invalid SDK Key: ${validationResult.error}`,
            });
        }
        return null;
    }

    const pollingConfigManager = createPollingProjectConfigManager({
        sdkKey: sdkKey,
        autoUpdate: true,
        updateInterval: 30000, // 30 seconds
    });

    const batchEventProcessor = createBatchEventProcessor();
    const odpManager = createOdpManager();

    const optimizelyClient = createInstance({
        projectConfigManager: pollingConfigManager,
        eventProcessor: batchEventProcessor,
        odpManager: odpManager,
    });

    try {
        // Wait for the client to be ready
        await optimizelyClient.onReady();

        // Get available feature flags
        const config = optimizelyClient.getOptimizelyConfig();
        let flags: string[] = [];

        if (config) {
            flags = Object.keys(config.featuresMap || {});
        }

        if (debugInfo) {
            updateSDKInfo(debugInfo, {
                enabled: true,
                availableFlags: flags,
            });
        }
    } catch (error) {
        if (debugInfo) {
            // Keep the SDK key and validation status visible even on error - just first 5 characters
            const trimmedKey = sdkKey.length > 5 ? sdkKey.substring(0, 5) + '...' : sdkKey;
            
            updateSDKInfo(debugInfo, {
                enabled: false,
                sdkKey: trimmedKey,
                isValidKey: true, // Key was valid but SDK initialization failed
                error: error instanceof Error ? error.message : String(error),
            });
        }
        return null;
    }

    return optimizelyClient;
}

// Export a singleton instance
let clientInstance: OptimizelySDK | null = null;
let clientPromise: Promise<OptimizelySDK | null> | null = null;

export async function getOptimizelyClient(
    debugInfo?: FXDebugInfo | null
): Promise<OptimizelySDK | null> {
    // If we have a cached instance and debugInfo is provided, update the debug info
    if (clientInstance && debugInfo) {
        // Get SDK key for display
        const sdkKey = import.meta.env.OPTIMIZELY_FX_SDK_KEY || process.env.OPTIMIZELY_FX_SDK_KEY;
        const trimmedKey = sdkKey && sdkKey !== 'undefined' && sdkKey !== 'null' && sdkKey.trim() !== ''
            ? (sdkKey.length > 5 ? sdkKey.substring(0, 5) + '...' : sdkKey)
            : 'Not configured';
        
        // Get available feature flags
        const config = clientInstance.getOptimizelyConfig();
        const flags = config ? Object.keys(config.featuresMap || {}) : [];
        
        updateSDKInfo(debugInfo, {
            enabled: true,
            sdkKey: trimmedKey,
            isValidKey: true, // If we have a cached instance, the key was valid
            availableFlags: flags,
        });
        
        return clientInstance;
    }
    
    // If clientPromise exists but clientInstance is null (failed initialization)
    // and we have debugInfo, we should still update the debug status
    if (!clientInstance && clientPromise && debugInfo) {
        await clientPromise; // Wait for the promise to complete
        // After awaiting, if clientInstance is still null, the SDK failed to initialize
        // The createOptimizelyClient function will have already updated debugInfo with the error
        return clientInstance;
    }
    
    if (clientInstance) {
        return clientInstance;
    }

    if (!clientPromise) {
        clientPromise = createOptimizelyClient(debugInfo).then((client) => {
            clientInstance = client;
            return client;
        });
    }

    return clientPromise;
}
