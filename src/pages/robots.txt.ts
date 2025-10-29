import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
User-agent: AdsBot-Google
User-agent: Googlebot-Image
Disallow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ request }) => {
    const site = import.meta.env.SITEMAP_BASE_URL || new URL(request.url).origin;
    const sitemapURL = new URL('sitemap-index.xml', site);
    return new Response(getRobotsTxt(sitemapURL));
};