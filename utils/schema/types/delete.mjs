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
 * Find all TypeScript type schema files
 */
async function findTypeSchemaFiles() {
    const schemaFiles = await fg('**/*.type.schema.ts', {
        cwd: path.resolve(__dirname, '../../../src/cms'),
        absolute: true,
    });
    
    return schemaFiles;
}

/**
 * Dynamically import and load schema files to get type information
 */
async function loadTypeSchemaInfo(typeKey) {
    console.log('🔍 Searching for type schema information...');
    
    const schemaFiles = await findTypeSchemaFiles();
    
    for (const schemaFile of schemaFiles) {
        try {
            // Convert absolute path to relative import path from this script
            const relativePath = path.relative(__dirname, schemaFile);
            const importPath = './' + relativePath.replace(/\\/g, '/');
            
            // Dynamic import to load the schema
            const module = await import(importPath);
            
            // Look for exported component definitions
            for (const [exportName, exportValue] of Object.entries(module)) {
                if (exportName.includes('ComponentDefinition') && exportValue?.key === typeKey) {
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
 * Get all available type schemas for reference
 */
async function getAvailableTypeSchemas() {
    try {
        const registryModule = await import('../../../src/lib/schema-registry.js');
        const allTypeSchemas = registryModule.getAllComponentSchemasMap();
        return Array.from(allTypeSchemas.keys());
    } catch (error) {
        console.warn('⚠️ Could not load type registry');
        return [];
    }
}

// Get command line arguments
const typeNameArg = process.argv[2];
const deleteLocalFlag = process.argv.includes('--delete-local') || process.argv.includes('-l');

// Main execution
(async () => {
    if (!typeNameArg) {
        console.log('❌ Error: Content type key is required');
        console.log('Usage: npx tsx delete.mjs <TypeKey> [--delete-local]');
        console.log('Example: npx tsx delete.mjs ArticleList');
        console.log('Options:');
        console.log('  --delete-local, -l    Also delete the local schema file');
        
        // Show available types
        console.log('\n📋 Available type schemas:');
        const availableTypes = await getAvailableTypeSchemas();
        if (availableTypes.length > 0) {
            availableTypes.forEach(type => console.log(`  - ${type}`));
        } else {
            console.log('  No type schemas found');
        }
        
        process.exit(1);
    }

    console.log(`🔍 Starting content type deletion for: ${typeNameArg}...`);
    
    // Search for the type schema information
    const typeInfo = await loadTypeSchemaInfo(typeNameArg);
    
    let typeKey, displayName, baseType, description;
    let hasLocalFile = false;
    let localFileName = 'Unknown';

    if (typeInfo) {
        // Local schema file exists, extract details
        hasLocalFile = true;
        typeKey = typeInfo.definition.key;
        displayName = typeInfo.definition.displayName;
        baseType = typeInfo.definition.baseType;
        description = typeInfo.definition.description;
        localFileName = typeInfo.fileName;
        
        console.log(`✅ Found local schema file: ${localFileName}`);
    } else {
        // No local file found, use parameter as typeKey
        console.log(`ℹ️  Local schema file for "${typeNameArg}" not found`);
        console.log(`   Using "${typeNameArg}" as typeKey for CMS deletion`);
        
        typeKey = typeNameArg;
        displayName = 'Unknown';
        baseType = 'Unknown';
        description = 'Unknown';
    }

    // Confirm deletion
    console.log(`\n⚠️  You are about to delete the following content type:`);
    console.log(`   Type Key: ${typeKey}`);
    console.log(`   Display Name: ${displayName || 'N/A'}`);
    console.log(`   Base Type: ${baseType || 'N/A'}`);
    console.log(`   Description: ${description || 'N/A'}`);
    if (hasLocalFile) {
        console.log(`   Local Schema File: ${localFileName}`);
        console.log(`   Full Path: ${typeInfo.file}`);
    } else {
        console.log(`   Local Schema File: None (CMS-only deletion)`);
    }
    
    console.log(`\n⚡ Proceeding with deletion...`);
    console.log(`⚠️  WARNING: This will delete the content type and ALL associated content!`);
    
    try {
        await client.contentTypes.contentTypesDelete(typeKey);
        console.log(`✅ Content type "${typeKey}" has been successfully deleted from the CMS`);
        
        if (hasLocalFile) {
            if (deleteLocalFlag) {
                // Delete the local file
                try {
                    await fs.unlink(typeInfo.file);
                    console.log(`\n🗑️  Local schema file "${localFileName}" has been deleted`);
                    console.log(`   File removed: ${typeInfo.file}`);
                    console.log(`\n💡 Note: The schema has been removed from both CMS and local registry`);
                    console.log(`\n⚠️  Don't forget to also remove any associated style schemas!`);
                } catch (error) {
                    console.log(`\n❌ Error deleting local file "${localFileName}": ${error.message}`);
                    console.log(`   You may need to remove it manually:`);
                    console.log(`   rm "${typeInfo.file}"`);
                }
            } else {
                console.log(`\n📁 Local file management:`);
                console.log(`   The local schema file "${localFileName}" still exists`);
                console.log(`   To remove it locally, run:`);
                console.log(`   rm "${typeInfo.file}"`);
                console.log(`   Or use: yarn schemas:types:delete ${typeNameArg} --delete-local`);
                console.log(`\n💡 Note: Removing the local file will also remove it from the schema registry`);
                console.log(`\n⚠️  Don't forget to also remove any associated style schemas!`);
            }
        } else {
            console.log(`ℹ️  This was a CMS-only deletion (no local schema file found)`);
            
            // Show available local types for reference
            console.log(`\n📋 Available local type schemas:`);
            const availableTypes = await getAvailableTypeSchemas();
            
            if (availableTypes.length > 0) {
                availableTypes.forEach(type => console.log(`  - ${type}`));
            } else {
                console.log('  No local type schema files found');
            }
        }
    } catch (e) {
        console.log(`❌ Error while trying to delete ${typeKey}`);
        console.log(`Error Details: ${e.message || JSON.stringify(e)}`);
        
        // Check if it's a "not found" error
        if (e.status === 404 || e.message?.includes('not found')) {
            console.log(`ℹ️  The content type "${typeKey}" may not exist in the CMS`);
            
            if (hasLocalFile) {
                console.log(`   However, the local schema file exists:`);
                console.log(`   ${typeInfo.file}`);
                console.log(`   You may want to remove it manually if it's no longer needed`);
            }
        } else if (e.message?.includes('in use') || e.message?.includes('referenced')) {
            console.log(`ℹ️  The content type "${typeKey}" appears to be in use and cannot be deleted`);
            console.log(`   You may need to delete associated content first`);
        }
        
        process.exit(1);
    }

    console.log('✅ Content type deletion completed!');
})().catch(err => {
    console.error('❌ Unhandled error during execution:', err);
    process.exit(1);
});