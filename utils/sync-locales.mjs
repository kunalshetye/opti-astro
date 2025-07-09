#!/usr/bin/env node

/**
 * Sync locales from generated SDK to astro.config.mjs
 * This script extracts locale values from __generated/sdk.ts and updates astro.config.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const SDK_PATH = resolve(process.cwd(), '__generated/sdk.ts');
const CONFIG_PATH = resolve(process.cwd(), 'astro.config.mjs');

// Markers for dynamic content injection
const LOCALE_START_MARKER = '// DYNAMIC_LOCALES_START';
const LOCALE_END_MARKER = '// DYNAMIC_LOCALES_END';
const FALLBACK_START_MARKER = '// DYNAMIC_FALLBACK_START';
const FALLBACK_END_MARKER = '// DYNAMIC_FALLBACK_END';

function extractLocalesFromSDK() {
  try {
    const sdkContent = readFileSync(SDK_PATH, 'utf8');
    
    // Extract Locales enum values
    const localesEnumMatch = sdkContent.match(/export enum Locales\s*{([^}]+)}/);
    if (!localesEnumMatch) {
      console.warn('⚠️  Could not find Locales enum in SDK, using fallback locales');
      return ['en', 'es', 'fr', 'fr-CA', 'nl', 'sv', 'de'];
    }
    
    const enumContent = localesEnumMatch[1];
    const localeMatches = enumContent.match(/\w+\s*=\s*'([^']+)'/g);
    
    if (!localeMatches) {
      console.warn('⚠️  Could not parse Locales enum, using fallback locales');
      return ['en', 'es', 'fr', 'fr-CA', 'nl', 'sv', 'de'];
    }
    
    const locales = localeMatches
      .map(match => match.match(/'([^']+)'/)?.[1])
      .filter(locale => locale && locale !== 'ALL' && locale !== 'NEUTRAL')
      .map(locale => {
        // Convert underscores to hyphens for Astro compatibility
        return locale.replace('_', '-');
      });
    
    console.log('✅ Extracted locales from SDK:', locales);
    return locales;
  } catch (error) {
    console.error('❌ Error reading SDK file:', error.message);
    console.log('📝 Using fallback locales');
    return ['en', 'es', 'fr', 'fr-CA', 'nl', 'sv', 'de'];
  }
}

function generateFallbackConfig(locales) {
  const defaultLocale = 'en';
  const fallback = {};
  
  locales.forEach(locale => {
    if (locale !== defaultLocale) {
      fallback[locale] = defaultLocale;
    }
  });
  
  return fallback;
}

function updateAstroConfig(locales) {
  try {
    let configContent = readFileSync(CONFIG_PATH, 'utf8');
    
    // Check if markers exist, if not add them
    if (!configContent.includes(LOCALE_START_MARKER)) {
      // Replace the existing locales array with markers
      configContent = configContent.replace(
        /locales:\s*\[([^\]]+)\]/,
        `locales: [\n        ${LOCALE_START_MARKER}\n        ${LOCALE_END_MARKER}\n        ]`
      );
    }
    
    if (!configContent.includes(FALLBACK_START_MARKER)) {
      // Replace the existing fallback object with markers
      configContent = configContent.replace(
        /fallback:\s*{([^}]+)}/,
        `fallback: {\n            ${FALLBACK_START_MARKER}\n            ${FALLBACK_END_MARKER}\n        }`
      );
    }
    
    // Generate dynamic content
    const localesArray = locales.map(locale => `'${locale}'`).join(', ');
    const fallbackConfig = generateFallbackConfig(locales);
    const fallbackEntries = Object.entries(fallbackConfig)
      .map(([key, value]) => {
        // Quote keys that contain hyphens or other special characters
        const quotedKey = key.includes('-') || key.includes('_') ? `'${key}'` : key;
        return `${quotedKey}: '${value}'`;
      })
      .join(',\n            ');
    
    // Replace locale content
    configContent = configContent.replace(
      new RegExp(`${LOCALE_START_MARKER}[\\s\\S]*?${LOCALE_END_MARKER}`),
      `${LOCALE_START_MARKER}\n        ${localesArray}\n        ${LOCALE_END_MARKER}`
    );
    
    // Replace fallback content
    configContent = configContent.replace(
      new RegExp(`${FALLBACK_START_MARKER}[\\s\\S]*?${FALLBACK_END_MARKER}`),
      `${FALLBACK_START_MARKER}\n            ${fallbackEntries}\n            ${FALLBACK_END_MARKER}`
    );
    
    writeFileSync(CONFIG_PATH, configContent);
    console.log('✅ Updated astro.config.mjs with dynamic locales');
    
  } catch (error) {
    console.error('❌ Error updating astro.config.mjs:', error.message);
    process.exit(1);
  }
}

function main() {
  console.log('🔄 Syncing locales from SDK to Astro config...');
  
  const locales = extractLocalesFromSDK();
  updateAstroConfig(locales);
  
  console.log('✨ Locale synchronization complete!');
}

main();