
import { getOptimizelySdk } from '../../graphql/getSdk';
import type { ContentPayload } from '../../graphql/shared/ContentPayload';
import { EXTERNAL_PREVIEW_TOKEN } from 'astro:env/server';
import crypto from 'crypto';

// Check if the current request is in CMS edit mode
// NOTE: DO NOT rely on the `ctx` query parameter (or this function) for security purposes, as it may be easily spoofed.
export function isEditContext(requestUrl: URL): boolean {
    const isEditContext = requestUrl?.searchParams?.get('ctx') === 'edit';

    return isEditContext;
}

// Check if the current request is in CMS preview mode
// NOTE: DO NOT rely on the `ctx` query parameter (or this function) for security purposes, as it may be easily spoofed.
export function isPreviewContext(requestUrl: URL): boolean {
    const isPreviewContext = requestUrl?.searchParams?.get('ctx') === 'preview';

    return isPreviewContext;
}

// Check if the current requested content version is DRAFT content
export async function isDraftContent(contentVersion: string): Promise<boolean> {

    // Create content payload for GraphQL request
    const contentPayload: ContentPayload = {
        ctx: 'ext_preview', // Use 'ext_preview' to ensure all statuses are returned via Graph query
        key: '',
        ver: contentVersion,
        loc: '',
        preview_token: '',
        types: [],
    };
    
    const contentPublishStatus = await getOptimizelySdk(
        contentPayload
    ).contentPublishStatusByVer({
        ver: contentVersion,
    });

    const contentStatus = contentPublishStatus?._Content?.item?._metadata?.status || '';
    const isDraftContent = contentStatus.toLowerCase() === 'draft';

    return isDraftContent;
}

// Check if the current requested content version has external preview enabled
export async function isExternalPreviewEnabled(contentVersion: string): Promise<boolean> {
    // Create content payload for GraphQL request
    const contentPayload: ContentPayload = {
        ctx: 'ext_preview', // Use 'ext_preview' to ensure all statuses are returned via Graph query
        key: '',
        ver: contentVersion,
        loc: '',
        preview_token: '',
        types: [],
    };
    
    const contentPublishStatus = await getOptimizelySdk(
        contentPayload
    ).extPreviewStatusByVer({
        ver: contentVersion,
    });

    const types = contentPublishStatus?._Content?.item?._metadata?.types || [];
    let isExtPreviewEnabled = false;
    if (types.includes('_Page')) {
        //@ts-ignore
        isExtPreviewEnabled = contentPublishStatus?._Content?.item?.PageAdminSettings?.EnableExternalPreview || false;
    }

    return isExtPreviewEnabled;
}

// Generate external preview token
export function generateExtPreviewToken(contentKey: string, contentVersion: string): string {
    const token = crypto
        .createHash('sha256')
        .update(`${EXTERNAL_PREVIEW_TOKEN}:${contentKey}:${contentVersion}`)
        .digest('hex')
        .substring(0, 16);

    return token;
}

// Validate external preview token
export function isValidExtPreviewToken(contentKey: string, contentVersion: string, token: string): boolean {
    const expectedToken = crypto
        .createHash('sha256')
        .update(`${EXTERNAL_PREVIEW_TOKEN}:${contentKey}:${contentVersion}`)
        .digest('hex')
        .substring(0, 16);

    return token === expectedToken;
}

// Build correct link for component
interface ButtonLinkUrl {
    hierarchical?: string;
    default?: string;
    type?: 'EXTERNAL' | 'SIMPLE' | 'HIERARCHICAL' | string;
    base?: string;
}
export interface ButtonLinkData {
    url?: ButtonLinkUrl;
}

export function getLink(buttonLinkData: ButtonLinkData | null | undefined, currentDomain: string): string {
    let buttonLink = buttonLinkData?.url?.hierarchical || buttonLinkData?.url?.default || '#';
    const buttonLinkType = buttonLinkData?.url?.type || 'HIERARCHICAL';
    const linkDomain = buttonLinkData?.url?.base || '';
    const isSameDomain = currentDomain === linkDomain;

    if (buttonLinkType === 'EXTERNAL') {
        buttonLink = buttonLinkData?.url?.default || '#';
    } else if (buttonLinkType === 'SIMPLE') {
        if (isSameDomain) {
            buttonLink = buttonLinkData?.url?.hierarchical || '#';
        } else {
            buttonLink = linkDomain + buttonLinkData?.url?.hierarchical || '#';
        }
    } else {
        if (isSameDomain) {
            buttonLink = buttonLinkData?.url?.hierarchical || '#';
        } else {
            if (buttonLinkData?.url?.default?.startsWith('http')) {
                buttonLink = buttonLinkData?.url?.default || '#';
            } else {
                buttonLink = linkDomain + buttonLinkData?.url?.hierarchical || '#';
            }
        }
    }

    return buttonLink;
}