// @ts-check
import htmx from "astro-htmx";
import { defineConfig, envField } from "astro/config";
import mkcert from "vite-plugin-mkcert";

import node from "@astrojs/node";

import alpinejs from "@astrojs/alpinejs";
import tailwind from "@astrojs/tailwind"; // https://astro.build/config

import pageInsight from "astro-page-insight";

// https://astro.build/config
export default defineConfig({
  image: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cms.optimizely.com",
      },
    ],
  },
  
  i18n: {
    locales: ["en", "es", "fr", "fr-CA", "nl", "sv"],
    defaultLocale: "en",
    routing: {
        prefixDefaultLocale: false,
        fallbackType: "rewrite"
    },
    fallback: {
      es: "en",
      fr: "en",
      "fr-CA": "en",
      nl: "en",
      sv: "en",
    },
  },

  output: "server",

  adapter: node({
    mode: "standalone",
  }),

  server: { port: 4321 },
  vite: {
    ssr: {
      noExternal: ["graphql", "graphql-request"],
    },
    plugins: [mkcert()],
  },
  integrations: [tailwind(), alpinejs(), htmx(), pageInsight()],
  
  env: {
    schema: {
      OPTIMIZELY_CMS_URL: envField.string({context: "client", access: "public", optional: true}),
      OPTIMIZELY_GRAPH_SECRET: envField.string({context: "server", access: "secret", optional: false}),
      OPTIMIZELY_GRAPH_APP_KEY: envField.string({context: "client", access: "public", optional: false}),
      OPTIMIZELY_GRAPH_SINGLE_KEY: envField.string({context: "client", access: "public", optional: false}),
      OPTIMIZELY_GRAPH_GATEWAY: envField.string({context: "client", access: "public", optional: false}),
    }
  }
});
