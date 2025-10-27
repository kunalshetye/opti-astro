/**
 * Default Sitemap Endpoint (English locale)
 *
 * Generates XML sitemap for the default locale (en) with caching.
 * URL: /sitemap.xml
 */

import type { APIRoute } from 'astro';
import { handleSitemapRequest } from '../lib/sitemap-endpoint';

export const GET: APIRoute = handleSitemapRequest;
