// Shared types that can be used in both browser and server
export interface StyleDefinition {
    key: string;
    displayName: string;
    nodeType?: string | null;
    baseType?: string | null;
    contentType?: string | null;
    isDefault?: boolean;
    settings: Record<string, DisplaySetting>;
    created?: string;
    createdBy?: string;
    lastModified?: string;
    lastModifiedBy?: string;
}

export interface DisplaySetting {
    displayName: string;
    editor?: string;
    sortOrder?: number;
    choices: Record<string, DisplaySettingChoice>;
}

export interface DisplaySettingChoice {
    displayName: string;
    sortOrder?: number;
}

export interface StyleStatus {
    key: string;
    displayName: string;
    status: 'in-sync' | 'local-only' | 'remote-only' | 'local-changes' | 'conflict';
    local?: StyleDefinition;
    remote?: StyleDefinition;
    localPath?: string;
    category?: string;
    contentType?: string;
    nodeType?: string;
    baseType?: string;
}

export interface StyleDiff {
    hasDifferences: boolean;
    differences: any[];
    summary: {
        additions: number;
        deletions: number;
        modifications: number;
    };
}

export interface SyncResult {
    success: boolean;
    message: string;
    details?: string;
}

export interface SyncProgress {
    stage: string;
    message: string;
    level: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
}

export type ProgressCallback = (progress: SyncProgress) => void;

// Validation function that can run in browser
export function validateStyleDefinition(style: Partial<StyleDefinition>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!style.key) {
        errors.push('key is required');
    } else if (!/^[A-Za-z][_0-9A-Za-z]+$/.test(style.key)) {
        errors.push('key must start with a letter and contain only alphanumerics and underscores');
    } else if (style.key.length < 2 || style.key.length > 255) {
        errors.push('key must be between 2 and 255 characters');
    }

    if (!style.displayName) {
        errors.push('displayName is required');
    } else if (style.displayName.length < 1 || style.displayName.length > 255) {
        errors.push('displayName must be between 1 and 255 characters');
    }

    // Scope filters (only one should be specified)
    const scopes = [style.nodeType, style.baseType, style.contentType].filter(Boolean);
    if (scopes.length > 1) {
        errors.push('Only one of nodeType, baseType, or contentType should be specified');
    }

    // Validate nodeType pattern if present
    if (style.nodeType && !/^[A-Za-z][_0-9A-Za-z]+$/.test(style.nodeType)) {
        errors.push('nodeType must start with a letter and contain only alphanumerics and underscores');
    }

    // Validate contentType pattern if present
    if (style.contentType && !/^[A-Za-z][_0-9A-Za-z]+$/.test(style.contentType)) {
        errors.push('contentType must start with a letter and contain only alphanumerics and underscores');
    }

    // Settings validation
    if (!style.settings || Object.keys(style.settings).length === 0) {
        errors.push('At least one setting is required');
    } else {
        Object.entries(style.settings).forEach(([settingKey, setting]) => {
            if (!setting.displayName) {
                errors.push(`Setting "${settingKey}" is missing displayName`);
            }
            if (!setting.choices || Object.keys(setting.choices).length === 0) {
                errors.push(`Setting "${settingKey}" must have at least one choice`);
            } else {
                Object.entries(setting.choices).forEach(([choiceKey, choice]) => {
                    if (!/^[A-Za-z][_0-9A-Za-z]+$/.test(choiceKey)) {
                        errors.push('Choice key must start with a letter and contain only alphanumerics and underscores');
                    }
                    if (!choice.displayName) {
                        errors.push(`Choice "${choiceKey}" in setting "${settingKey}" is missing displayName`);
                    }
                });
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
