# Documentation

This folder contains comprehensive documentation for the Opti-Astro project, covering configuration, usage, and best practices.

## 📚 Available Documentation

### Configuration & Setup

- **[Environment Variables Configuration](ENVIRONMENT-VARIABLES.md)** - Complete guide to all environment variables
    - Required Optimizely Graph credentials
    - Optional feature toggles (transitions, preview, dev mode)
    - Development vs production configuration
    - Security best practices and troubleshooting

- **[Locale Configuration Guide](LOCALE-CONFIG.md)** - Complete guide to setting up and configuring dynamic locale support
    - Dynamic locale system overview
    - Configuration options in `astro.config.mjs`
    - URL patterns and fallback behavior
    - GraphQL API integration
    - Migration from Astro i18n
    - Troubleshooting locale issues

### Layout & Design

- **[Row & Column Layout Guide](ROW-COLUMN-LAYOUT-GUIDE.md)** - How to use Row and Column styling options in the CMS
    - Row and Column layout system overview
    - Vertical alignment and responsive behavior
    - Grid spans and content spacing
    - Common layout patterns (forms, heroes, cards, sidebars)
    - Best practices and troubleshooting

### Forms & Data Integration

- **[Forms Guide](FORMS.md)** - Complete guide to Optimizely Forms with ODP integration
    - Form types (Optimizely Forms vs ODP Forms)
    - Creating and configuring forms in CMS
    - Form field components and validation
    - ODP integration for data collection and tracking
    - Event tracking (impressions, submissions, pageviews)
    - Testing, verification, and troubleshooting
    - Best practices and advanced configuration

## 🚀 Quick Start

New to this project? Start with these essential guides:

1. **For Setup**: Start with [Environment Variables Configuration](ENVIRONMENT-VARIABLES.md) to configure your development environment
2. **For Developers**: Read the [Locale Configuration Guide](LOCALE-CONFIG.md) to understand the internationalization system
3. **For Content Editors**: Check out the [Row & Column Layout Guide](ROW-COLUMN-LAYOUT-GUIDE.md) to master the CMS layout tools
4. **For Forms**: Read the [Forms Guide](FORMS.md) to create forms and set up ODP integration

## 📖 Project Overview

This is an **Astro v5 SSR project** with **Optimizely SaaS CMS integration** featuring:

- **Dynamic locale system** - No hardcoded locale lists, fully CMS-driven
- **Flexible layout system** - Responsive rows and columns with extensive styling options
- **GraphQL integration** - Type-safe content fetching from Optimizely Graph
- **Modern tech stack** - TailwindCSS v4, AlpineJS, TypeScript, Node.js 22.x

## 🔧 Development Commands

For quick reference, here are the most common development commands:

```bash
yarn dev              # Start development server
yarn build            # Build for production
yarn codegen          # Generate GraphQL types
yarn styles:push      # Push component styles to CMS
yarn types:push       # Push content types to CMS
```

For complete command documentation, see the main project README or `package.json`.

## 📝 Contributing Documentation

When adding new documentation:

1. Create descriptive markdown files in this `docs/` folder
2. Update this README to include links to your new documentation
3. Follow the established structure and formatting
4. Include practical examples and troubleshooting sections
5. Test any code examples or configuration snippets

## 🆘 Need Help?

If you can't find what you're looking for in these guides:

1. Review the inline code comments in relevant source files
2. Search the `src/` folder for examples of similar implementations
3. Consult the Optimizely CMS and Astro documentation for underlying concepts

---

_This documentation is maintained alongside the codebase. Please keep it updated as features change._
