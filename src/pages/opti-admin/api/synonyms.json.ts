// /src/pages/opti-admin/api/synonyms.json.ts
import type { APIRoute } from 'astro';
import { getOptimizelyGraphConfig, uploadSynonyms } from '../../../../utils/optimizely-hmac';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { synonyms, synonymSlot = '1', languageRouting = 'standard' } = body;

    // Get configuration
    const config = getOptimizelyGraphConfig();

    // Upload synonyms
    const result = await uploadSynonyms(config, synonyms || '', {
      synonymSlot,
      languageRouting
    });

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: result.message
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          error: result.message,
          details: result.error
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Synonyms API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const GET: APIRoute = async ({ request }) => {
  return new Response(
    JSON.stringify({
      message: 'Optimizely Graph Synonyms API - Use POST method to upload synonyms'
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
