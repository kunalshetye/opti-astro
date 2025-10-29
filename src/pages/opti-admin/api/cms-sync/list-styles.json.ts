import type { APIRoute } from 'astro';
import fg from 'fast-glob';
import path from 'path';
import { fileURLToPath } from 'url';

export const GET: APIRoute = async ({ request }) => {
    try {
        // Get project root directory
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const projectRoot = path.resolve(__dirname, '../../../../');

        // Use fast-glob with proper cross-platform configuration
        const styleFiles = await fg('src/cms/**/*.opti-style.json', {
            cwd: projectRoot,
            absolute: false,
            onlyFiles: true,
            dot: false
        });

        // Extract style names from file paths
        const styles = styleFiles.map(file => {
            const fileName = path.basename(file);
            // Remove .opti-style.json extension to get the style name
            const styleName = fileName.replace('.opti-style.json', '');

            // Get the relative path for categorization - cross-platform compatible
            const cmsRelativePath = path.join('src', 'cms');
            const relativePath = path.relative(cmsRelativePath, file);
            const category = relativePath.split(path.sep)[0] || 'other';

            return {
                name: styleName,
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
            JSON.stringify({ styles }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error listing styles:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to list styles' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};
