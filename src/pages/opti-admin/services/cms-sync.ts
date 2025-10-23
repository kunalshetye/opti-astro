import { createClient } from '@remkoj/optimizely-cms-api';
import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Types for our service
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

// CMS Client Factory
function createCMSClient() {
    const clientId = import.meta.env.OPTIMIZELY_CLIENT_ID;
    const clientSecret = import.meta.env.OPTIMIZELY_CLIENT_SECRET;
    const cmsUrl = import.meta.env.OPTIMIZELY_CMS_URL;

    if (!clientId || !clientSecret || !cmsUrl) {
        throw new Error('Missing required environment variables: OPTIMIZELY_CLIENT_ID, OPTIMIZELY_CLIENT_SECRET, OPTIMIZELY_CMS_URL');
    }

    return createClient({
        base: new URL(cmsUrl),
        clientId: clientId,
        clientSecret: clientSecret,
    });
}

// Utility functions
async function findFiles(pattern: string, baseDir?: string): Promise<string[]> {
    try {
        const projectRoot = process.cwd();
        const searchPattern = baseDir ? `${baseDir}/**/${pattern}` : `src/cms/**/${pattern}`;

        const files = await fg(searchPattern, {
            cwd: projectRoot,
            absolute: true,
            onlyFiles: true,
            dot: false
        });

        return files;
    } catch (error) {
        console.error('Error finding files:', error);
        return [];
    }
}

async function readJsonFile(filePath: string): Promise<any> {
    try {
        const content = await fs.readFile(filePath, { encoding: 'utf-8' });
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`Failed to read JSON file ${filePath}: ${(error as Error).message}`);
    }
}

// Property Groups Management
async function getPropertyGroups(client: any): Promise<Record<string, any>> {
    try {
        const groups = await client.propertyGroups.propertyGroupsList();
        const groupMap: Record<string, any> = {};
        if (groups && groups.items) {
            groups.items.forEach((group: any) => {
                groupMap[group.key] = group;
            });
        }
        return groupMap;
    } catch (error) {
        throw new Error(`Failed to fetch property groups: ${(error as Error).message}`);
    }
}

async function createPropertyGroup(client: any, groupKey: string): Promise<boolean> {
    try {
        await client.propertyGroups.propertyGroupsCreate({
            key: groupKey,
            displayName: groupKey,
            sortOrder: 0
        });
        return true;
    } catch (error) {
        throw new Error(`Failed to create property group ${groupKey}: ${(error as Error).message}`);
    }
}

async function ensurePropertyGroups(
    client: any,
    contentType: any,
    existingGroups: Record<string, any>,
    onProgress?: ProgressCallback
): Promise<void> {
    if (!contentType.properties) return;

    const groupsToCreate = new Set<string>();

    // Check each property for group references
    for (const [propertyKey, property] of Object.entries(contentType.properties)) {
        if ((property as any).group && !existingGroups[(property as any).group]) {
            groupsToCreate.add((property as any).group);
        }
    }

    // Create missing groups
    for (const groupKey of groupsToCreate) {
        try {
            onProgress?.({
                stage: 'property-groups',
                message: `Creating property group: ${groupKey}`,
                level: 'info',
                timestamp: new Date()
            });

            await createPropertyGroup(client, groupKey);
            existingGroups[groupKey] = { key: groupKey };

            onProgress?.({
                stage: 'property-groups',
                message: `Created property group: ${groupKey}`,
                level: 'success',
                timestamp: new Date()
            });
        } catch (error) {
            onProgress?.({
                stage: 'property-groups',
                message: `Failed to create property group ${groupKey}: ${(error as Error).message}`,
                level: 'error',
                timestamp: new Date()
            });
            throw error;
        }
    }
}

// Content Type Operations
export async function pushContentType(
    typeName: string,
    onProgress?: ProgressCallback
): Promise<SyncResult> {
    try {
        const client = createCMSClient();

        onProgress?.({
            stage: 'init',
            message: `Starting push for content type: ${typeName}`,
            level: 'info',
            timestamp: new Date()
        });

        // Find the specific type file
        const files = await findFiles('*.opti-type.json');
        const targetFile = files.find(file => {
            const filename = path.basename(file);
            return filename === `${typeName}.opti-type.json`;
        });

        if (!targetFile) {
            const error = `Content type file "${typeName}.opti-type.json" not found`;
            onProgress?.({
                stage: 'error',
                message: error,
                level: 'error',
                timestamp: new Date()
            });
            return { success: false, message: error };
        }

        onProgress?.({
            stage: 'reading',
            message: `Reading content type definition from ${path.basename(targetFile)}`,
            level: 'info',
            timestamp: new Date()
        });

        // Read and validate the content type definition
        const contentTypeDefinition = await readJsonFile(targetFile);
        if (!contentTypeDefinition || !contentTypeDefinition.key) {
            const error = `Invalid content type definition in ${targetFile}`;
            onProgress?.({
                stage: 'error',
                message: error,
                level: 'error',
                timestamp: new Date()
            });
            return { success: false, message: error };
        }

        const contentTypeKey = contentTypeDefinition.key;
        const baseType = contentTypeDefinition.baseType;
        const displayName = contentTypeDefinition.displayName;

        onProgress?.({
            stage: 'property-groups',
            message: 'Fetching existing property groups...',
            level: 'info',
            timestamp: new Date()
        });

        // Get existing property groups and ensure required ones exist
        const existingGroups = await getPropertyGroups(client);
        await ensurePropertyGroups(client, contentTypeDefinition, existingGroups, onProgress);

        onProgress?.({
            stage: 'pushing',
            message: `Pushing content type "${displayName}" (${contentTypeKey})...`,
            level: 'info',
            timestamp: new Date()
        });

        // Clean up the content type definition
        const cleanContentType = { ...contentTypeDefinition };
        delete cleanContentType.source;
        delete cleanContentType.features;
        delete cleanContentType.usage;
        delete cleanContentType.lastModifiedBy;
        delete cleanContentType.lastModified;
        delete cleanContentType.created;

        // Push to CMS
        await client.contentTypes.contentTypesPut(
            contentTypeKey,
            cleanContentType,
            true // Force update
        );

        const successMessage = `Content type "${displayName}" (${contentTypeKey}) of baseType ${baseType} has been updated`;
        onProgress?.({
            stage: 'complete',
            message: successMessage,
            level: 'success',
            timestamp: new Date()
        });

        return { success: true, message: successMessage };

    } catch (error) {
        const errorMessage = `Failed to push content type ${typeName}: ${(error as Error).message}`;
        onProgress?.({
            stage: 'error',
            message: errorMessage,
            level: 'error',
            timestamp: new Date()
        });
        return { success: false, message: errorMessage, details: (error as Error).stack };
    }
}

export async function pushAllContentTypes(onProgress?: ProgressCallback): Promise<SyncResult> {
    try {
        const client = createCMSClient();

        onProgress?.({
            stage: 'init',
            message: 'Starting content type push for all types...',
            level: 'info',
            timestamp: new Date()
        });

        // Find all type files
        const files = await findFiles('*.opti-type.json');
        onProgress?.({
            stage: 'discovery',
            message: `Found ${files.length} content type definition files`,
            level: 'info',
            timestamp: new Date()
        });

        // Get existing property groups
        onProgress?.({
            stage: 'property-groups',
            message: 'Fetching existing property groups...',
            level: 'info',
            timestamp: new Date()
        });
        const existingGroups = await getPropertyGroups(client);

        // Track results
        const results = { success: 0, failed: 0, skipped: 0 };

        // Process each file
        for (const file of files) {
            const fileName = path.basename(file);
            try {
                onProgress?.({
                    stage: 'processing',
                    message: `Processing ${fileName}...`,
                    level: 'info',
                    timestamp: new Date()
                });

                const contentTypeDefinition = await readJsonFile(file);
                if (!contentTypeDefinition || !contentTypeDefinition.key) {
                    onProgress?.({
                        stage: 'processing',
                        message: `Skipping invalid content type definition in ${fileName}`,
                        level: 'warning',
                        timestamp: new Date()
                    });
                    results.skipped++;
                    continue;
                }

                const contentTypeKey = contentTypeDefinition.key;
                const baseType = contentTypeDefinition.baseType;
                const displayName = contentTypeDefinition.displayName;

                // Ensure property groups exist for this content type
                await ensurePropertyGroups(client, contentTypeDefinition, existingGroups);

                // Clean up the content type definition
                const cleanContentType = { ...contentTypeDefinition };
                delete cleanContentType.source;
                delete cleanContentType.features;
                delete cleanContentType.usage;
                delete cleanContentType.lastModifiedBy;
                delete cleanContentType.lastModified;
                delete cleanContentType.created;

                // Push to CMS
                await client.contentTypes.contentTypesPut(
                    contentTypeKey,
                    cleanContentType,
                    true // Force update
                );

                onProgress?.({
                    stage: 'processing',
                    message: `Content type "${displayName}" (${contentTypeKey}) of baseType ${baseType} has been updated`,
                    level: 'success',
                    timestamp: new Date()
                });
                results.success++;

            } catch (error) {
                onProgress?.({
                    stage: 'processing',
                    message: `Error processing ${fileName}: ${(error as Error).message}`,
                    level: 'error',
                    timestamp: new Date()
                });
                results.failed++;
            }
        }

        // Summary
        const summary = `Completed: ${results.success} successful, ${results.failed} failed, ${results.skipped} skipped`;
        onProgress?.({
            stage: 'complete',
            message: summary,
            level: results.failed > 0 ? 'warning' : 'success',
            timestamp: new Date()
        });

        return {
            success: results.failed === 0,
            message: summary,
            details: `Total files processed: ${files.length}`
        };

    } catch (error) {
        const errorMessage = `Failed to push content types: ${(error as Error).message}`;
        onProgress?.({
            stage: 'error',
            message: errorMessage,
            level: 'error',
            timestamp: new Date()
        });
        return { success: false, message: errorMessage, details: (error as Error).stack };
    }
}

// Style Operations
export async function pushStyle(
    styleName: string,
    onProgress?: ProgressCallback
): Promise<SyncResult> {
    try {
        const client = createCMSClient();

        onProgress?.({
            stage: 'init',
            message: `Starting push for style: ${styleName}`,
            level: 'info',
            timestamp: new Date()
        });

        // Find the specific style file
        const files = await findFiles('*.opti-style.json');
        const targetFile = files.find(file => {
            const filename = path.basename(file);
            return filename === `${styleName}.opti-style.json`;
        });

        if (!targetFile) {
            const error = `Style file "${styleName}.opti-style.json" not found`;
            onProgress?.({
                stage: 'error',
                message: error,
                level: 'error',
                timestamp: new Date()
            });
            return { success: false, message: error };
        }

        onProgress?.({
            stage: 'reading',
            message: `Reading style definition from ${path.basename(targetFile)}`,
            level: 'info',
            timestamp: new Date()
        });

        // Read and validate the style definition
        const styleDefinition = await readJsonFile(targetFile);
        if (!styleDefinition || !styleDefinition.key) {
            const error = `Invalid style definition in ${targetFile}`;
            onProgress?.({
                stage: 'error',
                message: error,
                level: 'error',
                timestamp: new Date()
            });
            return { success: false, message: error };
        }

        const styleKey = styleDefinition.key;
        const contentType = styleDefinition.contentType;
        const nodeType = styleDefinition.nodeType;

        onProgress?.({
            stage: 'pushing',
            message: `Pushing style "${styleKey}"...`,
            level: 'info',
            timestamp: new Date()
        });

        // Push to CMS
        await client.displayTemplates.displayTemplatesPut(
            styleKey,
            styleDefinition
        );

        const successMessage = `Template with styleKey: ${styleKey}, contentType: ${contentType}, nodeType: ${nodeType} has been updated`;
        onProgress?.({
            stage: 'complete',
            message: successMessage,
            level: 'success',
            timestamp: new Date()
        });

        return { success: true, message: successMessage };

    } catch (error) {
        const errorMessage = `Failed to push style ${styleName}: ${(error as Error).message}`;
        onProgress?.({
            stage: 'error',
            message: errorMessage,
            level: 'error',
            timestamp: new Date()
        });
        return { success: false, message: errorMessage, details: (error as Error).stack };
    }
}

export async function pushAllStyles(onProgress?: ProgressCallback): Promise<SyncResult> {
    try {
        const client = createCMSClient();

        onProgress?.({
            stage: 'init',
            message: 'Starting style push for all styles...',
            level: 'info',
            timestamp: new Date()
        });

        // Find all style files
        const files = await findFiles('*.opti-style.json');
        onProgress?.({
            stage: 'discovery',
            message: `Found ${files.length} style definition files`,
            level: 'info',
            timestamp: new Date()
        });

        // Track results
        const results = { success: 0, failed: 0, skipped: 0 };

        // Process each file
        for (const file of files) {
            const fileName = path.basename(file);
            try {
                onProgress?.({
                    stage: 'processing',
                    message: `Processing ${fileName}...`,
                    level: 'info',
                    timestamp: new Date()
                });

                const styleDefinition = await readJsonFile(file);
                if (!styleDefinition || !styleDefinition.key) {
                    onProgress?.({
                        stage: 'processing',
                        message: `Skipping invalid style definition in ${fileName}`,
                        level: 'warning',
                        timestamp: new Date()
                    });
                    results.skipped++;
                    continue;
                }

                const styleKey = styleDefinition.key;
                const contentType = styleDefinition.contentType;
                const nodeType = styleDefinition.nodeType;

                // Push to CMS
                await client.displayTemplates.displayTemplatesPut(
                    styleKey,
                    styleDefinition
                );

                onProgress?.({
                    stage: 'processing',
                    message: `Template with styleKey: ${styleKey}, contentType: ${contentType}, nodeType: ${nodeType} has been updated`,
                    level: 'success',
                    timestamp: new Date()
                });
                results.success++;

            } catch (error) {
                onProgress?.({
                    stage: 'processing',
                    message: `Error processing ${fileName}: ${(error as Error).message}`,
                    level: 'error',
                    timestamp: new Date()
                });
                results.failed++;
            }
        }

        // Summary
        const summary = `Completed: ${results.success} successful, ${results.failed} failed, ${results.skipped} skipped`;
        onProgress?.({
            stage: 'complete',
            message: summary,
            level: results.failed > 0 ? 'warning' : 'success',
            timestamp: new Date()
        });

        return {
            success: results.failed === 0,
            message: summary,
            details: `Total files processed: ${files.length}`
        };

    } catch (error) {
        const errorMessage = `Failed to push styles: ${(error as Error).message}`;
        onProgress?.({
            stage: 'error',
            message: errorMessage,
            level: 'error',
            timestamp: new Date()
        });
        return { success: false, message: errorMessage, details: (error as Error).stack };
    }
}
