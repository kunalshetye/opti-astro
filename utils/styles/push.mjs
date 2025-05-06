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

async function processFiles(pattern) {
    try {
        const files = await fg(`${directoryToFindStylesIn}/**/${pattern}`, {
            absolute: true,
        });
        return files;
    } catch (error) {
        console.error('Error finding files:', error);
    }
}

const files = await processFiles('*.opti-style.json');
files.forEach(async (file) => {
    const styleDefinition = await tryReadJsonFile(file);
    if (styleDefinition === undefined || !styleDefinition.key) {
        console.log(`Invalid style definition in ${file}`);
        return;
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
            `Template with styleKey: ${styleKey}, contentType: ${contentType}, nodeType: ${nodeType} has been updated`
        );
    } catch (e) {
        console.log(`Error while trying to update ${styleKey} in ${file}`);
        console.log(`Error Details: ${JSON.stringify(e)}`);
    }
});

async function tryReadJsonFile(filePath) {
    try {
        return JSON.parse(await fs.readFile(filePath, { encoding: 'utf-8' }));
    } catch (e) {
        console.log(`Error while reading ${filePath}\n`);
    }
    return undefined;
}
