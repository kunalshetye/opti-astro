import type { CodegenConfig } from '@graphql-codegen/cli';
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

// import { loadEnv } from 'vite';
// const { OPTIMIZELY_GRAPH_SINGLE_KEY, OPTIMIZELY_GRAPH_GATEWAY } = loadEnv(
//     process.env.NODE_ENV || 'development',
//     process.cwd(),
//     ''
// );

import 'dotenv/config';

const OPTIMIZELY_GRAPH_GATEWAY=process.env.OPTIMIZELY_GRAPH_GATEWAY;
const OPTIMIZELY_GRAPH_SINGLE_KEY=process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;
const OPTIMIZELY_DAM_ENABLED = process.env.OPTIMIZELY_DAM_ENABLED === 'true';
const OPTIMIZELY_FORMS_ENABLED = process.env.OPTIMIZELY_FORMS_ENABLED === 'true';

// Build document array dynamically to avoid conflicts
function buildDocumentArray() {
    const graphqlFilePath = ['./src/graphql/**/*.graphql'];
    const graphqlFiles = glob.sync(graphqlFilePath);
    
    if (OPTIMIZELY_DAM_ENABLED && !OPTIMIZELY_FORMS_ENABLED) {
        // When DAM is enabled, prefer .dam.graphql files over regular ones
        const allCmsFiles = glob.sync('./src/cms/**/*.graphql');
        const allGraphqlFiles = [...graphqlFiles, ...allCmsFiles];
        const damFiles = allGraphqlFiles.filter(file => file.endsWith('.dam.graphql'));
        const regularFiles = allGraphqlFiles
            .filter(file => !file.endsWith('.dam.graphql'))
            .filter(file => !file.endsWith('.forms.graphql'));
        
        // For each regular file, check if a DAM version exists
        const finalFiles = regularFiles.filter(regularFile => {
            const damVersion = regularFile.replace('.graphql', '.dam.graphql');
            return !damFiles.includes(damVersion);
        });

        return [...damFiles, ...finalFiles];
    } else if (OPTIMIZELY_FORMS_ENABLED && !OPTIMIZELY_DAM_ENABLED) {
        // When Forms are enabled, prefer .forms.graphql files over regular ones
        const allCmsFiles = glob.sync('./src/cms/**/*.graphql');
        const allGraphqlFiles = [...graphqlFiles, ...allCmsFiles];
        const formsFiles = allGraphqlFiles.filter(file => file.endsWith('.forms.graphql'));
        const regularFiles = allGraphqlFiles
            .filter(file => !file.endsWith('.dam.graphql'))
            .filter(file => !file.endsWith('.forms.graphql'));

        // For each regular file, check if a DAM version exists
        const finalFiles = regularFiles.filter(regularFile => {
            const formsVersion = regularFile.replace('.graphql', '.forms.graphql');
            return !formsFiles.includes(formsVersion);
        });

        return [...formsFiles, ...finalFiles];
    } else if (OPTIMIZELY_FORMS_ENABLED && OPTIMIZELY_DAM_ENABLED) {
        // When Forms are enabled, prefer .forms.graphql files over regular ones
        const allCmsFiles = glob.sync('./src/cms/**/*.graphql');
        const allGraphqlFiles = [...graphqlFiles, ...allCmsFiles];
        const damFiles = allGraphqlFiles.filter(file => file.endsWith('.dam.graphql'));
        const formsFiles = allGraphqlFiles.filter(file => file.endsWith('.forms.graphql'));

        const regularFiles = allGraphqlFiles
            .filter(file => !file.endsWith('.dam.graphql'))
            .filter(file => !file.endsWith('.forms.graphql'));

        // For each regular file, check if a Forms version exists
        const finalFiles = regularFiles.filter(regularFile => {
            const damVersion = regularFile.replace('.graphql', '.dam.graphql');
            const formsVersion = regularFile.replace('.graphql', '.forms.graphql');
            return !formsFiles.includes(formsVersion) && !damFiles.includes(damVersion);
        });

        return [...damFiles, ...formsFiles, ...finalFiles];
    } else {
        // When DAM and Forms are disabled, exclude all .dam.graphql and .forms.graphql files
        return [
            ...graphqlFilePath,
            '!./src/graphql/**/*.dam.graphql',
            '!./src/graphql/**/*.forms.graphql',
            './src/cms/**/*.graphql',
            '!./src/cms/**/*.dam.graphql',
            '!./src/cms/**/*.forms.graphql'
        ];
    }
}

const allDocuments = buildDocumentArray();

const config: CodegenConfig = {
    overwrite: true,
    schema: `${OPTIMIZELY_GRAPH_GATEWAY}/content/v2?auth=${OPTIMIZELY_GRAPH_SINGLE_KEY}`,
    generates: {
        './__generated/graphql.schema.json': {
            plugins: ['introspection'],
        },
        './__generated/graphql.schema.graphql': {
            plugins: ['schema-ast'],
        },
        './__generated/sdk.ts': {
            documents: allDocuments,
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-generic-sdk',
            ],
            config: {
                rawRequest: false,
                inlineFragmentTypes: 'combine',
                skipTypename: false,
                exportFragmentSpreadSubTypes: true,
                dedupeFragments: true,
                preResolveTypes: true,
            },
        },
    },
};

export default config;
