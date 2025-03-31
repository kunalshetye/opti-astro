import { createClient } from '@remkoj/optimizely-cms-api';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a usable file path
const currentFilename = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilename);
const directoryToFindStylesIn = path.resolve(
    `${currentDirectory}/../../src/cms`
); // looking for pattern *.opti-style.json
const directoryToPullStylesInto = path.resolve(`${currentDirectory}/temp`); // temp directory to store pulled styles
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

const contentTypesList = await client.contentTypes.contentTypesList();
contentTypesList.items?.forEach(async (contentType) => {
    //console.log(contentType);
    const realContentType = await client.contentTypes.contentTypesGet(
        contentType.key
    );
    if (
        realContentType.baseType === 'component' ||
        realContentType.baseType === 'page'
    )
        return;
    console.log(realContentType);
    // fs.writeFile(
    //     `${directoryToPullStylesInto}/${styleKey}.opti-style.json`,
    //     JSON.stringify(styleDefinition, null, 2)
    // );
    // console.log(
    //     `Template with styleKey: ${styleKey} and contentType: ${styleDefinition.contentType} has been pulled`
    // );
});

async function folderExists(path) {
    try {
        await fs.access(path); // No error means the folder exists
        //console.log(`✅ Folder "${path}" exists.`);
        return true;
    } catch (error) {
        //console.log(`❌ Folder "${path}" does not exist.`);
        return false;
    }
}

function capitalize(str) {
    if (!str) return ''; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1);
}
