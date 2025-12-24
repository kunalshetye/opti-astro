import type { APIRoute } from 'astro';
import {
    getAllProducts,
    loadProductCatalog,
    saveProductCatalog,
    upsertProduct,
    deleteProduct,
    validateSKU
} from '../../../lib/product-catalog-utils';
import type { Product } from '../../../lib/product-catalog-utils';

export const prerender = false;

// GET - List all products
export const GET: APIRoute = async () => {
    try {
        const products = await getAllProducts();
        const catalog = await loadProductCatalog();

        return new Response(
            JSON.stringify({
                success: true,
                products,
                metadata: {
                    version: catalog.version,
                    lastUpdated: catalog.lastUpdated,
                    count: products.length
                }
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Failed to load products',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

// POST - Add or update product
export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const product = body.product as Product;

        if (!product) {
            return new Response(
                JSON.stringify({ success: false, error: 'Product data is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Validate SKU
        const validation = validateSKU(product.sku);
        if (!validation.valid) {
            return new Response(
                JSON.stringify({ success: false, error: `Invalid SKU: ${validation.error}` }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Normalize SKU
        product.sku = validation.normalized!;

        // Validate required fields
        if (!product.name || !product.name.en) {
            return new Response(
                JSON.stringify({ success: false, error: 'Product name (English) is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!product.price || product.price <= 0) {
            return new Response(
                JSON.stringify({ success: false, error: 'Valid price is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!product.images || product.images.length === 0) {
            return new Response(
                JSON.stringify({ success: false, error: 'At least one product image is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await upsertProduct(product);

        return new Response(
            JSON.stringify({ success: true, message: 'Product saved successfully', product }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Failed to save product',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

// DELETE - Remove product
export const DELETE: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { sku } = body;

        if (!sku) {
            return new Response(
                JSON.stringify({ success: false, error: 'SKU is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const deleted = await deleteProduct(sku);

        if (!deleted) {
            return new Response(
                JSON.stringify({ success: false, error: `Product not found: ${sku}` }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Product deleted successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Failed to delete product',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
