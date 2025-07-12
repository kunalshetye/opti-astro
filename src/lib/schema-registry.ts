/**
 * Global schema registry for tracking all component and style schemas
 */
import type { ComponentSchemaDefinition, StyleSchemaDefinition } from './schema-interfaces.js';

// Global registries
const componentSchemaRegistry = new Map<string, ComponentSchemaDefinition>();
const styleSchemaRegistry = new Map<string, StyleSchemaDefinition>();

/**
 * Enhanced component schema with built-in serialization
 */
export type ComponentSchemaWithSerialization<T extends ComponentSchemaDefinition = ComponentSchemaDefinition> = T & {
  serialize(): T;
};

/**
 * Auto-registering component schema builder with built-in serialize method
 */
export function ComponentSchema<T extends ComponentSchemaDefinition>(definition: T): ComponentSchemaWithSerialization<T> {
  if (componentSchemaRegistry.has(definition.key)) {
    throw new Error(`Duplicate component schema key: '${definition.key}'. Schema keys must be unique.`);
  }
  componentSchemaRegistry.set(definition.key, definition);
  console.log(`📝 Auto-registered component schema: ${definition.key}`);
  
  // Return enhanced object with built-in serialize method
  return {
    ...definition,
    serialize(): T {
      return JSON.parse(JSON.stringify(definition));
    }
  };
}

/**
 * Enhanced style schema with built-in serialization
 */
export type StyleSchemaWithSerialization<T extends StyleSchemaDefinition = StyleSchemaDefinition> = T & {
  serialize(): T;
};

/**
 * Auto-registering style schema builder with built-in serialize method
 */
export function StyleSchema<T extends StyleSchemaDefinition>(definition: T): StyleSchemaWithSerialization<T> {
  if (styleSchemaRegistry.has(definition.key)) {
    throw new Error(`Duplicate style schema key: '${definition.key}'. Schema keys must be unique.`);
  }
  styleSchemaRegistry.set(definition.key, definition);
  console.log(`🎨 Auto-registered style schema: ${definition.key}`);
  
  // Return enhanced object with built-in serialize method
  return {
    ...definition,
    serialize(): T {
      return JSON.parse(JSON.stringify(definition));
    }
  };
}

/**
 * Get a component schema by key
 */
export function getComponentSchema(key: string): ComponentSchemaDefinition | undefined {
  return componentSchemaRegistry.get(key);
}

/**
 * Get a style schema by key
 */
export function getStyleSchema(key: string): StyleSchemaDefinition | undefined {
  return styleSchemaRegistry.get(key);
}

/**
 * Get all registered component schemas as an array (optimized for templates)
 */
export function getAllComponentSchemas(): ComponentSchemaDefinition[] {
  return Array.from(componentSchemaRegistry.values());
}

/**
 * Get all registered style schemas as an array (optimized for templates)
 */
export function getAllStyleSchemas(): StyleSchemaDefinition[] {
  return Array.from(styleSchemaRegistry.values());
}

/**
 * Get all registered component schemas as a Map (optimized for tooling)
 */
export function getAllComponentSchemasMap(): Map<string, ComponentSchemaDefinition> {
  return new Map(componentSchemaRegistry);
}

/**
 * Get all registered style schemas as a Map (optimized for tooling)
 */
export function getAllStyleSchemasMap(): Map<string, StyleSchemaDefinition> {
  return new Map(styleSchemaRegistry);
}

/**
 * Check if a component schema is registered
 */
export function hasComponentSchema(key: string): boolean {
  return componentSchemaRegistry.has(key);
}

/**
 * Check if a style schema is registered
 */
export function hasStyleSchema(key: string): boolean {
  return styleSchemaRegistry.has(key);
}

/**
 * Get registry statistics
 */
export function getRegistryStats() {
  return {
    componentSchemas: componentSchemaRegistry.size,
    styleSchemas: styleSchemaRegistry.size,
    totalSchemas: componentSchemaRegistry.size + styleSchemaRegistry.size,
  };
}

/**
 * Clear all registries (useful for testing)
 */
export function clearRegistries(): void {
  componentSchemaRegistry.clear();
  styleSchemaRegistry.clear();
}