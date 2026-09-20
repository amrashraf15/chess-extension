import { resolve } from "node:path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: "dist",
    emptyOutDir: true,

    rolldownOptions: {
      input: {
        sidepanel: resolve(
          __dirname,
          "index.html",
        ),

        background: resolve(
          __dirname,
          "src/extension/background/service-worker.ts",
        ),

        content: resolve(
          __dirname,
          "src/extension/content/content.ts",
        ),
      },

      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") {
            return "background.js";
          }

          if (chunk.name === "content") {
            return "content.js";
          }

          return "assets/[name]-[hash].js";
        },
      },
    },
  },
});