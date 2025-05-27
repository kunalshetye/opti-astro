# Example Astro frontend integrated with Optimizely SaaS CMS and Optimizely Graph

## Getting Started
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
4. Create your *.env* file based on the [.env.template](/.env.template) example
   1. Values can be found at: *CMS > Settings > API Keys*
   2. Note, you must create a new API key for managing styles (it does not exist by default)
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

### Additional setup notes
#### Site Settings
Note: the Site Settings component currently allows you to update the site logo and footer tagline. Additional features coming soon.

1. Create a new Shared Block of type "Site Settings". If using the existing content pack, a Site Settings block is included in the "For This Page" for the imported homepage.
   
   *Note: my preference is to put it in the "For This Page" for the homepage, but you can create/save it anywhere you want*

2. Set the "Site Domain" field to match your domain -- for a local setup, it should be "localhost:4321". (Without this value defined, the site won't use the block.)
3. Update the Logo and the Footer Text as desired. Updates will be reflected on publish.

## Components

### Layout Components
- [Grid Component](src/cms/components/GridComponent/Grid.md) - Flexible layout system with standard and Bento grid options

### Content Components
- [ArticleList Component](src/cms/components/ArticleList/ArticleList.md) - Horizontally scrollable list of article cards
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

