import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    cssCodeSplit: false,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    lib: {
      entry: resolve("src/widget.tsx"),
      name: "MelissaPortfolioChat",
      formats: ["iife"],
      fileName: () => "widget.js",
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
