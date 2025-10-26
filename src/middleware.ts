import { defineMiddleware } from 'astro:middleware';
import { Locales } from '../__generated/sdk';
import { getOptimizelySdk } from './graphql/getSdk';
import type { ContentPayload } from './graphql/shared/ContentPayload';
import { localeToSdkLocale } from './lib/locale-helpers';
import { checkAdminAuth } from './pages/opti-admin/auth-opti-admin';

// Cache for placeholder data to avoid repeated GraphQL calls
const placeholderCache = new Map<string, Map<string, string>>();
const CACHE_DURATION = 60000; // 1 minute

export const onRequest = defineMiddleware(async (context, next) => {
  // Check if this is an admin route
  if (context.url.pathname.startsWith('/opti-admin')) {
    const authError = checkAdminAuth(context.request);
    if (authError) {
      return authError;
    }
  }

  const response = await next();
  
  // Only process HTML responses
  if (response.headers.get('content-type')?.includes('text/html')) {
    const html = await response.text();

    // Extract domain from URL
    const domain = context.url.host;
    // Use Astro's current locale
    const locale = localeToSdkLocale(context.currentLocale) as Locales;
    
    try {
      // Get placeholders from GraphQL
      const placeholders = await getPlaceholders(domain, locale);
      
      // Replace placeholders in HTML
      let processedHtml = html;
      let replacementCount = 0;
      
      
      for (const [key, value] of placeholders) {
        // Replace key with value (key is used as-is from PlaceholderItem)
        const regex = new RegExp(escapeRegex(key), 'g');
        
        const beforeLength = processedHtml.length;
        processedHtml = processedHtml.replace(regex, value);
        const afterLength = processedHtml.length;
        
        if (beforeLength !== afterLength) {
          replacementCount++;
        }
      }
      
      
      // Return new response with processed HTML
      return new Response(processedHtml, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    } catch (error) {
      console.error('[PLACEHOLDER MIDDLEWARE] Error processing placeholders:', error);
      // Return original HTML if GraphQL fails
      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }
  }
  
  return response;
});

async function getPlaceholders(domain: string, locale: Locales): Promise<Map<string, string>> {
  const cacheKey = `${domain}-${locale}`;
  
  // Check cache first
  if (placeholderCache.has(cacheKey)) {
    return placeholderCache.get(cacheKey)!;
  }
  
  
  // Create content payload for GraphQL request
  const contentPayload: ContentPayload = {
    ctx: 'view',
    key: '',
    ver: '',
    loc: locale,
    preview_token: '',
    types: [],
  };
  
  // Fetch placeholders from GraphQL
  const sdk = getOptimizelySdk(contentPayload);
  const response = await sdk.placeholderConfigurations({
    locale: [locale],
    domain: domain
  });
  
  
  // Build placeholder map
  const placeholders = new Map<string, string>();
  
  if (response?.PlaceholdersConfiguration?.items) {
    for (const config of response.PlaceholdersConfiguration.items) {
      if (config.Placeholders) {
        for (const placeholder of config.Placeholders) {
          if (placeholder.Key && placeholder.Value) {
            placeholders.set(placeholder.Key, placeholder.Value);
          }
        }
      }
    }
  }
  
  
  // Cache the result
  placeholderCache.set(cacheKey, placeholders);
  
  // Clear cache after duration
  setTimeout(() => {
    placeholderCache.delete(cacheKey);
  }, CACHE_DURATION);
  
  return placeholders;
}

function escapeRegex(string: string): string {
  // return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return string;
}