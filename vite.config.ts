import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: "@/styled-system",
        replacement: path.resolve(__dirname, "styled-system"),
      },
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
});
