/**
 * Dynamic component registry that auto-discovers and imports Astro components
 */
import { getAllComponentSchemas } from './schema-registry.js';

// Auto-import all schema files to ensure they're registered
import.meta.glob('../cms/**/*.schema.ts', { eager: true });

// Component props interface
export interface ComponentMappingProps {
  contentPayload: any;
  data: any;
  displaySettings?: any;
  displayTemplateKey?: string;
}

// Cache for imported components
const componentCache = new Map<string, any>();

/**
 * Dynamically import an Astro component based on component type
 */
export async function importComponent(componentType: string): Promise<any> {
  // Check cache first
  if (componentCache.has(componentType)) {
    return componentCache.get(componentType);
  }

  // Try to import from the expected locations
  const possiblePaths = [
    // Standard component path
    `../cms/components/${componentType}Component/${componentType}.astro`,
    // Page component path
    `../cms/pages/${componentType}Page/${componentType}.astro`,
    // Alternative component path (for special cases like ArticlePage -> ArticlePageCard)
    `../cms/pages/${componentType}Page/${componentType}PageCard.astro`,
  ];

  for (const path of possiblePaths) {
    try {
      const component = await import(path);
      componentCache.set(componentType, component.default);
      console.log(`🔗 Dynamically imported component: ${componentType} from ${path}`);
      return component.default;
    } catch (error) {
      // Continue to next path
    }
  }

  throw new Error(`Component '${componentType}' .astro file not found in expected locations`);
}

/**
 * Get all registered component types from the schema registry
 */
export function getAllComponentTypes(): string[] {
  return getAllComponentSchemas().map(schema => schema.key);
}

/**
 * Check if a component type is registered in the schema registry
 */
export function hasComponentType(componentType: string): boolean {
  return getAllComponentSchemas().some(schema => schema.key === componentType);
}

/**
 * Build props object for a component
 * This is a simplified version - in a more complex system, this could be driven by schema definitions
 */
export function buildComponentProps(
  componentType: string,
  availableProps: ComponentMappingProps
): Record<string, any> {
  const props: Record<string, any> = {
    contentPayload: availableProps.contentPayload,
    data: availableProps.data,
  };
  
  // Add optional props if they exist
  if (availableProps.displaySettings !== undefined) {
    props.displaySettings = availableProps.displaySettings;
  }
  
  if (availableProps.displayTemplateKey !== undefined) {
    props.displayTemplateKey = availableProps.displayTemplateKey;
  }
  
  return props;
}

/**
 * Clear the component cache (useful for development/testing)
 */
export function clearComponentCache(): void {
  componentCache.clear();
}