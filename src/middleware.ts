import { defineMiddleware } from 'astro:middleware';
import { getOptimizelySdk } from './graphql/getSdk';
import { Locales } from '../__generated/sdk';
import type { ContentPayload } from './graphql/shared/ContentPayload';

// Cache for placeholder data to avoid repeated GraphQL calls
const placeholderCache = new Map<string, Map<string, string>>();
const CACHE_DURATION = 1000; // 5 minutes

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  
  // Only process HTML responses
  if (response.headers.get('content-type')?.includes('text/html')) {
    const html = await response.text();
    console.log('[PLACEHOLDER MIDDLEWARE] Processing HTML response');
    
    // Extract domain from URL
    const domain = context.url.origin;
    const locale = context.currentLocale as Locales || Locales.En;
    console.log('[PLACEHOLDER MIDDLEWARE] Domain:', domain, 'Locale:', locale);
    
    try {
      // Get placeholders from GraphQL
      const placeholders = await getPlaceholders(domain, locale);
      console.log('[PLACEHOLDER MIDDLEWARE] Found placeholders:', Array.from(placeholders.entries()));
      
      // Replace placeholders in HTML
      let processedHtml = html;
      let replacementCount = 0;
      
      // Debug: Show first 500 chars of HTML to see what we're working with
      console.log('[PLACEHOLDER MIDDLEWARE] HTML preview (first 500 chars):', html.substring(0, 500));
      
      for (const [key, value] of placeholders) {
        console.log('[PLACEHOLDER MIDDLEWARE] Attempting to replace:', key, 'with:', value);
        
        // Check if the key exists in the HTML first
        if (processedHtml.includes(key)) {
          console.log('[PLACEHOLDER MIDDLEWARE] Key found in HTML:', key);
        } else {
          console.log('[PLACEHOLDER MIDDLEWARE] Key NOT found in HTML:', key);
        }
        
        // Replace key with value (key is used as-is from PlaceholderItem)
        const regex = new RegExp(escapeRegex(key), 'g');
        const matches = processedHtml.match(regex);
        console.log('[PLACEHOLDER MIDDLEWARE] Regex matches for key:', key, ':', matches);
        
        const beforeLength = processedHtml.length;
        processedHtml = processedHtml.replace(regex, value);
        const afterLength = processedHtml.length;
        
        if (beforeLength !== afterLength) {
          replacementCount++;
          console.log('[PLACEHOLDER MIDDLEWARE] Successfully replaced:', key, '->', value);
        } else {
          console.log('[PLACEHOLDER MIDDLEWARE] No replacement made for:', key);
        }
      }
      
      console.log('[PLACEHOLDER MIDDLEWARE] Total replacements made:', replacementCount);
      
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
  console.log('[PLACEHOLDER MIDDLEWARE] Cache key:', cacheKey);
  
  // Check cache first
  if (placeholderCache.has(cacheKey)) {
    console.log('[PLACEHOLDER MIDDLEWARE] Using cached placeholders');
    return placeholderCache.get(cacheKey)!;
  }
  
  console.log('[PLACEHOLDER MIDDLEWARE] Fetching placeholders from GraphQL');
  
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
  
  console.log('[PLACEHOLDER MIDDLEWARE] GraphQL response:', JSON.stringify(response, null, 2));
  
  // Build placeholder map
  const placeholders = new Map<string, string>();
  
  if (response.PlaceholdersConfiguration?.items) {
    console.log('[PLACEHOLDER MIDDLEWARE] Found', response.PlaceholdersConfiguration.items.length, 'configuration(s)');
    
    for (const config of response.PlaceholdersConfiguration.items) {
      console.log('[PLACEHOLDER MIDDLEWARE] Processing config:', config.Domain, 'with', config.Placeholders?.length || 0, 'placeholders');
      
      if (config.Placeholders) {
        for (const placeholder of config.Placeholders) {
          console.log('[PLACEHOLDER MIDDLEWARE] Processing placeholder:', placeholder);
          
          if (placeholder.Key && placeholder.Value) {
            placeholders.set(placeholder.Key, placeholder.Value);
            console.log('[PLACEHOLDER MIDDLEWARE] Added placeholder:', placeholder.Key, '->', placeholder.Value);
          }
        }
      }
    }
  } else {
    console.log('[PLACEHOLDER MIDDLEWARE] No PlaceholdersConfiguration items found');
  }
  
  console.log('[PLACEHOLDER MIDDLEWARE] Final placeholder map size:', placeholders.size);
  
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