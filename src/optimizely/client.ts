import { createBatchEventProcessor,
  createInstance,
  createOdpManager,
  createPollingProjectConfigManager} from '@optimizely/optimizely-sdk';

// Initialize the Optimizely client
export function createOptimizelyClient() {
    const sdkKey = import.meta.env.OPTIMIZELY_SDK_KEY;
    
    if (!sdkKey) {
        console.warn('OPTIMIZELY_SDK_KEY environment variable is not set. Optimizely features will be disabled.');
        return null;
    }

    const pollingConfigManager = createPollingProjectConfigManager({
        sdkKey: sdkKey,
        autoUpdate: true,
        updateInterval: 60000, // 1 minute
    });

    const batchEventProcessor = createBatchEventProcessor();
    const odpManager = createOdpManager();

    const optimizelyClient = createInstance({
        projectConfigManager: pollingConfigManager,
        eventProcessor: batchEventProcessor,
        odpManager: odpManager,
    });

    return optimizelyClient;
}

export const optimizelyClient = createOptimizelyClient();