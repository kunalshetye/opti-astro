// /utils/optimizely-graph-utils.ts
import { 
  getOptimizelyGraphConfig, 
  makeOptimizelyGraphRequest,
  type OptimizelyGraphConfig 
} from './optimizely-hmac';

// Re-export existing functionality for convenience
export { 
  getOptimizelyGraphConfig, 
  makeOptimizelyGraphRequest,
  type OptimizelyGraphConfig 
} from './optimizely-hmac';

// New utility functions specific to pinned results and content management

export function isValidGuid(guid: string): boolean {
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return guidRegex.test(guid);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateLanguageCode(language: string): boolean {
  // Basic validation for ISO language codes (2-5 characters, letters and hyphens)
  const languageRegex = /^[a-z]{2}(-[a-z]{2,3})?$/i;
  return languageRegex.test(language);
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function parseCsvPhrases(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => sanitizeInput(line));
}

// API Response helpers
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export function createSuccessResponse<T>(data?: T, message?: string): Response {
  const response: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data && { data })
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function createErrorResponse(error: string, status: number = 400): Response {
  const response: ApiResponse = {
    success: false,
    error
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);
  
  const message = error instanceof Error ? error.message : 'Unknown error occurred';
  return createErrorResponse(message, 500);
}

// GraphQL helper for content search
export async function makeGraphQLRequest(
  config: OptimizelyGraphConfig,
  query: string,
  variables?: Record<string, any>
): Promise<Response> {
  const payload = {
    query,
    variables: variables || {}
  };

  console.log('content search config', config);
  // Use the existing HMAC request helper to ensure proper authentication
  console.log('content search payload:', payload);
  return makeOptimizelyGraphRequest(config, '/content/v2', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// Content search utilities
export const CONTENT_SEARCH_QUERY = `
  query SearchContent($searchTerm: String!, $limit: Int!) {
    _Content(
      where: { _fulltext: { match: $searchTerm } }
      limit: $limit
      orderBy: { _modified: DESC }
    ) {
      items {
        _score
        _id
        _metadata {
          url {
            base
            default
          }
          displayName
        }
      }
      total
    }
  }
`;

export const RECENT_CONTENT_QUERY = `
  query RecentContent($limit: Int!) {
    Content(
      limit: $limit
      orderBy: { Modified: DESC }
    ) {
      items {
        _id
        Name
        ContentLink {
          GuidValue
        }
        ContentType
        Status
        Language {
          Name
        }
        Url
        Modified
        ... on IContent {
          Name
        }
        ... on PageData {
          PageName
        }
        ... on BlockData {
          Name
        }
      }
      total
    }
  }
`;

export function transformContentItem(item: any) {
  // Handle both _metadata structure and direct properties
  return {
    guid: item.ContentLink?.GuidValue || item._metadata?.key,
    name: item.Name || item.PageName || item._metadata?.displayName || 'Untitled',
    contentType: item.ContentType?.[0] || 'Unknown',
    status: item.Status,
    language: item.Language?.Name || 'Unknown',
    url: item.Url || item._metadata?.url?.default,
    score: item._score,
    modified: item.Modified,
    id: item._id
  };
}

// Pinned Results specific API helpers
export async function makeHmacApiRequest(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
  } = {}
): Promise<Response> {
  const config = getOptimizelyGraphConfig();
  const {
    method = 'GET',
    body,
    headers = {},
    queryParams = {}
  } = options;

  const requestBody = typeof body === 'string' ? body : JSON.stringify(body);
  const contentType = endpoint.includes('/synonyms') ? 'text/plain' : 'application/json';

  console.log('options', options);
  console.log('Request body:', requestBody);
  console.log('body:', body);
  console.log('Request method:', method);
  console.log('Request endpoint:', endpoint);
  
  return makeOptimizelyGraphRequest(config, endpoint, {
    method,
    body: method !== 'GET' ? requestBody : undefined,
    headers: {
      'Content-Type': contentType,
      ...headers
    },
    queryParams
  });
}