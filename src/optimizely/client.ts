import {
    createBatchEventProcessor,
    createInstance,
    createOdpManager,
    createPollingProjectConfigManager,
    type OptimizelySDK,
} from '@optimizely/optimizely-sdk';
import { updateSDKInfo, type FXDebugInfo } from './debug';

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

    // Always show the trimmed SDK key for troubleshooting
    const trimmedKey = sdkKey.length > 16 
        ? sdkKey.substring(0, 12) + '...' + sdkKey.substring(sdkKey.length - 4)
        : sdkKey.substring(0, 12) + '...';

    if (debugInfo) {
        updateSDKInfo(debugInfo, {
            enabled: true,
            sdkKey: trimmedKey,
        });
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
            // Keep the SDK key visible even on error
            const trimmedKey = sdkKey.length > 16 
                ? sdkKey.substring(0, 12) + '...' + sdkKey.substring(sdkKey.length - 4)
                : sdkKey.substring(0, 12) + '...';
            
            updateSDKInfo(debugInfo, {
                enabled: true,
                sdkKey: trimmedKey,
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
