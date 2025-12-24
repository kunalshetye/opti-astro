import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { normalizeLocale } from './locale-helpers';

export interface ProductImage {
    url: string;
    alt: string;
    isPrimary: boolean;
    sortOrder: number;
}

export interface Product {
    sku: string;
    name: Record<string, string>;
    description?: Record<string, string>;
    price: number;
    salePrice?: number | null;
    currency: string;
    images: ProductImage[];
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    brand?: string;
    category?: string;
    tags?: string[];
}

export interface ProductCatalog {
    version: string;
    lastUpdated: string;
    products: Product[];
}

// In-memory cache with TTL
const productCache = new Map<string, { data: Product | null; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Validate SKU format
 * Pattern: Starts with letter, 6-20 chars, alphanumeric + dashes/underscores
 */
export function validateSKU(sku: string): { valid: boolean; error?: string; normalized?: string } {
    if (!sku || typeof sku !== 'string') {
        return { valid: false, error: 'SKU is required and must be a string' };
    }

    const trimmed = sku.trim();

    if (trimmed.length < 6 || trimmed.length > 20) {
        return { valid: false, error: 'SKU must be between 6 and 20 characters' };
    }

    const skuPattern = /^[A-Z][A-Z0-9\-_]{5,19}$/i;
    if (!skuPattern.test(trimmed)) {
        return { valid: false, error: 'SKU must start with a letter and contain only alphanumeric characters, dashes, and underscores' };
    }

    if (trimmed.startsWith('0')) {
        return { valid: false, error: 'SKU cannot start with zero' };
    }

    const normalized = trimmed.toUpperCase();
    return { valid: true, normalized };
}

/**
 * Get catalog file path
 */
function getCatalogPath(): string {
    return join(process.cwd(), 'data', 'product-catalog.json');
}

/**
 * Read product catalog from file
 */
export async function loadProductCatalog(): Promise<ProductCatalog> {
    try {
        const catalogPath = getCatalogPath();
        const fileContent = await readFile(catalogPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error loading product catalog:', error);
        return {
            version: '1.0',
            lastUpdated: new Date().toISOString(),
            products: []
        };
    }
}

/**
 * Save product catalog to file
 */
export async function saveProductCatalog(catalog: ProductCatalog): Promise<void> {
    try {
        const catalogPath = getCatalogPath();
        const dirPath = join(process.cwd(), 'data');

        // Ensure directory exists
        await mkdir(dirPath, { recursive: true });

        // Update timestamp
        catalog.lastUpdated = new Date().toISOString();

        // Write file
        await writeFile(catalogPath, JSON.stringify(catalog, null, 2), 'utf-8');

        // Clear cache to force reload
        productCache.clear();
    } catch (error) {
        console.error('Error saving product catalog:', error);
        throw error;
    }
}

/**
 * Get product by SKU with caching
 */
export async function getProductBySKU(
    sku: string,
    locale: string = 'en'
): Promise<Product | null> {
    // Validate SKU
    const validation = validateSKU(sku);
    if (!validation.valid) {
        console.error(`Invalid SKU "${sku}": ${validation.error}`);
        return null;
    }

    const normalizedSKU = validation.normalized!;
    const cacheKey = `${normalizedSKU}-${locale}`;
    const now = Date.now();

    // Check cache
    const cached = productCache.get(cacheKey);
    if (cached && cached.expires > now) {
        return cached.data;
    }

    try {
        // Load catalog
        const catalog = await loadProductCatalog();

        // Find product
        const product = catalog.products.find(p => p.sku.toUpperCase() === normalizedSKU);

        // Cache result (even if null to avoid repeated lookups)
        productCache.set(cacheKey, {
            data: product || null,
            expires: now + CACHE_TTL
        });

        return product || null;
    } catch (error) {
        console.error(`Error fetching product ${sku}:`, error);

        // Return stale cache if available (graceful degradation)
        if (cached) {
            console.warn(`Returning stale cache for ${sku}`);
            return cached.data;
        }

        return null;
    }
}

/**
 * Get all products
 */
export async function getAllProducts(): Promise<Product[]> {
    const catalog = await loadProductCatalog();
    return catalog.products;
}

/**
 * Add or update product
 */
export async function upsertProduct(product: Product): Promise<void> {
    const catalog = await loadProductCatalog();
    const index = catalog.products.findIndex(p => p.sku === product.sku);

    if (index >= 0) {
        catalog.products[index] = product;
    } else {
        catalog.products.push(product);
    }

    await saveProductCatalog(catalog);
}

/**
 * Delete product by SKU
 */
export async function deleteProduct(sku: string): Promise<boolean> {
    const catalog = await loadProductCatalog();
    const initialLength = catalog.products.length;

    catalog.products = catalog.products.filter(p => p.sku !== sku);

    if (catalog.products.length < initialLength) {
        await saveProductCatalog(catalog);
        return true;
    }

    return false;
}
