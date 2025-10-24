import type { APIRoute } from 'astro';
import { pushStyle } from '../../services/cms-sync';

export const GET: APIRoute = async ({ request, url }) => {
    const styleName = url.searchParams.get('style');
    if (!styleName) {
        return new Response('Style name is required', { status: 400 });
    }

    // Set up SSE headers
    const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
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

            // Progress callback for real-time updates
            const onProgress = (progress: any) => {
                sendMessage({
                    type: 'log',
                    message: progress.message,
                    level: progress.level
                });
            };

            // Handle client disconnect
            request.signal.addEventListener('abort', () => {
                if (!closed) {
                    closed = true;
                    try {
                        controller.close();
                    } catch (error) {
                        // Controller might already be closed
                    }
                }
            });

            // Execute the push operation
            pushStyle(styleName, onProgress)
                .then((result) => {
                    if (!closed) {
                        sendMessage({
                            type: 'complete',
                            success: result.success,
                            message: result.message
                        });
                    }
                })
                .catch((error) => {
                    if (!closed) {
                        sendMessage({
                            type: 'error',
                            message: `Failed to push style: ${error.message}`
                        });
                    }
                })
                .finally(() => {
                    if (!closed) {
                        closed = true;
                        try {
                            controller.close();
                        } catch (error) {
                            // Controller might already be closed
                        }
                    }
                });
        }
    });

    return new Response(stream, { headers });
};
