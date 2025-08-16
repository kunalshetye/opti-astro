# Locale Configuration Guide

This project uses a **dynamic locale system** that allows you to configure locale behavior in `astro.config.mjs` without depending on predefined locale lists from the SDK.

## Configuration

Configure locales in `astro.config.mjs`:

```javascript
const localeConfig = {
    // Default locale (used when no locale is detected in URL)
    defaultLocale: 'en',

    // Enable or disable fallback completely
    // - true: Enable fallback behavior (default)
    // - false: Disable all fallback, show 404 if content doesn't exist in requested locale
    enableFallback: true,

    // Specific fallbacks for individual locales
    fallback: {
        'de': 'en',        // German falls back to English
        'fr-CA': 'fr',     // Canadian French falls back to French
        'nb-NO': 'en',     // Norwegian Bokmål falls back to English
        'nl-BE': 'nl',     // Belgian Dutch falls back to Dutch
        'zh-Hans': 'en',   // Simplified Chinese falls back to English
        // Add more fallbacks as needed based on your CMS locales
    },

    // Generic fallback locale (used when specific fallback is not defined)
    genericFallback: 'en',

    // Fallback behavior type (like Astro's i18n fallbackType)
    // - "redirect": Redirect to the fallback locale URL (e.g., /de -> /en)
    // - "rewrite": Show fallback content at original URL (e.g., show English content at /de)
    fallbackType: 'rewrite',

    // Whether to prefix the default locale in URLs (false = /page, true = /en/page)
    prefixDefaultLocale: false,
};
```

## How It Works

### URL Patterns
- **`/page`** → Default locale content
- **`/de/page`** → German content  
- **`/fr-CA/page`** → Canadian French content
- **`/any-locale/page`** → Dynamic locale support

### Locale Detection
1. Extract locale from URL path (`/de/about` → `de`)
2. Validate using regex pattern (supports `en`, `de`, `fr-CA`, `nb-NO`, etc.)
3. Fall back to `defaultLocale` if no valid locale found

### GraphQL API Integration  
- URL format: `nb-NO` (hyphens)
- GraphQL format: `nb_NO` (underscores)
- Automatic conversion handled by `localeToSdkLocale()`

### Fallback Chain
**When `enableFallback: true` (default):**
1. Check for **specific fallback** in `fallback` object
2. Use **generic fallback** if no specific fallback defined
3. Use **default locale** as final fallback

**When `enableFallback: false`:**
- Show 404 error if content doesn't exist in the requested locale
- No fallback behavior occurs

### Fallback Types
- **`"rewrite"`** (default): Show fallback content at the original URL
- **`"redirect"`**: Redirect user to the fallback locale URL

## Usage Examples

### Basic Usage
```javascript
import { getCurrentLocale, getRelativeLocaleUrl } from './lib/locale-utils';

// Get current locale
const locale = getCurrentLocale(Astro); // 'de', 'fr-CA', 'en', etc.

// Generate locale-aware URLs  
const homeUrl = getRelativeLocaleUrl(locale, '/'); 
// → '/de/' or '/' (depending on prefixDefaultLocale setting)

const aboutUrl = getRelativeLocaleUrl('fr-CA', '/about');
// → '/fr-CA/about'
```

### Fallback Usage
```javascript
import { getFallbackLocale } from './lib/locale-utils';

const fallback = getFallbackLocale('de');        // → 'en' (from config)
const fallback2 = getFallbackLocale('fr-CA');    // → 'fr' (from config)  
const fallback3 = getFallbackLocale('unknown');  // → 'en' (genericFallback)
```

## Key Features

✅ **Truly Dynamic** - No hardcoded locale lists  
✅ **CMS-Driven** - Add locales in CMS without code changes  
✅ **Configurable Fallbacks** - Specific and generic fallback support  
✅ **Format Conversion** - Automatic URL ↔ GraphQL format conversion  
✅ **URL Control** - Configure default locale prefixing behavior  

## Migration from Astro i18n

The system **replaces** Astro's built-in i18n module completely:

- ❌ **Removed**: `astro:i18n` imports
- ❌ **Removed**: `i18n` config block in `astro.config.mjs` 
- ❌ **Removed**: Build-time locale synchronization
- ✅ **Added**: Dynamic runtime locale detection
- ✅ **Added**: Configurable fallback system
- ✅ **Added**: CMS-driven locale support

## Troubleshooting

### Config Not Loading
If locale configuration isn't working:
1. Check that `localeConfig` is properly exported from `astro.config.mjs`
2. Verify the middleware imports `'./lib/locale-init.js'`
3. Check browser console for configuration warnings

### Invalid Locale Patterns
The system accepts these patterns:
- ✅ `en`, `de`, `fr` (2-3 letters)
- ✅ `en-US`, `fr-CA`, `nb-NO` (with region)
- ✅ `zh-Hans`, `zh-Hant` (with script)
- ❌ `invalid123`, `x` (invalid patterns)

### Fallback Not Working
1. Check that fallback locale exists in your CMS
2. Verify fallback configuration syntax in `astro.config.mjs`
3. Test with `getFallbackLocale('your-locale')` function