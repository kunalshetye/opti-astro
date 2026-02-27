import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: bai-internal
User-agent: Googlebot
User-agent: Google-Extended
User-agent: Chrome-Lighthouse
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: PerplexityBot
User-agent: ClaudeBot
User-agent: Claude-User
Allow: /

User-agent: *
Disallow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ request }) => {
    const site = import.meta.env.SITEMAP_BASE_URL || new URL(request.url).origin;
    const sitemapURL = new URL('sitemap.xml', site);
    return new Response(getRobotsTxt(sitemapURL));
};