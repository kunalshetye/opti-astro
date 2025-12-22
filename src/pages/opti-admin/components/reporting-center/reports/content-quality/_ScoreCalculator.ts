/**
 * Content Quality Score Calculator
 *
 * Pure utility functions for calculating content quality scores (0-100)
 * based on SEO completeness, content quality, accessibility, freshness, and publication status.
 */

export interface PageQualityData {
  id: string;
  title: string;
  url: string;
  locale: string;
  status: string;
  published: string | null;
  lastModified: string;
  pageType: string;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
    sharingImage: boolean;
    indexingConfigured: boolean;
  };
  content: {
    heading?: string | null;
    body?: string | null;
    bodyLength?: number;
    author?: string | null;
    promoImageAltText?: string | null;
    hasPromoImage?: boolean;
    topContentAreaCount?: number;
    mainContentAreaCount?: number;
  };
  daysSinceUpdate: number;
}

export interface QualityScoreBreakdown {
  seo: number; // out of 40
  content: number; // out of 30
  accessibility: number; // out of 10
  freshness: number; // out of 10
  publication: number; // out of 10
  total: number; // out of 100
  category: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface PageQualityMetrics {
  page: PageQualityData;
  score: QualityScoreBreakdown;
}

/**
 * Strips HTML tags from a string
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtmlTags(html: string | null | undefined): string {
  if (!html) return '';

  // Remove HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, '');

  // Decode HTML entities (basic ones)
  const withoutEntities = withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return withoutEntities.trim();
}

/**
 * Calculates SEO score (max 40 points)
 *
 * Scoring:
 * - Meta Title Present: 10 pts
 * - Meta Title Length Optimal (40-60 chars): 5 pts
 * - Meta Description Present: 10 pts
 * - Meta Description Length Optimal (120-160 chars): 5 pts
 * - Sharing Image Present: 5 pts
 * - Indexing Configured: 5 pts
 */
export function calculateSEOScore(page: PageQualityData): number {
  let score = 0;

  // Meta Title checks
  if (page.seo.metaTitle && page.seo.metaTitle.trim() !== '') {
    score += 10; // Title present

    const titleLength = page.seo.metaTitle.length;
    if (titleLength >= 40 && titleLength <= 60) {
      score += 5; // Optimal length
    }
  }

  // Meta Description checks
  if (page.seo.metaDescription && page.seo.metaDescription.trim() !== '') {
    score += 10; // Description present

    const descLength = page.seo.metaDescription.length;
    if (descLength >= 120 && descLength <= 160) {
      score += 5; // Optimal length
    }
  }

  // Sharing Image
  if (page.seo.sharingImage) {
    score += 5;
  }

  // Indexing configured (explicitly set to true or false, not null)
  if (page.seo.indexingConfigured) {
    score += 5;
  }

  return score;
}

/**
 * Calculates Content Completeness score (max 30 points)
 * Scoring varies by page type
 */
export function calculateContentScore(page: PageQualityData): number {
  let score = 0;

  if (page.pageType === 'ArticlePage') {
    // Heading Present
    if (page.content.heading && page.content.heading.trim() !== '') {
      score += 8;
    }

    // Body Content Present
    if (page.content.body && page.content.body.trim() !== '') {
      score += 12;

      // Body Content Substantial (> 300 chars excluding HTML)
      const plainText = stripHtmlTags(page.content.body);
      if (plainText.length > 300) {
        score += 5;
      }
    }

    // Author Assigned
    if (page.content.author && page.content.author.trim() !== '') {
      score += 5;
    }
  }
  else if (page.pageType === 'LandingPage') {
    // TopContentArea has items
    if ((page.content.topContentAreaCount ?? 0) >= 1) {
      score += 10;
    }

    // MainContentArea has items
    if ((page.content.mainContentAreaCount ?? 0) >= 1) {
      score += 15;
    }

    // Multiple components (>= 3 total)
    const totalComponents = (page.content.topContentAreaCount ?? 0) + (page.content.mainContentAreaCount ?? 0);
    if (totalComponents >= 3) {
      score += 5;
    }
  }
  else {
    // FolderPage, MockupPage, or other
    // Basic scoring based on displayName
    if (page.title && page.title.trim() !== '' && page.title.length > 5) {
      score += 30; // Meaningful displayName
    } else if (page.title && page.title.trim() !== '') {
      score += 15; // Has displayName but minimal
    }
  }

  return score;
}

/**
 * Calculates Accessibility score (max 10 points)
 *
 * Scoring:
 * - PromoImage has AltText: 10 pts
 * - No PromoImage: 10 pts (N/A bonus)
 */
export function calculateAccessibilityScore(page: PageQualityData): number {
  // If page doesn't have PromoImage, award full points (N/A)
  if (!page.content.hasPromoImage) {
    return 10;
  }

  // If page has PromoImage, check for AltText
  if (page.content.promoImageAltText && page.content.promoImageAltText.trim() !== '') {
    return 10;
  }

  return 0;
}

/**
 * Calculates Freshness score (max 10 points)
 *
 * Scoring:
 * - Recently Updated (< 90 days): 10 pts
 * - Moderately Fresh (< 180 days): 7 pts
 * - Aging (< 365 days): 4 pts
 * - Stale (>= 365 days): 0 pts
 */
export function calculateFreshnessScore(page: PageQualityData): number {
  const days = page.daysSinceUpdate;

  if (days < 90) {
    return 10;
  } else if (days < 180) {
    return 7;
  } else if (days < 365) {
    return 4;
  } else {
    return 0;
  }
}

/**
 * Calculates Publication Status score (max 10 points)
 *
 * Scoring:
 * - Published: 10 pts
 * - Draft/Unpublished: 0 pts
 */
export function calculatePublicationScore(page: PageQualityData): number {
  return page.status === 'Published' ? 10 : 0;
}

/**
 * Gets score category based on total score
 */
export function getScoreCategory(score: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
  if (score >= 76) return 'Excellent';
  if (score >= 51) return 'Good';
  if (score >= 26) return 'Fair';
  return 'Poor';
}

/**
 * Calculates complete quality score breakdown for a page
 */
export function calculateQualityScore(page: PageQualityData): QualityScoreBreakdown {
  const seo = calculateSEOScore(page);
  const content = calculateContentScore(page);
  const accessibility = calculateAccessibilityScore(page);
  const freshness = calculateFreshnessScore(page);
  const publication = calculatePublicationScore(page);
  const total = seo + content + accessibility + freshness + publication;

  return {
    seo,
    content,
    accessibility,
    freshness,
    publication,
    total,
    category: getScoreCategory(total)
  };
}

/**
 * Identifies the most impactful missing criterion for a page
 * Returns a human-readable description of the top issue
 */
export function identifyTopIssue(breakdown: QualityScoreBreakdown, page: PageQualityData): string {
  const issues: Array<{ issue: string; impact: number }> = [];

  // SEO issues (max 40 points)
  if (!page.seo.metaTitle || page.seo.metaTitle.trim() === '') {
    issues.push({ issue: 'Missing Meta Title', impact: 10 });
  } else if (page.seo.metaTitle.length < 40 || page.seo.metaTitle.length > 60) {
    issues.push({ issue: 'Meta Title Length Not Optimal', impact: 5 });
  }

  if (!page.seo.metaDescription || page.seo.metaDescription.trim() === '') {
    issues.push({ issue: 'Missing Meta Description', impact: 10 });
  } else if (page.seo.metaDescription.length < 120 || page.seo.metaDescription.length > 160) {
    issues.push({ issue: 'Meta Description Length Not Optimal', impact: 5 });
  }

  if (!page.seo.sharingImage) {
    issues.push({ issue: 'Missing Sharing Image', impact: 5 });
  }

  if (!page.seo.indexingConfigured) {
    issues.push({ issue: 'Indexing Not Configured', impact: 5 });
  }

  // Content issues (max 30 points)
  if (page.pageType === 'ArticlePage') {
    if (!page.content.heading || page.content.heading.trim() === '') {
      issues.push({ issue: 'Missing Heading', impact: 8 });
    }

    if (!page.content.body || page.content.body.trim() === '') {
      issues.push({ issue: 'Missing Body Content', impact: 12 });
    } else {
      const plainText = stripHtmlTags(page.content.body);
      if (plainText.length <= 300) {
        issues.push({ issue: 'Body Content Too Short', impact: 5 });
      }
    }

    if (!page.content.author || page.content.author.trim() === '') {
      issues.push({ issue: 'Missing Author', impact: 5 });
    }
  } else if (page.pageType === 'LandingPage') {
    if ((page.content.topContentAreaCount ?? 0) === 0) {
      issues.push({ issue: 'TopContentArea Empty', impact: 10 });
    }

    if ((page.content.mainContentAreaCount ?? 0) === 0) {
      issues.push({ issue: 'MainContentArea Empty', impact: 15 });
    }

    const totalComponents = (page.content.topContentAreaCount ?? 0) + (page.content.mainContentAreaCount ?? 0);
    if (totalComponents < 3) {
      issues.push({ issue: 'Needs More Components', impact: 5 });
    }
  }

  // Accessibility issues (max 10 points)
  if (page.content.hasPromoImage && (!page.content.promoImageAltText || page.content.promoImageAltText.trim() === '')) {
    issues.push({ issue: 'PromoImage Missing Alt Text', impact: 10 });
  }

  // Freshness issues (max 10 points)
  if (page.daysSinceUpdate >= 365) {
    issues.push({ issue: 'Content Stale (>365 days)', impact: 10 });
  } else if (page.daysSinceUpdate >= 180) {
    issues.push({ issue: 'Content Aging (>180 days)', impact: 7 });
  } else if (page.daysSinceUpdate >= 90) {
    issues.push({ issue: 'Content Needs Update (>90 days)', impact: 3 });
  }

  // Publication issues (max 10 points)
  if (page.status !== 'Published') {
    issues.push({ issue: 'Not Published', impact: 10 });
  }

  // Sort by impact (descending) and return top issue
  issues.sort((a, b) => b.impact - a.impact);

  return issues.length > 0 ? issues[0].issue : 'No Issues';
}
