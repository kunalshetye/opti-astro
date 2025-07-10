/**
 * Global schema registry for tracking all component and style schemas
 */
import type { ComponentSchemaDefinition, StyleSchemaDefinition } from './schema-interfaces.js';

// Global registries
const componentSchemaRegistry = new Map<string, ComponentSchemaDefinition>();
const styleSchemaRegistry = new Map<string, StyleSchemaDefinition>();

/**
 * Auto-registering component schema builder
 */
export function ComponentSchema<T extends ComponentSchemaDefinition>(definition: T): T {
  componentSchemaRegistry.set(definition.key, definition);
  console.log(`📝 Auto-registered component schema: ${definition.key}`);
  return definition;
}

/**
 * Auto-registering style schema builder
 */
export function StyleSchema<T extends StyleSchemaDefinition>(definition: T): T {
  styleSchemaRegistry.set(definition.key, definition);
  console.log(`🎨 Auto-registered style schema: ${definition.key}`);
  return definition;
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
 * Get all registered component schemas
 */
export function getAllComponentSchemas(): Map<string, ComponentSchemaDefinition> {
  return new Map(componentSchemaRegistry);
}

/**
 * Get all registered style schemas
 */
export function getAllStyleSchemas(): Map<string, StyleSchemaDefinition> {
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
    total: componentSchemaRegistry.size + styleSchemaRegistry.size,
  };
}

/**
 * Clear all registries (useful for testing)
 */
export function clearRegistries(): void {
  componentSchemaRegistry.clear();
  styleSchemaRegistry.clear();
}