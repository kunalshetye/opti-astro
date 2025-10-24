# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Astro v5 SSR project** with **Optimizely SaaS CMS integration** featuring:
- **Dynamic locale system** - No hardcoded locale lists, fully CMS-driven
- **Flexible layout system** - Responsive rows and columns with extensive styling options
- **GraphQL integration** - Type-safe content fetching from Optimizely Graph
- **Modern tech stack** - TailwindCSS v4, AlpineJS, Svelte5, TypeScript, Node.js 22.x

## Available Commands

### Development
- `yarn dev` - Start development server with GraphQL codegen and locale sync
- `yarn prod:hotreload` - Start development server with host access  
- `yarn build` - Build the project with GraphQL codegen and locale sync
- `yarn preview` - Preview the built project
- `yarn start` - Start production server (Node.js)

### GraphQL & Code Generation
- `yarn codegen` - Generate GraphQL types from CMS schema and sync locales
- `yarn codegen:watch` - Watch and auto-generate GraphQL types
- `yarn sync-locales` - Sync locale files

### Content Management
- `yarn styles:push` - Push all component styles to CMS
- `yarn styles:pull` - Pull component styles from CMS
- `yarn style:push [styleName]` - Push a specific style to CMS (e.g., `yarn style:push DefaultButton`)
- `yarn style:delete [styleName]` - Delete a specific style from CMS
- `yarn types:pull` - Pull content types from CMS
- `yarn types:push` - Push all content types to CMS
- `yarn type:push [typeName]` - Push a specific content type to CMS (e.g., `yarn type:push Button`)

## Architecture Overview

This is an Astro v5 SSR project with Optimizely SaaS CMS integration using:
- **Node.js 22.x** runtime environment
- **GraphQL** for content fetching via Optimizely Graph
- **TailwindCSS v4 + daisyUI** for styling system
- **AlpineJS** for lightweight client-side interactivity
- **Svelte5** for complex UI components requiring extensive JavaScript interactivity
- **Splide.js** for carousel functionality
- **TypeScript** for type safety

### Project Structure
```
src/
├── cms/
│   ├── components/          # CMS components (.astro, .opti-type.json, .graphql)
│   ├── compositions/        # Layout compositions (Row, Column, Section)
│   ├── experiences/         # Experience definitions
│   ├── media/              # Media type definitions
│   ├── pages/              # Page types (ArticlePage, LandingPage)
│   └── shared/             # Shared utilities and helpers
├── graphql/                # GraphQL SDK and queries
├── layouts/                # Astro layouts
├── pages/                  # Astro pages and API routes
└── styles/                 # Global CSS
```

### Component Architecture
Components follow a specific pattern in `src/cms/components/`:
- **`.astro`** - Component template and logic
- **`.opti-type.json`** - CMS content type definition
- **`.opti-style.json`** - Style definitions mapping to TailwindCSS classes
- **`.graphql`** - GraphQL fragments for data requirements
- **`.md`** - Component documentation (optional)
- **Styling.ts`** - TypeScript styling helpers (optional)

Components are dynamically rendered through `_Component.astro` and `_Components.astro`.

### Content Type System
- Content types are defined in `.opti-type.json` files
- Styles are defined in `.opti-style.json` files that reference display settings
- GraphQL fragments in `.graphql` files define data requirements
- The `globalStylesHelper.ts` converts display settings to TailwindCSS classes

### Key Files & Directories
- `codegen.ts` - GraphQL code generation configuration
- `src/graphql/getSdk.ts` - GraphQL SDK for CMS data fetching
- `src/cms/shared/globalStylesHelper.ts` - Style mapping system
- `src/middleware.ts` - Astro middleware (includes redirect checking)
- `src/lib/redirect-utils.ts` - URL redirect management utilities
- `utils/styles/` - CMS style sync utilities
- `utils/types/` - CMS type sync utilities
- `utils/sync-locales.mjs` - Locale synchronization
- `__generated/` - Generated GraphQL types and schema

### Admin Dashboard (`/opti-admin`)
The project includes a comprehensive admin dashboard built with Svelte 5 and Astro:

#### Features
- **CMS Sync** - Push/pull content types and component styles
- **Synonyms Manager** - Configure search synonym mappings for Optimizely Graph
- **Pinned Results** - Manage best bets for targeted search queries
- **Style Manager** - Create and edit display templates with form-based UI
- **Redirect Management** - Manage URL redirects with middleware integration
- **Published Pages Dashboard** - Track recently published pages and plan content migrations

#### Redirect Management
- **Location**: `/opti-admin?view=redirects`
- **Features**:
  - Create, edit, delete, and toggle redirects
  - Support for 301, 302, 307, and 308 redirect types
  - CSV bulk upload with validation
  - Search and filter by type and status
  - Real-time middleware integration
- **Storage**: Client-side (localStorage) + server-side (in-memory cache)
- **Middleware**: `checkRedirects()` in `src/middleware.ts` handles redirect logic
- **APIs**:
  - `GET/POST /opti-admin/api/redirects.json` - List/sync redirects to cache
  - `POST /opti-admin/api/redirects-upload.json` - CSV file upload with persistence to `data/redirects.json`

#### Published Pages Dashboard
- **Location**: `/opti-admin?view=published-pages`
- **Features**:
  - View pages published in the last 10 days
  - Filter by locale and search by title/owner/URL
  - Track action decisions (Copy as is, Copy + changes, Ignore)
  - Action tracking persists to localStorage
- **Data Source**: Direct GraphQL queries to Optimizely Graph
- **No server API required** - Uses client-side GraphQL calls with `astro:env/client`

### Environment Setup
Requires `.env` file with Optimizely Graph credentials:
- `OPTIMIZELY_GRAPH_GATEWAY` - GraphQL endpoint
- `OPTIMIZELY_GRAPH_SINGLE_KEY` - Single key for authentication
- `OPTIMIZELY_GRAPH_APP_KEY` - Application key
- `OPTIMIZELY_GRAPH_SECRET` - Secret key

Optional environment variables:
- `ASTRO_TRANSITIONS_ENABLED` - Enable/disable Astro view transitions (default: true)

### Development Notes
- Uses Yarn 4.9.1 package manager
- TailwindCSS v4 with new syntax and features
- Astro auto-adapter for flexible deployment
- GraphQL code generation runs before dev/build to ensure types are current
- Locale synchronization integrated into build process

### Client-Side Interactivity Guidelines
**When to use AlpineJS:**
- Simple interactions (dropdowns, toggles, accordions)
- Lightweight DOM manipulations
- Small components with minimal state management

**When to use Svelte5:**
- Complex UI components with extensive interactivity
- Components requiring significant state management
- Advanced user interactions (drag-and-drop, complex forms, data visualizations)
- When component logic becomes too complex for AlpineJS

## Documentation

Comprehensive documentation is available in the `docs/` folder:

### Configuration & Setup
- **[Environment Variables Configuration](docs/ENVIRONMENT-VARIABLES.md)** - Complete guide to all environment variables including required Optimizely Graph credentials and optional feature toggles
- **[Locale Configuration Guide](docs/LOCALE-CONFIG.md)** - Dynamic locale system setup, URL patterns, and GraphQL API integration

### Layout & Design
- **[Row & Column Layout Guide](docs/ROW-COLUMN-LAYOUT-GUIDE.md)** - How to use Row and Column styling options in the CMS with responsive behavior and common layout patterns

### Quick Start for New Developers
1. **Setup**: Configure environment variables (see docs/ENVIRONMENT-VARIABLES.md)
2. **Locales**: Understand the internationalization system (see docs/LOCALE-CONFIG.md)
3. **Layouts**: Master the CMS layout tools (see docs/ROW-COLUMN-LAYOUT-GUIDE.md)
4. **Interactivity**: Choose between AlpineJS and Svelte5 based on complexity (see Client-Side Interactivity Guidelines)