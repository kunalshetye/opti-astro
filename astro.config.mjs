// @ts-check
import { defineConfig, envField } from 'astro/config';
import mkcert from 'vite-plugin-mkcert';

import node from '@astrojs/node';

import alpinejs from '@astrojs/alpinejs';
import tailwindcss from '@tailwindcss/vite';

import pageInsight from 'astro-page-insight';

// https://astro.build/config
export default defineConfig({
    devToolbar: {
        enabled: false,
    },

    image: {
        domains: ['images.unsplash.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.cms.optimizely.com',
            },
        ],
    },

    i18n: {
        locales: ['en', 'es', 'fr', 'fr-CA', 'nl', 'sv', 'de'],
        defaultLocale: 'en',
        routing: {
            prefixDefaultLocale: false,
            fallbackType: 'rewrite',
        },
        fallback: {
            es: 'en',
            fr: 'en',
            'fr-CA': 'en',
            nl: 'en',
            sv: 'en',
            de: 'en',
        },
    },

    output: 'server',

    adapter: node({
        mode: 'standalone',
    }),

    server: { port: 4321 },
    vite: {
        ssr: {
            noExternal: ['graphql', 'graphql-request'],
        },
        plugins: [mkcert(), tailwindcss()],
    },
    integrations: [alpinejs(), pageInsight()],

    env: {
        schema: {
            OPTIMIZELY_CMS_URL: envField.string({
                context: 'client',
                access: 'public',
                optional: true,
            }),
            OPTIMIZELY_GRAPH_SECRET: envField.string({
                context: 'server',
                access: 'secret',
                optional: false,
            }),
            OPTIMIZELY_GRAPH_APP_KEY: envField.string({
                context: 'client',
                access: 'public',
                optional: false,
            }),
            OPTIMIZELY_GRAPH_SINGLE_KEY: envField.string({
                context: 'client',
                access: 'public',
                optional: false,
            }),
            OPTIMIZELY_GRAPH_GATEWAY: envField.string({
                context: 'client',
                access: 'public',
                optional: false,
            }),
            PREVIEW_DELAY: envField.number({
                context: 'client',
                access: 'public',
                optional: true,
                default: 0,
            }),
        },
    },
});
