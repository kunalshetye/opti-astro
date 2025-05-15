import type { CodegenConfig } from '@graphql-codegen/cli';

// import { loadEnv } from 'vite';
// const { OPTIMIZELY_GRAPH_SINGLE_KEY, OPTIMIZELY_GRAPH_GATEWAY } = loadEnv(
//     process.env.NODE_ENV || 'development',
//     process.cwd(),
//     ''
// );

import 'dotenv/config'

const OPTIMIZELY_GRAPH_GATEWAY=import.meta.env.OPTIMIZELY_GRAPH_GATEWAY;
const OPTIMIZELY_GRAPH_SINGLE_KEY=import.meta.env.OPTIMIZELY_GRAPH_SINGLE_KEY;

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
            documents: ['./src/cms/**/*.graphql', './src/graphql/**/*.graphql'],
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
