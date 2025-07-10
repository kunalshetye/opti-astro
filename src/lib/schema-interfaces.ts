/**
 * Shared interfaces for CMS schema definitions
 */

// Base property interface
export interface BaseProperty {
  type: string;
  displayName: string;
  description: string;
  localized: boolean;
  required: boolean;
  group: string;
  sortOrder: number;
  editorSettings: Record<string, any>;
}

// String property interface
export interface StringProperty extends BaseProperty {
  type: 'string';
  format?: 'shortString' | 'html' | 'text';
  indexingType?: 'searchable' | 'queryable';
}

// Content reference property interface
export interface ContentReferenceProperty extends BaseProperty {
  type: 'contentReference';
  allowedTypes: string[];
  restrictedTypes: string[];
}

// Component property interface
export interface ComponentProperty extends BaseProperty {
  type: 'component';
  contentType: string;
}

// Array property interface
export interface ArrayProperty extends BaseProperty {
  type: 'array';
  format?: string;
  items: {
    type: 'content' | 'component';
    contentType?: string;
    allowedTypes?: string[];
    restrictedTypes?: string[];
  };
}

// Union of all property types
export type Property = StringProperty | ContentReferenceProperty | ComponentProperty | ArrayProperty;

// Component schema definition type
export interface ComponentSchemaDefinition<TKey extends string = string, TProperties = Record<string, Property>> {
  key: TKey;
  displayName: string;
  description: string;
  baseType: 'component' | 'page' | 'image' | 'video' | 'media';
  sortOrder: number;
  mayContainTypes: string[];
  mediaFileExtensions: string[];
  compositionBehaviors: ('sectionEnabled' | 'elementEnabled')[];
  properties: TProperties;
}

// Style choice interface
export interface StyleChoice {
  displayName: string;
  sortOrder: number;
}

// Style setting interface
export interface StyleSetting {
  displayName: string;
  editor: string;
  sortOrder: number;
  choices: Record<string, StyleChoice>;
}

// Style schema definition type (supports both component and composition styles)
export interface StyleSchemaDefinition<TKey extends string = string, TSettings = Record<string, StyleSetting>> {
  key: TKey;
  displayName: string;
  contentType?: string; // For component styles
  baseType?: string;    // For composition styles
  nodeType?: string;    // For composition styles
  isDefault?: boolean;
  settings: TSettings;
}

// Example of how to use the generic interface
// export type HeroComponentSchema = ComponentSchema<'Hero', HeroSpecificProperties>;

// Helper type for creating property definitions
export type PropertyDefinition<T extends Property = Property> = Omit<T, 'type'> & {
  type: T['type'];
};

// Utility types for property creation
export type StringPropertyConfig = {
  displayName: string;
  description?: string;
  group?: string;
  sortOrder?: number;
  format?: 'shortString' | 'html' | 'text';
  indexingType?: 'searchable' | 'queryable';
  localized?: boolean;
  required?: boolean;
};

export type ContentReferencePropertyConfig = {
  displayName: string;
  allowedTypes: string[];
  description?: string;
  group?: string;
  sortOrder?: number;
  restrictedTypes?: string[];
  localized?: boolean;
  required?: boolean;
};

export type ComponentPropertyConfig = {
  displayName: string;
  contentType: string;
  description?: string;
  group?: string;
  sortOrder?: number;
  localized?: boolean;
  required?: boolean;
};

export type ArrayPropertyConfig = {
  displayName: string;
  itemType: 'content' | 'component';
  contentType?: string;
  format?: string;
  description?: string;
  group?: string;
  sortOrder?: number;
  allowedTypes?: string[];
  restrictedTypes?: string[];
  localized?: boolean;
  required?: boolean;
};

// Factory functions for creating property definitions
export function createStringProperty(config: StringPropertyConfig): StringProperty {
  return {
    type: 'string',
    displayName: config.displayName,
    description: config.description ?? '',
    group: config.group ?? 'Information',
    sortOrder: config.sortOrder ?? 0,
    format: config.format,
    indexingType: config.indexingType,
    localized: config.localized ?? true,
    required: config.required ?? false,
    editorSettings: {},
  };
}

export function createContentReferenceProperty(config: ContentReferencePropertyConfig): ContentReferenceProperty {
  return {
    type: 'contentReference',
    displayName: config.displayName,
    description: config.description ?? '',
    group: config.group ?? 'Information',
    sortOrder: config.sortOrder ?? 0,
    allowedTypes: config.allowedTypes,
    restrictedTypes: config.restrictedTypes ?? [],
    localized: config.localized ?? true,
    required: config.required ?? false,
    editorSettings: {},
  };
}

export function createComponentProperty(config: ComponentPropertyConfig): ComponentProperty {
  return {
    type: 'component',
    displayName: config.displayName,
    description: config.description ?? '',
    group: config.group ?? 'Information',
    sortOrder: config.sortOrder ?? 0,
    contentType: config.contentType,
    localized: config.localized ?? false,
    required: config.required ?? false,
    editorSettings: {},
  };
}

export function createArrayProperty(config: ArrayPropertyConfig): ArrayProperty {
  const items: ArrayProperty['items'] = {
    type: config.itemType,
  };

  if (config.contentType) {
    items.contentType = config.contentType;
  }

  if (config.itemType === 'content') {
    items.allowedTypes = config.allowedTypes ?? [];
    items.restrictedTypes = config.restrictedTypes ?? [];
  }

  return {
    type: 'array',
    displayName: config.displayName,
    description: config.description ?? '',
    group: config.group ?? 'Information',
    sortOrder: config.sortOrder ?? 0,
    format: config.format,
    items,
    localized: config.localized ?? true,
    required: config.required ?? false,
    editorSettings: {},
  };
}