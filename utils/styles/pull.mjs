import { createClient } from '@remkoj/optimizely-cms-api';
import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a usable file path
const currentFilename = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilename);
// const directoryToPullStylesInto = fg.convertPathToPattern(path.resolve(`${currentDirectory}/temp`)); // temp directory to store pulled styles
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

// Get command line argument for specific style name
const styleNameArg = process.argv[2];

const templatesList = await client.displayTemplates.displayTemplatesList();
const templatesListFiltered = styleNameArg ? 
    templatesList.items.filter(
        (item) => item.key === styleNameArg
    ) : templatesList.items;

templatesListFiltered?.forEach(async (template) => {
    const styleKey = template.key;
    const styleDefinition =
        await client.displayTemplates.displayTemplatesGet(styleKey);
    const contentType = styleDefinition.contentType;
    const nodeType = styleDefinition.nodeType;
    const baseType = styleDefinition.baseType;
    // Cleanup the style definition
    // https://github.com/remkoj/optimizely-dxp-clients/blob/main/packages/optimizely-cms-cli/src/commands/styles_pull.tshttps://github.com/remkoj/optimizely-dxp-clients/blob/6f9633d4965a50a5323d3e8b2a03ab10deff8e9d/packages/optimizely-cms-cli/src/commands/styles_pull.ts#L63
    if (styleDefinition.createdBy) delete styleDefinition.createdBy;
    if (styleDefinition.lastModifiedBy) delete styleDefinition.lastModifiedBy;
    if (styleDefinition.created) delete styleDefinition.created;
    if (styleDefinition.lastModified) delete styleDefinition.lastModified;

    if (contentType !== undefined && contentType !== '') {
        const componentStyleLocation = fg.convertPathToPattern(path.resolve(
            path.dirname(fileURLToPath(import.meta.url)), 
            `../../src/cms/components/${contentType}Component`
        ));
        if (
            contentType !== undefined &&
            contentType !== '' &&
            (await folderExists(componentStyleLocation))
        ) {
            fs.writeFile(
                path.join(componentStyleLocation, `${styleKey}.opti-style.json`),
                JSON.stringify(styleDefinition, null, '\t')
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
        const nodeStyleLocation = fg.convertPathToPattern(path.resolve(
            path.dirname(fileURLToPath(import.meta.url)), 
            `../../src/cms/compositions/${capitalize(nodeType)}`
        ));
        const baseStyleLocation = fg.convertPathToPattern(path.resolve(
            path.dirname(fileURLToPath(import.meta.url)), 
            `../../src/cms/compositions/${capitalize(baseType)}`
        ));
        if (
            nodeType !== undefined &&
            nodeType !== '' &&
            (await folderExists(nodeStyleLocation))
        ) {
            fs.writeFile(
                path.join(nodeStyleLocation, `${styleKey}.opti-style.json`),
                JSON.stringify(styleDefinition, null, '\t')
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
                path.join(baseStyleLocation, `${styleKey}.opti-style.json`),
                JSON.stringify(styleDefinition, null, '\t')
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
