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

export const GET: APIRoute = async () => {
    try {
        const client = createCMSClient();
        const templatesList = await client.displayTemplates.displayTemplatesList();

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
