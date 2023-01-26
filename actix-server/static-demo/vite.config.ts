import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/demo/",
  server: {
    proxy: {
      "/api": "http://localhost:20424",
      "/ws": {
        target: "ws://localhost:20424",
        ws: true,
      },
    },
  },
});
