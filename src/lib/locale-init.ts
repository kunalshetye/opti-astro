/**
 * Initialize locale configuration
 * This should be imported early in the application lifecycle
 */

import { initializeLocaleConfig } from './locale-utils.js';

// Initialize locale configuration when this module is imported
initializeLocaleConfig().catch((error) => {
    console.warn('Failed to initialize locale configuration:', error);
});

export default true;