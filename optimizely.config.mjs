import { buildConfig } from '@episerver/cms-sdk';

export default buildConfig({
  components: [
    // Content type definitions
    './src/content-types/**/*.ts',
    
    // React components for rendering
    './src/cms/components/**/*.astro',
    './src/cms/pages/**/*.astro',
    
    // Any additional component patterns
    './src/components/**/*.astro',
    './src/components/**/*.tsx'
  ]
});