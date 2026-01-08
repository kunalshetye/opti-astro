// /src/pages/opti-admin/api/reporting/localization-coverage.json.ts
import type { APIRoute } from 'astro';
import {
  getOptimizelyGraphConfig,
  makeGraphQLRequest,
  createSuccessResponse,
  createErrorResponse,
  handleApiError
} from '../../../../../utils/optimizely-graph-utils';
import { defaultI18nConfig } from '../../../../config/i18n.config';

// Helper function to extract content type from types array
function extractContentType(types: string[]): string {
  const contentType = types.find(t =>
    t.includes('Page') || t.includes('Experience')
  );
  return contentType || types[0] || 'Unknown';
}

// Helper function to extract ContentID from _id
function extractContentId(id: string): string {
  const guidMatch = id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (guidMatch) {
    return guidMatch[0];
  }
  return id;
}

// Convert GraphQL locale format (en_GB) to i18n format (en-gb)
function graphqlToI18nLocale(graphqlLocale: string): string {
  return graphqlLocale.toLowerCase().replace(/_/g, '-');
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const statusFilter = url.searchParams.get('status') || 'Published';

    console.log('[Localization Coverage API] Status filter:', statusFilter);

    // Build queries based on status filter
    let pageQuery: string;
    let experienceQuery: string;

    if (statusFilter === 'All') {
      // Query without status filter
      pageQuery = `
        query GetPages {
          _Page(
            limit: 100
            variation: { include: ALL }
          ) {
            total
            items {
              _id
              _metadata {
                displayName
                key
                locale
                status
                types
                published
                lastModified
                url {
                  default
                  base
                }
              }
            }
          }
        }
      `;

      experienceQuery = `
        query GetExperiences {
          _Experience(
            limit: 100
            variation: { include: ALL }
          ) {
            total
            items {
              _id
              _metadata {
                displayName
                key
                locale
                status
                types
                published
                lastModified
                url {
                  default
                  base
                }
              }
            }
          }
        }
      `;
    } else {
      // Query with status filter
      pageQuery = `
        query GetPages {
          _Page(
            limit: 100
            variation: { include: ALL }
            where: {
              _metadata: {
                status: { eq: "${statusFilter}" }
              }
            }
          ) {
            total
            items {
              _id
              _metadata {
                displayName
                key
                locale
                status
                types
                published
                lastModified
                url {
                  default
                  base
                }
              }
            }
          }
        }
      `;

      experienceQuery = `
        query GetExperiences {
          _Experience(
            limit: 100
            variation: { include: ALL }
            where: {
              _metadata: {
                status: { eq: "${statusFilter}" }
              }
            }
          ) {
            total
            items {
              _id
              _metadata {
                displayName
                key
                locale
                status
                types
                published
                lastModified
                url {
                  default
                  base
                }
              }
            }
          }
        }
      `;
    }

    // Server-side authentication
    const config = getOptimizelyGraphConfig();

    console.log('[Localization Coverage API] Executing GraphQL queries...');

    // Execute both queries concurrently
    const [pageResponse, experienceResponse] = await Promise.all([
      makeGraphQLRequest(config, pageQuery),
      makeGraphQLRequest(config, experienceQuery)
    ]);

    // Handle errors for both responses
    if (!pageResponse.ok) {
      const errorText = await pageResponse.text();
      console.error('[Localization Coverage API] Page response not OK:', pageResponse.status, errorText);
      return createErrorResponse(
        `Page query failed: ${pageResponse.status} - ${errorText}`,
        pageResponse.status
      );
    }

    if (!experienceResponse.ok) {
      const errorText = await experienceResponse.text();
      console.error('[Localization Coverage API] Experience response not OK:', experienceResponse.status, errorText);
      return createErrorResponse(
        `Experience query failed: ${experienceResponse.status} - ${errorText}`,
        experienceResponse.status
      );
    }

    console.log('[Localization Coverage API] GraphQL responses OK, parsing JSON...');

    const pageResult = await pageResponse.json();
    const experienceResult = await experienceResponse.json();

    // Check for GraphQL errors
    if (pageResult.errors) {
      console.error('[Localization Coverage API] Page GraphQL errors:', pageResult.errors);
      return createErrorResponse(
        `Page GraphQL errors: ${pageResult.errors.map((e: any) => e.message).join(', ')}`,
        500
      );
    }

    if (experienceResult.errors) {
      console.error('[Localization Coverage API] Experience GraphQL errors:', experienceResult.errors);
      return createErrorResponse(
        `Experience GraphQL errors: ${experienceResult.errors.map((e: any) => e.message).join(', ')}`,
        500
      );
    }

    console.log('[Localization Coverage API] No GraphQL errors, processing data...');

    // Get items from both queries
    const pageItems = pageResult.data?._Page?.items || [];
    const experienceItems = experienceResult.data?._Experience?.items || [];

    // Combine both arrays
    const allItems = [...pageItems, ...experienceItems];

    // Filter to exclude Blocks and ShareableContent
    const items = allItems.filter((item: any) => {
      const types = item._metadata?.types || [];
      const isBlock = types.some((type: string) =>
        type.includes('_Block') || type.includes('Block') || type.includes('ShareableContent')
      );
      return !isBlock;
    });

    console.log(`Fetched ${items.length} total items for localization analysis`);

    // Get locale configuration
    const defaultLocale = defaultI18nConfig.defaultLocale; // 'en'

    // Extract unique locales from actual content (not from config)
    const localesInContent = new Set<string>();
    items.forEach((item: any) => {
      if (item._metadata.locale) {
        const locale = graphqlToI18nLocale(item._metadata.locale);
        localesInContent.add(locale);
      }
    });
    const allLocales = Array.from(localesInContent).sort();

    console.log(`Found ${allLocales.length} unique locales in content:`, allLocales);

    // Group content by key
    interface ContentTranslation {
      key: string;
      defaultLocaleContent: {
        id: string;
        title: string;
        url: string;
        contentType: string;
        published: string;
        lastModified: string;
      } | null;
      translations: Map<string, {
        id: string;
        title: string;
        url: string;
        published: string;
        lastModified: string;
      }>;
      missingLocales: string[];
      translationCompleteness: number;
      contentType: string;
    }

    const contentByKey = new Map<string, ContentTranslation>();

    items.forEach((item: any) => {
      const key = item._metadata.key;
      const graphqlLocale = item._metadata.locale; // e.g., 'en_GB'
      const locale = graphqlToI18nLocale(graphqlLocale); // e.g., 'en-gb'
      const contentType = extractContentType(item._metadata.types);

      if (!contentByKey.has(key)) {
        contentByKey.set(key, {
          key,
          defaultLocaleContent: null,
          translations: new Map(),
          missingLocales: [],
          translationCompleteness: 0,
          contentType
        });
      }

      const content = contentByKey.get(key)!;

      if (locale === defaultLocale) {
        content.defaultLocaleContent = {
          id: item._id,
          title: item._metadata.displayName,
          url: item._metadata.url?.default || '',
          contentType,
          published: item._metadata.published || '',
          lastModified: item._metadata.lastModified || ''
        };
      }

      content.translations.set(locale, {
        id: item._id,
        title: item._metadata.displayName,
        url: item._metadata.url?.default || '',
        published: item._metadata.published || '',
        lastModified: item._metadata.lastModified || ''
      });
    });

    // Filter to only include content that exists in default locale
    const contentInDefaultLocale = Array.from(contentByKey.values()).filter(
      content => content.defaultLocaleContent !== null
    );

    // Calculate completeness for each content item
    contentInDefaultLocale.forEach(content => {
      content.missingLocales = allLocales.filter(
        locale => !content.translations.has(locale)
      );

      const totalLocales = allLocales.length;
      const translatedLocales = allLocales.filter(
        locale => content.translations.has(locale)
      ).length;

      content.translationCompleteness = (translatedLocales / totalLocales) * 100;
    });

    // Calculate locale-level metrics
    interface LocaleMetrics {
      locale: string;
      totalContentInDefault: number;
      translatedContent: number;
      missingContent: number;
      completenessPercentage: number;
    }

    const localeMetrics = new Map<string, LocaleMetrics>();

    allLocales.forEach(locale => {
      localeMetrics.set(locale, {
        locale,
        totalContentInDefault: contentInDefaultLocale.length,
        translatedContent: 0,
        missingContent: 0,
        completenessPercentage: 0
      });
    });

    contentInDefaultLocale.forEach(content => {
      allLocales.forEach(locale => {
        const metrics = localeMetrics.get(locale)!;

        if (content.translations.has(locale)) {
          metrics.translatedContent++;
        } else {
          metrics.missingContent++;
        }
      });
    });

    // Calculate completeness percentages
    localeMetrics.forEach(metrics => {
      if (metrics.locale === defaultLocale) {
        metrics.completenessPercentage = 100;
      } else {
        metrics.completenessPercentage =
          contentInDefaultLocale.length > 0
            ? (metrics.translatedContent / contentInDefaultLocale.length) * 100
            : 0;
      }
    });

    // Aggregate missing translations by content type
    const missingByContentTypeMap = new Map<string, number>();

    contentInDefaultLocale.forEach(content => {
      if (content.missingLocales.length > 0) {
        const currentCount = missingByContentTypeMap.get(content.contentType) || 0;
        missingByContentTypeMap.set(
          content.contentType,
          currentCount + content.missingLocales.length
        );
      }
    });

    const missingByContentType = Array.from(missingByContentTypeMap.entries()).map(
      ([contentType, missingCount]) => ({ contentType, missingCount })
    );

    // Generate time series data for publications by locale
    const timeRangeDays = 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRangeDays);

    interface TimeSeriesData {
      locale: string;
      dataPoints: Array<{
        date: string;
        publicationCount: number;
      }>;
    }

    const localeTimeSeries = new Map<string, Map<string, number>>();

    allLocales.forEach(locale => {
      localeTimeSeries.set(locale, new Map());
    });

    contentInDefaultLocale.forEach(content => {
      content.translations.forEach((translation, locale) => {
        if (translation.published) {
          const pubDate = new Date(translation.published);
          if (pubDate >= cutoffDate) {
            const dateKey = pubDate.toISOString().split('T')[0];
            const localeData = localeTimeSeries.get(locale)!;
            localeData.set(dateKey, (localeData.get(dateKey) || 0) + 1);
          }
        }
      });
    });

    const timeSeriesData: TimeSeriesData[] = Array.from(localeTimeSeries.entries()).map(
      ([locale, dateMap]) => ({
        locale,
        dataPoints: Array.from(dateMap.entries())
          .map(([date, count]) => ({ date, publicationCount: count }))
          .sort((a, b) => a.date.localeCompare(b.date))
      })
    );

    // Calculate summary metrics
    const totalMissingTranslations = contentInDefaultLocale.reduce(
      (sum, content) => sum + content.missingLocales.length,
      0
    );

    const localeMetricsArray = Array.from(localeMetrics.values());
    const averageCompleteness = localeMetricsArray.length > 0
      ? localeMetricsArray.reduce((sum, m) => sum + m.completenessPercentage, 0) / localeMetricsArray.length
      : 0;

    // Convert contentInDefaultLocale to serializable format (Map -> Object)
    console.log('[Localization Coverage API] Converting to serializable format...');
    const contentTranslationsSerializable = contentInDefaultLocale.map(content => ({
      key: content.key,
      defaultLocaleContent: content.defaultLocaleContent,
      translations: Object.fromEntries(content.translations),
      missingLocales: content.missingLocales,
      translationCompleteness: content.translationCompleteness,
      contentType: content.contentType
    }));

    console.log('[Localization Coverage API] Data processed successfully. Returning response...');
    console.log('[Localization Coverage API] Summary:', {
      defaultLocale,
      totalContentInDefault: contentInDefaultLocale.length,
      totalLocales: allLocales.length,
      averageCompleteness,
      totalMissingTranslations
    });

    // Return response
    return createSuccessResponse({
      summary: {
        defaultLocale,
        totalContentInDefault: contentInDefaultLocale.length,
        totalLocales: allLocales.length,
        averageCompleteness,
        totalMissingTranslations
      },
      localeMetrics: localeMetricsArray,
      contentTranslations: contentTranslationsSerializable,
      missingByContentType,
      timeSeriesData
    });

  } catch (error) {
    console.error('[Localization Coverage API] Error:', error);
    return handleApiError(error);
  }
};
