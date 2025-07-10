import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import type { ComponentSchemaDefinition, StyleSchemaDefinition, Property } from './schema-interfaces.js';

/**
 * Runtime validation utilities for schemas
 */

// Helper functions to create TypeBox schemas for each property type
function createStringPropertySchema() {
  return Type.Object({
    type: Type.Literal('string'),
    displayName: Type.String(),
    description: Type.String(),
    localized: Type.Boolean(),
    required: Type.Boolean(),
    group: Type.String(),
    sortOrder: Type.Number(),
    editorSettings: Type.Record(Type.String(), Type.Any()),
    format: Type.Optional(Type.Union([
      Type.Literal('shortString'),
      Type.Literal('html'),
      Type.Literal('text'),
      Type.Literal('selectOne')
    ])),
    indexingType: Type.Optional(Type.Union([
      Type.Literal('searchable'),
      Type.Literal('queryable')
    ])),
    pattern: Type.Optional(Type.String()),
    enum: Type.Optional(Type.Object({
      values: Type.Array(Type.Object({
        displayName: Type.String(),
        value: Type.String()
      }))
    }))
  });
}

function createContentReferencePropertySchema() {
  return Type.Object({
    type: Type.Literal('contentReference'),
    displayName: Type.String(),
    description: Type.String(),
    localized: Type.Boolean(),
    required: Type.Boolean(),
    group: Type.String(),
    sortOrder: Type.Number(),
    editorSettings: Type.Record(Type.String(), Type.Any()),
    allowedTypes: Type.Array(Type.String()),
    restrictedTypes: Type.Array(Type.String())
  });
}

function createComponentPropertySchema() {
  return Type.Object({
    type: Type.Literal('component'),
    displayName: Type.String(),
    description: Type.String(),
    localized: Type.Boolean(),
    required: Type.Boolean(),
    group: Type.String(),
    sortOrder: Type.Number(),
    editorSettings: Type.Record(Type.String(), Type.Any()),
    contentType: Type.String()
  });
}

function createArrayPropertySchema() {
  return Type.Object({
    type: Type.Literal('array'),
    displayName: Type.String(),
    description: Type.String(),
    localized: Type.Boolean(),
    required: Type.Boolean(),
    group: Type.String(),
    sortOrder: Type.Number(),
    editorSettings: Type.Record(Type.String(), Type.Any()),
    format: Type.Optional(Type.String()),
    maxItems: Type.Optional(Type.Number()),
    items: Type.Object({
      type: Type.Union([Type.Literal('content'), Type.Literal('component')]),
      contentType: Type.Optional(Type.String()),
      allowedTypes: Type.Optional(Type.Array(Type.String())),
      restrictedTypes: Type.Optional(Type.Array(Type.String()))
    })
  });
}

function createBooleanPropertySchema() {
  return Type.Object({
    type: Type.Literal('boolean'),
    displayName: Type.String(),
    description: Type.String(),
    localized: Type.Boolean(),
    required: Type.Boolean(),
    group: Type.String(),
    sortOrder: Type.Number(),
    editorSettings: Type.Record(Type.String(), Type.Any())
  });
}

function createIntegerPropertySchema() {
  return Type.Object({
    type: Type.Literal('integer'),
    displayName: Type.String(),
    description: Type.String(),
    localized: Type.Boolean(),
    required: Type.Boolean(),
    group: Type.String(),
    sortOrder: Type.Number(),
    editorSettings: Type.Record(Type.String(), Type.Any()),
    minimum: Type.Optional(Type.Number())
  });
}

function createFloatPropertySchema() {
  return Type.Object({
    type: Type.Literal('float'),
    displayName: Type.String(),
    description: Type.String(),
    localized: Type.Boolean(),
    required: Type.Boolean(),
    group: Type.String(),
    sortOrder: Type.Number(),
    editorSettings: Type.Record(Type.String(), Type.Any()),
    minimum: Type.Optional(Type.Number()),
    maximum: Type.Optional(Type.Number())
  });
}

// Union schema for all property types
function createPropertySchema() {
  return Type.Union([
    createStringPropertySchema(),
    createContentReferencePropertySchema(),
    createComponentPropertySchema(),
    createArrayPropertySchema(),
    createBooleanPropertySchema(),
    createIntegerPropertySchema(),
    createFloatPropertySchema()
  ]);
}

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
    properties: Type.Record(Type.String(), createPropertySchema()),
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

// Individual property validation functions
export function validateProperty(data: unknown): data is Property {
  const validator = TypeCompiler.Compile(createPropertySchema());
  return validator.Check(data);
}

export function getPropertyErrors(data: unknown) {
  const validator = TypeCompiler.Compile(createPropertySchema());
  return Array.from(validator.Errors(data));
}

// Property type-specific validation functions
export function validateStringProperty(data: unknown): boolean {
  const validator = TypeCompiler.Compile(createStringPropertySchema());
  return validator.Check(data);
}

export function validateContentReferenceProperty(data: unknown): boolean {
  const validator = TypeCompiler.Compile(createContentReferencePropertySchema());
  return validator.Check(data);
}

export function validateComponentProperty(data: unknown): boolean {
  const validator = TypeCompiler.Compile(createComponentPropertySchema());
  return validator.Check(data);
}

export function validateArrayProperty(data: unknown): boolean {
  const validator = TypeCompiler.Compile(createArrayPropertySchema());
  return validator.Check(data);
}

export function validateBooleanProperty(data: unknown): boolean {
  const validator = TypeCompiler.Compile(createBooleanPropertySchema());
  return validator.Check(data);
}

export function validateIntegerProperty(data: unknown): boolean {
  const validator = TypeCompiler.Compile(createIntegerPropertySchema());
  return validator.Check(data);
}

export function validateFloatProperty(data: unknown): boolean {
  const validator = TypeCompiler.Compile(createFloatPropertySchema());
  return validator.Check(data);
}

// Dynamic property validation based on type
export function validatePropertyByType(data: unknown, type: string): boolean {
  switch (type) {
    case 'string':
      return validateStringProperty(data);
    case 'contentReference':
      return validateContentReferenceProperty(data);
    case 'component':
      return validateComponentProperty(data);
    case 'array':
      return validateArrayProperty(data);
    case 'boolean':
      return validateBooleanProperty(data);
    case 'integer':
      return validateIntegerProperty(data);
    case 'float':
      return validateFloatProperty(data);
    default:
      return false;
  }
}