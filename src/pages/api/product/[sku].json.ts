import type { APIRoute } from 'astro';
import { getProductBySKU } from '../../../lib/product-catalog-utils';

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
    const { sku } = params;
    const locale = url.searchParams.get('locale') || 'en';

    if (!sku) {
        return new Response(
            JSON.stringify({ success: false, error: 'SKU is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const product = await getProductBySKU(sku, locale);

        if (!product) {
            return new Response(
                JSON.stringify({ success: false, error: `Product not found for SKU: ${sku}` }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, product }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error in GET /api/product/[sku]:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Failed to fetch product',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
