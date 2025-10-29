/**
 * Locale-Specific Sitemap Endpoint
 *
 * Generates XML sitemap for non-default locales with caching.
 * URL: /fr/sitemap.xml, /nl/sitemap.xml, /de/sitemap.xml, etc.
 */

import type { APIRoute } from 'astro';
import { handleSitemapRequest } from '../../lib/sitemap-endpoint';

export const GET: APIRoute = handleSitemapRequest;
