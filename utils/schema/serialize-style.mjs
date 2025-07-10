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
        // Print all component schemas
        const allComponents = registryModule.getAllComponentSchemas();
        console.log('📝 All Component Schemas:');
        console.log('='.repeat(60));
        
        for (const [key, schema] of allComponents) {
          console.log(`\n🏗️  Component: ${key}`);
          console.log('-'.repeat(40));
          console.log(JSON.stringify(schema, null, 2));
          console.log('-'.repeat(40));
          
          console.log(`📊 Component Stats:`);
          console.log(`- Key: ${schema.key}`);
          console.log(`- Display Name: ${schema.displayName}`);
          console.log(`- Description: ${schema.description || 'N/A'}`);
          console.log(`- Base Type: ${schema.baseType}`);
          console.log(`- Properties: ${Object.keys(schema.properties || {}).length}`);
          
          if (schema.properties) {
            console.log(`- Property Types: ${Object.values(schema.properties).map(p => p.type).join(', ')}`);
          }
        }
        
        // Print all style schemas
        const allStyles = registryModule.getAllStyleSchemas();
        console.log('\n\n🎨 All Style Schemas:');
        console.log('='.repeat(60));
        
        for (const [key, schema] of allStyles) {
          console.log(`\n🎭 Style: ${key}`);
          console.log('-'.repeat(40));
          console.log(JSON.stringify(schema, null, 2));
          console.log('-'.repeat(40));
          
          console.log(`📊 Style Stats:`);
          console.log(`- Key: ${schema.key}`);
          console.log(`- Display Name: ${schema.displayName}`);
          console.log(`- Content Type: ${schema.contentType || 'N/A'}`);
          console.log(`- Is Default: ${schema.isDefault || false}`);
          console.log(`- Settings: ${Object.keys(schema.settings || {}).length}`);
          
          if (schema.settings) {
            const totalChoices = Object.values(schema.settings)
              .reduce((total, setting) => total + Object.keys(setting.choices || {}).length, 0);
            console.log(`- Total style choices: ${totalChoices}`);
            
            const settingNames = Object.keys(schema.settings);
            console.log(`- Setting names: ${settingNames.join(', ')}`);
          }
        }
        
        // Summary
        console.log('\n\n📚 Registry Summary:');
        console.log('='.repeat(60));
        console.log(`Total Component Schemas: ${allComponents.size}`);
        console.log(`Total Style Schemas: ${allStyles.size}`);
        console.log(`Grand Total: ${stats.total}`);
        
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