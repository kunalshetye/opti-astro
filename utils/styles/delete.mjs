import { createClient } from '@remkoj/optimizely-cms-api';
import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a usable file path
const currentFilename = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilename);
const directoryToFindStylesIn = fg.convertPathToPattern(path.resolve(
    `${currentDirectory}/../../src/cms`
)); // looking for pattern *.opti-style.json

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
 * Find all files matching a pattern in the specified directory
 * @param {string} pattern - The file pattern to look for
 * @returns {Promise<string[]>} - Array of file paths
 */
async function processFiles(pattern) {
    try {
        const files = await fg(`${directoryToFindStylesIn}/**/${pattern}`, {
            absolute: true,
        });
        return files;
    } catch (error) {
        console.error('Error finding files:', error);
        return [];
    }
}

async function tryReadJsonFile(filePath) {
    try {
        return JSON.parse(await fs.readFile(filePath, { encoding: 'utf-8' }));
    } catch (e) {
        console.log(`Error while reading ${filePath}\n`);
    }
    return undefined;
}

// Get command line argument for specific style
const styleNameArg = process.argv[2];

// Main execution
(async () => {
    if (!styleNameArg) {
        console.log('❌ Error: Style name is required');
        console.log('Usage: node delete.mjs <StyleName>');
        console.log('Example: node delete.mjs DefaultSection');
        process.exit(1);
    }

    console.log(`Starting style deletion for: ${styleNameArg}...`);
    
    // Find specific style file
    const files = await processFiles('*.opti-style.json');
    const targetFile = files.find(file => {
        const filename = path.basename(file);
        return filename === `${styleNameArg}.opti-style.json`;
    });

    let styleKey, contentType, nodeType;
    let hasLocalFile = false;

    if (targetFile) {
        // Local file exists, read it for details
        hasLocalFile = true;
        const styleDefinition = await tryReadJsonFile(targetFile);
        if (styleDefinition === undefined || !styleDefinition.key) {
            console.log(`❌ Invalid style definition in ${targetFile}`);
            process.exit(1);
        }

        styleKey = styleDefinition.key;
        contentType = styleDefinition.contentType;
        nodeType = styleDefinition.nodeType;
    } else {
        // No local file found, use parameter as styleKey
        console.log(`ℹ️  Local file "${styleNameArg}.opti-style.json" not found`);
        console.log(`   Using "${styleNameArg}" as styleKey for CMS deletion`);
        
        styleKey = styleNameArg;
        contentType = 'Unknown';
        nodeType = 'Unknown';
    }

    // Confirm deletion
    console.log(`\n⚠️  You are about to delete the following style:`);
    console.log(`   Style Key: ${styleKey}`);
    console.log(`   Content Type: ${contentType || 'N/A'}`);
    console.log(`   Node Type: ${nodeType || 'N/A'}`);
    if (hasLocalFile) {
        console.log(`   Local File: ${path.basename(targetFile)}`);
    } else {
        console.log(`   Local File: None (CMS-only deletion)`);
    }
    
    // In a real-world scenario, you might want to add a confirmation prompt
    // For now, we'll proceed with the deletion
    
    try {
        await client.displayTemplates.displayTemplatesDelete(styleKey);
        console.log(`✅ Style "${styleKey}" has been successfully deleted from the CMS`);
        
        if (hasLocalFile) {
            console.log(`ℹ️  Note: The local file "${targetFile}" still exists`);
            console.log(`   To remove it locally, run: rm "${targetFile}"`);
        } else {
            console.log(`ℹ️  This was a CMS-only deletion (no local file found)`);
            
            // Show available local styles for reference
            console.log(`\nAvailable local styles:`);
            const availableStyles = files.map(file => {
                const filename = path.basename(file);
                return filename.replace('.opti-style.json', '');
            });
            
            if (availableStyles.length > 0) {
                availableStyles.forEach(style => console.log(`  - ${style}`));
            } else {
                console.log('  No local style files found');
            }
        }
    } catch (e) {
        console.log(`❌ Error while trying to delete ${styleKey}`);
        console.log(`Error Details: ${JSON.stringify(e)}`);
        
        // Check if it's a "not found" error
        if (e.status === 404 || e.message?.includes('not found')) {
            console.log(`ℹ️  The style "${styleKey}" may not exist in the CMS`);
        }
        
        process.exit(1);
    }

    console.log('Done!');
})().catch(err => {
    console.error('Unhandled error during execution:', err);
    process.exit(1);
});