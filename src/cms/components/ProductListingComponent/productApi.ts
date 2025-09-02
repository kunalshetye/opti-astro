interface ProductApiResponse {
  data?: any[];
  meta?: {
    spellingSuggestion?: string | null;
    pinned?: any[];
    keywordRedirect?: string | null;
    pagination?: {
      totalCount: number;
      limit: number;
      offset: number;
    };
    debug?: any;
    facets?: Facet[];
    sort?: SortOption[];
  };
}

interface Facet {
  name: string;
  localizedName: string;
  docCount: number;
  activeValue: any[];
  config: {
    parameterName: string;
    type: string;
    isMultiValue: boolean;
    componentName: string;
    component: {
      name: string;
      valueActive?: string | null;
      valueInactive?: string | null;
    };
  };
  stats?: any;
  values: FacetValue[];
}

interface FacetValue {
  key: string;
  docCount: number;
  label: string;
  isSelected?: boolean | null;
  thumbnail?: string | null;
  children: FacetValue[];
}

interface SortOption {
  parameterName: string;
  parameterValue: string;
  localizedName: string;
  isActive: boolean;
}

interface Product {
  id: string | number;
  brand: string;
  name: string;
  size: string;
  price: string;
  originalPrice: string | null;
  image: string;
  badges: string[];
  category?: string;
  countryOfOrigin?: string;
  snapEligible?: boolean;
}

interface ProductSearchResult {
  products: Product[];
  metadata: {
    pagination?: {
      totalCount: number;
      limit: number;
      offset: number;
    };
    spellingSuggestion?: string | null;
    pinned?: any[];
    keywordRedirect?: string | null;
    facets?: Facet[];
    sortOptions?: SortOption[];
    debug?: any;
  };
}

interface FilterOptions {
  brands?: string[];
  categories?: string[];
  sortBy?: string;
  snapEbt?: boolean;
  countryOfOrigin?: string[];
}

interface CacheEntry {
  data: ProductSearchResult;
  timestamp: number;
  expiry: number;
}

// In-memory cache with 30-minute TTL
const productCache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

export async function fetchProductsByCategory(categoryId: number, limit: number = 12, filters: FilterOptions = {}, skus?: string[]): Promise<ProductSearchResult> {
  const cacheKey = skus?.length 
    ? `skus-${skus.join(',')}-limit-${limit}`
    : `category-${categoryId}-limit-${limit}-filters-${JSON.stringify(filters)}`;
  const now = Date.now();
  
  // Check cache first
  const cached = productCache.get(cacheKey);
  if (cached && now < cached.expiry) {
    console.log(`Cache hit for category ${categoryId}`);
    return cached.data;
  }
  
  try {
    let apiUrl: string;
    
    if (skus?.length) {
      console.log(`Fetching products for SKUs ${skus.join(',')} from API with limit: ${limit}`);
      
      // Build API URL for SKU-based fetch (v2 API)
      const params = new URLSearchParams({
        servicePoint: '440-018',
        serviceType: 'pickup',
        skus: skus.join(','),
        limit: limit.toString()
      });
      
      apiUrl = `https://api.aldi.us/v2/products?${params.toString()}`;
    } else {
      console.log(`Fetching products for category ${categoryId} from API with limit: ${limit}, filters:`, filters);
      
      // Build API URL with filters (v3 API for category search)
      const params = new URLSearchParams({
        currency: 'USD',
        serviceType: 'pickup',
        categoryKey: categoryId.toString(),
        limit: limit.toString(),
        offset: '0',
        sort: filters.sortBy || 'relevance',
        testVariant: 'A',
        servicePoint: '440-018'
      });
    
      // Add brand filters
      if (filters.brands?.length) {
        filters.brands.forEach(brand => params.append('brand', brand));
      }
      
      // Add category filters  
      if (filters.categories?.length) {
        filters.categories.forEach(cat => params.append('category', cat));
      }
      
      // Add SNAP/EBT filter
      if (filters.snapEbt === true) {
        params.append('snapEbt', 'true');
      }
      
      // Add country of origin filters
      if (filters.countryOfOrigin?.length) {
        filters.countryOfOrigin.forEach(country => params.append('countryOfOrigin', country));
      }
      
      apiUrl = `https://api.aldi.us/v3/product-search?${params.toString()}`;
    }
    
    const response = await fetch(apiUrl, {
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'origin': 'https://www.aldi.us',
        'pragma': 'no-cache',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const apiData: ProductApiResponse = await response.json();
    
    // Map API response to our product format (handle both v2 and v3 API responses)
    const dataArray = apiData.data || apiData || [];
    const products: Product[] = dataArray.map((item: any) => {
      const badges: string[] = [];
      
      // Add SNAP EBT badge if applicable
      if (item.countryExtensions?.usSnapEligible) {
        badges.push("SNAP EBT");
      }
      
      // Add Price Drop badge if on sale (check if wasPrice exists)
      if (item.price?.wasPriceDisplay) {
        badges.push("Price Drop");
      }
      
      // Get the main product image
      const mainImage = item.assets?.find((asset: any) => asset.assetType === "FR01");
      let imageUrl = "https://placehold.co/200x200/f3f4f6/1f2937?text=Product";
      
      if (mainImage?.url) {
        // Replace the placeholder values in the image URL
        imageUrl = mainImage.url
          .replace('{width}', '200')
          .replace('{slug}', item.urlSlugText || 'product');
      }
      
      return {
        id: item.sku || item.name,
        brand: item.brandName || "",
        name: item.name || "Product",
        size: item.sellingSize || "",
        price: item.price?.amountRelevantDisplay || "N/A",
        originalPrice: item.price?.wasPriceDisplay || null,
        image: imageUrl,
        badges,
        category: item.categoryKey || item.categoryName,
        countryOfOrigin: item.countryExtensions?.countryOfOrigin || item.countryOfOrigin,
        snapEligible: item.countryExtensions?.usSnapEligible || false
      };
    });

    // Extract metadata
    const result: ProductSearchResult = {
      products,
      metadata: {
        pagination: apiData.meta?.pagination,
        spellingSuggestion: apiData.meta?.spellingSuggestion,
        pinned: apiData.meta?.pinned,
        keywordRedirect: apiData.meta?.keywordRedirect,
        facets: apiData.meta?.facets,
        sortOptions: apiData.meta?.sort,
        debug: apiData.meta?.debug
      }
    };
    
    // Cache the result
    productCache.set(cacheKey, {
      data: result,
      timestamp: now,
      expiry: now + CACHE_TTL
    });
    
    // Clean up expired cache entries (simple cleanup)
    cleanExpiredCache();
    
    return result;
    
  } catch (error) {
    console.error(`Failed to fetch products for category ${categoryId}:`, error);
    
    // Return cached data if available, even if expired, as fallback
    if (cached) {
      console.log(`Using expired cache as fallback for category ${categoryId}`);
      return cached.data;
    }
    
    // Return empty result as last resort
    return {
      products: [],
      metadata: {}
    };
  }
}

// Clean up expired cache entries to prevent memory leaks
function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, entry] of productCache.entries()) {
    if (now >= entry.expiry) {
      productCache.delete(key);
    }
  }
}

// Optional: Clear all cache
export function clearProductCache() {
  productCache.clear();
}

// Optional: Get cache stats for debugging
export function getCacheStats() {
  const now = Date.now();
  const entries = Array.from(productCache.entries());
  const active = entries.filter(([, entry]) => now < entry.expiry).length;
  const expired = entries.length - active;
  
  return {
    total: entries.length,
    active,
    expired
  };
}