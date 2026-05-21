// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const base = process.env.BASE_PATH || "/";
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",
  // Shared static assets live in the repo-root `static/` folder so
  // Docusaurus and v2 can both reference `templates.json` and images.
  publicDir: "../static",
  vite: {
    plugins: [tailwindcss()],
  },
});
