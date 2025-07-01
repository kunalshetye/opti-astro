import { initContentTypeRegistry } from '@episerver/cms-sdk';

// Import all content types
import {
  // Pages
  ArticlePage,
  LandingPage,
  
  // Core Components
  Hero,
  Card,
  CallToAction,
  Button,
  ArticleList,
  Text,
  Paragraph,
  
  // Interactive Components
  Image,
  Video,
  VideoExternal,
  Iframe,
  Carousel,
  Collapse,
  
  // Layout Components
  Grid,
  MenuItem,
  Divider,
  
  // Media Types
  GenericMedia,
  ImageMedia,
  VideoMedia,
  
  // Configuration Types
  SiteSettings,
  SiteStyles,
  PageSeoSettings,
  PlaceholderItem,
  PlaceholdersConfiguration
} from '../content-types';

/**
 * Initialize the content type registry with all available content types.
 * This should be called once during application startup.
 */
export function initializeContentTypeRegistry() {
  initContentTypeRegistry([
    // Pages
    ArticlePage,
    LandingPage,
    
    // Core Components
    Hero,
    Card,
    CallToAction,
    Button,
    ArticleList,
    Text,
    Paragraph,
    
    // Interactive Components
    Image,
    Video,
    VideoExternal,
    Iframe,
    Carousel,
    Collapse,
    
    // Layout Components
    Grid,
    MenuItem,
    Divider,
    
    // Media Types
    GenericMedia,
    ImageMedia,
    VideoMedia,
    
    // Configuration Types
    SiteSettings,
    SiteStyles,
    PageSeoSettings,
    PlaceholderItem,
    PlaceholdersConfiguration
  ]);
}

/**
 * Content type registry initialization status
 */
let isInitialized = false;

/**
 * Ensure content type registry is initialized exactly once
 */
export function ensureContentTypeRegistry() {
  if (!isInitialized) {
    initializeContentTypeRegistry();
    isInitialized = true;
    console.log('✅ Optimizely CMS SDK content type registry initialized with 26 content types');
  }
}

// Auto-initialize in non-server environments
if (typeof window !== 'undefined') {
  ensureContentTypeRegistry();
}