// /src/pages/opti-admin/api/reporting/user-performance.json.ts
import type { APIRoute } from 'astro';
import {
  getOptimizelyGraphConfig,
  makeGraphQLRequest,
  createSuccessResponse,
  createErrorResponse,
  handleApiError
} from '../../../../../utils/optimizely-graph-utils';

// Helper function to extract owner from content key
function extractOwner(key: string): string {
  const parts = key.split('_');
  return parts.length > 1 ? parts[1] : 'Unknown';
}

// Helper function to extract ContentID from _id
function extractContentId(id: string): string {
  // The _id format is: GUID_locale_status_variation (e.g., "fb3fadfa-c111-4da5-9178-a6688344fa6a_88_en_Draft_VariationNEW2")
  // Extract just the GUID portion (first 36 characters for standard GUID format)
  // Standard GUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 chars with hyphens)
  const guidMatch = id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (guidMatch) {
    return guidMatch[0];
  }
  // Fallback: if not a GUID format, return as-is
  return id;
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const timeRangeDays = parseInt(url.searchParams.get('timeRangeDays') || '30');

    // Calculate date filter based on time range
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - timeRangeDays);
    const dateFilter = dateThreshold.toISOString();

    // GraphQL query to fetch published pages with variations
    const pageQuery = `
      query GetUserPerformance {
        _Page(
          limit: 100
          variation: { include: ALL }
          orderBy: {
            _metadata: {
              lastModified: DESC
            }
          }
          where: {
            _metadata: {
              lastModified: {
                gte: "${dateFilter}"
              }
            }
          }
        ) {
          total
          items {
            _id
            _metadata {
              displayName
              published
              created
              lastModified
              locale
              types
              status
              key
              version
              variation
              url {
                default
                base
              }
              ... on InstanceMetadata {
                createdBy
                lastModifiedBy
              }
            }
            ... on ArticlePage {
              Author
            }
          }
        }
      }
    `;

    // GraphQL query to fetch published experiences with variations
    const experienceQuery = `
      query GetUserPerformanceExperiences {
        _Experience(
          limit: 100
          variation: { include: ALL }
          orderBy: {
            _metadata: {
              lastModified: DESC
            }
          }
          where: {
            _metadata: {
              lastModified: {
                gte: "${dateFilter}"
              }
            }
          }
        ) {
          total
          items {
            _id
            _metadata {
              displayName
              published
              created
              lastModified
              locale
              types
              status
              key
              version
              variation
              url {
                default
                base
              }
              ... on InstanceMetadata {
                createdBy
                lastModifiedBy
              }
            }
          }
        }
      }
    `;

    // Server-side authentication
    const config = getOptimizelyGraphConfig();

    // Execute both queries concurrently
    const [pageResponse, experienceResponse] = await Promise.all([
      makeGraphQLRequest(config, pageQuery),
      makeGraphQLRequest(config, experienceQuery)
    ]);

    // Handle errors for both responses
    if (!pageResponse.ok) {
      const errorText = await pageResponse.text();
      return createErrorResponse(
        `Page query failed: ${pageResponse.status} - ${errorText}`,
        pageResponse.status
      );
    }

    if (!experienceResponse.ok) {
      const errorText = await experienceResponse.text();
      return createErrorResponse(
        `Experience query failed: ${experienceResponse.status} - ${errorText}`,
        experienceResponse.status
      );
    }

    const pageResult = await pageResponse.json();
    const experienceResult = await experienceResponse.json();

    // Check for GraphQL errors
    if (pageResult.errors) {
      return createErrorResponse(
        `Page GraphQL errors: ${pageResult.errors.map((e: any) => e.message).join(', ')}`,
        500
      );
    }

    if (experienceResult.errors) {
      return createErrorResponse(
        `Experience GraphQL errors: ${experienceResult.errors.map((e: any) => e.message).join(', ')}`,
        500
      );
    }

    // Get items from both queries
    const pageItems = pageResult.data?._Page?.items || [];
    const experienceItems = experienceResult.data?._Experience?.items || [];

    // Combine both arrays
    const items = [...pageItems, ...experienceItems];

    console.log(`Fetched ${pageItems.length} pages and ${experienceItems.length} experiences (grouping by contentId + locale)`);

    // Filter to only include Pages and Experiences (exclude Blocks)
    const filteredItems = items.filter((item: any) => {
      const types = item._metadata?.types || [];

      // Exclude Blocks
      const isBlock = types.some((type: string) =>
        type.includes('_Block') || type.includes('Block') || type.includes('ShareableContent')
      );
      return !isBlock;
    });

    // Transform data with variation support
    const transformedPages = filteredItems.map((item: any) => {
      const contentId = extractContentId(item._id);
      const variationId = item._metadata?.variation;

      return {
        id: item._id,
        contentId: contentId,
        variationId: variationId || null,
        fullId: variationId ? `${contentId}_${variationId}` : contentId,
        title: item._metadata?.displayName || 'Untitled',
        url: item._metadata?.url?.default || '',
        published: item._metadata?.published || '',
        created: item._metadata?.created || '',
        lastModified: item._metadata?.lastModified || '',
        owner: item.Author || extractOwner(item._metadata?.key || ''),
        locale: item._metadata?.locale || '',
        status: item._metadata?.status || '',
        baseUrl: item._metadata?.url?.base || '',
        contentType: item._metadata?.types || [],
        version: item._metadata?.version || null,
        isVariation: !!variationId,
        createdBy: item._metadata?.createdBy || null,
        lastModifiedBy: item._metadata?.lastModifiedBy || null
      };
    });

    // Group pages by contentId + locale to create parent-child relationships
    // This ensures different locale versions are NOT grouped together
    const groupedPages = new Map<string, any>();

    transformedPages.forEach(page => {
      // Create unique key combining contentId and locale
      const groupingKey = `${page.contentId}_${page.locale}`;

      if (!page.isVariation) {
        // This is the original - make it a parent
        groupedPages.set(groupingKey, {
          ...page,
          variations: []
        });
      } else {
        // This is a variation - add to parent with same contentId AND locale
        const parent = groupedPages.get(groupingKey);
        if (parent && parent.locale === page.locale) {
          parent.variations.push(page);
        } else {
          // Parent not found - create placeholder
          groupedPages.set(groupingKey, {
            id: page.contentId,
            contentId: page.contentId,
            variationId: null,
            fullId: page.contentId,
            title: page.title + ' (Original - not found)',
            url: page.url,
            published: page.published,
            created: page.created,
            lastModified: page.lastModified,
            owner: page.owner,
            locale: page.locale,
            status: 'Unknown',
            baseUrl: page.baseUrl,
            contentType: page.contentType,
            version: null,
            isVariation: false,
            createdBy: page.createdBy,
            lastModifiedBy: page.lastModifiedBy,
            variations: [page]
          });
        }
      }
    });

    // Return grouped data
    return createSuccessResponse({
      pages: Array.from(groupedPages.values()),
      total: groupedPages.size
    });

  } catch (error) {
    return handleApiError(error);
  }
};
