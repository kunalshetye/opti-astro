/**
 * Admin authentication utility for protecting admin routes and API endpoints
 * Uses HTTP Basic Authentication only
 */

export interface AuthCredentials {
    username: string;
    password: string;
}

/**
 * Check if admin credentials are configured
 * Returns true only if both username and password are set
 */
export function isAdminConfigured(): boolean {
    const adminUsername = import.meta.env.ADMIN_DASHBOARD_USERNAME;
    const adminPassword = import.meta.env.ADMIN_DASHBOARD_PASSWORD;
    
    // Both username and password must be set
    return !!(adminUsername && adminPassword);
}

/**
 * Parse Basic Authentication header
 */
function parseBasicAuth(authHeader: string | null): AuthCredentials | null {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return null;
    }

    try {
        const credentials = atob(authHeader.slice(6));
        const [username, password] = credentials.split(':');
        return { username, password };
    } catch {
        return null;
    }
}

/**
 * Check admin authentication for a request
 * Uses HTTP Basic Authentication
 * Returns 404 if credentials aren't configured
 */
export function checkAdminAuth(request: Request): Response | null {
    // First check if admin is configured
    if (!isAdminConfigured()) {
        // Return 404 to hide the existence of the admin dashboard
        return new Response('Not found', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
    
    // Get auth credentials from environment
    const adminUsername = import.meta.env.ADMIN_DASHBOARD_USERNAME;
    const adminPassword = import.meta.env.ADMIN_DASHBOARD_PASSWORD;
    
    // Check Basic Auth header
    const authHeader = request.headers.get('authorization');
    const credentials = parseBasicAuth(authHeader);
    
    // Verify credentials
    if (!credentials || 
        credentials.username !== adminUsername || 
        credentials.password !== adminPassword) {
        
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
                'Content-Type': 'text/plain'
            }
        });
    }
    
    // Authentication successful
    return null;
}

/**
 * Middleware function for admin API routes
 * Returns 404 if credentials aren't configured
 */
export function requireAdminAuth(request: Request): Response | null {
    return checkAdminAuth(request);
}