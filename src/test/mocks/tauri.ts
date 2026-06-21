/**
 * Mock Tauri API
 *
 * 在测试中使用此 mock，避免依赖真实的 Tauri 环境。
 * 使用时在测试文件顶部添加:
 *   vi.mock("@tauri-apps/api/core", () => tauriCoreMock)
 *   vi.mock("@tauri-apps/api/event", () => tauriEventMock)
 */
import { vi } from "vitest";

// ── @tauri-apps/api/core ──
export const mockInvoke = vi.fn();

export const tauriCoreMock = {
  invoke: mockInvoke,
};

// ── @tauri-apps/api/event ──
export const mockListen = vi.fn();

export const tauriEventMock = {
  listen: mockListen,
};

/** 创建模拟的 listen 返回值 */
export function createMockUnlisten() {
  return vi.fn();
}

/**
 * Helper: 重置所有 mock 状态
 * 在 beforeEach 中调用
 */
export function resetTauriMocks() {
  mockInvoke.mockReset();
  mockListen.mockReset();
}
