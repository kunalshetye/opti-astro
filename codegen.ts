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

// Build document array dynamically to avoid conflicts
function buildDocumentArray() {
    const graphqlFiles = ['./src/graphql/**/*.graphql'];
    
    if (OPTIMIZELY_DAM_ENABLED) {
        // When DAM is enabled, prefer .dam.graphql files over regular ones
        const allCmsFiles = glob.sync('./src/cms/**/*.graphql');
        const damFiles = allCmsFiles.filter(file => file.endsWith('.dam.graphql'));
        const regularFiles = allCmsFiles.filter(file => !file.endsWith('.dam.graphql'));
        
        // For each regular file, check if a DAM version exists
        const finalFiles = regularFiles.filter(regularFile => {
            const damVersion = regularFile.replace('.graphql', '.dam.graphql');
            return !damFiles.includes(damVersion);
        });
        
        return [...graphqlFiles, ...damFiles, ...finalFiles];
    } else {
        // When DAM is disabled, exclude all .dam.graphql files
        return [
            ...graphqlFiles,
            './src/cms/**/*.graphql',
            '!./src/cms/**/*.dam.graphql'
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
