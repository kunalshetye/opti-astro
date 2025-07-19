import { createClient } from '@remkoj/optimizely-cms-api';
import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a usable file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientId = process.env.OPTIMIZELY_CLIENT_ID;
const clientSecret = process.env.OPTIMIZELY_CLIENT_SECRET;
const cmsUrl = process.env.OPTIMIZELY_CMS_URL;

// Create an instance of the client
const config = {
    base: new URL(cmsUrl),
    clientId: clientId,
    clientSecret: clientSecret,
};
const client = createClient(config);

/**
 * Find all TypeScript schema files
 */
async function findSchemaFiles() {
    const schemaFiles = await fg('**/*.type.schema.ts', {
        cwd: path.resolve(__dirname, '../../../src/cms'),
        absolute: true,
    });
    
    return schemaFiles;
}

/**
 * Dynamically import schema files to trigger auto-registration
 */
async function loadSchemaFiles(schemaFiles) {
    console.log('📥 Loading schema files to trigger auto-registration...');
    
    const loadedSchemas = [];
    const failedSchemas = [];
    
    for (const schemaFile of schemaFiles) {
        try {
            // Convert absolute path to relative import path from this script
            const relativePath = path.relative(__dirname, schemaFile);
            const importPath = './' + relativePath.replace(/\\/g, '/');
            
            // Dynamic import to trigger auto-registration
            await import(importPath);
            loadedSchemas.push(schemaFile);
            
            const fileName = path.basename(schemaFile);
            console.log(`✅ Loaded: ${fileName}`);
        } catch (error) {
            console.warn(`⚠️ Failed to load ${path.basename(schemaFile)}: ${error.message}`);
            failedSchemas.push({ file: schemaFile, error: error.message });
        }
    }
    
    return { loadedSchemas, failedSchemas };
}

/**
 * Load the schema registry and get all schemas
 */
async function loadRegistry() {
    try {
        const registryModule = await import('../../../src/lib/schema-registry.js');
        
        const allSchemas = registryModule.getAllComponentSchemasMap();
        const stats = registryModule.getRegistryStats();
        
        console.log(`📊 Registry loaded with ${stats.componentSchemas} component schemas`);
        
        return { registry: registryModule, schemas: allSchemas };
    } catch (error) {
        console.error('❌ Failed to load schema registry:', error.message);
        throw error;
    }
}

/**
 * Get all property groups from the CMS
 */
async function getPropertyGroups() {
    try {
        const groups = await client.propertyGroups.propertyGroupsList();
        const groupMap = {};
        if (groups && groups.items) {
            groups.items.forEach(group => {
                groupMap[group.key] = group;
            });
        }
        return groupMap;
    } catch (error) {
        console.error('Error fetching property groups:', error);
        return {};
    }
}

/**
 * Create a property group if it doesn't exist
 */
async function createPropertyGroup(groupKey) {
    try {
        await client.propertyGroups.propertyGroupsCreate({
            key: groupKey,
            displayName: groupKey,
            sortOrder: 0
        });
        console.log(`✅ Created property group: ${groupKey}`);
        return true;
    } catch (error) {
        console.error(`❌ Error creating property group ${groupKey}:`, error.message);
        return false;
    }
}

/**
 * Ensure all property groups exist for a content type
 */
async function ensurePropertyGroups(contentType, existingGroups) {
    if (!contentType.properties) return;

    const groupsToCreate = new Set();
    
    // Check each property for group references
    for (const [propertyKey, property] of Object.entries(contentType.properties)) {
        if (property.group && !existingGroups[property.group]) {
            groupsToCreate.add(property.group);
        }
    }

    // Create missing groups
    for (const groupKey of groupsToCreate) {
        const created = await createPropertyGroup(groupKey);
        if (created) {
            existingGroups[groupKey] = { key: groupKey };
        }
    }
}

/**
 * Clean up schema definition for API submission
 */
function cleanSchemaDefinition(schema) {
    const cleanSchema = { ...schema };
    
    // Remove properties that should not be included in the update
    if (cleanSchema.source || cleanSchema.source === '') delete cleanSchema.source;
    if (cleanSchema.features) delete cleanSchema.features;
    if (cleanSchema.usage) delete cleanSchema.usage;
    if (cleanSchema.lastModifiedBy) delete cleanSchema.lastModifiedBy;
    if (cleanSchema.lastModified) delete cleanSchema.lastModified;
    if (cleanSchema.created) delete cleanSchema.created;
    
    return cleanSchema;
}

/**
 * Process a single schema for push
 */
async function processSchema(schemaKey, schema, existingGroups) {
    const displayName = schema.displayName;
    const baseType = schema.baseType;
    
    // Ensure all required property groups exist
    await ensurePropertyGroups(schema, existingGroups);
    
    // Clean up the schema definition
    const cleanSchema = cleanSchemaDefinition(schema);
    
    try {
        await client.contentTypes.contentTypesPut(
            schemaKey,
            cleanSchema,
            true // Force update
        );
        
        console.log(`✅ Schema "${displayName}" (${schemaKey}) of baseType ${baseType} has been updated`);
        return 'success';
    } catch (error) {
        console.error(`❌ Error updating schema "${schemaKey}":`, error.message);
        return 'failed';
    }
}

// Get command line argument for specific schema
const schemaNameArg = process.argv[2];

// Main execution
(async () => {
    try {
        console.log('🔍 Discovering schema files...');
        const schemaFiles = await findSchemaFiles();
        console.log(`Found ${schemaFiles.length} schema files`);
        
        if (schemaFiles.length === 0) {
            console.log('❌ No schema files found');
            process.exit(1);
        }
        
        // Load schema files to trigger auto-registration
        const { loadedSchemas, failedSchemas } = await loadSchemaFiles(schemaFiles);
        
        if (failedSchemas.length > 0) {
            console.log(`\n⚠️ ${failedSchemas.length} schema files failed to load:`);
            failedSchemas.forEach(({ file, error }) => {
                console.log(`  - ${path.basename(file)}: ${error}`);
            });
        }
        
        if (loadedSchemas.length === 0) {
            console.log('❌ No schema files could be loaded');
            process.exit(1);
        }
        
        // Load the registry
        console.log('\n📦 Loading schema registry...');
        const { registry, schemas } = await loadRegistry();
        
        if (schemas.size === 0) {
            console.log('❌ No schemas found in registry');
            process.exit(1);
        }
        
        // Get existing property groups
        console.log('📡 Fetching property groups from CMS...');
        const existingGroups = await getPropertyGroups();
        
        if (schemaNameArg) {
            console.log(`\n🚀 Starting schema push for specific type: ${schemaNameArg}...`);
            
            if (!schemas.has(schemaNameArg)) {
                console.log(`❌ Schema "${schemaNameArg}" not found in registry`);
                console.log(`Available schemas: ${Array.from(schemas.keys()).join(', ')}`);
                process.exit(1);
            }
            
            const schema = schemas.get(schemaNameArg);
            const result = await processSchema(schemaNameArg, schema, existingGroups);
            
            if (result === 'success') {
                console.log('✅ Schema push completed successfully!');
            } else {
                console.log('❌ Schema push failed!');
                process.exit(1);
            }
        } else {
            console.log(`\n🚀 Starting schema push for all schemas...`);
            
            const results = {
                success: 0,
                failed: 0
            };
            
            for (const [schemaKey, schema] of schemas) {
                const result = await processSchema(schemaKey, schema, existingGroups);
                if (result === 'success') {
                    results.success++;
                } else {
                    results.failed++;
                }
            }
            
            console.log('\n📊 Schema push summary:');
            console.log(`✅ Successfully updated: ${results.success}`);
            console.log(`❌ Failed to update: ${results.failed}`);
            
            if (results.failed > 0) {
                process.exit(1);
            }
        }
        
        console.log('✅ Schema push completed!');
    } catch (error) {
        console.error('❌ Fatal error during schema push:', error.message);
        process.exit(1);
    }
})();