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
 * Find all existing TypeScript schema files to understand the current structure
 */
async function findExistingSchemaFiles() {
    const schemaFiles = await fg('**/*.type.schema.ts', {
        cwd: path.resolve(__dirname, '../../../src/cms'),
        absolute: true,
    });
    
    const schemaMap = new Map();
    
    for (const file of schemaFiles) {
        const relativePath = path.relative(path.resolve(__dirname, '../../../src/cms'), file);
        const parts = relativePath.split(path.sep);
        
        // Extract the schema key from the filename
        const filename = path.basename(file, '.type.schema.ts');
        const schemaKey = filename;
        
        // Determine the directory type and path
        let baseType;
        let directoryPath;
        
        if (parts[0] === 'components') {
            baseType = 'component';
            directoryPath = path.dirname(file);
        } else if (parts[0] === 'pages') {
            baseType = 'page';
            directoryPath = path.dirname(file);
        } else if (parts[0] === 'media') {
            baseType = 'media';
            directoryPath = path.dirname(file);
        } else if (parts[0] === 'compositions') {
            baseType = 'composition';
            directoryPath = path.dirname(file);
        } else {
            baseType = 'unknown';
            directoryPath = path.dirname(file);
        }
        
        schemaMap.set(schemaKey, {
            file,
            baseType,
            directoryPath,
            relativePath
        });
    }
    
    return schemaMap;
}

/**
 * Generate TypeScript schema content from CMS content type definition
 */
function generateTypeScriptSchema(contentType, schemaKey) {
    const cleanContentType = { ...contentType };
    
    // Remove unwanted properties
    if (cleanContentType.source || cleanContentType.source === '') delete cleanContentType.source;
    if (cleanContentType.features) delete cleanContentType.features;
    if (cleanContentType.usage) delete cleanContentType.usage;
    if (cleanContentType.lastModifiedBy) delete cleanContentType.lastModifiedBy;
    if (cleanContentType.lastModified) delete cleanContentType.lastModified;
    if (cleanContentType.created) delete cleanContentType.created;
    
    // Convert properties to TypeScript schema format
    const properties = {};
    if (cleanContentType.properties) {
        for (const [key, prop] of Object.entries(cleanContentType.properties)) {
            properties[key] = {
                type: prop.type,
                displayName: prop.displayName,
                description: prop.description || '',
                localized: prop.localized || false,
                required: prop.required || false,
                group: prop.group || 'Information',
                sortOrder: prop.sortOrder || 0,
                editorSettings: prop.editorSettings || {},
                ...(prop.allowedTypes && { allowedTypes: prop.allowedTypes }),
                ...(prop.restrictedTypes && { restrictedTypes: prop.restrictedTypes }),
                ...(prop.items && { items: prop.items }),
                ...(prop.format && { format: prop.format }),
                ...(prop.indexingType && { indexingType: prop.indexingType }),
                ...(prop.pattern && { pattern: prop.pattern }),
                ...(prop.enum && { enum: prop.enum }),
                ...(prop.minimum && { minimum: prop.minimum }),
                ...(prop.maximum && { maximum: prop.maximum }),
                ...(prop.maxItems && { maxItems: prop.maxItems }),
                ...(prop.contentType && { contentType: prop.contentType }),
            };
        }
    }
    
    const capitalizedKey = capitalize(schemaKey);
    const componentName = `${capitalizedKey}ComponentDefinition`;
    
    const tsContent = `import { ComponentSchema } from '../../../../lib/schema-registry.js';

// Auto-registering ${cleanContentType.displayName} component schema
export const ${componentName} = ComponentSchema({
  key: '${cleanContentType.key}',
  displayName: '${cleanContentType.displayName}',
  description: '${cleanContentType.description || ''}',
  baseType: '${cleanContentType.baseType}',
  sortOrder: ${cleanContentType.sortOrder || 0},
  mayContainTypes: ${JSON.stringify(cleanContentType.mayContainTypes || [], null, 2).replace(/\n/g, '\n  ')},
  mediaFileExtensions: ${JSON.stringify(cleanContentType.mediaFileExtensions || [], null, 2).replace(/\n/g, '\n  ')},
  compositionBehaviors: ${JSON.stringify(cleanContentType.compositionBehaviors || [], null, 2).replace(/\n/g, '\n  ')},
  properties: ${JSON.stringify(properties, null, 2).replace(/\n/g, '\n    ')},
});

// Function to serialize to JSON (returns a copy that can be safely modified)
export function serialize${capitalizedKey}ToJSON() {
  return JSON.parse(JSON.stringify(${componentName}));
}
`;
    
    return tsContent;
}

/**
 * Get the target directory for a content type based on its baseType and key
 */
function getTargetDirectory(contentType, existingSchemas) {
    const contentTypeKey = contentType.key;
    const baseType = contentType.baseType;
    
    // First check if we already have a schema for this type
    if (existingSchemas.has(contentTypeKey)) {
        return existingSchemas.get(contentTypeKey).directoryPath;
    }
    
    // Generate new directory based on baseType
    const sanitizedKey = contentTypeKey.replace(/[\/:*?"<>|]/g, '_');
    const capitalizedKey = capitalize(sanitizedKey);
    
    const baseCmsPath = path.resolve(__dirname, '../../../src/cms');
    
    if (baseType === 'page') {
        return path.join(baseCmsPath, 'pages', `${capitalizedKey}`, 'schemas');
    } else if (baseType === 'component') {
        return path.join(baseCmsPath, 'components', `${capitalizedKey}Component`, 'schemas');
    } else if (baseType === 'media' || baseType === 'image' || baseType === 'video') {
        return path.join(baseCmsPath, 'media', `${capitalizedKey}`, 'schemas');
    } else if (baseType === 'experience') {
        return path.join(baseCmsPath, 'experiences', `${capitalizedKey}`, 'schemas');
    } else {
        // Fallback to components
        return path.join(baseCmsPath, 'components', `${capitalizedKey}Component`, 'schemas');
    }
}

/**
 * Check if a directory exists
 */
async function directoryExists(dirPath) {
    try {
        await fs.access(dirPath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Create directory if it doesn't exist
 */
async function ensureDirectory(dirPath) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
        return true;
    } catch (error) {
        console.error(`❌ Error creating directory "${dirPath}": ${error.message}`);
        return false;
    }
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Get command line argument for specific type
const typeNameArg = process.argv[2];

// Main execution
(async () => {
    try {
        console.log('🔍 Discovering existing schema files...');
        const existingSchemas = await findExistingSchemaFiles();
        console.log(`Found ${existingSchemas.size} existing schema files`);
        
        // Get content types from API
        console.log('📡 Fetching content types from CMS...');
        const contentTypesList = await client.contentTypes.contentTypesList();
        const contentTypesListSorted = contentTypesList.items.sort((a, b) =>
            a.key.localeCompare(b.key)
        );
        
        const filteredContentTypes = contentTypesListSorted.filter(ct => 
            ct && ct.key && ct.source !== 'system' && ct.source !== 'graph'
        );
        
        console.log(`Found ${filteredContentTypes.length} content types in CMS`);
        
        if (typeNameArg) {
            console.log(`Starting schema pull for specific type: ${typeNameArg}...`);
            
            const targetContentType = filteredContentTypes.find(ct => ct.key === typeNameArg);
            if (!targetContentType) {
                console.log(`❌ Content type "${typeNameArg}" not found in CMS`);
                process.exit(1);
            }
            
            await processContentType(targetContentType, existingSchemas);
        } else {
            console.log('Starting schema pull for all content types...');
            
            let success = 0;
            let skipped = 0;
            let failed = 0;
            
            for (const contentType of filteredContentTypes) {
                try {
                    const result = await processContentType(contentType, existingSchemas);
                    if (result === 'success') success++;
                    else if (result === 'skipped') skipped++;
                    else failed++;
                } catch (error) {
                    console.error(`❌ Error processing ${contentType.key}:`, error.message);
                    failed++;
                }
            }
            
            console.log('\n📊 Schema pull summary:');
            console.log(`✅ Successfully updated: ${success}`);
            console.log(`⚠️ Skipped: ${skipped}`);
            console.log(`❌ Failed: ${failed}`);
        }
        
        console.log('✅ Schema pull completed!');
    } catch (error) {
        console.error('❌ Fatal error during schema pull:', error.message);
        process.exit(1);
    }
})();

/**
 * Process a single content type
 */
async function processContentType(contentType, existingSchemas) {
    const contentTypeKey = contentType.key;
    const sanitizedKey = contentTypeKey.replace(/[\/:*?"<>|]/g, '_');
    
    // Skip certain types
    if (contentType.baseType === 'experience' && contentTypeKey === 'BlankExperience') {
        console.log(`⚠️ Skipping experience type "${contentTypeKey}"`);
        return 'skipped';
    }
    
    // Get target directory
    const targetDirectory = getTargetDirectory(contentType, existingSchemas);
    const schemaFilePath = path.join(targetDirectory, `${sanitizedKey}.type.schema.ts`);
    
    // Check if target directory exists or can be created
    if (!(await directoryExists(targetDirectory))) {
        console.log(`📁 Creating directory: ${targetDirectory}`);
        const created = await ensureDirectory(targetDirectory);
        if (!created) {
            console.log(`❌ Failed to create directory for "${contentTypeKey}"`);
            return 'failed';
        }
    }
    
    // Generate TypeScript schema content
    const tsContent = generateTypeScriptSchema(contentType, sanitizedKey);
    
    // Write the schema file
    try {
        await fs.writeFile(schemaFilePath, tsContent, 'utf8');
        console.log(`✅ Content type "${contentTypeKey}" pulled to ${path.relative(process.cwd(), schemaFilePath)}`);
        return 'success';
    } catch (error) {
        console.error(`❌ Error writing schema file for "${contentTypeKey}":`, error.message);
        return 'failed';
    }
}