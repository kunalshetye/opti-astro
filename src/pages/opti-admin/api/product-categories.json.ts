import type { APIRoute } from 'astro';
import { getAllProducts } from '../../../lib/product-catalog-utils';

export const prerender = false;

export const GET: APIRoute = async () => {
    try {
        const products = await getAllProducts();
        const categories = [...new Set(
            products.map(p => p.category).filter(Boolean)
        )].sort();

        const categoryCounts = categories.map(cat => ({
            category: cat,
            productCount: products.filter(p => p.category === cat).length
        }));

        return new Response(
            JSON.stringify({
                success: true,
                categories,
                categoryCounts
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Failed to load categories'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
