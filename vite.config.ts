import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { qrcode } from "vite-plugin-qrcode";

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    qrcode(),
  ],
  server: {
    port: 5172,
    // open: true,
    host: "192.168.31.164",
  },
});
