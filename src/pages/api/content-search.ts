// /src/pages/api/content-search.ts
import type { APIRoute } from 'astro';
import { 
  getOptimizelyGraphConfig,
  makeGraphQLRequest,
  CONTENT_SEARCH_QUERY,
  RECENT_CONTENT_QUERY,
  transformContentItem,
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  clampNumber
} from '../../../utils/optimizely-graph-utils';

// POST - Search for content and return with GUIDs
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { query, limit = 10 } = body;
    
    if (!query || query.trim().length === 0) {
      return createErrorResponse('Search query is required', 400);
    }
    
    const config = getOptimizelyGraphConfig();
    const clampedLimit = clampNumber(limit, 1, 50);
    
    const response = await makeGraphQLRequest(config, CONTENT_SEARCH_QUERY, {
      searchTerm: query.trim(),
      limit: clampedLimit
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(
        `GraphQL query failed: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }
    
    const result = await response.json();
    
    if (result.errors) {
      return createErrorResponse(
        `GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`,
        400
      );
    }
    
    // Transform the results
    const items = result.data?.Content?.items || [];
    const transformedItems = items
      .map(transformContentItem)
      .filter((item: any) => item.guid); // Only include items with GUIDs
    
    return createSuccessResponse(
      transformedItems,
      `Found ${transformedItems.length} content items`
    );
    
  } catch (error) {
    return handleApiError(error);
  }
};

// GET - Get recent content (for quick access)
export const GET: APIRoute = async ({ url }) => {
  try {
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const contentType = url.searchParams.get('contentType') || '';
    
    const config = getOptimizelyGraphConfig();
    const clampedLimit = clampNumber(limit, 1, 50);
    
    // Build GraphQL query to get recent content
    let whereClause = '';
    if (contentType) {
      whereClause = `where: { ContentType: { eq: "${contentType}" } }`;
    }
    
    const modifiedQuery = `
      query RecentContent($limit: Int!) {
        Content(
          ${whereClause}
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
    
    const response = await makeGraphQLRequest(config, modifiedQuery, {
      limit: clampedLimit
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(
        `GraphQL query failed: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }
    
    const result = await response.json();
    
    if (result.errors) {
      return createErrorResponse(
        `GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`,
        400
      );
    }
    
    // Transform the results
    const items = result.data?.Content?.items || [];
    const transformedItems = items
      .map(transformContentItem)
      .filter((item: any) => item.guid);
    
    return createSuccessResponse(
      transformedItems,
      `Found ${transformedItems.length} recent content items`
    );
    
  } catch (error) {
    return handleApiError(error);
  }
};