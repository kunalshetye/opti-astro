/**
 * Debug collector for Optimizely FX SDK and content variant information
 * Used by the Developer Tools panel to display debugging information
 */

export interface FXDebugInfo {
    timestamp: Date;
    page: {
        url: string;
        locale: string;
        path: string;
    };
    sdk: {
        enabled: boolean;
        sdkKey?: string;
        availableFlags: string[];
        error?: string;
    };
    user: {
        id: string;
        isNew: boolean;
        attributes: Record<string, any>;
    };
    content: {
        defaultKey?: string;
        flagKey?: string;
        decision?: {
            enabled: boolean;
            variationKey?: string;
            flagKey?: string;
            ruleKey?: string;
            reasons?: string[];
        };
        variantRequested?: string;
        variantReceived?: string;
        finalContentKey?: string;
        isVariantContent: boolean;
    };
    errors: string[];
}

// Global store for FX debug information
let fxDebugStore: FXDebugInfo[] = [];

/**
 * Initialize a new debug session
 */
export function initFXDebugSession(url: string, locale: string): FXDebugInfo {
    const debugInfo: FXDebugInfo = {
        timestamp: new Date(),
        page: {
            url,
            locale,
            path: new URL(url).pathname,
        },
        sdk: {
            enabled: false,
            availableFlags: [],
        },
        user: {
            id: '',
            isNew: false,
            attributes: {},
        },
        content: {
            isVariantContent: false,
        },
        errors: [],
    };

    // Add to store (keep only last 10 sessions)
    fxDebugStore.unshift(debugInfo);
    if (fxDebugStore.length > 10) {
        fxDebugStore = fxDebugStore.slice(0, 10);
    }

    return debugInfo;
}

/**
 * Update SDK information
 */
export function updateSDKInfo(debugInfo: FXDebugInfo, data: {
    enabled: boolean;
    sdkKey?: string;
    availableFlags?: string[];
    error?: string;
}) {
    debugInfo.sdk = { ...debugInfo.sdk, ...data };
}

/**
 * Update user information
 */
export function updateUserInfo(debugInfo: FXDebugInfo, data: {
    id: string;
    isNew: boolean;
    attributes: Record<string, any>;
}) {
    debugInfo.user = { ...debugInfo.user, ...data };
}

/**
 * Update content information
 */
export function updateContentInfo(debugInfo: FXDebugInfo, data: {
    defaultKey?: string;
    flagKey?: string;
    decision?: any;
    variantRequested?: string;
    variantReceived?: string;
    finalContentKey?: string;
    isVariantContent?: boolean;
}) {
    debugInfo.content = { ...debugInfo.content, ...data };
}


/**
 * Add an error to the debug info
 */
export function addDebugError(debugInfo: FXDebugInfo, error: string) {
    debugInfo.errors.push(error);
}

/**
 * Get all FX debug sessions
 */
export function getFXDebugSessions(): FXDebugInfo[] {
    return fxDebugStore;
}

/**
 * Clear all debug sessions
 */
export function clearFXDebugSessions() {
    fxDebugStore = [];
}

/**
 * Get the current (most recent) debug session
 */
export function getCurrentFXDebugSession(): FXDebugInfo | null {
    return fxDebugStore[0] || null;
}