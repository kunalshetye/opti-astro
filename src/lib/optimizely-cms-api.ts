/**
 * Lightweight Optimizely CMS API client for Astro server-side code.
 * Replaces @remkoj/optimizely-cms-api with direct fetch calls to preview3.
 *
 * Base URL: https://api.cms.optimizely.com/preview3
 * Auth: OAuth2 client credentials via https://api.cms.optimizely.com/oauth/token
 */

const API_BASE = 'https://api.cms.optimizely.com/v1';
const AUTH_URL = 'https://api.cms.optimizely.com/oauth/token';

interface CmsApiClientConfig {
    clientId: string;
    clientSecret: string;
}

/**
 * Create a CMS API client for Astro server-side code.
 */
export function createCmsApiClient(config: CmsApiClientConfig) {
    const { clientId, clientSecret } = config;

    if (!clientId || !clientSecret) {
        throw new Error(
            'Missing CMS API credentials. Set OPTIMIZELY_CLIENT_ID and OPTIMIZELY_CLIENT_SECRET in your .env file.'
        );
    }

    let cachedToken: string | null = null;
    let tokenExpiry = 0;

    async function getAccessToken(): Promise<string> {
        if (cachedToken && Date.now() < tokenExpiry) {
            return cachedToken;
        }

        const credentials = btoa(`${clientId}:${clientSecret}`);
        const response = await fetch(AUTH_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Connection': 'close',
            },
            body: 'grant_type=client_credentials',
            cache: 'no-store',
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(`Authentication error: ${data.error_description || data.error}`);
        }

        cachedToken = data.access_token as string;
        tokenExpiry = Date.now() + ((data.expires_in || 3600) - 60) * 1000;
        return cachedToken!;
    }

    async function apiRequest(
        method: string,
        path: string,
        body?: unknown,
        contentType?: string
    ): Promise<any> {
        const token = await getAccessToken();
        const url = `${API_BASE}${path}`;

        const headers: Record<string, string> = {
            'Authorization': `Bearer ${token}`,
        };
        if (contentType) {
            headers['Content-Type'] = contentType;
        }

        const options: RequestInit = { method, headers };
        if (body !== undefined) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            let errorDetail: string;
            try {
                errorDetail = await response.text();
            } catch {
                errorDetail = response.statusText;
            }
            throw new Error(`CMS API ${method} ${path} failed: ${response.status} ${response.statusText} - ${errorDetail}`);
        }

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        return response.json();
    }

    const request = (method: string, path: string, body?: unknown, contentType?: string) =>
        apiRequest(method, path, body, contentType);

    return {
        contentTypes: {
            async list(): Promise<{ items: any[] }> {
                return request('GET', '/contenttypes');
            },
            async put(key: string, definition: any): Promise<any> {
                try {
                    return await request('PATCH', `/contenttypes/${encodeURIComponent(key)}`, definition, 'application/merge-patch+json');
                } catch (error: any) {
                    if (error?.message?.includes(': 404 ')) {
                        return request('POST', '/contenttypes', definition, 'application/json');
                    }
                    throw error;
                }
            },
        },
        displayTemplates: {
            async list(): Promise<{ items: any[] }> {
                return request('GET', '/displaytemplates');
            },
            async get(key: string): Promise<any> {
                return request('GET', `/displaytemplates/${encodeURIComponent(key)}`);
            },
            async put(key: string, definition: any): Promise<any> {
                try {
                    return await request('PATCH', `/displaytemplates/${encodeURIComponent(key)}`, definition, 'application/merge-patch+json');
                } catch (error: any) {
                    if (error?.message?.includes(': 404 ')) {
                        return request('POST', '/displaytemplates', definition, 'application/json');
                    }
                    throw error;
                }
            },
            async delete(key: string): Promise<any> {
                return request('DELETE', `/displaytemplates/${encodeURIComponent(key)}`);
            },
        },
        propertyGroups: {
            async list(): Promise<{ items: any[] }> {
                return request('GET', '/propertygroups');
            },
            async create(groupData: { key: string; displayName: string; sortOrder: number }): Promise<any> {
                return request('POST', '/propertygroups', groupData, 'application/json');
            },
        },
    };
}
