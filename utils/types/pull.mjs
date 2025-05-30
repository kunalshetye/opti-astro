import { createClient } from '@remkoj/optimizely-cms-api';
import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a usable file path

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

// Get content types from API
const contentTypesList = await client.contentTypes.contentTypesList();
const contentTypesListSorted = contentTypesList.items.sort((a, b) =>
    a.key.localeCompare(b.key)
);

contentTypesListSorted?.forEach(async (contentType) => {
    if (
        contentType !== undefined &&
        contentType !== '' &&
        contentType.source != 'system'
    ) {
        // Clean up the content type object by removing unwanted properties
        const cleanContentType = { ...contentType };

        // Remove unwanted properties as in the reference implementation
        if (cleanContentType.source || cleanContentType.source == '')
            delete cleanContentType.source;
        if (cleanContentType.features) delete cleanContentType.features;
        if (cleanContentType.usage) delete cleanContentType.usage;
        if (cleanContentType.lastModifiedBy)
            delete cleanContentType.lastModifiedBy;
        if (cleanContentType.lastModified) delete cleanContentType.lastModified;
        if (cleanContentType.created) delete cleanContentType.created;

        const contentTypeKey = contentType.key;
        // Sanitize the key for folder names (replace invalid chars like : with _)
        const sanitizedKey = contentTypeKey.replace(/[\/:*?"<>|]/g, '_');
        const contentTypeKeyCapitalized = capitalize(sanitizedKey);

        // Now organize based on type following folder structure based on baseType
        const baseType = cleanContentType.baseType;

        if (baseType === 'page') {
            // Pages go in pages folder
            const typeFolderPath = fg.convertPathToPattern(
                path.resolve(
                    path.dirname(fileURLToPath(import.meta.url)),
                    `../../src/cms/pages/${contentTypeKeyCapitalized}`
                )
            );

            // Check if directory exists, but don't create it
            if (await folderExists(typeFolderPath)) {
                // Directory exists, write the file
                fs.writeFile(
                    path.join(typeFolderPath, `${sanitizedKey}.opti-type.json`),
                    JSON.stringify(cleanContentType, null, '\t')
                );
                console.log(
                    `✅ Content type for type "${contentTypeKey}" has been pulled to pages folder`
                );
            } else {
                // Directory doesn't exist, just warn
                console.log(
                    `⚠️ Warning: Page folder for "${contentTypeKey}" does not exist at ${typeFolderPath}`
                );
            }
        } else if (baseType === 'component') {
            // Standard components go in component folders
            const typeFolderPath = fg.convertPathToPattern(
                path.resolve(
                    path.dirname(fileURLToPath(import.meta.url)),
                    `../../src/cms/components/${contentTypeKeyCapitalized}Component`
                )
            );

            // Check if directory exists, but don't create it
            if (await folderExists(typeFolderPath)) {
                // Directory exists, write the file
                fs.writeFile(
                    path.join(typeFolderPath, `${sanitizedKey}.opti-type.json`),
                    JSON.stringify(cleanContentType, null, '\t')
                );
                console.log(
                    `✅ Content type for type "${contentTypeKey}" has been pulled to components folder`
                );
            } else {
                // Directory doesn't exist, just warn
                console.log(
                    `⚠️ Warning: Component folder for "${contentTypeKey}" does not exist at ${typeFolderPath}`
                );
            }
        } else if (baseType === 'media') {
            // Media types go in media folder
            const typeFolderPath = fg.convertPathToPattern(
                path.resolve(
                    path.dirname(fileURLToPath(import.meta.url)),
                    `../../src/cms/media/${contentTypeKeyCapitalized}`
                )
            );

            // Check if directory exists, but don't create it
            if (await folderExists(typeFolderPath)) {
                // Directory exists, write the file
                fs.writeFile(
                    path.join(typeFolderPath, `${sanitizedKey}.opti-type.json`),
                    JSON.stringify(cleanContentType, null, '\t')
                );
                console.log(
                    `✅ Content type for type "${contentTypeKey}" has been pulled to media folder`
                );
            } else {
                // Directory doesn't exist, just warn
                console.log(
                    `⚠️ Warning: Media folder for "${contentTypeKey}" does not exist at ${typeFolderPath}`
                );
            }
        } else if (baseType === 'image' || baseType === 'video') {
            // Image and video types also go in media folder
            const typeFolderPath = fg.convertPathToPattern(
                path.resolve(
                    path.dirname(fileURLToPath(import.meta.url)),
                    `../../src/cms/media/${contentTypeKeyCapitalized}`
                )
            );

            // Check if directory exists, but don't create it
            if (await folderExists(typeFolderPath)) {
                // Directory exists, write the file
                fs.writeFile(
                    path.join(typeFolderPath, `${sanitizedKey}.opti-type.json`),
                    JSON.stringify(cleanContentType, null, '\t')
                );
                console.log(
                    `✅ Content type for type "${contentTypeKey}" has been pulled to media folder`
                );
            } else {
                // Directory doesn't exist, just warn
                console.log(
                    `⚠️ Warning: Media folder for "${contentTypeKey}" does not exist at ${typeFolderPath}`
                );
            }
        } else if (baseType === 'experience') {
            if (contentTypeKeyCapitalized === 'BlankExperience') {
                console.log(
                    `⚠️ Warning: Skipping experience type "${contentTypeKey}"`
                );
                return;
            }

            // Experience types go in experiences folder
            const typeFolderPath = fg.convertPathToPattern(
                path.resolve(
                    path.dirname(fileURLToPath(import.meta.url)),
                    `../../src/cms/experiences/${contentTypeKeyCapitalized}`
                )
            );

            // Check if directory exists, but don't create it
            if (await folderExists(typeFolderPath)) {
                // Directory exists, write the file
                fs.writeFile(
                    path.join(typeFolderPath, `${sanitizedKey}.opti-type.json`),
                    JSON.stringify(cleanContentType, null, '\t')
                );
                console.log(
                    `✅ Content type for type "${contentTypeKey}" has been pulled to experiences folder`
                );
            } else {
                // Directory doesn't exist, just warn
                console.log(
                    `⚠️ Warning: Experience folder for "${contentTypeKey}" does not exist at ${typeFolderPath}`
                );
            }
        } else {
            // Fallback for any other baseType - put in components folder
            console.log(
                `Unknown baseType "${baseType}" for type "${contentTypeKey}", placing in components folder`
            );
            const typeFolderPath = fg.convertPathToPattern(
                path.resolve(
                    path.dirname(fileURLToPath(import.meta.url)),
                    `../../src/cms/components/${contentTypeKeyCapitalized}Component`
                )
            );

            // Check if directory exists, but don't create it
            if (await folderExists(typeFolderPath)) {
                // Directory exists, write the file
                fs.writeFile(
                    path.join(typeFolderPath, `${sanitizedKey}.opti-type.json`),
                    JSON.stringify(cleanContentType, null, '\t')
                );
                console.log(
                    `✅ Content type for type "${contentTypeKey}" has been pulled to components folder (fallback)`
                );
            } else {
                // Directory doesn't exist, just warn
                console.log(
                    `⚠️ Warning: Component folder for "${contentTypeKey}" does not exist at ${typeFolderPath} (fallback)`
                );
            }
        }
    }
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

// async function createDirectory(path) {
//     try {
//         // Create with recursive option to ensure parent directories are created
//         await fs.mkdir(path, { recursive: true });
//         return true;
//     } catch (error) {
//         console.log(
//             `❌ Error creating output folder "${path}": ${error.message}`
//         );
//         return false;
//     }
// }

function capitalize(str) {
    if (!str) return ''; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1);
}
