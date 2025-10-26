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

  // Use the existing HMAC request helper to ensure proper authentication
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
  query SearchContent($searchTerm: String!, $limit: Int) {
    _Content(
      where: {
        _metadata: { types: { in: ["_Page"] } }
        _or: [
          { _fulltext: { match: $searchTerm } }
          { _metadata: { displayName: { contains: $searchTerm, boost: 10 } } }
        ]
      }
      limit: $limit
      orderBy: { _ranking: SEMANTIC, _modified: DESC }
    ) {
      items {
        _id
        _metadata {
          url {
            base
            default
          }
          key
          displayName
          types
          locale
        }
      }
      total
    }
  }
`;

export const getRecentContentQuery = (contentType?: string) => {
  const whereClause = contentType ? `where: { ContentType: { eq: "${contentType}" } }` : '';
  return `
  query RecentContent($limit: Int!) {    
    Content(
      limit: $limit
      orderBy: { Modified: DESC }
      ${whereClause}
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
};
export function transformContentItem(item: any) {
  // Handle both _metadata structure and direct properties
  let finalUrl = item.Url || item._metadata?.url?.default; // Default to path or old Url property
  
  // If we have both base and default from the new query, construct the full URL
  if (item._metadata?.url?.base && item._metadata?.url?.default) {
    try {
      finalUrl = new URL(item._metadata.url.default, item._metadata.url.base).href;
    } catch (e) {
      console.error('Error constructing full URL:', e);
    }
  }

  return {
    guid: item._metadata?.key || item._id || item.ContentLink?.GuidValue,
    name: item.Name || item.PageName || item._metadata?.displayName || 'Untitled',
    contentType: item.ContentType?.[0] || item._metadata?.types?.[0] || 'Unknown',
    status: item.Status,
    language: item.Language?.Name || item._metadata?.locale || 'Unknown',
    url: finalUrl,
    score: item._ranking?.semantic,
    modified: item.Modified,
    id: item._id
  };
}

export async function searchContent(
  config: OptimizelyGraphConfig,
  query: string,
  variables: Record<string, any>
): Promise<{ items: any[]; error?: string }> {
  try {
    const response = await makeGraphQLRequest(config, query, variables);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        items: [],
        error: `GraphQL query failed: ${response.status} ${response.statusText} - ${errorText}`
      };
    }

    const result = await response.json();

    if (result.errors) {
      return {
        items: [],
        error: `GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`
      };
    }

    const items = result.data?.Content?.items || result.data?._Content?.items || [];
    const transformedItems = items
      .map(transformContentItem)
      .filter((item: any) => item.guid);

    return { items: transformedItems };
  } catch (error) {
    return { items: [], error: error instanceof Error ? error.message : 'Unknown error during content search' };
  }
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