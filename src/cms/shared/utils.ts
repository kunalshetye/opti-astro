
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