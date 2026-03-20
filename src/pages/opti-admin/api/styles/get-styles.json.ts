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

export const GET: APIRoute = async () => {
    try {
        const client = createCMSClient();
        const templatesList = await client.displayTemplates.list();

        // Clean up system fields
        const styles = (templatesList.items || []).map((style: any) => {
            const cleaned = { ...style };
            delete cleaned.createdBy;
            delete cleaned.lastModifiedBy;
            delete cleaned.created;
            delete cleaned.lastModified;
            return cleaned;
        });

        return new Response(
            JSON.stringify({ styles }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error fetching styles:', error);
        return new Response(
            JSON.stringify({
                error: 'Failed to fetch styles',
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
