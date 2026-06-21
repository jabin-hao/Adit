import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://tauri.app/start/frontend/vite/
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 阻止 Vite 在 Tauri 打开前就提示 "localhost:1420 is ready"
  clearScreen: false,
  server: {
    // Tauri 在固定端口工作，若端口被占用则失败
    strictPort: true,
    // 开发时通过局域网 IP 向 Tauri 暴露
    host: host || false,
    port: 1420,
    watch: {
      ignored: ["**/src-tauri/target/**"],
    },
  },
  // Env 变量前缀
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri 在 Windows 上使用 Chromium，在 macOS/Linux 上使用 WebKit
    target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari14",
    // 生产构建不压缩体积
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // 调试构建生成 sourcemap
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
