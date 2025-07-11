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
 * Find all TypeScript style schema files
 */
async function findStyleSchemaFiles() {
    const schemaFiles = await fg('**/*.style.schema.ts', {
        cwd: path.resolve(__dirname, '../../../src/cms'),
        absolute: true,
    });
    
    return schemaFiles;
}

/**
 * Dynamically import schema files to trigger auto-registration
 */
async function loadSchemaFiles(schemaFiles) {
    console.log('📥 Loading style schema files to trigger auto-registration...');
    
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
 * Load the schema registry and get all style schemas
 */
async function loadRegistry() {
    try {
        const registryModule = await import('../../../src/lib/schema-registry.js');
        
        const allStyleSchemas = registryModule.getAllStyleSchemasMap();
        const stats = registryModule.getRegistryStats();
        
        console.log(`📊 Registry loaded with ${stats.styleSchemas} style schemas`);
        
        return { registry: registryModule, schemas: allStyleSchemas };
    } catch (error) {
        console.error('❌ Failed to load schema registry:', error.message);
        throw error;
    }
}

/**
 * Clean up style definition for API submission
 */
function cleanStyleDefinition(styleSchema) {
    const cleanStyle = { ...styleSchema };
    
    // Remove properties that should not be included in the update
    if (cleanStyle.createdBy) delete cleanStyle.createdBy;
    if (cleanStyle.lastModifiedBy) delete cleanStyle.lastModifiedBy;
    if (cleanStyle.created) delete cleanStyle.created;
    if (cleanStyle.lastModified) delete cleanStyle.lastModified;
    
    return cleanStyle;
}

/**
 * Process a single style schema for push
 */
async function processStyleSchema(styleKey, styleSchema) {
    const displayName = styleSchema.displayName;
    const contentType = styleSchema.contentType;
    const nodeType = styleSchema.nodeType;
    const baseType = styleSchema.baseType;
    
    // Clean up the style definition
    const cleanStyle = cleanStyleDefinition(styleSchema);
    
    try {
        await client.displayTemplates.displayTemplatesPut(
            styleKey,
            cleanStyle
        );
        
        const typeInfo = contentType || nodeType || baseType || 'unknown';
        console.log(`✅ Style "${displayName}" (${styleKey}) for ${typeInfo} has been updated`);
        return 'success';
    } catch (error) {
        console.error(`❌ Error updating style "${styleKey}":`, error.message);
        return 'failed';
    }
}

// Get command line argument for specific style
const styleNameArg = process.argv[2];

// Main execution
(async () => {
    try {
        console.log('🔍 Discovering style schema files...');
        const schemaFiles = await findStyleSchemaFiles();
        console.log(`Found ${schemaFiles.length} style schema files`);
        
        if (schemaFiles.length === 0) {
            console.log('❌ No style schema files found');
            process.exit(1);
        }
        
        // Load schema files to trigger auto-registration
        const { loadedSchemas, failedSchemas } = await loadSchemaFiles(schemaFiles);
        
        if (failedSchemas.length > 0) {
            console.log(`\n⚠️ ${failedSchemas.length} style schema files failed to load:`);
            failedSchemas.forEach(({ file, error }) => {
                console.log(`  - ${path.basename(file)}: ${error}`);
            });
        }
        
        if (loadedSchemas.length === 0) {
            console.log('❌ No style schema files could be loaded');
            process.exit(1);
        }
        
        // Load the registry
        console.log('\n📦 Loading schema registry...');
        const { registry, schemas } = await loadRegistry();
        
        if (schemas.size === 0) {
            console.log('❌ No style schemas found in registry');
            process.exit(1);
        }
        
        if (styleNameArg) {
            console.log(`\n🚀 Starting style schema push for specific style: ${styleNameArg}...`);
            
            if (!schemas.has(styleNameArg)) {
                console.log(`❌ Style schema "${styleNameArg}" not found in registry`);
                console.log(`Available style schemas: ${Array.from(schemas.keys()).join(', ')}`);
                process.exit(1);
            }
            
            const styleSchema = schemas.get(styleNameArg);
            const result = await processStyleSchema(styleNameArg, styleSchema);
            
            if (result === 'success') {
                console.log('✅ Style schema push completed successfully!');
            } else {
                console.log('❌ Style schema push failed!');
                process.exit(1);
            }
        } else {
            console.log(`\n🚀 Starting style schema push for all styles...`);
            
            const results = {
                success: 0,
                failed: 0
            };
            
            for (const [styleKey, styleSchema] of schemas) {
                const result = await processStyleSchema(styleKey, styleSchema);
                if (result === 'success') {
                    results.success++;
                } else {
                    results.failed++;
                }
            }
            
            console.log('\n📊 Style schema push summary:');
            console.log(`✅ Successfully updated: ${results.success}`);
            console.log(`❌ Failed to update: ${results.failed}`);
            
            if (results.failed > 0) {
                process.exit(1);
            }
        }
        
        console.log('✅ Style schema push completed!');
    } catch (error) {
        console.error('❌ Fatal error during style schema push:', error.message);
        process.exit(1);
    }
})();