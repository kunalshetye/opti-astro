import { Type, TypeCompiler } from '@sinclair/typebox';
import type { ComponentSchemaDefinition, StyleSchemaDefinition } from './schema-interfaces.js';

/**
 * Runtime validation utilities for schemas
 */

// Create TypeBox schema from ComponentSchema interface
export function createComponentSchemaValidator() {
  const schema = Type.Object({
    key: Type.String(),
    displayName: Type.String(),
    description: Type.String(),
    baseType: Type.Union([
      Type.Literal('component'),
      Type.Literal('page'),
      Type.Literal('image'),
      Type.Literal('video'),
      Type.Literal('media')
    ]),
    sortOrder: Type.Number(),
    mayContainTypes: Type.Array(Type.String()),
    mediaFileExtensions: Type.Array(Type.String()),
    compositionBehaviors: Type.Array(Type.Union([
      Type.Literal('sectionEnabled'),
      Type.Literal('elementEnabled')
    ])),
    properties: Type.Record(Type.String(), Type.Any()),
  });

  return TypeCompiler.Compile(schema);
}

// Create TypeBox schema from StyleSchema interface
export function createStyleSchemaValidator() {
  const schema = Type.Object({
    key: Type.String(),
    displayName: Type.String(),
    contentType: Type.Optional(Type.String()),
    baseType: Type.Optional(Type.String()),
    nodeType: Type.Optional(Type.String()),
    isDefault: Type.Optional(Type.Boolean()),
    settings: Type.Record(Type.String(), Type.Any()),
  });

  return TypeCompiler.Compile(schema);
}

// Validation functions
export function validateComponentSchema(data: unknown): data is ComponentSchemaDefinition {
  const validator = createComponentSchemaValidator();
  return validator.Check(data);
}

export function validateStyleSchema(data: unknown): data is StyleSchemaDefinition {
  const validator = createStyleSchemaValidator();
  return validator.Check(data);
}

// Get validation errors
export function getComponentSchemaErrors(data: unknown) {
  const validator = createComponentSchemaValidator();
  return Array.from(validator.Errors(data));
}

export function getStyleSchemaErrors(data: unknown) {
  const validator = createStyleSchemaValidator();
  return Array.from(validator.Errors(data));
}