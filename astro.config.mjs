// @ts-check
import { defineConfig } from "astro/config";
import htmx from "astro-htmx";

import node from "@astrojs/node";

import tailwind from "@astrojs/tailwind"; // https://astro.build/config
import alpinejs from "@astrojs/alpinejs";

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

  output: "server",

  adapter: node({
    mode: "standalone",
  }),

  server: { port: 4321 },
  vite: {
    ssr: {
      noExternal: ["graphql", "graphql-request"],
    },
  },
  integrations: [tailwind(), alpinejs(), htmx()],
});
