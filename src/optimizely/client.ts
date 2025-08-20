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
    const sdkKey = import.meta.env.OPTIMIZELY_FX_SDK_KEY;

    if (!sdkKey) {
        if (debugInfo) {
            updateSDKInfo(debugInfo, {
                enabled: false,
                error: 'OPTIMIZELY_FX_SDK_KEY not set',
            });
        }
        return null;
    }

    if (debugInfo) {
        updateSDKInfo(debugInfo, {
            enabled: true,
            sdkKey: sdkKey.substring(0, 12) + '...', // Show first 12 chars for identification
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
            updateSDKInfo(debugInfo, {
                enabled: true,
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
