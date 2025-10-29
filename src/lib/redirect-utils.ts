interface Redirect {
  id: string;
  fromPath: string;
  toPath: string;
  type: '301' | '302' | '307' | '308';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// In-memory cache for redirects (synced from admin UI)
let redirectsCache: Redirect[] = [];

/**
 * Get redirects from in-memory cache
 */
export function getRedirectsFromCache(): Redirect[] {
  return redirectsCache;
}

/**
 * Set redirects in cache (called by API)
 */
export function setRedirectsInCache(redirects: Redirect[]): void {
  redirectsCache = redirects;
}

/**
 * Check if the given path should be redirected
 * Returns a Response object if a redirect is found, null otherwise
 */
export function checkRedirects(pathname: string): Response | null {
  try {
    const redirects = getRedirectsFromCache();

    // Find matching redirect (enabled only)
    const redirect = redirects.find(
      r => r.enabled && r.fromPath === pathname
    );

    if (!redirect) {
      return null;
    }

    // Determine status code
    let statusCode: number;
    switch (redirect.type) {
      case '301':
        statusCode = 301;
        break;
      case '302':
        statusCode = 302;
        break;
      case '307':
        statusCode = 307;
        break;
      case '308':
        statusCode = 308;
        break;
      default:
        statusCode = 301;
    }

    // Create redirect response
    return new Response(null, {
      status: statusCode,
      headers: {
        Location: redirect.toPath
      }
    });
  } catch (error) {
    console.error('Error checking redirects:', error);
    return null;
  }
}
