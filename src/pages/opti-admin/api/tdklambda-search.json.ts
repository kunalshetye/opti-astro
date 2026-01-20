import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const params = await request.json();

    // Build form data for TDK-Lambda API
    const formData = new URLSearchParams();
    if (params.voltage) formData.append('voltage[]', params.voltage);
    if (params.current) formData.append('current[]', params.current);
    formData.append('numberOfOutputs', params.numberOfOutputs || '1');
    formData.append('InputPhases', params.InputPhases || '0');
    formData.append('ApproxMatches', '1');
    formData.append('UseCache', 'true');

    // Call TDK-Lambda API
    const response = await fetch('https://config.emea.tdk-lambda.com/QPF/s_units', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    const data = await response.json();

    if (data.key === 'SUCCESS') {
      return new Response(JSON.stringify({
        success: true,
        products: data.data.results
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'API returned error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
