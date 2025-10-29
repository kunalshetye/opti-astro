import type { APIRoute } from 'astro';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const prerender = false;

const REDIRECTS_FILE = join(process.cwd(), 'data', 'redirects.json');

interface Redirect {
  id: string;
  fromPath: string;
  toPath: string;
  type: '301' | '302' | '307' | '308';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

// Load redirects from file
async function loadRedirects(): Promise<Redirect[]> {
  try {
    await ensureDataDir();
    if (!existsSync(REDIRECTS_FILE)) {
      return [];
    }
    const content = await readFile(REDIRECTS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading redirects:', error);
    return [];
  }
}

// Save redirects to file
async function saveRedirects(redirects: Redirect[]): Promise<void> {
  await ensureDataDir();
  await writeFile(REDIRECTS_FILE, JSON.stringify(redirects, null, 2), 'utf-8');
}

// Generate unique ID
function generateId(): string {
  return `redirect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Parse CSV content
function parseCSV(content: string): Array<{ fromPath: string; toPath: string; type: string; enabled: string }> {
  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  const header = lines[0].toLowerCase().split(',').map(h => h.trim());
  const requiredColumns = ['frompath', 'topath', 'type', 'enabled'];

  // Validate header
  for (const col of requiredColumns) {
    if (!header.includes(col)) {
      throw new Error(`Missing required column: ${col}`);
    }
  }

  const fromPathIndex = header.indexOf('frompath');
  const toPathIndex = header.indexOf('topath');
  const typeIndex = header.indexOf('type');
  const enabledIndex = header.indexOf('enabled');

  const data: Array<{ fromPath: string; toPath: string; type: string; enabled: string }> = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = line.split(',').map(v => v.trim());

    if (values.length < requiredColumns.length) {
      throw new Error(`Invalid data at line ${i + 1}: not enough columns`);
    }

    data.push({
      fromPath: values[fromPathIndex],
      toPath: values[toPathIndex],
      type: values[typeIndex],
      enabled: values[enabledIndex]
    });
  }

  return data;
}

// POST - Upload CSV file with redirects
export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const csvFile = formData.get('csv') as File;

    if (!csvFile) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No CSV file provided'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    if (!csvFile.name.endsWith('.csv')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'File must be a CSV file'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Read CSV content
    const csvContent = await csvFile.text();

    // Parse CSV
    let csvData: Array<{ fromPath: string; toPath: string; type: string; enabled: string }>;
    try {
      csvData = parseCSV(csvContent);
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to parse CSV file',
          details: error instanceof Error ? error.message : 'Invalid CSV format'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    if (csvData.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'CSV file contains no data rows'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Load existing redirects
    const existingRedirects = await loadRedirects();
    const existingPaths = new Set(existingRedirects.map(r => r.fromPath));

    // Process CSV data
    const newRedirects: Redirect[] = [];
    const errors: string[] = [];
    const skipped: string[] = [];

    for (const row of csvData) {
      // Validate type
      if (!['301', '302', '307', '308'].includes(row.type)) {
        errors.push(`Invalid type "${row.type}" for path "${row.fromPath}". Must be 301, 302, 307, or 308.`);
        continue;
      }

      // Validate fromPath
      if (!row.fromPath.startsWith('/')) {
        errors.push(`Invalid fromPath "${row.fromPath}". Must start with /.`);
        continue;
      }

      // Skip if already exists
      if (existingPaths.has(row.fromPath)) {
        skipped.push(row.fromPath);
        continue;
      }

      // Parse enabled
      const enabled = row.enabled.toLowerCase() === 'true' || row.enabled === '1';

      // Create redirect
      const redirect: Redirect = {
        id: generateId(),
        fromPath: row.fromPath.trim(),
        toPath: row.toPath.trim(),
        type: row.type as '301' | '302' | '307' | '308',
        enabled,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      newRedirects.push(redirect);
      existingPaths.add(row.fromPath);
    }

    // Save all redirects
    const allRedirects = [...existingRedirects, ...newRedirects];
    await saveRedirects(allRedirects);

    // Build response message
    let message = `CSV uploaded successfully. ${newRedirects.length} redirects imported.`;
    if (skipped.length > 0) {
      message += ` ${skipped.length} skipped (already exist).`;
    }
    if (errors.length > 0) {
      message += ` ${errors.length} errors.`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message,
        imported: newRedirects.length,
        skipped: skipped.length,
        errors: errors.length,
        errorDetails: errors.length > 0 ? errors.slice(0, 10) : undefined // Limit to first 10 errors
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in POST /api/redirects-upload:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to upload CSV file',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
