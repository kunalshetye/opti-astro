import type { APIRoute } from 'astro';
import { createClient } from '@remkoj/optimizely-cms-api';

function createCMSClient() {
    const clientId = import.meta.env.OPTIMIZELY_CLIENT_ID;
    const clientSecret = import.meta.env.OPTIMIZELY_CLIENT_SECRET;
    const cmsUrl = import.meta.env.OPTIMIZELY_CMS_URL;

    if (!clientId || !clientSecret || !cmsUrl) {
        throw new Error('Missing required environment variables');
    }

    return createClient({
        base: new URL(cmsUrl),
        clientId: clientId,
        clientSecret: clientSecret,
    });
}

export const GET: APIRoute = async ({ url }) => {
    try {
        const styleKey = url.searchParams.get('key');
        if (!styleKey) {
            return new Response(
                JSON.stringify({ error: 'Style key is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const client = createCMSClient();
        const style = await client.displayTemplates.displayTemplatesGet(styleKey);

        // Clean up system fields
        const cleaned = { ...style };
        delete cleaned.createdBy;
        delete cleaned.lastModifiedBy;
        delete cleaned.created;
        delete cleaned.lastModified;

        return new Response(
            JSON.stringify({ style: cleaned }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error fetching style:', error);
        return new Response(
            JSON.stringify({
                error: 'Failed to fetch style',
                details: (error as Error).message
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};
