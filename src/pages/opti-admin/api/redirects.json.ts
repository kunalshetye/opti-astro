import type { APIRoute } from 'astro';
import { getRedirectsFromCache, setRedirectsInCache } from '../../../lib/redirect-utils';

export const prerender = false;

interface Redirect {
  id: string;
  fromPath: string;
  toPath: string;
  type: '301' | '302' | '307' | '308';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Generate unique ID
function generateId(): string {
  return `redirect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Validate redirect data
function validateRedirect(data: any): { valid: boolean; error?: string } {
  if (!data.fromPath || typeof data.fromPath !== 'string') {
    return { valid: false, error: 'fromPath is required and must be a string' };
  }
  if (!data.toPath || typeof data.toPath !== 'string') {
    return { valid: false, error: 'toPath is required and must be a string' };
  }
  if (!data.fromPath.startsWith('/')) {
    return { valid: false, error: 'fromPath must start with /' };
  }
  if (!['301', '302', '307', '308'].includes(data.type)) {
    return { valid: false, error: 'type must be one of: 301, 302, 307, 308' };
  }
  return { valid: true };
}

// GET - List all redirects
export const GET: APIRoute = async () => {
  try {
    const redirects = getRedirectsFromCache();

    return new Response(
      JSON.stringify({
        success: true,
        redirects
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in GET /api/redirects:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to load redirects',
        details: error instanceof Error ? error.message : 'Unknown error'
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

// POST - Sync redirects from client (replaces all redirects)
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    if (!Array.isArray(data.redirects)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'redirects must be an array'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Validate all redirects
    for (const redirect of data.redirects) {
      const validation = validateRedirect(redirect);
      if (!validation.valid) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Invalid redirect: ${validation.error}`
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }

    // Replace all redirects
    setRedirectsInCache(data.redirects);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Redirects synced successfully',
        count: data.redirects.length
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in POST /api/redirects:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to sync redirects',
        details: error instanceof Error ? error.message : 'Unknown error'
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
