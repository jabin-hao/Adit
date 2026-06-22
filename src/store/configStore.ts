/**
 * 应用配置状态管理 —— 主题、字体、布局等偏好设置
 *
 * 双重持久化：
 * 1. Zustand persist → localStorage（即时恢复，不受后端影响）
 * 2. Rust settings.json → app_data_dir（跨设备持久化）
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_SCROLLBACK,
  DEFAULT_SSH_PORT,
} from "../lib/constants";
import type { AppSettings } from "../lib/types";

interface ConfigStore {
  config: AppSettings;

  /** 部分更新配置 */
  setConfig: (partial: Partial<AppSettings>) => void;

  /** 恢复默认设置 */
  resetConfig: () => void;

  /** 从 Rust 后端加载设置覆盖本地 */
  loadFromBackend: (settings: AppSettings) => void;
}

export const DEFAULT_CONFIG: AppSettings = {
  theme: "system",
  font_size: DEFAULT_FONT_SIZE,
  font_family: DEFAULT_FONT_FAMILY,
  default_port: DEFAULT_SSH_PORT,
  scrollback_lines: DEFAULT_SCROLLBACK,
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: { ...DEFAULT_CONFIG },

      setConfig: (partial) =>
        set((state) => ({ config: { ...state.config, ...partial } })),

      resetConfig: () => set({ config: { ...DEFAULT_CONFIG } }),

      loadFromBackend: (settings) =>
        set({ config: { ...DEFAULT_CONFIG, ...settings } }),
    }),
    {
      name: "adit-settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ config: state.config }),
    },
  ),
);
