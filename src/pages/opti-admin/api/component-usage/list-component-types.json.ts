import type { APIRoute } from 'astro';
import { requireAdminAuth } from '../../auth-opti-admin';

const TOKEN_ENDPOINT = 'https://api.cms.optimizely.com/oauth/token';

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
    });
    if (!response.ok) throw new Error(`Token request failed: HTTP ${response.status}`);
    const data = await response.json();
    if (!data.access_token) throw new Error('No access_token in token response');
    return data.access_token;
}

export const GET: APIRoute = async ({ request }) => {
    const authError = requireAdminAuth(request);
    if (authError) return authError;

    try {
        const clientId = import.meta.env.OPTIMIZELY_CLIENT_ID;
        const clientSecret = import.meta.env.OPTIMIZELY_CLIENT_SECRET;
        const cmsApiGateway = import.meta.env.OPTIMIZELY_CMS_API_GATEWAY;

        if (!clientId || !clientSecret || !cmsApiGateway) {
            return new Response(
                JSON.stringify({ error: 'Missing required environment variables: OPTIMIZELY_CLIENT_ID, OPTIMIZELY_CLIENT_SECRET, OPTIMIZELY_CMS_API_GATEWAY' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const accessToken = await getAccessToken(clientId, clientSecret);

        const typesResponse = await fetch(`${cmsApiGateway}/contenttypes?pageSize=1000`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (!typesResponse.ok) throw new Error(`Content types request failed: HTTP ${typesResponse.status}`);

        const result = await typesResponse.json();
        const allTypes: any[] = result?.items ?? [];

        const componentTypes = allTypes
            .filter((t) => t.baseType === '_component' && !['_system', '_server', 'globalcontract', 'graph'].includes(t.source))
            .map((t) => ({ key: t.key, displayName: t.displayName || t.key }))
            .sort((a, b) => a.displayName.localeCompare(b.displayName));

        return new Response(
            JSON.stringify({ types: componentTypes }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error fetching component types:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch component types: ' + (error as Error).message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
