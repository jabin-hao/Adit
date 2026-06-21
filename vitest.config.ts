import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // 测试环境
    environment: "jsdom",
    // Setup 文件
    setupFiles: ["./src/test/setup.ts"],
    // 全局变量（如 expect, describe, it）
    globals: true,
    // CSS 导入处理
    css: false,
    // 排除
    exclude: ["node_modules", "src-tauri"],
    // 覆盖率
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/test/**", "src/**/*.test.*"],
    },
  },
});
