import { createHash, createHmac, randomBytes } from 'crypto';

export interface OptimizelyGraphConfig {
  gatewayUrl: string;
  appKey: string;
  secret: string;
}

export interface HmacAuthHeader {
  authorization: string;
}

/**
 * Creates HMAC authentication header for Optimizely Graph API requests
 */
export function createHmacAuthHeader(
  config: OptimizelyGraphConfig,
  method: string,
  path: string,
  body: string = ''
): HmacAuthHeader {
  const timestamp = Date.now();
  const nonce = randomBytes(16).toString('hex');
  
  // Create MD5 hash of the request body
  const bodyMd5 = createHash('md5').update(body, 'utf8').digest('base64');
  
  // Create the signature data string
  const signatureData = `${config.appKey}${method}${path}${timestamp}${nonce}${bodyMd5}`;
  
  // Create HMAC signature
  const secretBuffer = Buffer.from(config.secret, 'base64');
  const hmac = createHmac('sha256', secretBuffer);
  hmac.update(signatureData, 'utf8');
  const base64hmac = hmac.digest('base64');
  
  // Create the authorization header
  const authHeader = `epi-hmac ${config.appKey}:${timestamp}:${nonce}:${base64hmac}`;
  
  return {
    authorization: authHeader
  };
}

/**
 * Makes an authenticated request to Optimizely Graph API
 */
export async function makeOptimizelyGraphRequest(
  config: OptimizelyGraphConfig,
  endpoint: string,
  options: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
  } = {}
): Promise<Response> {
  const {
    method = 'GET',
    body = '',
    headers = {},
    queryParams = {}
  } = options;
  
  // Build the full URL with query parameters
  const url = new URL(endpoint, config.gatewayUrl);
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  // Get the path with query string for HMAC signature
  const pathWithQuery = url.pathname + url.search;
  
  // Create HMAC auth header
  const authHeader = createHmacAuthHeader(config, method, pathWithQuery, body);
  
  // Make the request
  return fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'text/plain',
      ...headers,
      ...authHeader
    },
    body: method !== 'GET' ? body : undefined
  });
}

/**
 * Upload synonyms to Optimizely Graph
 */
export async function uploadSynonyms(
  config: OptimizelyGraphConfig,
  synonyms: string,
  options: {
    synonymSlot?: '1' | '2';
    languageRouting?: string;
  } = {}
): Promise<{ success: boolean; message: string; error?: string }> {
  const { synonymSlot = '1', languageRouting = 'standard' } = options;
  
  try {
    const response = await makeOptimizelyGraphRequest(config, '/resources/synonyms', {
      method: 'PUT',
      body: synonyms,
      queryParams: {
        synonym_slot: synonymSlot,
        language_routing: languageRouting
      }
    });
    
    if (response.ok) {
      return {
        success: true,
        message: `Synonyms successfully uploaded to slot ${synonymSlot} for language routing: ${languageRouting}`
      };
    } else {
      const errorText = await response.text();
      return {
        success: false,
        message: 'Failed to upload synonyms',
        error: `${response.status} ${response.statusText} - ${errorText}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get Optimizely Graph configuration from environment variables
 */
export function getOptimizelyGraphConfig(): OptimizelyGraphConfig {
  const gatewayUrl = import.meta.env.OPTIMIZELY_GRAPH_GATEWAY_URL || 'https://cg.optimizely.com';
  const appKey = import.meta.env.OPTIMIZELY_GRAPH_APP_KEY;
  const secret = import.meta.env.OPTIMIZELY_GRAPH_SECRET;
  
  if (!appKey || !secret) {
    throw new Error('Missing required environment variables: OPTIMIZELY_GRAPH_APP_KEY and OPTIMIZELY_GRAPH_SECRET');
  }
  
  return {
    gatewayUrl,
    appKey,
    secret
  };
}