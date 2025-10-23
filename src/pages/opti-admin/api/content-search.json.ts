// /src/pages/opti-admin/api/content-search.json.ts
import type { APIRoute } from 'astro';
import {
  getOptimizelyGraphConfig,
  CONTENT_SEARCH_QUERY,
  getRecentContentQuery,
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  clampNumber,
  searchContent
} from '../../../../utils/optimizely-graph-utils';

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
    const { items: transformedItems, error } = await searchContent(
      config,
      CONTENT_SEARCH_QUERY,
      { searchTerm: query.trim(), limit: clampedLimit }
    );

    if (error) return createErrorResponse(error, 500);

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

    const recentContentQuery = getRecentContentQuery(contentType);
    const { items: transformedItems, error } = await searchContent(
      config,
      recentContentQuery,
      { limit: clampedLimit }
    );

    if (error) return createErrorResponse(error, 500);

    return createSuccessResponse(
      transformedItems,
      `Found ${transformedItems.length} recent content items`
    );

  } catch (error) {
    return handleApiError(error);
  }
};
