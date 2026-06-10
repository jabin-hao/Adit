/**
 * Vitest 全局 setup
 *
 * 在每个测试文件之前运行，设置：
 * - Mock 浏览器 API（ResizeObserver, matchMedia 等）
 * - Mock Tauri API（invoke, listen 等）
 * - 清理 Ant Design 动画（避免测试中的异步延迟）
 */
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// ── Mock ResizeObserver（xterm.js FitAddon 需要） ──
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// ── Mock matchMedia（Ant Design 主题检测需要） ──
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ── Mock requestAnimationFrame（终端初始化需要） ──
global.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
  setTimeout(() => cb(Date.now()), 0);
  return 0;
});

global.cancelAnimationFrame = vi.fn();

// ── Mock getComputedStyle（xterm 需要） ──
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = vi.fn().mockImplementation((...args: Parameters<typeof originalGetComputedStyle>) => {
  return originalGetComputedStyle(...args);
});
