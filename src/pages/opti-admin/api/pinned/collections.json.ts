// /src/pages/opti-admin/api/pinned/collections.json.ts
import type { APIRoute } from 'astro';
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  makeHmacApiRequest
} from '../../../../../utils/optimizely-graph-utils';

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
    const { title, key, isActive = false } = body;

    if (!title) {
      return createErrorResponse('Collection title is required', 400);
    }

    // Generate a key from the title if not provided
    const collectionKey = key || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const response = await makeHmacApiRequest('/api/pinned/collections', {
      method: 'POST',
      body: { title, key: collectionKey, isActive }
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

    // Build partial update payload - only include provided fields
    const updatePayload: Record<string, any> = {};
    if (title !== undefined) updatePayload.title = title;
    if (isActive !== undefined) updatePayload.isActive = isActive;

    const response = await makeHmacApiRequest(`/api/pinned/collections/${id}`, {
      method: 'PUT',
      body: updatePayload
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

// DELETE - Delete existing collection (clears all items first)
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const collectionId = body.id;

    if (!collectionId) {
      return createErrorResponse('Collection ID is required', 400);
    }

    // Step 1: Clear all items in the collection first
    const clearResponse = await makeHmacApiRequest(`/api/pinned/collections/${collectionId}/items`, {
      method: 'DELETE'
    });

    if (!clearResponse.ok) {
      const errorText = await clearResponse.text();
      return createErrorResponse(
        `Failed to clear collection items before deletion: ${clearResponse.status} ${clearResponse.statusText} - ${errorText}`,
        clearResponse.status
      );
    }

    // Step 2: Delete the collection itself
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

    return createSuccessResponse(undefined, 'Collection and all its items deleted successfully');

  } catch (error) {
    return handleApiError(error);
  }
};
