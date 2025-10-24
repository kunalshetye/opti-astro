/**
 * Helper functions for formatting and extracting data from search results
 */

/**
 * Format a date string according to locale
 */
export function formatDate(dateString: string, locale: string = 'en'): string {
	const date = new Date(dateString);
	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * Truncate HTML content to a specified length
 */
export function getExcerpt(html: string, maxLength: number = 200): string {
	const text = html?.replace(/<[^>]*>/g, '') || '';
	return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * Get the title for any content type (ArticlePage or Experience)
 */
export function getTitle(result: any): string {
	if (result.__contentType === 'Experience') {
		// Try SEO MetaTitle first, then displayName
		return result.BlankExperienceSeoSettings?.MetaTitle || result._metadata?.displayName || 'Untitled';
	}
	// ArticlePage
	return result.Heading || result._metadata?.displayName || 'Untitled';
}

/**
 * Get the excerpt/description for any content type (ArticlePage or Experience)
 */
export function getContentExcerpt(result: any): string {
	if (result.__contentType === 'Experience') {
		// Try SEO MetaDescription first, then _fulltext
		if (result.BlankExperienceSeoSettings?.MetaDescription) {
			return result.BlankExperienceSeoSettings.MetaDescription;
		}
		// Use _fulltext as fallback (it's an array, join and truncate)
		const fulltext = Array.isArray(result._fulltext) ? result._fulltext.join(' ') : (result._fulltext || '');
		return getExcerpt(fulltext, 200);
	}
	// ArticlePage
	return result.Body?.html ? getExcerpt(result.Body.html) : '';
}

/**
 * Check if a result is an Experience content type
 */
export function isExperience(result: any): boolean {
	return result.__contentType === 'Experience';
}
