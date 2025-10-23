// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import mkcert from 'vite-plugin-mkcert';

import { adapter } from 'astro-auto-adapter';

import alpinejs from '@astrojs/alpinejs';
import tailwindcss from '@tailwindcss/vite';

import svelte from '@astrojs/svelte';

const multiAdapter = await adapter();

// Custom locale configuration for dynamic CMS locales
const localeConfig = {
    // Default locale (used when no locale is detected in URL)
    defaultLocale: 'en',

    // Enable or disable fallback completely
    // - true: Enable fallback behavior (default)
    // - false: Disable all fallback, show 404 if content doesn't exist in requested locale
    enableFallback: true,

    // Specific fallbacks for individual locales
    fallback: {
        // Examples of locale fallback configuration:
        'fr-CA': 'fr', // Canadian French falls back to French
        'nl-BE': 'nl', // Belgian Dutch falls back to Dutch
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

    output: 'server',

    adapter: multiAdapter,

    server: { port: 4321 },
    vite: {
        ssr: {
            noExternal: ['graphql', 'graphql-request'],
        },
        plugins: [mkcert(), tailwindcss()],
    },
    integrations: [alpinejs(), svelte()],

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
            OPTIMIZELY_DATA_PLATFORM_ENDPOINT: envField.string({
                context: 'server',
                access: 'secret',
                optional: true,
                default: "https://api.zaius.com"
            }),
            OPTIMIZELY_DATA_PLATFORM_PRIVATE_KEY: envField.string({
                context: 'server',
                access: 'secret',
                optional: true,
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
            ASTRO_TRANSITIONS_ENABLED: envField.boolean({
                context: 'client',
                access: 'public',
                optional: true,
                default: true,
            }),
        },
    },

    experimental: {
        fonts: [
            {
                provider: fontProviders.google(),
                name: 'Alegreya',
                cssVariable: '--font-alegreya',
            },
            {
                provider: fontProviders.google(),
                name: 'Alegreya Sans',
                cssVariable: '--font-alegreya-sans',
            },
            {
                provider: fontProviders.google(),
                name: 'Archivo Narrow',
                cssVariable: '--font-archivo-narrow',
            },
            {
                provider: fontProviders.google(),
                name: 'BioRhyme',
                cssVariable: '--font-biorhyme',
            },
            {
                provider: fontProviders.google(),
                name: 'Cardo',
                cssVariable: '--font-cardo',
            },
            {
                provider: fontProviders.google(),
                name: 'Chivo',
                cssVariable: '--font-chivo',
            },
            {
                provider: fontProviders.google(),
                name: 'Cormorant',
                cssVariable: '--font-cormorant',
            },
            {
                provider: fontProviders.google(),
                name: 'Crimson Text',
                cssVariable: '--font-crimson-text',
            },
            {
                provider: fontProviders.google(),
                name: 'DM Sans',
                cssVariable: '--font-dm-sans',
            },
            {
                provider: fontProviders.google(),
                name: 'Eczar',
                cssVariable: '--font-eczar',
            },
            {
                provider: fontProviders.google(),
                name: 'Fira Sans',
                cssVariable: '--font-fira-sans',
            },
            {
                provider: fontProviders.google(),
                name: 'Fraunces',
                cssVariable: '--font-fraunces',
            },
            {
                provider: fontProviders.google(),
                name: 'Heebo',
                cssVariable: '--font-heebo',
            },
            {
                provider: fontProviders.google(),
                name: 'IBM Plex Sans',
                cssVariable: '--font-ibm-plex-sans',
            },
            {
                provider: fontProviders.google(),
                name: 'IBM Plex Serif',
                cssVariable: '--font-ibm-plex-serif',
            },
            {
                provider: fontProviders.google(),
                name: 'Inconsolata',
                cssVariable: '--font-inconsolata',
            },
            {
                provider: fontProviders.google(),
                name: 'Inknut Antiqua',
                cssVariable: '--font-inknut-antiqua',
            },
            {
                provider: fontProviders.google(),
                name: 'Inter',
                cssVariable: '--font-inter',
            },
            {
                provider: fontProviders.google(),
                name: 'Karla',
                cssVariable: '--font-karla',
            },
            {
                provider: fontProviders.google(),
                name: 'Lato',
                cssVariable: '--font-lato',
            },
            {
                provider: fontProviders.google(),
                name: 'Libre Baskerville',
                cssVariable: '--font-libre-baskerville',
            },
            {
                provider: fontProviders.google(),
                name: 'Libre Franklin',
                cssVariable: '--font-libre-franklin',
            },
            {
                provider: fontProviders.google(),
                name: 'Lora',
                cssVariable: '--font-lora',
            },
            {
                provider: fontProviders.google(),
                name: 'Manrope',
                cssVariable: '--font-manrope',
            },
            {
                provider: fontProviders.google(),
                name: 'Merriweather',
                cssVariable: '--font-merriweather',
            },
            {
                provider: fontProviders.google(),
                name: 'Montserrat',
                cssVariable: '--font-montserrat',
            },
            {
                provider: fontProviders.google(),
                name: 'Neuton',
                cssVariable: '--font-neuton',
            },
            {
                provider: fontProviders.google(),
                name: 'Nunito',
                cssVariable: '--font-nunito',
            },
            {
                provider: fontProviders.google(),
                name: 'Open Sans',
                cssVariable: '--font-open-sans',
            },
            {
                provider: fontProviders.google(),
                name: 'Oswald',
                cssVariable: '--font-oswald',
            },
            {
                provider: fontProviders.google(),
                name: 'Outfit',
                cssVariable: '--font-outfit',
            },
            {
                provider: fontProviders.google(),
                name: 'Playfair Display',
                cssVariable: '--font-playfair-display',
            },
            {
                provider: fontProviders.google(),
                name: 'Plus Jakarta Sans',
                cssVariable: '--font-plus-jakarta-sans',
            },
            {
                provider: fontProviders.google(),
                name: 'Poppins',
                cssVariable: '--font-poppins',
            },
            {
                provider: fontProviders.google(),
                name: 'Proza Libre',
                cssVariable: '--font-proza-libre',
            },
            {
                provider: fontProviders.google(),
                name: 'PT Sans',
                cssVariable: '--font-pt-sans',
            },
            {
                provider: fontProviders.google(),
                name: 'PT Serif',
                cssVariable: '--font-pt-serif',
            },
            {
                provider: fontProviders.google(),
                name: 'Public Sans',
                cssVariable: '--font-public-sans',
            },
            {
                provider: fontProviders.google(),
                name: 'Quicksand',
                cssVariable: '--font-quicksand',
            },
            {
                provider: fontProviders.google(),
                name: 'Raleway',
                cssVariable: '--font-raleway',
            },
            {
                provider: fontProviders.google(),
                name: 'Roboto',
                cssVariable: '--font-roboto',
            },
            {
                provider: fontProviders.google(),
                name: 'Roboto Mono',
                cssVariable: '--font-roboto-mono',
            },
            {
                provider: fontProviders.google(),
                name: 'Rubik',
                cssVariable: '--font-rubik',
            },
            {
                provider: fontProviders.google(),
                name: 'Source Sans 3',
                cssVariable: '--font-source-sans-3',
            },
            {
                provider: fontProviders.google(),
                name: 'Source Serif 4',
                cssVariable: '--font-source-serif-4',
            },
            {
                provider: fontProviders.google(),
                name: 'Space Grotesk',
                cssVariable: '--font-space-grotesk',
            },
            {
                provider: fontProviders.google(),
                name: 'Space Mono',
                cssVariable: '--font-space-mono',
            },
            {
                provider: fontProviders.google(),
                name: 'Spectral',
                cssVariable: '--font-spectral',
            },
            {
                provider: fontProviders.google(),
                name: 'Syne',
                cssVariable: '--font-syne',
            },
            {
                provider: fontProviders.google(),
                name: 'Urbanist',
                cssVariable: '--font-urbanist',
            },
            {
                provider: fontProviders.google(),
                name: 'Work Sans',
                cssVariable: '--font-work-sans',
            },
        ],
    },
});

// Export locale configuration for use in locale utilities
export { localeConfig };