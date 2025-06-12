# Example Astro frontend integrated with Optimizely SaaS CMS and Optimizely Graph

## Quick Deploy

Pre-requisites for quick deploy:
- Optimizely SaaS CMS instance, with administrator access
- GitHub account
- Netlify or Vercel account

Deploy this project with one click:

### Vercel
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkunalshetye%2Fopti-astro&env=OPTIMIZELY_CMS_URL,OPTIMIZELY_GRAPH_GATEWAY,OPTIMIZELY_GRAPH_SINGLE_KEY,OPTIMIZELY_GRAPH_APP_KEY,OPTIMIZELY_GRAPH_SECRET,OPTIMIZELY_DAM_ENABLED&envDescription=Required%20API%20keys%20for%20Optimizely%20Graph%20integration&envLink=https%3A%2F%2Fgithub.com%2Fkunalshetye%2Fopti-astro%23environment-setup&project-name=opti-astro&repository-name=opti-astro)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/kunalshetye/opti-astro#OPTIMIZELY_CMS_URL=&OPTIMIZELY_GRAPH_GATEWAY=https://cg.optimizely.com&OPTIMIZELY_GRAPH_SINGLE_KEY=&OPTIMIZELY_GRAPH_APP_KEY=&OPTIMIZELY_GRAPH_SECRET=&OPTIMIZELY_DAM_ENABLED=false)

**Note:** You'll need to configure the environment variables during deployment. See the [Environment Setup](#environment-setup) section below for required values.

After deploying the project via one of the buttons above, your front-end will return a 404. Next, you need to configure an Application in the CMS (which will also require creating a site homepage -- be sure to publish it!). The Application hostname should match the front-end domain (for example: your-project-name.netlify.app / your-project-name.vercel.app), and the locale should be "en". After configuring the Application, re-run the Optimizely Graph Full Synchronization Scheduled Job, and your homepage should now appear.

## Getting Started (Local Devs)
Note: these instructions are for configuring the CMS, and setting up and running the front-end locally on your computer.

More in-depth setup and usage instructions will follow.

1. Clone the repository
2. CMS: import the content pack (and types) into your CMS instance
   1. *CMS > Settings > Import Data*
   2. Import the content pack file from the repo [/contentpack/Astro - ContentTypes.episerverdata](/contentpack/Astro%20-%20ContentTypes.episerverdata), selecting "Root" as the content destination.
3. CMS: configure an Application (front-end)
   1. *CMS > Settings > Applications > Create Application*
   2. *Hostnames > Add Hostname...*
      1. Hostname: *localhost:4321*
      2. Use a secure connection (HTTPS): *true*
      3. Locale: *en*
4. <a id="environment-setup"></a>**Environment Setup**: Create your *.env* file based on the [.env.template](/.env.template) example
   1. Values can be found at: *CMS > Settings > API Keys*
   2. Note, you must create a new API key for managing styles (it does not exist by default)
   3. Configure DAM settings based on your CMS instance capabilities (see [Environment Variables](#environment-variables) below)
5. Install dependencies using Yarn (or your preferred package manager):
    ```sh
    yarn install
    ```
6. Run the codegen command to generate your local graphql files from the CMS content types
    ```sh
    yarn codegen
    ```
7. OPTIONAL: Pull the styles from the CMS (added via the content pack import)
   ```sh
   yarn styles:pull
   ```
8. Run the Astro front-end locally in dev mode
   ```sh
   yarn run dev
   ```

**Result**: your frontend should now load at https://localhost:4321/ and inside the CMS for content preview.

## Environment Variables

The following environment variables are required for the application to function properly:

### Required API Keys
| Variable | Description | Where to find |
|----------|-------------|---------------|
| `OPTIMIZELY_CMS_URL` | Your CMS instance URL | CMS domain (e.g., `https://app-yourinstance.cms.optimizely.com`) |
| `OPTIMIZELY_GRAPH_GATEWAY` | Optimizely Graph API endpoint | Usually `https://cg.optimizely.com` |
| `OPTIMIZELY_GRAPH_SINGLE_KEY` | Single-use API key for Graph | *CMS > Settings > API Keys* |
| `OPTIMIZELY_GRAPH_APP_KEY` | Application key for Graph | *CMS > Settings > API Keys* |
| `OPTIMIZELY_GRAPH_SECRET` | Secret key for Graph | *CMS > Settings > API Keys* |
| `OPTIMIZELY_CLIENT_ID` | API client ID for style management | *CMS > Settings > API Keys* (create new) |
| `OPTIMIZELY_CLIENT_SECRET` | API client secret for style management | *CMS > Settings > API Keys* (create new) |

### Optional Configuration
| Variable | Description | Default | Usage |
|----------|-------------|---------|-------|
| `PREVIEW_DELAY` | Delay in ms for content preview updates | `600` | Increase if preview updates are unreliable |
| `OPTIMIZELY_DAM_ENABLED` | Enable DAM (Digital Asset Management) features | `false` | Set to `true` if your CMS instance has DAM enabled |

### DAM Configuration
The `OPTIMIZELY_DAM_ENABLED` variable controls how GraphQL queries are generated:

- **`false` (default)**: Uses standard GraphQL fragments without DAM-specific fields like `item.AltText`
- **`true`**: Uses enhanced GraphQL fragments that include DAM fields for richer media metadata

**How to determine if DAM is enabled:**
1. Check if your CMS instance includes Digital Asset Management features
2. Test GraphQL queries - if `ContentReference.item` field exists in your schema, DAM is enabled
3. Contact your Optimizely administrator if unsure

**Important**: Setting this incorrectly will cause GraphQL compilation errors during `yarn codegen`.

### Additional setup notes
#### Site Settings
Note: the Site Settings component currently allows you to update the site logo and footer tagline. Additional features coming soon.

1. Create a new Shared Block of type "Site Settings". If using the existing content pack, a Site Settings block is included in the "For This Page" for the imported homepage.
2. Set the "Site Domain" field to match your domain -- for a local setup, it should be "localhost:4321". (Without this value defined, the site won't use the block.)
3. Update the Logo and the Footer Text as desired. Updates will be reflected on publish.

## Components

### Layout Components
- [Grid Component](src/cms/components/GridComponent/Grid.md) - Flexible layout system with standard and Bento grid options

### Content Components
- [ArticleList Component](src/cms/components/ArticleListComponent/ArticleList.md) - Horizontally scrollable list of article cards
- [Card Component](src/cms/components/CardComponent/Card.md) - Versatile content display with multiple layout configurations
- [Carousel Component](src/cms/components/CarouselComponent/Carousel.md) - Infinite-scrolling image carousel with autoplay
- [Collapse Component](src/cms/components/CollapseComponent/Collapse.md) - Expandable/collapsible content sections
- [Hero Component](src/cms/components/HeroComponent/Hero.md) - Full-width banner with video/image backgrounds
- [Paragraph Component](src/cms/components/ParagraphComponent/Paragraph.md) - Rich text content rendering

### Media Components
- [Image Component](src/cms/components/ImageComponent/Image.md) - Optimized images with configurable styling
- [Video Component](src/cms/components/VideoComponent/Video.md) - Video content with aspect ratios and playback controls

### Interactive Components
- [CallToAction Component](src/cms/components/CallToActionComponent/CallToAction.md) - Collection of action buttons for user engagement
- [Text Component](src/cms/components/TextComponent/Text.md) - Configurable heading and text elements

