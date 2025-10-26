# Locale Configuration Guide

This project uses **Astro's built-in i18n module** configured via environment variables for maximum flexibility.

## Quick Start

The project comes with default support for these locales:

- 🇬🇧 **English** (`en`) - Default locale
- 🇳🇱 **Dutch** (`nl`)
- 🇧🇪 **Dutch Belgian** (`nl-BE`) → falls back to `nl` → `en`
- 🇸🇪 **Swedish** (`sv`)
- 🇳🇴 **Norwegian** (`no`)
- 🇫🇷 **French** (`fr`)
- 🇨🇦 **French Canadian** (`fr-CA`) → falls back to `fr` → `en`
- 🇪🇸 **Spanish** (`es`)
- 🇮🇹 **Italian** (`it`)
- 🇸🇦 **Arabic** (`ar`)
- 🇨🇳 **Chinese** (`zh`)
- 🇭🇰 **Chinese Hong Kong** (`zh-Hans-HK`) → falls back to `zh` → `en`
- 🇩🇪 **German** (`de`)
- 🇦🇹 **Austrian German** (`de-AT`) → falls back to `de` → `en`

**No configuration needed** - these work out of the box!

## URL Patterns

With default configuration:

- `/about` → English content
- `/nl/about` → Dutch content
- `/nl-BE/about` → Dutch Belgian content (falls back to Dutch if missing)
- `/fr-CA/about` → Canadian French content (falls back to French if missing)
- `/de/about` → German content (falls back to English if missing)
- `/de-AT/about` → Austrian German content (falls back to German if missing)
- `/ar/about` → Arabic content (falls back to English if missing)
- `/zh/about` → Chinese content (falls back to English if missing)
- `/zh-Hans-HK/about` → Chinese Hong Kong content (falls back to Chinese if missing)

## Custom Configuration

### Option 1: Modify Default Config (Recommended for Production)

Edit `astro.config.mjs` directly:

```javascript
const defaultI18nConfig = {
    locales: ['en', 'de', 'fr'],
    defaultLocale: 'en',
    routing: {
        prefixDefaultLocale: false,
        fallbackType: 'rewrite',
    },
    fallback: {
        'de': 'en',
        'fr': 'en',
    },
};
```

### Option 2: Environment Variable Override

Set `ASTRO_I18N_CONFIG` in your `.env` file (useful for deployment environments):

```bash
ASTRO_I18N_CONFIG='{"locales":["en","de","fr"],"defaultLocale":"en","routing":{"prefixDefaultLocale":false,"fallbackType":"rewrite"},"fallback":{"de":"en","fr":"en"}}'
```

**Note:** Environment variable overrides the default config completely.

## Configuration Options

### Complete Configuration Object

```json
{
  "locales": ["en", "fr", "de", "nl"],
  "defaultLocale": "en",
  "routing": {
    "prefixDefaultLocale": false,
    "fallbackType": "rewrite"
  },
  "fallback": {
    "fr": "en",
    "de": "en",
    "nl": "en",
    "fr-CA": "fr"
  }
}
```

### Available Options

#### `locales` (required)
Array of supported locale codes.

**Examples:**
- Simple: `["en", "fr", "de"]`
- With regions: `["en", "fr", "fr-CA", "nl", "nl-BE"]`

#### `defaultLocale` (required)
The default locale code. Must be included in `locales` array.

**Example:** `"en"`

#### `routing.prefixDefaultLocale` (optional)
Whether to prefix default locale in URLs.

- `false` (default): `/about` for English
- `true`: `/en/about` for English

#### `routing.fallbackType` (optional)
How to handle missing translations.

- `"rewrite"` (default): Show fallback content at original URL
  - User visits `/de/about`
  - Content doesn't exist in German
  - Shows English content at `/de/about`

- `"redirect"`: Redirect to fallback locale URL
  - User visits `/de/about`
  - Content doesn't exist in German
  - Redirects to `/en/about`

#### `fallback` (optional)
Locale-specific fallback mappings.

**Examples:**
```json
{
  "fr-CA": "fr",    // Canadian French → French
  "nl-BE": "nl",    // Belgian Dutch → Dutch
  "de": "en",       // German → English
  "fr": "en"        // French → English
}
```

Creates fallback chains: `fr-CA` → `fr` → `en`

## How It Works

### Locale Detection
Astro automatically detects the locale from the URL path and sets `Astro.currentLocale`.

```astro
---
// In any .astro file
const locale = Astro.currentLocale; // 'en', 'fr', 'nl-BE', etc.
---
```

### GraphQL API Integration
The project automatically converts locale formats for Optimizely Graph:

- **Astro format:** `fr-CA` (hyphens)
- **GraphQL format:** `fr_CA` (underscores)

This is handled automatically by the `localeToSdkLocale()` helper:

```typescript
import { localeToSdkLocale } from '../lib/locale-helpers';

const locale = Astro.currentLocale; // 'fr-CA'
const graphqlLocale = localeToSdkLocale(locale); // 'fr_CA'
```

### Content Fallback System

**The project now relies entirely on Astro's built-in i18n fallback system!**

When content doesn't exist in the requested locale, Astro automatically handles the fallback:

**How it works:**

1. **User requests:** `/fr-CA/about`
2. **Page renders** with `Astro.currentLocale = 'fr-CA'`
3. **GraphQL query** for `fr_CA` content
4. **If not found:** Return 404 to Astro
5. **Astro's i18n** automatically rewrites to `/fr/about` (based on fallback config)
6. **Page re-renders** with `Astro.currentLocale = 'fr'`
7. **GraphQL query** for `fr` content
8. **If still not found:** Repeats until default locale or 404

**Key benefits:**
- ✅ Simpler code - no manual fallback logic
- ✅ Leverages Astro's optimized routing
- ✅ Consistent with Astro best practices
- ✅ Automatic based on `fallbackType` configuration

**Behavior based on `fallbackType`:**
- `rewrite` (default): Server-side rewrite, URL stays `/fr-CA/about`
- `redirect`: Client-side redirect to `/fr/about` or `/about`

### Feature Experimentation (FX) Integration

The locale system fully supports Optimizely Feature Experimentation:

1. **Default content** fetched in requested locale (with fallbacks)
2. **FX decision** made for the user
3. **Variant content** fetched if user is in experiment
4. **Same fallback chain** applied to variant content

All locale handling is transparent to FX - it just works! ✅

## Usage Examples

### In Astro Components

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';

// Get current locale
const locale = Astro.currentLocale; // 'en', 'fr', 'nl-BE', etc.

// Generate locale-aware URLs
const homeUrl = getRelativeLocaleUrl(locale, '/');
// With prefixDefaultLocale: false → '/' or '/fr/'
// With prefixDefaultLocale: true → '/en/' or '/fr/'

const aboutUrl = getRelativeLocaleUrl('fr-CA', '/about');
// → '/fr-CA/about'
---

<nav>
  <a href={homeUrl}>Home</a>
  <a href={aboutUrl}>About</a>
</nav>
```

### In GraphQL Queries

```typescript
import { localeToSdkLocale } from '../lib/locale-helpers';

const contentPayload = {
  ctx: 'view',
  key: '',
  ver: '',
  loc: localeToSdkLocale(Astro.currentLocale), // Converts 'fr-CA' → 'fr_CA'
  preview_token: '',
  types: [],
};

const sdk = getOptimizelySdk(contentPayload);
const content = await sdk.contentByPath({...});
```

### In Middleware

```typescript
import { localeToSdkLocale } from './lib/locale-helpers';

export const onRequest = defineMiddleware(async (context, next) => {
  // Astro provides the locale automatically
  const locale = context.currentLocale;
  const graphqlLocale = localeToSdkLocale(locale);

  // Use in GraphQL queries...
});
```

## Common Scenarios

### Adding a New Locale

**1. Edit `astro.config.mjs`:**

```javascript
const defaultI18nConfig = {
    locales: ['en', 'nl', 'sv', 'no', 'fr', 'es', 'it', 'ar', 'de'], // Add 'de'
    defaultLocale: 'en',
    routing: {
        prefixDefaultLocale: false,
        fallbackType: 'rewrite',
    },
    fallback: {
        'de': 'en', // Add fallback
        // ... other fallbacks
    },
};
```

**2. Restart dev server:**
```bash
yarn dev
```

**3. Access new locale:**
```
http://localhost:4321/de/about
```

### Regional Variant with Fallback Chain

```javascript
const defaultI18nConfig = {
    locales: ['en', 'pt', 'pt-BR'],
    defaultLocale: 'en',
    fallback: {
        'pt-BR': 'pt',  // Brazilian Portuguese → Portuguese
        'pt': 'en',     // Portuguese → English
    },
};
```

Creates chain: `pt-BR` → `pt` → `en`

### Prefix All Locales (Including Default)

```javascript
const defaultI18nConfig = {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
    routing: {
        prefixDefaultLocale: true, // Changed to true
        fallbackType: 'rewrite',
    },
    fallback: {
        'fr': 'en',
        'de': 'en',
    },
};
```

**URLs:**
- `/en/about` - English
- `/fr/about` - French
- `/de/about` - German

### Use Redirect Instead of Rewrite

```javascript
const defaultI18nConfig = {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
    routing: {
        prefixDefaultLocale: false,
        fallbackType: 'redirect', // Changed to redirect
    },
    fallback: {
        'fr': 'en',
        'de': 'en',
    },
};
```

**Behavior:**
- User visits `/de/about` but no German content exists
- Automatically redirects to `/about` (English)
- Browser URL changes

## Troubleshooting

### Locale Not Recognized

**Symptom:** URLs like `/fr/about` return 404

**Solution:**
1. Verify locale is in `locales` array in `astro.config.mjs`
2. Restart dev server after config changes
3. Check console for config loading message

### Content Not Found

**Symptom:** Page shows 404 even though locale is configured

**Possible causes:**
1. Content doesn't exist in CMS for that locale
2. Fallback locale also missing content
3. Check fallback chain is properly configured in `astro.config.mjs`

**Debug steps:**
```javascript
// Add to page to see what's happening
console.log('Current locale:', Astro.currentLocale);
console.log('Fallback config:', import.meta.env.ASTRO_I18N_CONFIG);
```

### GraphQL Query Failing

**Symptom:** GraphQL errors about invalid locale

**Solution:** Ensure you're using `localeToSdkLocale()`:

```typescript
// ❌ Wrong
const payload = { loc: Astro.currentLocale }; // 'fr-CA'

// ✅ Correct
import { localeToSdkLocale } from '../lib/locale-helpers';
const payload = { loc: localeToSdkLocale(Astro.currentLocale) }; // 'fr_CA'
```

### Environment Variable Not Loading

**Symptom:** Config doesn't change when setting `ASTRO_I18N_CONFIG`

**Checklist:**
1. JSON is valid (use a JSON validator)
2. No trailing commas in JSON
3. Properly escaped in `.env` file
4. Restart dev server after changing `.env`
5. Check console for parse errors

**Validate JSON:**
```bash
# Test your JSON is valid
echo '{"locales":["en","fr"],"defaultLocale":"en"}' | python -m json.tool
```

### TypeScript Errors in Config

**Symptom:** TypeScript errors in `astro.config.mjs`

**Solution:** The `@ts-ignore` comment is intentional:
```javascript
// @ts-ignore - Astro's type definitions don't properly handle dynamic fallback configurations
i18n: i18nConfig,
```

This is a limitation in Astro's type definitions. Runtime behavior is correct.

### FX Variants Not Working

**Symptom:** Feature Experimentation variants not loading

**Checklist:**
1. Optimizely client configured correctly
2. Flag key matches content key
3. Variant content exists in CMS
4. Check browser console for FX debug logs
5. Verify cookie: `optimizely_user_id`

**Enable debug logging:**
```typescript
// In [...page].astro or variant-resolver.ts
const debugEnabled = true;
const result = await fetchContentByPath(
    getOptimizelySdk,
    contentPayload,
    urlBase,
    urlPath,
    debugEnabled, // Set to true for debug logs
    variantKey // Optional variant key
);
```

## Architecture Notes

### Why Not Use Astro's Locale Detection?

We **do** use Astro's locale detection! That's the whole point of this migration:

✅ **Astro handles:** URL routing, locale detection, `Astro.currentLocale`
✅ **Custom code handles:** GraphQL format conversion, fallback content fetching, FX integration

### File Structure

```
src/
├── lib/
│   └── locale-helpers.ts       # GraphQL utilities only
├── pages/
│   ├── [...page].astro         # Uses Astro.currentLocale
│   └── api/search.json.ts      # Uses localeToSdkLocale()
├── middleware.ts               # Uses Astro.currentLocale
└── optimizely/
    └── variant-resolver.ts     # FX integration

astro.config.mjs                # i18n configuration
```

### What Changed from PR #166

**Removed:**
- ❌ Custom routing logic (~200 lines)
- ❌ `getCurrentLocale()` function
- ❌ `getLocaleFromPath()` function
- ❌ `isValidLocale()` function
- ❌ `utils/sync-locales.mjs` script
- ❌ Build-time locale synchronization
- ❌ Manual fallback logic (`getFallbackChain()`, `getFallbackLocale()`)
- ❌ `resolveContentWithFallback()` complexity (~150 lines)
- ❌ `getPathWithoutLocale()` helper

**Added:**
- ✅ Astro's `i18n` config block
- ✅ Environment variable support
- ✅ `@ts-ignore` for type limitations
- ✅ Simple `fetchContentByPath()` function (~80 lines)

**Kept:**
- ✅ `localeToSdkLocale()` - Essential for GraphQL format conversion
- ✅ `normalizeLocale()` - For reverse conversion
- ✅ All FX integration code

**Result:** 700+ lines of custom code removed, more reliable routing, simpler architecture! 🎉

**Key architectural change:** Now leverages Astro's built-in i18n fallback system instead of manually implementing fallback logic in GraphQL queries.

## Migration Notes

### From Custom Router (PR #166)

If migrating from the custom locale router:

**Code changes needed:**

```diff
- import { getCurrentLocale, getRelativeLocaleUrl } from '../lib/locale-utils';
+ import { getRelativeLocaleUrl } from 'astro:i18n';
+ import { localeToSdkLocale } from '../lib/locale-helpers';

- const lang = getCurrentLocale(Astro);
+ const lang = Astro.currentLocale;

- import { localeToSdkLocale } from '../lib/locale-utils';
+ import { localeToSdkLocale } from '../lib/locale-helpers';
```

**Configuration changes:**

Remove `localeConfig` object, use `i18n` block instead:

```diff
- const localeConfig = {
-     defaultLocale: 'en',
-     fallback: {...},
- };

+ const defaultI18nConfig = {
+     locales: ['en', 'fr', 'de'],
+     defaultLocale: 'en',
+     routing: {...},
+     fallback: {...},
+ };
```

## Performance Considerations

### Build Time
- **No sync step** - Locales configured at build time in `astro.config.mjs`
- **Fast builds** - No dynamic locale detection during build

### Runtime
- **Astro's optimized routing** - Uses Astro's built-in i18n router
- **Efficient fallbacks** - Only queries GraphQL when needed
- **Cached config** - i18n config loaded once at startup

### Caching Strategy
Consider caching fallback content:
- Use Astro's static generation for pages with translations
- Cache GraphQL responses at CDN level
- Use Optimizely's cache headers

## Further Reading

- [Astro i18n Guide](https://docs.astro.build/en/guides/internationalization/)
- [Astro i18n Routing](https://docs.astro.build/en/guides/internationalization/#routing)
- [Astro i18n Reference](https://docs.astro.build/en/reference/configuration-reference/#i18n)
- [Optimizely Graph Documentation](https://docs.developers.optimizely.com/content-management-system/docs/graph)
