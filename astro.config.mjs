// @ts-check
import { defineConfig, envField } from 'astro/config';
import mkcert from 'vite-plugin-mkcert';

import node from '@astrojs/node';
import { adapter } from "astro-auto-adapter";

import alpinejs from '@astrojs/alpinejs';
import tailwindcss from '@tailwindcss/vite';

const multiAdapter = await adapter();

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
            {
                protocol: 'https',
                hostname: '*.cmp.optimizely.com',
            },
        ],
    },

    i18n: {
        locales: [
        // DYNAMIC_LOCALES_START
       'en' 
        // DYNAMIC_LOCALES_END
        ],
        defaultLocale: 'en',
        routing: {
            prefixDefaultLocale: false,
            fallbackType: 'rewrite',
        },
        fallback: {
            // DYNAMIC_FALLBACK_START
            
            // DYNAMIC_FALLBACK_END
        },
    },

    output: 'server',

    adapter: multiAdapter,

    server: { port: 4321 },
    vite: {
        ssr: {
            noExternal: ['graphql', 'graphql-request'],
        },
        plugins: [mkcert(), tailwindcss()],
    },
    integrations: [alpinejs()],

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
            EXTERNAL_PREVIEW_ENABLED: envField.boolean({
                context: 'server',
                access: 'public',
                optional: true,
                default: false,
            }),
            EXTERNAL_PREVIEW_TOKEN: envField.string({
                context: 'server',
                access: 'secret',
                optional: true,
            }),
            OPTIMIZELY_DEV_MODE: envField.boolean({
                context: 'client',
                access: 'public',
                optional: true,
                default: false,
            }),
        },
    },
});
