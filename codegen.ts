import type { CodegenConfig } from '@graphql-codegen/cli';
import { glob } from 'glob';

import 'dotenv/config';

const OPTIMIZELY_GRAPH_GATEWAY=process.env.OPTIMIZELY_GRAPH_GATEWAY;
const OPTIMIZELY_GRAPH_SINGLE_KEY=process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;

// Auto-detect DAM and Forms features by querying the Graph schema
async function detectCmsFeatures(): Promise<{ damEnabled: boolean; formsEnabled: boolean }> {
    try {
        const response = await fetch(
            `${OPTIMIZELY_GRAPH_GATEWAY}/content/v2?auth=${OPTIMIZELY_GRAPH_SINGLE_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `query cmsFeatureChecks {
                        damEnabled: __type(name: "cmp_Asset") { __typename }
                        formsEnabled: __type(name: "OptiFormsContainerData") { __typename }
                    }`
                }),
            }
        );
        const { data } = await response.json();
        const damEnabled = data?.damEnabled !== null;
        const formsEnabled = data?.formsEnabled !== null;
        console.log(`[codegen] Auto-detected features — DAM: ${damEnabled}, Forms: ${formsEnabled}`);
        return { damEnabled, formsEnabled };
    } catch (error) {
        console.warn('[codegen] Failed to auto-detect CMS features, defaulting to disabled:', error);
        return { damEnabled: false, formsEnabled: false };
    }
}

// Build document array dynamically to avoid conflicts
function buildDocumentArray(damEnabled: boolean, formsEnabled: boolean) {
    const graphqlFilePath = ['./src/graphql/**/*.graphql'];
    const graphqlFiles = glob.sync(graphqlFilePath);
    
    if (damEnabled && !formsEnabled) {
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
    } else if (formsEnabled && !damEnabled) {
        // When Forms are enabled, prefer .forms.graphql files over regular ones
        const allCmsFiles = glob.sync('./src/cms/**/*.graphql');
        const allGraphqlFiles = [...graphqlFiles, ...allCmsFiles];
        const formsFiles = allGraphqlFiles.filter(file => file.endsWith('.forms.graphql'));
        const regularFiles = allGraphqlFiles
            .filter(file => !file.endsWith('.dam.graphql'))
            .filter(file => !file.endsWith('.forms.graphql'));

        // For each regular file, check if a Forms version exists
        const finalFiles = regularFiles.filter(regularFile => {
            const formsVersion = regularFile.replace('.graphql', '.forms.graphql');
            return !formsFiles.includes(formsVersion);
        });

        return [...formsFiles, ...finalFiles];
    } else if (formsEnabled && damEnabled) {
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

export default (async (): Promise<CodegenConfig> => {
    const { damEnabled, formsEnabled } = await detectCmsFeatures();
    const allDocuments = buildDocumentArray(damEnabled, formsEnabled);

    return {
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
})();
