/**
 * Admin authentication utility for protecting admin routes and API endpoints
 * Uses HTTP Basic Authentication only
 */

export interface AuthCredentials {
    username: string;
    password: string;
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
 */
export function checkAdminAuth(request: Request): Response | null {
    // Get auth credentials from environment
    const adminUsername = import.meta.env.ADMIN_USERNAME || 'admin';
    const adminPassword = import.meta.env.ADMIN_PASSWORD;
    
    // Skip authentication in development if no password is set
    if (!adminPassword && !import.meta.env.PROD) {
        return null;
    }
    
    // Require password in production or when explicitly set
    if (!adminPassword) {
        return new Response('Admin dashboard requires ADMIN_PASSWORD environment variable to be set', {
            status: 500,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
    
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
 */
export function requireAdminAuth(request: Request): Response | null {
    return checkAdminAuth(request);
}