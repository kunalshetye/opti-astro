#!/usr/bin/env node

/**
 * Script to serialize schemas from the schema registry to JSON
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fg from 'fast-glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dynamically import all .schema.ts files to trigger auto-registration
 */
async function loadAllSchemas() {
  try {
    console.log('🔍 Scanning for schema files...');
    
    // Find all .schema.ts files in the cms directory
    const schemaFiles = await fg('../../src/cms/**/*.schema.ts', {
      absolute: true,
      cwd: __dirname
    });
    
    console.log(`Found ${schemaFiles.length} schema files:`);
    schemaFiles.forEach(file => {
      const relativePath = path.relative(__dirname, file);
      console.log(`  - ${relativePath}`);
    });
    
    console.log('\n📥 Loading schemas...');
    
    const loadedSchemas = [];
    
    for (const schemaFile of schemaFiles) {
      try {
        // Convert absolute path to relative import path
        const relativePath = path.relative(__dirname, schemaFile);
        const importPath = './' + relativePath.replace(/\\/g, '/');
        
        console.log(`Attempting to load: ${relativePath}`);
        
        // Try to dynamically import the TypeScript file
        await import(importPath);
        loadedSchemas.push(relativePath);
        console.log(`✅ Successfully loaded: ${relativePath}`);
        
      } catch (error) {
        const errorMessage = error?.message || 'Unknown error';
        console.warn(`⚠️ Failed to load ${path.relative(__dirname, schemaFile)}: ${errorMessage}`);
        console.warn(`   Error details:`, error);
        // Still add to discovered list for reporting
        loadedSchemas.push(path.relative(__dirname, schemaFile));
      }
    }
    
    console.log(`\n✅ Discovered ${loadedSchemas.length} schema files!`);
    console.log('💡 To actually load them, run with: node --loader ts-node/esm serialize-style.mjs');
    console.log('   Or build the project first: yarn build\n');
    
    return loadedSchemas;
    
  } catch (error) {
    console.error('❌ Error scanning for schema files:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('📋 Auto-discovering and loading schemas...\n');
    
    // Load all schema files dynamically
    const discoveredSchemas = await loadAllSchemas();
    
    // Try to dynamically import and use the registry
    let registryModule = null;
    try {
      registryModule = await import('../../src/lib/schema-registry.ts');
      console.log('✅ Registry module loaded successfully');
    } catch (error) {
      const errorMessage = error?.message || 'Unknown error';
      console.log(`⚠️ Registry not available: ${errorMessage.split('\n')[0]}`);
    }
    
    if (registryModule) {
      const stats = registryModule.getRegistryStats();
      console.log('Registry Statistics:');
      console.log(`- Component schemas: ${stats.componentSchemas}`);
      console.log(`- Style schemas: ${stats.styleSchemas}`);
      console.log(`- Total schemas: ${stats.total}\n`);
      
      if (stats.total > 0) {
        // Registry is working - show actual schemas
        const heroStyle = registryModule.getStyleSchema('DefaultHero');
        
        if (heroStyle) {
          console.log('🎨 DefaultHero Style Schema JSON:');
          console.log('='.repeat(50));
          console.log(JSON.stringify(heroStyle, null, 2));
          console.log('='.repeat(50));
          
          console.log('\n📊 Schema stats:');
          console.log(`- Key: ${heroStyle.key}`);
          console.log(`- Display Name: ${heroStyle.displayName}`);
          console.log(`- Settings: ${Object.keys(heroStyle.settings).length}`);
          console.log(`- Content Type: ${heroStyle.contentType}`);
          console.log(`- Is Default: ${heroStyle.isDefault}`);
          
          const totalChoices = Object.values(heroStyle.settings)
            .reduce((total, setting) => total + Object.keys(setting.choices).length, 0);
          console.log(`- Total style choices: ${totalChoices}`);
        } else {
          console.log('❌ DefaultHero style schema not found in registry');
        }
        
        // List all registered schemas
        console.log('\n📚 All Registered Schemas:');
        
        const allComponents = registryModule.getAllComponentSchemas();
        console.log('\nComponent Schemas:');
        for (const [key, schema] of allComponents) {
          console.log(`  - ${key}: ${schema.displayName}`);
        }
        
        const allStyles = registryModule.getAllStyleSchemas();
        console.log('\nStyle Schemas:');
        for (const [key, schema] of allStyles) {
          console.log(`  - ${key}: ${schema.displayName} (${schema.contentType || 'composition'})`);
        }
      } else {
        console.log('📁 Registry loaded but no schemas registered');
      }
    } else {
      // Show discovered files but no dummy data
      console.log('📁 Discovered Schema Files:');
      discoveredSchemas.forEach(file => {
        console.log(`  - ${file}`);
      });
      
      console.log('\n❌ Could not load registry module');
      console.log('💡 To load actual schema data, try:');
      console.log('   node --loader ts-node/esm serialize-style.mjs');
    }
    
  } catch (error) {
    console.error('❌ Error in main function:', error.message);
    process.exit(1);
  }
}

main();