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
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const cmsUrl = process.env.CMS_URL;

// Create an instance of the client
const config = {
    base: new URL(cmsUrl),
    clientId: clientId,
    clientSecret: clientSecret,
};
const client = createClient(config);

const templatesList = await client.displayTemplates.displayTemplatesList();
templatesList.items?.forEach(async (template) => {
    const styleKey = template.key;
    const styleDefinition =
        await client.displayTemplates.displayTemplatesGet(styleKey);
    const contentType = styleDefinition.contentType;
    const nodeType = styleDefinition.nodeType;
    const baseType = styleDefinition.baseType;
    if (contentType !== undefined && contentType !== '') {
        const componentStyleLocation = `${directoryToFindStylesIn}/components/${contentType}Component`;
        if (
            contentType !== undefined &&
            contentType !== '' &&
            (await folderExists(componentStyleLocation))
        ) {
            fs.writeFile(
                `${componentStyleLocation}/${styleKey}.opti-style.json`,
                JSON.stringify(styleDefinition, null, 2)
            );
            console.log(
                `✅ Template with styleKey: ${styleKey} and contentType: ${contentType} has been pulled`
            );
        } else {
            console.log(
                `❌ Style exists in the CMS but folder "${styleKey}" does not exist.`
            );
        }
    } else {
        const nodeStyleLocation = `${directoryToFindStylesIn}/compositions/${capitalize(nodeType)}`;
        const baseStyleLocation = `${directoryToFindStylesIn}/compositions/${capitalize(baseType)}`;
        if (
            nodeType !== undefined &&
            nodeType !== '' &&
            (await folderExists(nodeStyleLocation))
        ) {
            fs.writeFile(
                `${nodeStyleLocation}/${styleKey}.opti-style.json`,
                JSON.stringify(styleDefinition, null, 2)
            );
            console.log(
                `✅ Template with styleKey: ${styleKey} and nodeType: ${nodeType} has been pulled`
            );
        } else if (
            baseType !== undefined &&
            baseType !== '' &&
            (await folderExists(baseStyleLocation))
        ) {
            fs.writeFile(
                `${baseStyleLocation}/${styleKey}.opti-style.json`,
                JSON.stringify(styleDefinition, null, 2)
            );
            console.log(
                `✅ Template with styleKey: ${styleKey} and baseType: ${baseType} has been pulled`
            );
        } else {
            console.log(
                `❌ Style exists in the CMS but folder for "${styleKey}" does not exist.`
            );
        }
    }

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
