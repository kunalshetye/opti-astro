// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import mkcert from 'vite-plugin-mkcert';

import { adapter } from 'astro-auto-adapter';

import alpinejs from '@astrojs/alpinejs';
import tailwindcss from '@tailwindcss/vite';

const multiAdapter = await adapter();

// Parse i18n configuration from environment variable or use defaults
const defaultI18nConfig = {
    locales: ['en', 'nl', 'nl-BE', 'sv', 'no', 'fr', 'fr-CA', 'es', 'it', 'ar', 'zh', 'zh-Hans-HK'],
    defaultLocale: 'en',
    routing: {
        prefixDefaultLocale: false,
        fallbackType: 'rewrite',
    },
    fallback: {
        'nl-BE': 'nl',
        'fr-CA': 'fr',
        'zh-Hans-HK': 'zh',
        'nl': 'en',
        'sv': 'en',
        'no': 'en',
        'fr': 'en',
        'es': 'en',
        'it': 'en',
        'ar': 'en',
        'zh': 'en',
    },
};

let i18nConfig = defaultI18nConfig;

try {
    const envI18nConfig = process.env.ASTRO_I18N_CONFIG;
    if (envI18nConfig) {
        const parsedConfig = JSON.parse(envI18nConfig);
        // Merge with defaults to ensure all required fields are present
        if (parsedConfig && typeof parsedConfig === 'object') {
            i18nConfig = {
                locales: parsedConfig.locales || defaultI18nConfig.locales,
                defaultLocale: parsedConfig.defaultLocale || defaultI18nConfig.defaultLocale,
                routing: {
                    prefixDefaultLocale: parsedConfig.routing?.prefixDefaultLocale ?? defaultI18nConfig.routing.prefixDefaultLocale,
                    fallbackType: parsedConfig.routing?.fallbackType || defaultI18nConfig.routing.fallbackType,
                },
                fallback: parsedConfig.fallback || defaultI18nConfig.fallback,
            };
        }
        console.log('✅ Loaded i18n config from ASTRO_I18N_CONFIG environment variable');
    } else {
        console.log('ℹ️  Using default i18n config (set ASTRO_I18N_CONFIG env var to customize)');
    }
} catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('⚠️  Failed to parse ASTRO_I18N_CONFIG, using defaults:', errorMessage);
}

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

    // @ts-ignore - Astro's type definitions don't properly handle dynamic fallback configurations
    i18n: i18nConfig,

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
            ASTRO_I18N_CONFIG: envField.string({
                context: 'server',
                access: 'public',
                optional: true,
                default: '',
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
