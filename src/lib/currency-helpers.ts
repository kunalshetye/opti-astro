import { normalizeLocale } from './locale-helpers';

/**
 * Mapping of locales to currency codes
 * Uses ISO 4217 currency codes
 */
const LOCALE_CURRENCY_MAP: Record<string, string> = {
    'en': 'USD',
    'en-gb': 'GBP',
    'en-nz': 'NZD',
    'en-za': 'ZAR',
    'de': 'EUR',
    'de-at': 'EUR',
    'fr': 'EUR',
    'fr-ca': 'CAD',
    'nl': 'EUR',
    'nl-be': 'EUR',
    'es': 'EUR',
    'it': 'EUR',
    'sv': 'SEK',
    'no': 'NOK',
    'da': 'DKK',
    'pt-br': 'BRL',
    'zh': 'CNY',
    'zh-hans-hk': 'HKD',
    'ar': 'SAR',
    'hi': 'INR',
    'sw': 'KES',
    'fi': 'EUR'
};

/**
 * Get the currency code for a given locale
 * @param locale - Locale string in either GraphQL format (e.g., 'en', 'fr_CA') or Astro format (e.g., 'en', 'fr-ca')
 * @returns Currency code (e.g., 'USD', 'EUR')
 */
export function getCurrencyForLocale(locale: string): string {
    // Normalize locale to Astro format (lowercase with hyphens)
    const normalizedLocale = locale.includes('_')
        ? normalizeLocale(locale)
        : locale.toLowerCase();

    return LOCALE_CURRENCY_MAP[normalizedLocale] || 'USD';
}

/**
 * Format a numeric amount as currency based on locale
 * @param amount - Numeric amount to format
 * @param locale - Locale string in either GraphQL format (e.g., 'en', 'fr_CA') or Astro format (e.g., 'en', 'fr-ca')
 * @param currency - Optional currency code override (defaults to locale-based currency)
 * @returns Formatted currency string (e.g., "$99.99", "99,99 €")
 */
export function formatCurrency(
    amount: number,
    locale: string,
    currency?: string
): string {
    // Normalize locale to Astro format (lowercase with hyphens)
    const normalizedLocale = locale.includes('_')
        ? normalizeLocale(locale)
        : locale.toLowerCase();

    // Get currency code (use override if provided, otherwise get from locale)
    const currencyCode = currency || getCurrencyForLocale(normalizedLocale);

    try {
        return new Intl.NumberFormat(normalizedLocale, {
            style: 'currency',
            currency: currencyCode
        }).format(amount);
    } catch (error) {
        // Fallback to USD if locale or currency is invalid
        console.warn(`Currency formatting failed for locale "${normalizedLocale}" and currency "${currencyCode}". Falling back to USD.`, error);
        return new Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
}
