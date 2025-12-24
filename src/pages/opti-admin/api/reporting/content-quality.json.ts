// /src/pages/opti-admin/api/reporting/content-quality.json.ts
import type { APIRoute } from 'astro';
import {
  getOptimizelyGraphConfig,
  makeGraphQLRequest,
  createSuccessResponse,
  createErrorResponse,
  handleApiError
} from '../../../../../utils/optimizely-graph-utils';

export const GET: APIRoute = async () => {
  try {
    // GraphQL query to fetch content quality data
    const query = `
      query GetContentQualityData {
        _Page(
          limit: 100
          orderBy: {
            _metadata: {
              lastModified: DESC
            }
          }
          where: {
            _metadata: {
              status: {
                in: ["Published", ""]
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
              lastModified
              locale
              types
              status
              url {
                default
              }
            }

            ... on ArticlePage {
              Heading
              SubHeading
              Body {
                html
              }
              Author
              AuthorEmail
              PromoImage {
                item {
                  ... on ImageMedia {
                    AltText
                  }
                }
              }
              SeoSettings {
                MetaTitle
                MetaDescription
                SharingImage {
                  item {
                    ... on _IContent {
                      _metadata {
                        key
                      }
                    }
                  }
                }
                Indexing
                GraphType
              }
            }

            ... on LandingPage {
              TopContentArea {
                ... on _IContent {
                  _metadata {
                    key
                  }
                }
              }
              MainContentArea {
                ... on _IContent {
                  _metadata {
                    key
                  }
                }
              }
              SeoSettings {
                MetaTitle
                MetaDescription
                SharingImage {
                  item {
                    ... on _IContent {
                      _metadata {
                        key
                      }
                    }
                  }
                }
                Indexing
                GraphType
              }
            }

            ... on FolderPage {
              FolderDescription
            }
          }
        }
      }
    `;

    // Server-side authentication
    const config = getOptimizelyGraphConfig();
    const response = await makeGraphQLRequest(config, query);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(
        `GraphQL query failed: ${response.status} - ${errorText}`,
        response.status
      );
    }

    const result = await response.json();

    if (result.errors) {
      return createErrorResponse(
        `GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`,
        500
      );
    }

    const items = result.data?._Page?.items || [];

    // Return raw data - let client handle transformation and scoring
    return createSuccessResponse({
      pages: items,
      total: items.length
    });

  } catch (error) {
    return handleApiError(error);
  }
};
