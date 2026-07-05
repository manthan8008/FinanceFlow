import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router") ||
            id.includes("/scheduler/")
          ) {
            return "vendor-react";
          }

          if (
            id.includes("/recharts/") ||
            id.includes("/d3-") ||
            id.includes("/victory-vendor/")
          ) {
            return "vendor-charts";
          }

          if (id.includes("/framer-motion/") || id.includes("/motion-")) {
            return "vendor-motion";
          }

          if (id.includes("/lucide-react/")) {
            return "vendor-icons";
          }

          if (
            id.includes("/axios/") ||
            id.includes("/react-hot-toast/") ||
            id.includes("/goober/")
          ) {
            return "vendor-utils";
          }
        },
      },
    },
  },
});
