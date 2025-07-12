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
 * Find all existing TypeScript style schema files to understand the current structure
 */
async function findExistingStyleSchemaFiles() {
    const schemaFiles = await fg('**/*.style.schema.ts', {
        cwd: path.resolve(__dirname, '../../../src/cms'),
        absolute: true,
    });
    
    const schemaMap = new Map();
    
    for (const file of schemaFiles) {
        const relativePath = path.relative(path.resolve(__dirname, '../../../src/cms'), file);
        const parts = relativePath.split(path.sep);
        
        // Extract the schema key from the filename
        const filename = path.basename(file, '.style.schema.ts');
        const schemaKey = filename;
        
        // Determine the directory type and path
        let baseType;
        let directoryPath;
        
        if (parts[0] === 'components') {
            baseType = 'component';
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
 * Find the corresponding type schema file for a style
 */
async function findTypeSchemaFile(contentType, baseType, nodeType) {
    const searchPaths = [];
    
    // Search patterns based on contentType or nodeType
    if (contentType) {
        searchPaths.push(`**/${contentType}.type.schema.ts`);
        searchPaths.push(`**/${contentType}Component/schemas/${contentType}.type.schema.ts`);
    }
    
    if (nodeType) {
        searchPaths.push(`**/${nodeType}.type.schema.ts`);
        searchPaths.push(`**/${capitalize(nodeType)}/schemas/${nodeType}.type.schema.ts`);
    }
    
    if (baseType) {
        searchPaths.push(`**/${baseType}.type.schema.ts`);
        searchPaths.push(`**/${capitalize(baseType)}/schemas/${baseType}.type.schema.ts`);
    }
    
    for (const searchPath of searchPaths) {
        const files = await fg(searchPath, {
            cwd: path.resolve(__dirname, '../../../src/cms'),
            absolute: true,
        });
        
        if (files.length > 0) {
            return files[0];
        }
    }
    
    return null;
}

/**
 * Generate TypeScript style schema content from CMS style definition
 */
async function generateTypeScriptStyleSchema(styleDefinition, schemaKey) {
    const cleanStyle = { ...styleDefinition };
    
    // Remove unwanted properties
    if (cleanStyle.createdBy) delete cleanStyle.createdBy;
    if (cleanStyle.lastModifiedBy) delete cleanStyle.lastModifiedBy;
    if (cleanStyle.created) delete cleanStyle.created;
    if (cleanStyle.lastModified) delete cleanStyle.lastModified;
    
    // Convert settings to TypeScript schema format
    const settings = {};
    if (cleanStyle.settings) {
        for (const [key, setting] of Object.entries(cleanStyle.settings)) {
            settings[key] = {
                displayName: setting.displayName,
                editor: setting.editor || '',
                sortOrder: setting.sortOrder || 0,
                choices: setting.choices || {}
            };
        }
    }
    
    const capitalizedKey = capitalize(schemaKey);
    const styleDefinitionName = `${capitalizedKey}StyleDefinition`;
    
    // Determine import path for type schema
    let importPath = '';
    let importName = '';
    
    if (cleanStyle.contentType) {
        // Component style - find the type schema
        const typeSchemaFile = await findTypeSchemaFile(cleanStyle.contentType, cleanStyle.baseType, cleanStyle.nodeType);
        if (typeSchemaFile) {
            const typeSchemaName = path.basename(typeSchemaFile, '.type.schema.ts');
            importName = `${capitalize(typeSchemaName)}ComponentDefinition`;
            importPath = `./${typeSchemaName}.type.schema.js`;
        }
    } else if (cleanStyle.nodeType || cleanStyle.baseType) {
        // Composition style - find the type schema  
        const typeSchemaFile = await findTypeSchemaFile(null, cleanStyle.baseType, cleanStyle.nodeType);
        if (typeSchemaFile) {
            const typeSchemaName = path.basename(typeSchemaFile, '.type.schema.ts');
            importName = `${capitalize(typeSchemaName)}ComponentDefinition`;
            importPath = `./${typeSchemaName}.type.schema.js`;
        }
    }
    
    const imports = [];
    imports.push("import { StyleSchema } from '../../../../lib/schema-registry.js';");
    
    if (importName && importPath) {
        imports.push(`import { ${importName} } from '${importPath}';`);
    }
    
    const styleProperties = {
        key: cleanStyle.key,
        displayName: cleanStyle.displayName,
        ...(cleanStyle.contentType && { contentType: `${importName ? importName + '.key' : `'${cleanStyle.contentType}'`}` }),
        ...(cleanStyle.baseType && { baseType: `'${cleanStyle.baseType}'` }),
        ...(cleanStyle.nodeType && { nodeType: `'${cleanStyle.nodeType}'` }),
        ...(cleanStyle.isDefault !== undefined && { isDefault: cleanStyle.isDefault }),
        settings: settings
    };
    
    const tsContent = `${imports.join('\n')}

// Auto-registering ${cleanStyle.displayName} style schema
export const ${styleDefinitionName} = StyleSchema({
  key: '${styleProperties.key}',
  displayName: '${styleProperties.displayName}',${styleProperties.contentType ? `\n  contentType: ${styleProperties.contentType},` : ''}${styleProperties.baseType ? `\n  baseType: ${styleProperties.baseType},` : ''}${styleProperties.nodeType ? `\n  nodeType: ${styleProperties.nodeType},` : ''}${styleProperties.isDefault !== undefined ? `\n  isDefault: ${styleProperties.isDefault},` : ''}
  settings: ${JSON.stringify(settings, null, 2).replace(/\n/g, '\n    ')},
});
`;
    
    return tsContent;
}

/**
 * Get the target directory for a style based on its contentType, nodeType, or baseType
 */
function getTargetDirectory(styleDefinition, existingSchemas) {
    const styleKey = styleDefinition.key;
    
    // First check if we already have a schema for this style
    if (existingSchemas.has(styleKey)) {
        return existingSchemas.get(styleKey).directoryPath;
    }
    
    // Generate new directory based on contentType, nodeType, or baseType
    const baseCmsPath = path.resolve(__dirname, '../../../src/cms');
    
    if (styleDefinition.contentType) {
        // Component style
        const contentType = styleDefinition.contentType;
        const capitalizedContentType = capitalize(contentType);
        return path.join(baseCmsPath, 'components', `${capitalizedContentType}Component`, 'schemas');
    } else if (styleDefinition.nodeType) {
        // Composition style by nodeType
        const nodeType = styleDefinition.nodeType;
        const capitalizedNodeType = capitalize(nodeType);
        return path.join(baseCmsPath, 'compositions', capitalizedNodeType, 'schemas');
    } else if (styleDefinition.baseType) {
        // Composition style by baseType
        const baseType = styleDefinition.baseType;
        const capitalizedBaseType = capitalize(baseType);
        return path.join(baseCmsPath, 'compositions', capitalizedBaseType, 'schemas');
    } else {
        // Fallback - use the style key
        const sanitizedKey = styleKey.replace(/[\/:*?"<>|]/g, '_');
        const capitalizedKey = capitalize(sanitizedKey);
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

// Get command line argument for specific style
const styleNameArg = process.argv[2];

// Main execution
(async () => {
    try {
        console.log('🔍 Discovering existing style schema files...');
        const existingSchemas = await findExistingStyleSchemaFiles();
        console.log(`Found ${existingSchemas.size} existing style schema files`);
        
        // Get style templates from API
        console.log('📡 Fetching style templates from CMS...');
        const templatesList = await client.displayTemplates.displayTemplatesList();
        const filteredTemplates = templatesList.items?.filter(template => template && template.key) || [];
        
        console.log(`Found ${filteredTemplates.length} style templates in CMS`);
        
        if (styleNameArg) {
            console.log(`Starting style schema pull for specific style: ${styleNameArg}...`);
            
            const targetTemplate = filteredTemplates.find(t => t.key === styleNameArg);
            if (!targetTemplate) {
                console.log(`❌ Style template "${styleNameArg}" not found in CMS`);
                process.exit(1);
            }
            
            await processStyleTemplate(targetTemplate, existingSchemas);
        } else {
            console.log('Starting style schema pull for all templates...');
            
            let success = 0;
            let skipped = 0;
            let failed = 0;
            
            for (const template of filteredTemplates) {
                try {
                    const result = await processStyleTemplate(template, existingSchemas);
                    if (result === 'success') success++;
                    else if (result === 'skipped') skipped++;
                    else failed++;
                } catch (error) {
                    console.error(`❌ Error processing ${template.key}:`, error.message);
                    failed++;
                }
            }
            
            console.log('\n📊 Style schema pull summary:');
            console.log(`✅ Successfully updated: ${success}`);
            console.log(`⚠️ Skipped: ${skipped}`);
            console.log(`❌ Failed: ${failed}`);
        }
        
        console.log('✅ Style schema pull completed!');
    } catch (error) {
        console.error('❌ Fatal error during style schema pull:', error.message);
        process.exit(1);
    }
})();

/**
 * Process a single style template
 */
async function processStyleTemplate(template, existingSchemas) {
    const styleKey = template.key;
    
    try {
        // Get detailed style definition
        const styleDefinition = await client.displayTemplates.displayTemplatesGet(styleKey);
        
        // Get target directory
        const targetDirectory = getTargetDirectory(styleDefinition, existingSchemas);
        const schemaFilePath = path.join(targetDirectory, `${styleKey}.style.schema.ts`);
        
        // Check if target directory exists or can be created
        if (!(await directoryExists(targetDirectory))) {
            console.log(`📁 Creating directory: ${targetDirectory}`);
            const created = await ensureDirectory(targetDirectory);
            if (!created) {
                console.log(`❌ Failed to create directory for style "${styleKey}"`);
                return 'failed';
            }
        }
        
        // Generate TypeScript schema content
        const tsContent = await generateTypeScriptStyleSchema(styleDefinition, styleKey);
        
        // Write the schema file
        await fs.writeFile(schemaFilePath, tsContent, 'utf8');
        
        const contentType = styleDefinition.contentType || styleDefinition.nodeType || styleDefinition.baseType || 'unknown';
        console.log(`✅ Style "${styleKey}" (${contentType}) pulled to ${path.relative(process.cwd(), schemaFilePath)}`);
        
        return 'success';
    } catch (error) {
        console.error(`❌ Error processing style "${styleKey}":`, error.message);
        return 'failed';
    }
}