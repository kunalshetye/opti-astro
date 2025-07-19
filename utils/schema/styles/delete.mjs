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
 * Dynamically import and load schema files to get style information
 */
async function loadStyleSchemaInfo(styleKey) {
    console.log('🔍 Searching for style schema information...');
    
    const schemaFiles = await findStyleSchemaFiles();
    
    for (const schemaFile of schemaFiles) {
        try {
            // Convert absolute path to relative import path from this script
            const relativePath = path.relative(__dirname, schemaFile);
            const importPath = './' + relativePath.replace(/\\/g, '/');
            
            // Dynamic import to load the schema
            const module = await import(importPath);
            
            // Look for exported style definitions
            for (const [exportName, exportValue] of Object.entries(module)) {
                if (exportName.includes('StyleDefinition') && exportValue?.key === styleKey) {
                    return {
                        file: schemaFile,
                        definition: exportValue,
                        exportName,
                        fileName: path.basename(schemaFile),
                    };
                }
            }
        } catch (error) {
            // Skip files that can't be loaded
            continue;
        }
    }
    
    return null;
}

/**
 * Get all available style schemas for reference
 */
async function getAvailableStyleSchemas() {
    try {
        const registryModule = await import('../../../src/lib/schema-registry.js');
        const allStyleSchemas = registryModule.getAllStyleSchemasMap();
        return Array.from(allStyleSchemas.keys());
    } catch (error) {
        console.warn('⚠️ Could not load style registry');
        return [];
    }
}

// Get command line arguments
const styleNameArg = process.argv[2];
const deleteLocalFlag = process.argv.includes('--delete-local') || process.argv.includes('-l');

// Main execution
(async () => {
    if (!styleNameArg) {
        console.log('❌ Error: Style name is required');
        console.log('Usage: npx tsx delete.mjs <StyleKey> [--delete-local]');
        console.log('Example: npx tsx delete.mjs DefaultArticleList');
        console.log('Options:');
        console.log('  --delete-local, -l    Also delete the local schema file');
        
        // Show available styles
        console.log('\n📋 Available style schemas:');
        const availableStyles = await getAvailableStyleSchemas();
        if (availableStyles.length > 0) {
            availableStyles.forEach(style => console.log(`  - ${style}`));
        } else {
            console.log('  No style schemas found');
        }
        
        process.exit(1);
    }

    console.log(`🔍 Starting style deletion for: ${styleNameArg}...`);
    
    // Search for the style schema information
    const styleInfo = await loadStyleSchemaInfo(styleNameArg);
    
    let styleKey, contentType, nodeType, baseType;
    let hasLocalFile = false;
    let localFileName = 'Unknown';

    if (styleInfo) {
        // Local schema file exists, extract details
        hasLocalFile = true;
        styleKey = styleInfo.definition.key;
        contentType = styleInfo.definition.contentType;
        nodeType = styleInfo.definition.nodeType;
        baseType = styleInfo.definition.baseType;
        localFileName = styleInfo.fileName;
        
        console.log(`✅ Found local schema file: ${localFileName}`);
    } else {
        // No local file found, use parameter as styleKey
        console.log(`ℹ️  Local schema file for "${styleNameArg}" not found`);
        console.log(`   Using "${styleNameArg}" as styleKey for CMS deletion`);
        
        styleKey = styleNameArg;
        contentType = 'Unknown';
        nodeType = 'Unknown';
        baseType = 'Unknown';
    }

    // Confirm deletion
    console.log(`\n⚠️  You are about to delete the following style:`);
    console.log(`   Style Key: ${styleKey}`);
    console.log(`   Content Type: ${contentType || 'N/A'}`);
    console.log(`   Node Type: ${nodeType || 'N/A'}`);
    console.log(`   Base Type: ${baseType || 'N/A'}`);
    if (hasLocalFile) {
        console.log(`   Local Schema File: ${localFileName}`);
        console.log(`   Full Path: ${styleInfo.file}`);
    } else {
        console.log(`   Local Schema File: None (CMS-only deletion)`);
    }
    
    console.log(`\n⚡ Proceeding with deletion...`);
    
    try {
        await client.displayTemplates.displayTemplatesDelete(styleKey);
        console.log(`✅ Style "${styleKey}" has been successfully deleted from the CMS`);
        
        if (hasLocalFile) {
            if (deleteLocalFlag) {
                // Delete the local file
                try {
                    await fs.unlink(styleInfo.file);
                    console.log(`\n🗑️  Local schema file "${localFileName}" has been deleted`);
                    console.log(`   File removed: ${styleInfo.file}`);
                    console.log(`\n💡 Note: The schema has been removed from both CMS and local registry`);
                } catch (error) {
                    console.log(`\n❌ Error deleting local file "${localFileName}": ${error.message}`);
                    console.log(`   You may need to remove it manually:`);
                    console.log(`   rm "${styleInfo.file}"`);
                }
            } else {
                console.log(`\n📁 Local file management:`);
                console.log(`   The local schema file "${localFileName}" still exists`);
                console.log(`   To remove it locally, run:`);
                console.log(`   rm "${styleInfo.file}"`);
                console.log(`   Or use: yarn schemas:styles:delete ${styleNameArg} --delete-local`);
                console.log(`\n💡 Note: Removing the local file will also remove it from the schema registry`);
            }
        } else {
            console.log(`ℹ️  This was a CMS-only deletion (no local schema file found)`);
            
            // Show available local styles for reference
            console.log(`\n📋 Available local style schemas:`);
            const availableStyles = await getAvailableStyleSchemas();
            
            if (availableStyles.length > 0) {
                availableStyles.forEach(style => console.log(`  - ${style}`));
            } else {
                console.log('  No local style schema files found');
            }
        }
    } catch (e) {
        console.log(`❌ Error while trying to delete ${styleKey}`);
        console.log(`Error Details: ${e.message || JSON.stringify(e)}`);
        
        // Check if it's a "not found" error
        if (e.status === 404 || e.message?.includes('not found')) {
            console.log(`ℹ️  The style "${styleKey}" may not exist in the CMS`);
            
            if (hasLocalFile) {
                console.log(`   However, the local schema file exists:`);
                console.log(`   ${styleInfo.file}`);
                console.log(`   You may want to remove it manually if it's no longer needed`);
            }
        }
        
        process.exit(1);
    }

    console.log('✅ Style deletion completed!');
})().catch(err => {
    console.error('❌ Unhandled error during execution:', err);
    process.exit(1);
});