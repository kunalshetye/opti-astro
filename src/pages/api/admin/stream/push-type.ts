import type { APIRoute } from 'astro';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

export const GET: APIRoute = async ({ request, url }) => {
    // Check for admin token
    const adminToken = import.meta.env.ADMIN_DASHBOARD_TOKEN;
    const isProduction = import.meta.env.PROD;
    const token = url.searchParams.get('token');
    const typeName = url.searchParams.get('type');

    if (isProduction && adminToken && token !== adminToken) {
        return new Response('Unauthorized', { status: 401 });
    }

    if (!typeName) {
        return new Response('Type name is required', { status: 400 });
    }

    // Set up SSE headers
    const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable Nginx buffering
    });

    // Create a readable stream for SSE
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            let closed = false;

            // Helper to send SSE message
            const sendMessage = (data: any) => {
                if (!closed) {
                    try {
                        const message = `data: ${JSON.stringify(data)}\n\n`;
                        controller.enqueue(encoder.encode(message));
                    } catch (error) {
                        // Stream might be closed, ignore
                    }
                }
            };

            // Send initial message
            sendMessage({ 
                type: 'log', 
                message: `Starting push for content type: ${typeName}...`, 
                level: 'info' 
            });

            // Get project root directory
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const projectRoot = path.resolve(__dirname, '../../../../../');

            // Spawn the yarn command with the specific type
            const child = spawn('yarn', ['type:push', typeName], {
                cwd: projectRoot,
                env: { ...process.env },
                shell: false,
            });

            // Handle stdout
            child.stdout.on('data', (data) => {
                const lines = data.toString().split('\n').filter(line => line.trim());
                lines.forEach(line => {
                    // Detect different types of messages
                    let level = 'info';
                    if (line.includes('✅') || line.includes('Success') || line.includes('successfully')) {
                        level = 'success';
                    } else if (line.includes('❌') || line.includes('Error') || line.includes('Failed')) {
                        level = 'error';
                    } else if (line.includes('⚠️') || line.includes('Warning')) {
                        level = 'warning';
                    }

                    sendMessage({ 
                        type: 'log', 
                        message: line, 
                        level 
                    });
                });
            });

            // Handle stderr
            child.stderr.on('data', (data) => {
                const lines = data.toString().split('\n').filter(line => line.trim());
                lines.forEach(line => {
                    // Some tools output normal messages to stderr, so check content
                    const isError = line.toLowerCase().includes('error') || 
                                   line.toLowerCase().includes('failed');
                    sendMessage({ 
                        type: 'log', 
                        message: line, 
                        level: isError ? 'error' : 'warning' 
                    });
                });
            });

            // Handle process exit
            child.on('close', (code) => {
                const success = code === 0;
                sendMessage({ 
                    type: 'complete', 
                    success, 
                    message: success 
                        ? `Content type "${typeName}" pushed successfully!` 
                        : `Process exited with code ${code}` 
                });
                
                // Close the stream
                if (!closed) {
                    closed = true;
                    controller.close();
                }
            });

            // Handle process error
            child.on('error', (error) => {
                sendMessage({ 
                    type: 'error', 
                    message: `Failed to start process: ${error.message}` 
                });
                if (!closed) {
                    closed = true;
                    controller.close();
                }
            });

            // Handle client disconnect
            request.signal.addEventListener('abort', () => {
                child.kill();
                if (!closed) {
                    closed = true;
                    controller.close();
                }
            });
        }
    });

    return new Response(stream, { headers });
};