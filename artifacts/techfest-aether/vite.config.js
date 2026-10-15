import { defineConfig } from "vite";

const port = Number(process.env.PORT || 5173);
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base,
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port,
    allowedHosts: true,
  },
});
