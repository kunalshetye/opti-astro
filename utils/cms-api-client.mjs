/**
 * Lightweight Optimizely CMS API client for CLI scripts.
 * Replaces @remkoj/optimizely-cms-api with direct fetch calls to preview3.
 *
 * Base URL: https://api.cms.optimizely.com/preview3
 * Auth: OAuth2 client credentials via https://api.cms.optimizely.com/oauth/token
 */

const API_BASE = 'https://api.cms.optimizely.com/preview3';
const AUTH_URL = 'https://api.cms.optimizely.com/oauth/token';

let cachedToken = null;
let tokenExpiry = 0;

/**
 * Get an OAuth2 access token using client credentials.
 * Caches the token until it expires.
 */
async function getAccessToken(clientId, clientSecret) {
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

/**
 * Make an authenticated request to the CMS API.
 */
async function apiRequest(method, path, { clientId, clientSecret, body, contentType } = {}) {
    const token = await getAccessToken(clientId, clientSecret);
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

/**
 * Create a CMS API client for CLI scripts.
 * @param {{ clientId: string, clientSecret: string }} config
 */
export function createCmsApiClient(config) {
    const { clientId, clientSecret } = config;

    const request = (method, path, body, contentType) =>
        apiRequest(method, path, { clientId, clientSecret, body, contentType });

    return {
        contentTypes: {
            /** List all content types */
            async list() {
                return request('GET', '/contenttypes');
            },
            /** Create or update a content type by key (PATCH with merge semantics) */
            async put(key, definition) {
                return request('PATCH', `/contenttypes/${encodeURIComponent(key)}`, definition, 'application/merge-patch+json');
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
            /** Create or update a display template by key */
            async put(key, definition) {
                return request('PATCH', `/displaytemplates/${encodeURIComponent(key)}`, definition, 'application/merge-patch+json');
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
