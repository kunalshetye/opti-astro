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

/**
 * Get image URL from a search result
 * Returns the PromoImage URL for ArticlePage, SharingImage for Experience, or null if missing
 * Handles both Content Reference URLs (url.default) and DAM asset URLs (item.Url)
 */
export function getImageUrl(result: any): string | null {
	if (result.__contentType === 'Experience') {
		// Experience: get SharingImage from SEO settings
		// Try Content Reference URL first, then DAM asset URL
		return result.BlankExperienceSeoSettings?.SharingImage?.url?.default ||
		       result.BlankExperienceSeoSettings?.SharingImage?.item?.Url ||
		       null;
	}
	// ArticlePage: get PromoImage
	// Try Content Reference URL first, then DAM asset URL
	return result.PromoImage?.url?.default ||
	       result.PromoImage?.item?.Url ||
	       null;
}

/**
 * Get image alt text from a search result
 */
export function getImageAlt(result: any): string {
	if (result.__contentType === 'Experience') {
		// Experience: get alt text from SharingImage
		return result.BlankExperienceSeoSettings?.SharingImage?.item?.AltText ||
		       result.BlankExperienceSeoSettings?.SharingImage?.item?._metadata?.displayName ||
		       getTitle(result);
	}
	// ArticlePage: get alt text from PromoImage
	return result.PromoImage?.item?.AltText || result.PromoImage?.item?._metadata?.displayName || getTitle(result);
}

/**
 * Generate a deterministic gradient class based on content title
 * Returns consistent colors for the same title (for placeholders)
 */
export function getPlaceholderGradient(result: any): string {
	const title = getTitle(result);
	// Simple hash function to get a number from the title
	let hash = 0;
	for (let i = 0; i < title.length; i++) {
		hash = ((hash << 5) - hash) + title.charCodeAt(i);
		hash = hash & hash; // Convert to 32-bit integer
	}

	// Use hash to pick from predefined gradient combinations
	const gradients = [
		'bg-gradient-to-br from-primary/20 to-secondary/20',
		'bg-gradient-to-br from-accent/20 to-primary/20',
		'bg-gradient-to-br from-secondary/20 to-accent/20',
		'bg-gradient-to-br from-info/20 to-primary/20',
		'bg-gradient-to-br from-success/20 to-secondary/20',
		'bg-gradient-to-br from-primary/20 to-accent/20',
		'bg-gradient-to-br from-secondary/20 to-info/20',
		'bg-gradient-to-br from-accent/20 to-success/20',
	];

	const index = Math.abs(hash) % gradients.length;
	return gradients[index];
}
