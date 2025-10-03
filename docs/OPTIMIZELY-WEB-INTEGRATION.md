### NOTE: docs in progress, will be updated later

Leverage Optimizely Web to test content variations created in the CMS, via the following [Template](https://docs.developers.optimizely.com/web-experimentation/docs/templates).

Note: ensure your Optimizely Web project snippet is added to your site, via the Site Settings component.

### Template Code

```
{
    "plugin_type": "widget",
    "name": "SaaS CMS Variations DI",
    "edit_page_url": "https://variations-di.netlify.app/variations",
    "form_schema": [
        {
            "name": "variationName",
            "label": "Variation Name",
            "default_value": "",
            "field_type": "text",
            "options": null
        }
    ],
    "description": "",
    "options": {
        "html": "",
        "css": "",
        "apply_js": "(function() {\n    const customString = extension.variationName;\n    \n    let pathSegment = window.location.pathname;\n    if (pathSegment === '/') {\n        pathSegment = 'homepage';\n    } else {\n        pathSegment = pathSegment.replace(/^\\//, '').replace(/[\\/|-]/g, '_');\n    }\n    \n    const cookieName = `cmsvariation_${pathSegment}`;\n    \n    let path = window.location.pathname;\n    if (path.length > 1 && path.endsWith('/')) {\n        path = path.slice(0, -1);\n    }\n    const domain = window.location.hostname;\n\n    function getCookie(name) {\n        const value = `; ${document.cookie}`;\n        const parts = value.split(`; ${name}=`);\n        if (parts.length === 2) {\n            return parts.pop().split(';').shift();\n        }\n        return null;\n    }\n\n    const variationFromCookie = getCookie(cookieName);\n\n    if (!variationFromCookie) {\n        const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();\n        document.cookie = `${cookieName}=${customString}; path=${path}; expires=${expires}; domain=${domain}; SameSite=Lax`;\n        \n        window.location.reload();\n    } else {\n        console.log(`User is in variation: ${variationFromCookie}`);\n        \n    }\n})();",
        "undo_js": "(function() {\n    let pathSegment = window.location.pathname;\n    if (pathSegment === '/') {\n        pathSegment = 'homepage';\n    } else {\n        pathSegment = pathSegment.replace(/^\\//, '').replace(/[\\/|-]/g, '_');\n    }\n    \n    const cookieName = `cmsvariation_${pathSegment}`;\n    \n    let path = window.location.pathname;\n    if (path.length > 1 && path.endsWith('/')) {\n        path = path.slice(0, -1);\n    }\n    const domain = window.location.hostname;\n    document.cookie = `${cookieName}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; SameSite=Lax`;\n})();"
    }
}
```
