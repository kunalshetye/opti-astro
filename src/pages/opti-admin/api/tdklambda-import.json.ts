import type { APIRoute } from 'astro';
import { loadProductCatalog, saveProductCatalog } from '../../../lib/product-catalog-utils';
import type { Product } from '../../../lib/product-catalog-utils';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { products, locale } = await request.json();

    // Load existing catalog
    const catalog = await loadProductCatalog();

    // Transform TDK-Lambda products to catalog format
    const newProducts: Product[] = products.map((tdkProduct: any) => {
      // Sanitize range for SKU generation
      // Remove invalid characters and ensure it's alphanumeric with dashes/underscores only
      const sanitizedRange = tdkProduct.range
        .replace(/[^A-Z0-9\-_]/gi, '-')  // Replace invalid chars with dash
        .replace(/-+/g, '-')              // Replace multiple dashes with single dash
        .replace(/^-|-$/g, '')            // Remove leading/trailing dashes
        .substring(0, 12);                // Limit to 12 chars to leave room for suffix

      // Generate SKU: TDK-{SANITIZED_RANGE}-{RANDOM}
      const sku = `TDK-${sanitizedRange}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // Build description from features and specs
      const descriptionHtml = `
        <p>${tdkProduct.features.join('. ')}.</p>
        <ul>
          <li>Input: ${tdkProduct.inVoltRange}</li>
          <li>Output Power: ${tdkProduct.unitOutputPower.totalOutputPowerHighLine}W</li>
          <li>Dimensions: ${tdkProduct.dimensions.unitWidth}x${tdkProduct.dimensions.unitLength}x${tdkProduct.dimensions.unitHeight}mm</li>
          ${tdkProduct.coolingDescription ? `<li>Cooling: ${tdkProduct.coolingDescription}</li>` : ''}
          ${tdkProduct.approvalCodes?.approvedTo ? `<li>Approvals: ${tdkProduct.approvalCodes.approvedTo}</li>` : ''}
        </ul>
      `;

      // Construct image URL
      const imageUrl = tdkProduct.imageFileNameUrlEncoded
        ? `https://www.emea.lambda.tdk.com/images/products/${tdkProduct.imageFileNameUrlEncoded}`
        : 'https://via.placeholder.com/400x300?text=TDK-Lambda';

      return {
        sku,
        name: {
          [locale]: `${tdkProduct.displayHeading} - ${tdkProduct.itemDescription}`,
          en: `${tdkProduct.displayHeading} - ${tdkProduct.itemDescription}`
        },
        description: {
          [locale]: descriptionHtml,
          en: descriptionHtml
        },
        price: 0, // TDK-Lambda API doesn't provide pricing
        salePrice: null,
        currency: 'EUR',
        images: [
          {
            url: imageUrl,
            alt: `${tdkProduct.displayHeading} Programmable Power Supply`,
            isPrimary: true,
            sortOrder: 0
          }
        ],
        availability: 'InStock' as const,
        brand: 'TDK-Lambda',
        category: 'TDK-Lambda/Programmable Power Supplies',
        tags: [
          'power-supply',
          'programmable',
          tdkProduct.inputPhaseDescription?.toLowerCase().replace(' ', '-'),
          ...tdkProduct.features.map((f: string) =>
            f.toLowerCase().split(' ').slice(0, 2).join('-')
          )
        ].filter(Boolean)
      };
    });

    // Check for duplicate SKUs
    const existingSkus = new Set(catalog.products.map(p => p.sku));
    const duplicates = newProducts.filter(p => existingSkus.has(p.sku));

    if (duplicates.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: `Duplicate SKUs found: ${duplicates.map(p => p.sku).join(', ')}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add new products
    catalog.products.push(...newProducts);
    catalog.lastUpdated = new Date().toISOString();

    // Save catalog
    await saveProductCatalog(catalog);

    return new Response(JSON.stringify({
      success: true,
      imported: newProducts.length,
      products: newProducts
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
