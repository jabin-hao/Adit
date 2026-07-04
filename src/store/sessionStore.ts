/**
 * 会话状态管理 —— 管理 SSH 连接列表、标签页、profiles
 */
import { create } from "zustand";
import type { ConnectRequest, SessionInfo, SessionStatus, SessionTab } from "../lib/types";
import type { Profile } from "../lib/types";

interface SessionStore {
  // ── 数据 ──
  sessions: Map<string, SessionInfo>;
  tabs: SessionTab[];
  activeTabKey: string | null;
  profiles: Profile[];

  // ── 会话操作 ──
  addSession: (id: string, config: ConnectRequest) => void;
  updateSessionStatus: (id: string, status: SessionStatus) => void;
  removeSession: (id: string) => void;

  // ── 标签页操作 ──
  openTerminalTab: (sessionId: string, title: string) => string;
  openSftpTab: (sessionId: string, title: string) => string;
  openSettingsTab: () => string;
  openConnectionTab: (editingProfile?: Profile | null) => string;
  closeTab: (key: string) => void;
  setActiveTab: (key: string) => void;

  // ── Profile 操作 ──
  setProfiles: (profiles: Profile[]) => void;
  addProfile: (profile: Profile) => void;
  removeProfile: (id: string) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessions: new Map(),
  tabs: [],
  activeTabKey: null,
  profiles: [],

  // ── 会话 ──

  addSession: (id, config) =>
    set((state) => {
      const newMap = new Map(state.sessions);
      newMap.set(id, {
        id,
        name: config.name,
        target: `${config.host}:${config.port}`,
        status: "connecting",
      });
      return { sessions: newMap };
    }),

  updateSessionStatus: (id, status) =>
    set((state) => {
      const newMap = new Map(state.sessions);
      const existing = newMap.get(id);
      if (existing) {
        newMap.set(id, { ...existing, status });
      }
      return { sessions: newMap };
    }),

  removeSession: (id) =>
    set((state) => {
      const newMap = new Map(state.sessions);
      newMap.delete(id);
      return {
        sessions: newMap,
        tabs: state.tabs.filter((t) => t.sessionId !== id),
      };
    }),

  // ── 标签页 ──

  openTerminalTab: (sessionId, title) => {
    const key = `term-${sessionId}`;
    set((state) => {
      if (state.tabs.some((t) => t.key === key)) {
        return { activeTabKey: key };
      }
      return {
        tabs: [...state.tabs, { key, sessionId, title, type: "terminal" }],
        activeTabKey: key,
      };
    });
    return key;
  },

  openSftpTab: (sessionId, title) => {
    const key = `sftp-${sessionId}-${Date.now()}`;
    set((state) => ({
      tabs: [
        ...state.tabs,
        { key, sessionId, title: `${title} - SFTP`, type: "sftp" },
      ],
      activeTabKey: key,
    }));
    return key;
  },

  openSettingsTab: () => {
    const key = "settings";
    set((state) => {
      if (state.tabs.some((t) => t.key === key)) {
        return { activeTabKey: key };
      }
      return {
        tabs: [...state.tabs, { key, title: "设置", type: "settings" }],
        activeTabKey: key,
      };
    });
    return key;
  },

  openConnectionTab: (editingProfile) => {
    const key = editingProfile ? `conn-${editingProfile.id}` : `conn-new-${Date.now()}`;
    const title = editingProfile ? `编辑 ${editingProfile.name}` : "新建连接";
    set((state) => {
      const existing = state.tabs.find((t) => t.key === key);
      if (existing) return { activeTabKey: key };
      return {
        tabs: [...state.tabs, { key, title, type: "connection", editingProfile }],
        activeTabKey: key,
      };
    });
    return key;
  },

  closeTab: (key) =>
    set((state) => {
      const idx = state.tabs.findIndex((t) => t.key === key);
      const newTabs = state.tabs.filter((t) => t.key !== key);
      let active = state.activeTabKey;
      if (active === key) {
        const newIdx = Math.min(idx, newTabs.length - 1);
        active = newTabs[newIdx]?.key ?? null;
      }
      return { tabs: newTabs, activeTabKey: active };
    }),

  setActiveTab: (key) => set({ activeTabKey: key }),

  // ── Profiles ──

  setProfiles: (profiles) => set({ profiles }),

  addProfile: (profile) =>
    set((state) => {
      const existing = state.profiles.findIndex((p) => p.id === profile.id);
      if (existing >= 0) {
        const newProfiles = [...state.profiles];
        newProfiles[existing] = profile;
        return { profiles: newProfiles };
      }
      return { profiles: [...state.profiles, profile] };
    }),

  removeProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
    })),
}));
