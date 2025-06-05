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

// Get command line argument for specific style
const styleNameArg = process.argv[2];

// Main execution
(async () => {
    if (styleNameArg) {
        console.log(`Starting style push for: ${styleNameArg}...`);
        
        // Find specific style file
        const files = await processFiles('*.opti-style.json');
        const targetFile = files.find(file => {
            const filename = path.basename(file);
            return filename === `${styleNameArg}.opti-style.json`;
        });

        if (!targetFile) {
            console.log(`❌ Style file "${styleNameArg}.opti-style.json" not found`);
            process.exit(1);
        }

        // Read the style definition
        const styleDefinition = await tryReadJsonFile(targetFile);
        if (styleDefinition === undefined || !styleDefinition.key) {
            console.log(`❌ Invalid style definition in ${targetFile}`);
            process.exit(1);
        }

        const styleKey = styleDefinition.key;
        const contentType = styleDefinition.contentType;
        const nodeType = styleDefinition.nodeType;

        try {
            await client.displayTemplates.displayTemplatesPut(
                styleKey,
                styleDefinition
            );
            console.log(
                `✅ Template with styleKey: ${styleKey}, contentType: ${contentType}, nodeType: ${nodeType} has been updated`
            );
        } catch (e) {
            console.log(`❌ Error while trying to update ${styleKey} in ${targetFile}`);
            console.log(`Error Details: ${JSON.stringify(e)}`);
            process.exit(1);
        }
    } else {
        console.log('Starting style push for all styles...');
        
        // Find all opti-style.json files
        const files = await processFiles('*.opti-style.json');
        console.log(`Found ${files.length} style definition files`);
        
        // Track results for summary
        const results = {
            success: 0,
            failed: 0,
            skipped: 0
        };

        // Process each file
        for (const file of files) {
            const styleDefinition = await tryReadJsonFile(file);
            if (styleDefinition === undefined || !styleDefinition.key) {
                console.log(`Invalid style definition in ${file}`);
                results.skipped++;
                continue;
            }
            
            const styleKey = styleDefinition.key;
            const contentType = styleDefinition.contentType;
            const nodeType = styleDefinition.nodeType;
            
            try {
                await client.displayTemplates.displayTemplatesPut(
                    styleKey,
                    styleDefinition
                );
                console.log(
                    `✅ Template with styleKey: ${styleKey}, contentType: ${contentType}, nodeType: ${nodeType} has been updated`
                );
                results.success++;
            } catch (e) {
                console.log(`❌ Error while trying to update ${styleKey} in ${file}`);
                console.log(`Error Details: ${JSON.stringify(e)}`);
                results.failed++;
            }
        }

        // Display summary
        console.log('\nStyle push summary:');
        console.log(`✅ Successfully updated: ${results.success}`);
        console.log(`❌ Failed to update: ${results.failed}`);
        console.log(`⚠️ Skipped: ${results.skipped}`);
    }
    console.log('Done!');
})().catch(err => {
    console.error('Unhandled error during execution:', err);
    process.exit(1);
});

async function tryReadJsonFile(filePath) {
    try {
        return JSON.parse(await fs.readFile(filePath, { encoding: 'utf-8' }));
    } catch (e) {
        console.log(`Error while reading ${filePath}\n`);
    }
    return undefined;
}
