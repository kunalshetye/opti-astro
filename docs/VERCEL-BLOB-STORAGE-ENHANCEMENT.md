# Future Enhancement: Vercel Blob Storage for Product Catalog

**Status:** Planned
**Priority:** Medium
**Affected Components:** Product Catalog, TDK-Lambda Import

## Problem Statement
Product catalog saving fails on Vercel with error:
```
EROFS: read-only file system, open '/var/task/data/product-catalog.json'
```

This occurs because Vercel serverless functions have read-only filesystems and cannot write to local files. The current implementation in [product-catalog-utils.ts](../src/lib/product-catalog-utils.ts) uses `fs/promises` to read/write `data/product-catalog.json`.

### Affected Features
Both admin features use the same `saveProductCatalog()` function and will fail in Vercel production:
1. **TDK-Lambda Product Import** ([_TdkLambdaImport.svelte](../src/pages/opti-admin/components/_TdkLambdaImport.svelte)) - Error confirmed in production
2. **Product Catalog Management** ([_ProductCatalog.svelte](../src/pages/opti-admin/components/_ProductCatalog.svelte)) - Works locally, will fail in Vercel production

Both use the same code path:
- API endpoints → `upsertProduct()` or `saveProductCatalog()` → filesystem write → EROFS error

## Requirements
- Enable product catalog persistence in Vercel production environment
- Maintain local development workflow (filesystem-based)
- Preserve existing product catalog data (26 products, ~38KB)
- Maintain backward compatibility with existing API endpoints
- No changes required to admin UI components

## Proposed Solution: Vercel Blob Storage with Environment-Aware Abstraction

Use **Vercel Blob** for production file storage while keeping filesystem for local development.

### Why Vercel Blob?
1. **File-native** - Designed for storing files (like JSON), not key-value pairs
2. **Simple API** - `put()` and `get()` operations on blob URLs
3. **Edge-optimized** - Fast global CDN distribution
4. **Cost-effective** - Free tier: 1GB storage, 1000 writes/month
5. **Perfect for JSON** - Store product-catalog.json as a blob

### Alternative Comparison
| Solution | Pros | Cons | Selected |
|----------|------|------|----------|
| **Vercel Blob** | File storage, simple, edge CDN | Requires @vercel/blob package | ✅ **YES** |
| Vercel KV | Fast Redis | Key-value only, need JSON parsing | ❌ No |
| Vercel Postgres | Queryable, robust | Overkill, schema management | ❌ No |
| Optimizely CMS | Aligned with architecture | Complex, GraphQL setup | ❌ No |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 product-catalog-utils.ts                 │
│                                                           │
│  Public API (unchanged):                                 │
│  - loadProductCatalog()                                   │
│  - saveProductCatalog()                                   │
│  - getAllProducts()                                       │
│  - getProductBySKU()                                      │
│  - upsertProduct()                                        │
│  - deleteProduct()                                        │
│                                                           │
│         ↓ delegates to ↓                                 │
│                                                           │
│  Storage Abstraction Layer:                              │
│  - loadCatalogFromStorage() ← NEW                        │
│  - saveCatalogToStorage()   ← NEW                        │
│                                                           │
│         ↓ routes to ↓                                    │
│  ┌─────────────────┬─────────────────┐                  │
│  │   Filesystem    │   Vercel Blob   │                  │
│  │   (dev/local)   │  (production)   │                  │
│  └─────────────────┴─────────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Add Vercel Blob Dependency
**File:** `package.json`

Add to dependencies:
```json
"@vercel/blob": "^0.29.0"
```

Run: `yarn add @vercel/blob`

### Step 2: Update Product Catalog Utils
**File:** `src/lib/product-catalog-utils.ts`

#### 2A. Add Imports
Add at top of file (after existing imports):
```typescript
import { put, head, del } from '@vercel/blob';
```

#### 2B. Add Storage Abstraction Layer
Add after line 69 (after `getCatalogPath()` function):

```typescript
/**
 * Environment detection
 */
function isVercelProduction(): boolean {
  return process.env.VERCEL_ENV === 'production' ||
         process.env.VERCEL_ENV === 'preview';
}

/**
 * Blob storage URL (set as env var in Vercel)
 * Example: https://[account].public.blob.vercel-storage.com/product-catalog-[hash].json
 */
const BLOB_URL_ENV_KEY = 'PRODUCT_CATALOG_BLOB_URL';

/**
 * Load catalog from appropriate storage
 */
async function loadCatalogFromStorage(): Promise<ProductCatalog> {
  const isVercel = isVercelProduction();

  if (isVercel) {
    try {
      const blobUrl = process.env[BLOB_URL_ENV_KEY];

      if (!blobUrl) {
        console.log('[Blob] No blob URL configured, returning empty catalog');
        return {
          version: '1.0',
          lastUpdated: new Date().toISOString(),
          products: []
        };
      }

      // Fetch blob content
      const response = await fetch(blobUrl);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('[Blob] Blob not found, returning empty catalog');
          return {
            version: '1.0',
            lastUpdated: new Date().toISOString(),
            products: []
          };
        }
        throw new Error(`Failed to fetch blob: ${response.status} ${response.statusText}`);
      }

      const catalog = await response.json();
      console.log('[Blob] Loaded product catalog from Vercel Blob');
      return catalog;
    } catch (error) {
      console.error('[Blob] Error loading from Vercel Blob:', error);
      throw error;
    }
  } else {
    // Load from filesystem (local development)
    try {
      const catalogPath = getCatalogPath();
      const fileContent = await readFile(catalogPath, 'utf-8');
      console.log('[FS] Loaded product catalog from filesystem');
      return JSON.parse(fileContent);
    } catch (error) {
      console.log('[FS] No catalog file found, returning empty');
      return {
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        products: []
      };
    }
  }
}

/**
 * Save catalog to appropriate storage
 */
async function saveCatalogToStorage(catalog: ProductCatalog): Promise<void> {
  const isVercel = isVercelProduction();

  // Update timestamp
  catalog.lastUpdated = new Date().toISOString();

  if (isVercel) {
    try {
      // Upload to Vercel Blob
      const catalogJson = JSON.stringify(catalog, null, 2);
      const blob = await put('product-catalog.json', catalogJson, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false // Keep consistent filename
      });

      // Store blob URL in environment for future reads
      // Note: This requires updating the env var after first upload
      console.log(`[Blob] Saved ${catalog.products.length} products to Vercel Blob`);
      console.log(`[Blob] URL: ${blob.url}`);
      console.log('[Blob] Update PRODUCT_CATALOG_BLOB_URL env var with this URL');

      // Clear cache
      productCache.clear();
    } catch (error) {
      console.error('[Blob] Error saving to Vercel Blob:', error);
      throw error;
    }
  } else {
    // Save to filesystem (local development)
    try {
      const catalogPath = getCatalogPath();
      const dirPath = join(process.cwd(), 'data');

      // Ensure directory exists
      await mkdir(dirPath, { recursive: true });

      // Write file
      await writeFile(catalogPath, JSON.stringify(catalog, null, 2), 'utf-8');
      console.log(`[FS] Saved ${catalog.products.length} products to filesystem`);

      // Clear cache
      productCache.clear();
    } catch (error) {
      console.error('[FS] Error saving to filesystem:', error);
      throw error;
    }
  }
}
```

#### 2C. Update loadProductCatalog()
Replace existing `loadProductCatalog()` function (lines 74-87) with:

```typescript
/**
 * Read product catalog (public API)
 */
export async function loadProductCatalog(): Promise<ProductCatalog> {
  try {
    return await loadCatalogFromStorage();
  } catch (error) {
    console.error('Error loading product catalog:', error);
    return {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      products: []
    };
  }
}
```

#### 2D. Update saveProductCatalog()
Replace existing `saveProductCatalog()` function (lines 92-112) with:

```typescript
/**
 * Save product catalog (public API)
 */
export async function saveProductCatalog(catalog: ProductCatalog): Promise<void> {
  try {
    await saveCatalogToStorage(catalog);
  } catch (error) {
    console.error('Error saving product catalog:', error);
    throw error;
  }
}
```

### Step 3: Configure Vercel Blob Store
**Manual steps in Vercel Dashboard:**

1. Go to Vercel project → **Storage** tab
2. Click **Create Database** → **Blob**
3. Name: `product-catalog-blob`
4. Region: Auto (closest to deployment)
5. Connect to project

This automatically sets environment variables:
- `BLOB_READ_WRITE_TOKEN` - Authentication token for blob operations

### Step 4: Initial Upload and Environment Configuration

**Two-step process:**

#### 4A. First deploy (to get blob URL)
1. Deploy code changes to Vercel
2. Manually trigger a save operation (add any product via admin)
3. Check Vercel logs for the blob URL:
   ```
   [Blob] URL: https://[account].public.blob.vercel-storage.com/product-catalog.json
   ```

#### 4B. Set environment variable
1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `PRODUCT_CATALOG_BLOB_URL`
   - **Value**: The URL from logs (e.g., `https://xxxxx.public.blob.vercel-storage.com/product-catalog.json`)
   - **Environment**: Production, Preview, Development
3. Redeploy to apply environment variable

### Step 5: Migrate Existing Data
**File:** `utils/migrate-catalog-to-blob.mjs` (NEW)

Create migration script to upload local catalog to Blob:

```javascript
import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';
import { join } from 'path';

async function migrateCatalogToBlob() {
  try {
    // Read local catalog
    const catalogPath = join(process.cwd(), 'data', 'product-catalog.json');
    const fileContent = await readFile(catalogPath, 'utf-8');
    const catalog = JSON.parse(fileContent);

    console.log(`Migrating ${catalog.products.length} products to Vercel Blob...`);

    // Upload to Blob
    const blob = await put('product-catalog.json', fileContent, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });

    console.log('✓ Migration complete!');
    console.log(`  Products: ${catalog.products.length}`);
    console.log(`  Last updated: ${catalog.lastUpdated}`);
    console.log(`  Blob URL: ${blob.url}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Add this environment variable in Vercel:');
    console.log(`  PRODUCT_CATALOG_BLOB_URL=${blob.url}`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateCatalogToBlob();
```

Add to `package.json` scripts:
```json
"migrate:blob": "node --env-file=.env ./utils/migrate-catalog-to-blob.mjs"
```

Run with Vercel Blob token:
```bash
# Get BLOB_READ_WRITE_TOKEN from Vercel dashboard
yarn migrate:blob
```

## Data Flow

### Development (Local)
```
API Request
  ↓
loadProductCatalog()
  ↓
loadCatalogFromStorage()
  ↓
isVercelProduction() → false
  ↓
readFile('data/product-catalog.json')
  ↓
Return catalog
```

### Production (Vercel)
```
API Request
  ↓
loadProductCatalog()
  ↓
loadCatalogFromStorage()
  ↓
isVercelProduction() → true
  ↓
fetch(process.env.PRODUCT_CATALOG_BLOB_URL)
  ↓
Return catalog
```

## Testing Strategy

### Local Development Testing
1. **Verify filesystem still works:**
   ```bash
   yarn dev
   ```
2. Open `/opti-admin?view=product-catalog`
3. Add or edit a product
4. Verify saved to `data/product-catalog.json`
5. Check console logs show `[FS]` prefix

### Vercel Production Testing
1. **Deploy to Vercel:**
   ```bash
   git add .
   git commit -m "Add Vercel Blob storage for product catalog"
   git push
   ```

2. **Initial setup (first time):**
   - Add a test product via admin
   - Check logs for blob URL
   - Set `PRODUCT_CATALOG_BLOB_URL` environment variable
   - Redeploy

3. **Migrate existing data:**
   ```bash
   yarn migrate:blob
   ```
   Copy the blob URL and set as environment variable.

4. **Test both features:**
   - **Product Catalog:** Add/edit products at `/opti-admin?view=product-catalog`
   - **TDK-Lambda Import:** Import products at `/opti-admin?view=tdklambda-import`
   - Verify no EROFS errors
   - Check logs for `[Blob]` prefix

5. **Verify persistence:**
   - Refresh page
   - Products should still be there
   - Check blob URL directly in browser (should show JSON)

### Edge Cases to Test
| Scenario | Expected Behavior |
|----------|-------------------|
| Empty blob (first deploy) | Returns empty catalog, no error |
| Blob URL not set | Logs warning, returns empty catalog |
| Blob fetch fails | Error logged, throws exception |
| Filesystem missing in dev | Returns empty catalog, creates on save |
| Large catalog (100+ products) | Should work (well under 1GB blob limit) |
| Concurrent writes | Last write wins (Blob atomic uploads) |

## Rollback Plan
If issues occur in production:

1. **Immediate rollback:**
   ```bash
   git revert HEAD
   git push
   ```

2. **Manual blob data recovery:**
   - Access blob URL directly in browser
   - Copy JSON content
   - Save to local `data/product-catalog.json`

3. **Temporary disable blob storage:**
   - Remove `PRODUCT_CATALOG_BLOB_URL` environment variable
   - Code will return empty catalog (safe fallback)
   - Won't delete existing blob data

## Benefits
- ✅ **Fixes Vercel EROFS error** - No more filesystem writes in serverless
- ✅ **Fixes both features** - ProductCatalog AND TDK-Lambda Import
- ✅ **Zero UI changes** - Existing admin interfaces work as-is
- ✅ **Fast edge delivery** - Blob CDN provides global low-latency access
- ✅ **File-native storage** - JSON stored as file, not parsed string
- ✅ **Simple API** - Just `put()` and `get()` operations
- ✅ **Public URL access** - Can view catalog JSON directly in browser
- ✅ **Environment parity** - Same data structure in dev and prod

## Critical Files

### Files to Modify
1. `package.json` - Add `@vercel/blob` dependency
2. `src/lib/product-catalog-utils.ts` - Add storage abstraction

### New Files
1. `utils/migrate-catalog-to-blob.mjs` - One-time migration script

### Files That DON'T Need Changes
All these files use the public API from `product-catalog-utils.ts` and will automatically work with the new storage layer:
- `src/pages/opti-admin/api/products.json.ts` - Uses `upsertProduct()`, `deleteProduct()`, `loadProductCatalog()`
- `src/pages/opti-admin/api/tdklambda-import.json.ts` - Uses `loadProductCatalog()`/`saveProductCatalog()`
- `src/pages/opti-admin/api/tdklambda-check-imported.json.ts` - Uses `loadProductCatalog()`
- `src/pages/opti-admin/components/_ProductCatalog.svelte` - UI component, no changes needed
- `src/pages/opti-admin/components/_TdkLambdaImport.svelte` - UI component, no changes needed

## Cost Analysis
**Vercel Blob Free Tier:**
- Storage: 1GB (current catalog ~38KB = 0.004% of limit)
- Writes: 1000/month
- Reads: Unlimited (free)
- Bandwidth: 100GB/month

Estimated usage:
- Writes: ~50/month (product updates)
- Storage: <1MB even with 1000 products

**Cost:** $0/month for this use case

## Security Considerations
- Blob is public but URL is non-guessable (includes hash)
- Write operations require `BLOB_READ_WRITE_TOKEN` (auto-managed by Vercel)
- Read operations are public (anyone with URL can read JSON)
- Environment variables auto-rotated by Vercel
- Data encrypted at rest and in transit

## Verification Checklist

After implementation, verify:
- [ ] Local dev: Products save to `data/product-catalog.json`
- [ ] Local dev: Console shows `[FS]` logs
- [ ] Vercel production: Products save to Blob
- [ ] Vercel production: Console shows `[Blob]` logs and blob URL
- [ ] Vercel production: No EROFS errors
- [ ] Vercel production: ProductCatalog add/edit works
- [ ] Vercel production: TDK-Lambda import works
- [ ] Vercel production: Data persists across function invocations
- [ ] Blob URL set as `PRODUCT_CATALOG_BLOB_URL` environment variable
- [ ] Migration script successfully uploads existing products to Blob
- [ ] Blob URL accessible directly in browser (shows JSON)

## Timeline Estimate
- **Setup Vercel Blob:** 15 minutes
- **Code changes:** 1-2 hours
- **Testing locally:** 30 minutes
- **Deploy and configure:** 30 minutes
- **Migration:** 15 minutes
- **Production testing:** 30 minutes

**Total:** ~3-4 hours

## Dependencies
- Vercel account with Blob storage enabled
- `@vercel/blob` npm package
- Vercel environment variables configured

## Notes
- This enhancement is currently deferred as the product catalog and TDK-Lambda import features work correctly in local development
- Implementation should be prioritized before deploying to Vercel production if product catalog management is needed in production
- The enhancement maintains full backward compatibility with existing code
- No database migrations or schema changes required
