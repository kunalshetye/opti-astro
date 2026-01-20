import type { APIRoute } from 'astro';
import { loadProductCatalog } from '../../../lib/product-catalog-utils';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { productRanges } = await request.json();

    // Load existing catalog
    const catalog = await loadProductCatalog();

    // Find TDK-Lambda products
    const tdkProducts = catalog.products.filter(p => p.brand === 'TDK-Lambda');

    // Check which ranges are already imported
    const importedRanges = new Set<string>();
    tdkProducts.forEach(product => {
      // Extract range from SKU (format: TDK-{RANGE}-{RANDOM})
      const match = product.sku.match(/^TDK-([^-]+)-/);
      if (match) {
        importedRanges.add(match[1]);
      }
    });

    // Check each product range
    const importStatus: Record<string, boolean> = {};
    productRanges.forEach((range: string) => {
      importStatus[range] = importedRanges.has(range);
    });

    return new Response(JSON.stringify({
      success: true,
      importStatus
    }), {
      status: 200,
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
