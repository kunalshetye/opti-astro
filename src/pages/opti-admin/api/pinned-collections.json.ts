// /src/pages/opti-admin/api/pinned-collections.json.ts
import type { APIRoute } from 'astro';
import {
  getOptimizelyGraphConfig,
  makeHmacApiRequest,
  createSuccessResponse,
  createErrorResponse,
  handleApiError
} from '../../../../utils/optimizely-graph-utils';

// GET - List all collections
export const GET: APIRoute = async () => {
  try {
    const response = await makeHmacApiRequest('/api/pinned/collections', {
      method: 'GET'
    });

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(
        `Failed to fetch collections: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    const collections = await response.json();

    return createSuccessResponse(
      Array.isArray(collections) ? collections : [collections]
    );

  } catch (error) {
    return handleApiError(error);
  }
};

// POST - Create new collection
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, isActive = true } = body;

    if (!title) {
      return createErrorResponse('Collection title is required', 400);
    }

    const response = await makeHmacApiRequest('/api/pinned/collections', {
      method: 'POST',
      body: { title, isActive }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(
        `Failed to create collection: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    const result = await response.json();

    return createSuccessResponse(
      result,
      `Collection "${title}" created successfully`
    );

  } catch (error) {
    return handleApiError(error);
  }
};

// PUT - Update existing collection
export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, title, isActive } = body;

    if (!id) {
      return createErrorResponse('Collection ID is required', 400);
    }

    const response = await makeHmacApiRequest(`/api/pinned/collections/${id}`, {
      method: 'PUT',
      body: { title, isActive }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(
        `Failed to update collection: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    const result = await response.json();

    return createSuccessResponse(result, 'Collection updated successfully');

  } catch (error) {
    return handleApiError(error);
  }
};

// DELETE - Delete existing collection
export const DELETE: APIRoute = async ({ request }) => {
  try {
    // Get collection ID from the request body
    const body = await request.json();
    const collectionId = body.id;

    if (!collectionId) {
      return createErrorResponse('Collection ID is required', 400);
    }

    const response = await makeHmacApiRequest(`/api/pinned/collections/${collectionId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(
        `Failed to delete collection: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    return createSuccessResponse(undefined, 'Collection deleted successfully');

  } catch (error) {
    return handleApiError(error);
  }
};
