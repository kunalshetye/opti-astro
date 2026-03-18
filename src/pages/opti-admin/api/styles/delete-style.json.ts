import type { APIRoute } from 'astro';
import { createCmsApiClient } from '../../../../lib/optimizely-cms-api';

function createCMSClient() {
    const clientId = import.meta.env.OPTIMIZELY_CLIENT_ID;
    const clientSecret = import.meta.env.OPTIMIZELY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Missing required environment variables: OPTIMIZELY_CLIENT_ID, OPTIMIZELY_CLIENT_SECRET');
    }

    return createCmsApiClient({ clientId, clientSecret });
}

export const DELETE: APIRoute = async ({ url }) => {
    try {
        const styleKey = url.searchParams.get('key');
        if (!styleKey) {
            return new Response(
                JSON.stringify({ error: 'Style key is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const client = createCMSClient();
        await client.displayTemplates.delete(styleKey);

        return new Response(
            JSON.stringify({
                success: true,
                message: `Style "${styleKey}" deleted successfully`
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error deleting style:', error);
        return new Response(
            JSON.stringify({
                error: 'Failed to delete style',
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
