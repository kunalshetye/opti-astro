/**
 * i18n Configuration
 *
 * This file contains the internationalization configuration for the application.
 * It can be safely imported by both build-time code (astro.config.mjs) and
 * runtime code (SSR pages, middleware, etc.) without bundling Vite or other
 * build-time dependencies.
 */

export interface I18nConfig {
    locales: string[];
    defaultLocale: string;
    routing: {
        prefixDefaultLocale: boolean;
        fallbackType: 'rewrite' | 'redirect';
    };
    fallback: Record<string, string>;
}

/**
 * Default i18n configuration
 * This is the fallback if no environment variable override is provided
 */
export const defaultI18nConfig: I18nConfig = {
    locales: ['en', 'nl', 'nl-BE', 'sv', 'no', 'fr', 'fr-CA', 'es', 'it', 'ar', 'zh', 'zh-Hans-HK', 'de', 'de-AT'],
    defaultLocale: 'en',
    routing: {
        prefixDefaultLocale: false,
        fallbackType: 'rewrite',
    },
    fallback: {
        'nl-BE': 'nl',
        'fr-CA': 'fr',
        'zh-Hans-HK': 'zh',
        'de-AT': 'de',
        'nl': 'en',
        'sv': 'en',
        'no': 'en',
        'fr': 'en',
        'es': 'en',
        'it': 'en',
        'ar': 'en',
        'zh': 'en',
        'de': 'en',
    },
};

/**
 * Load i18n configuration from environment variable or use defaults
 * This function is safe to call at build time but NOT at runtime in serverless environments
 *
 * IMPORTANT: Only call this during build/config phase, not in SSR runtime!
 */
export function loadI18nConfig(): I18nConfig {
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

    return i18nConfig;
}

/**
 * Get the i18n configuration
 * This is the config that should be used at runtime
 * It returns the default config since environment variable overrides
 * only apply at build time
 */
export function getI18nConfig(): I18nConfig {
    return defaultI18nConfig;
}

/**
 * Astro config compatible format
 * This wraps the config in the shape Astro expects
 */
export function getAstroI18nConfig() {
    const config = getI18nConfig();
    return {
        i18n: config
    };
}
