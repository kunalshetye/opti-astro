/**
 * Lightweight Optimizely CMS API client for CLI scripts.
 * Replaces @remkoj/optimizely-cms-api with direct fetch calls to v1.
 *
 * Base URL: https://api.cms.optimizely.com/v1
 * Auth: OAuth2 client credentials via https://api.cms.optimizely.com/oauth/token
 */

const API_BASE = 'https://api.cms.optimizely.com/v1';
const AUTH_URL = 'https://api.cms.optimizely.com/oauth/token';

/**
 * Create a CMS API client for CLI scripts.
 * @param {{ clientId: string, clientSecret: string }} config
 */
export function createCmsApiClient(config) {
    const { clientId, clientSecret } = config;

    if (!clientId || !clientSecret) {
        throw new Error(
            'Missing CMS API credentials. Set OPTIMIZELY_CLIENT_ID and OPTIMIZELY_CLIENT_SECRET in your .env file.'
        );
    }

    let cachedToken = null;
    let tokenExpiry = 0;

    async function getAccessToken() {
        if (cachedToken && Date.now() < tokenExpiry) {
            return cachedToken;
        }

        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
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

        cachedToken = data.access_token;
        // Expire 60 seconds early to be safe
        tokenExpiry = Date.now() + ((data.expires_in || 3600) - 60) * 1000;
        return cachedToken;
    }

    async function apiRequest(method, path, body, contentType) {
        const token = await getAccessToken();
        const url = `${API_BASE}${path}`;

        const headers = {
            'Authorization': `Bearer ${token}`,
        };
        if (contentType) {
            headers['Content-Type'] = contentType;
        }

        const options = { method, headers };
        if (body !== undefined) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            let errorDetail;
            try {
                errorDetail = await response.text();
            } catch {
                errorDetail = response.statusText;
            }
            throw new Error(`CMS API ${method} ${path} failed: ${response.status} ${response.statusText} - ${errorDetail}`);
        }

        // DELETE and some responses may have no body
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        return response.json();
    }

    const request = (method, path, body, contentType) =>
        apiRequest(method, path, body, contentType);

    return {
        contentTypes: {
            /** List all content types */
            async list() {
                return request('GET', '/contenttypes');
            },
            /** Create or update a content type by key (PATCH if exists, POST if new) */
            async put(key, definition) {
                try {
                    return await request('PATCH', `/contenttypes/${encodeURIComponent(key)}`, definition, 'application/merge-patch+json');
                } catch (error) {
                    if (error?.message?.includes(': 404 ')) {
                        return request('POST', '/contenttypes', definition, 'application/json');
                    }
                    throw error;
                }
            },
        },
        displayTemplates: {
            /** List all display templates */
            async list() {
                return request('GET', '/displaytemplates');
            },
            /** Get a display template by key */
            async get(key) {
                return request('GET', `/displaytemplates/${encodeURIComponent(key)}`);
            },
            /** Create or update a display template by key (PATCH if exists, POST if new) */
            async put(key, definition) {
                try {
                    return await request('PATCH', `/displaytemplates/${encodeURIComponent(key)}`, definition, 'application/merge-patch+json');
                } catch (error) {
                    if (error?.message?.includes(': 404 ')) {
                        return request('POST', '/displaytemplates', definition, 'application/json');
                    }
                    throw error;
                }
            },
            /** Delete a display template by key */
            async delete(key) {
                return request('DELETE', `/displaytemplates/${encodeURIComponent(key)}`);
            },
        },
        propertyGroups: {
            /** List all property groups */
            async list() {
                return request('GET', '/propertygroups');
            },
            /** Create a new property group */
            async create(groupData) {
                return request('POST', '/propertygroups', groupData, 'application/json');
            },
        },
    };
}
