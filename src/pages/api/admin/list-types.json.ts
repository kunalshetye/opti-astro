import type { APIRoute } from 'astro';
import fg from 'fast-glob';
import path from 'path';
import { fileURLToPath } from 'url';

export const GET: APIRoute = async ({ url }) => {
    // Check for admin token in production
    const adminToken = import.meta.env.ADMIN_DASHBOARD_TOKEN;
    const isProduction = import.meta.env.PROD;
    const token = url.searchParams.get('token');

    if (isProduction && adminToken && token !== adminToken) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // Get project root directory
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const projectRoot = path.resolve(__dirname, '../../../../');
        const cmsPath = path.join(projectRoot, 'src/cms');

        // Find all *.opti-type.json files
        const typeFiles = await fg(`${cmsPath}/**/*.opti-type.json`, {
            absolute: false,
            cwd: projectRoot,
        });

        // Extract type names from file paths
        const types = typeFiles.map(file => {
            const fileName = path.basename(file);
            // Remove .opti-type.json extension to get the type name
            const typeName = fileName.replace('.opti-type.json', '');
            
            // Get the relative path for categorization
            const relativePath = file.replace('src/cms/', '');
            const category = path.dirname(relativePath).split('/')[0] || 'other';
            
            return {
                name: typeName,
                category: category,
                path: file
            };
        }).sort((a, b) => {
            // Sort by category, then by name
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            return a.name.localeCompare(b.name);
        });

        return new Response(
            JSON.stringify({ types }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error listing types:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to list types' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};