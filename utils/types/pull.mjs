import { createClient } from '@remkoj/optimizely-cms-api';
import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a usable file path
const currentFilename = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilename);

// use temp directory in .gitignore to store pulled types while WIP
const directoryToPullTypesInto = fg.convertPathToPattern(path.resolve(`${currentDirectory}/temp`)); 
// const directoryToPullTypesInto = fg.convertPathToPattern(path.resolve(`${currentDirectory}/content_types`));

if(!(await folderExists(directoryToPullTypesInto))) {
    console.log("Creating output folder.")
    if(await createDirectory(directoryToPullTypesInto)) {
        console.log(`✅ Output folder "${directoryToPullTypesInto}" created.`);
    } 
}

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
const contentTypesListSorted = contentTypesList.items.sort((a, b) => a.key.localeCompare(b.key));

contentTypesListSorted?.forEach(async (contentType) => {
    // const contentTypeKey = contentType.key;
    // const realContentType = await client.contentTypes.contentTypesGet(
    //     contentType.key
    // );
    // console.log(contentTypeKey)
    if (contentType !== undefined && 
        contentType !== '' && 
        contentType.source != "system" &&
        (await folderExists(directoryToPullTypesInto))) {

        const contentTypeKey = capitalize(contentType.key);
        fs.writeFile(
            `${directoryToPullTypesInto}/${contentTypeKey}.opti-type.json`,
            JSON.stringify(contentType, null, 2)
        );
        console.log(
            `✅ Content type for type "${contentTypeKey}" has been pulled, and template was created`
        );
    }

    return;
});

async function folderExists(path) {
    try {
        await fs.access(path); // No error means the folder exists
        //console.log(`✅ Folder "${path}" exists.`);
        return true;
    } catch (error) {
        console.log(`❌ Output folder "${path}" does not exist.`);
        return false;
    }
}

async function createDirectory(path) {
    try {
        await fs.mkdir(path);
        return true;
    } catch(error) {
        console.log(`❌ Error creating output folder "${path}".`);
        return false;
    }
}

function capitalize(str) {
    if (!str) return ''; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1);
}