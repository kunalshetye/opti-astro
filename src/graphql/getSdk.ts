import { print } from 'graphql';
import { GraphQLClient } from 'graphql-request';

import {
    getSdk as getSdkWithClient,
    type Requester,
} from '../../__generated/sdk';

import {
    OPTIMIZELY_GRAPH_GATEWAY,
    OPTIMIZELY_GRAPH_SINGLE_KEY,
    OPTIMIZELY_DEV_MODE,
} from 'astro:env/client';

import type { ContentPayload } from '../graphql/shared/ContentPayload.ts';

// Global store for GraphQL queries in dev mode
let currentStore: Array<{
    query: string;
    variables: any;
    timestamp: Date;
}> = [];

// Track the last request timestamp to detect new page loads
let lastRequestTime = 0;
const REQUEST_RESET_THRESHOLD = 500; // 500ms between requests indicates new page

// Function to get captured queries (for use in components)
export function getGraphQLQueries() {
    return currentStore;
}

// Function to clear query history
export function clearGraphQLQueries() {
    currentStore = [];
}

export function getOptimizelySdk(contentPayload: ContentPayload) {
    const mode = contentPayload.ctx;
    const prevToken = contentPayload.preview_token;

    var client = new GraphQLClient('');
    const requester: Requester<any> = async (doc: any, vars: any) => {
        if (mode === 'edit' && prevToken) {
            client = new GraphQLClient(
                `${OPTIMIZELY_GRAPH_GATEWAY}/content/v2` + `?cache=false`, // fix for preview update delays
                {
                    headers: {
                        Authorization: `Bearer ${prevToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
        } else {
            client = new GraphQLClient(
                `${OPTIMIZELY_GRAPH_GATEWAY}/content/v2?auth=${OPTIMIZELY_GRAPH_SINGLE_KEY}`
            );
        }

        // Capture query data in dev mode
        if (OPTIMIZELY_DEV_MODE) {
            const now = Date.now();
            
            // If enough time has passed since last request, assume it's a new page
            if (now - lastRequestTime > REQUEST_RESET_THRESHOLD) {
                currentStore = [];
            }
            
            lastRequestTime = now;
            
            currentStore.push({
                query: print(doc),
                variables: vars,
                timestamp: new Date()
            });
        }

        try {
            const res = await client.rawRequest(print(doc), vars);
            return res?.data as any;
        } catch (err: any) {
            if (import.meta.env.DEV) {
                console.error(
                    'Error in GraphQL request:',
                    '\n' + print(doc) + '\n',
                    vars,
                    '\n' + err.message
                );
            } else {
                console.error(err);
            }
            console.error(
                'Error in GraphQL request:',
                '\n' + print(doc) + '\n',
                vars,
                '\n' + err.message
            );
        }
    };

    return getSdkWithClient(requester);
}
