// /src/pages/opti-admin/api/pinned-items.json.ts
import type { APIRoute } from 'astro';
import {
  makeHmacApiRequest,
  isValidGuid,
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  clampNumber
} from '../../../../utils/optimizely-graph-utils';

// POST - Add pinned item to collection
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      collectionId,
      phrases,
      targetKey,
      language = 'en',
      priority = 1,
      isActive = true
    } = body;

    // Validation
    if (!collectionId) {
      return createErrorResponse('Collection ID is required', 400);
    }
    if (!phrases) {
      return createErrorResponse('At least one search phrase is required', 400);
    }
    if (!targetKey) {
      return createErrorResponse('Content GUID (targetKey) is required', 400);
    }

    // Prepare request body as strings
    const requestBody: Record<string, any> = {
      phrases: typeof phrases === 'string' ? phrases : Array.isArray(phrases) ? phrases.join('\n') : '',
      targetKey,
      language,
      priority,
      isActive
    };

    const response = await makeHmacApiRequest(`/api/pinned/collections/${collectionId}/items`, {
      method: 'POST',
      body: requestBody
    });

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(
        `Failed to add pinned item: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    let result;
    try {
      result = await response.json();
    } catch (e) {
      result = { success: true };
    }

    return createSuccessResponse(
      {
        ...requestBody,
        ...result
      },
      `Pinned item added successfully`
    );
  } catch (error) {
    return handleApiError(error);
  }
};

// GET - Get pinned items for a collection
export const GET: APIRoute = async ({ url }) => {
  try {
    const collectionId = url.searchParams.get('collectionId');

    if (!collectionId) {
      return createErrorResponse('Collection ID is required', 400);
    }

    const response = await makeHmacApiRequest(`/api/pinned/collections/${collectionId}/items`, {
      method: 'GET'
    });

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(
        `Failed to fetch pinned items: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    const items = await response.json();

    return createSuccessResponse(
      Array.isArray(items) ? items : [items]
    );

  } catch (error) {
    return handleApiError(error);
  }
};

// DELETE - Remove pinned item
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { collectionId, itemId } = body;

    if (!collectionId || !itemId) {
      return createErrorResponse('Collection ID and Item ID are required', 400);
    }

    const response = await makeHmacApiRequest(`/api/pinned/collections/${collectionId}/items/${itemId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(
        `Failed to delete pinned item: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    return createSuccessResponse(undefined, 'Pinned item deleted successfully');

  } catch (error) {
    return handleApiError(error);
  }
};
