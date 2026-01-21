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
      // SKU format: TDK-{RANGE}-{RAND} must be max 20 chars total
      // TDK- (4) + RANGE (11) + - (1) + RAND (4) = 20 chars
      const sanitizedRange = tdkProduct.range
        .replace(/[^A-Z0-9\-_]/gi, '-')  // Replace invalid chars with dash
        .replace(/-+/g, '-')              // Replace multiple dashes with single dash
        .replace(/^-|-$/g, '')            // Remove leading/trailing dashes
        .substring(0, 11);                // Limit to 11 chars (20 - 9 fixed chars)

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

      // Construct image URL from product page link
      // The imageFileNameUrlEncoded field doesn't point to a valid URL
      // Instead, extract slug from product page and use imagebank path
      let imageUrl = 'https://via.placeholder.com/400x300?text=TDK-Lambda';

      if (tdkProduct.linksToProductPage && tdkProduct.linksToProductPage.length > 0) {
        const productPageUrl = tdkProduct.linksToProductPage[0];
        const productSlug = productPageUrl.split('/').pop();
        imageUrl = `https://www.emea.lambda.tdk.com/uk/imagebank/cropped/product/${productSlug}.jpg`;
      }

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
