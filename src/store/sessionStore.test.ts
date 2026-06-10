/**
 * sessionStore 单元测试示例
 *
 * 展示如何测试 Zustand store 的状态迁移。
 */
import { describe, it, expect, beforeEach } from "vitest";
import { useSessionStore } from "./sessionStore";
import type { ConnectRequest } from "../lib/types";

// 创建一个测试用的 ConnectRequest
function makeTestConfig(): ConnectRequest {
  return {
    name: "测试服务器",
    host: "localhost",
    port: 22,
    username: "root",
    auth: { type: "agent" },
    keepalive_secs: 30,
  };
}

describe("sessionStore", () => {
  // 每个测试前重置 store 状态
  beforeEach(() => {
    useSessionStore.setState({
      sessions: new Map(),
      tabs: [],
      activeTabKey: null,
      profiles: [],
    });
  });

  it("addSession 后状态为 connecting", () => {
    const config = makeTestConfig();
    useSessionStore.getState().addSession("session-1", config);

    const session = useSessionStore.getState().sessions.get("session-1");
    expect(session).toBeDefined();
    expect(session?.status).toBe("connecting");
    expect(session?.name).toBe("测试服务器");
  });

  it("updateSessionStatus 更新状态", () => {
    const config = makeTestConfig();
    const store = useSessionStore.getState();
    store.addSession("session-1", config);
    store.updateSessionStatus("session-1", "connected");

    const session = useSessionStore.getState().sessions.get("session-1");
    expect(session?.status).toBe("connected");
  });

  it("removeSession 同时清理关联的 tabs", () => {
    const config = makeTestConfig();
    const store = useSessionStore.getState();
    store.addSession("session-1", config);
    store.openTerminalTab("session-1", "测试");
    store.removeSession("session-1");

    const state = useSessionStore.getState();
    expect(state.sessions.has("session-1")).toBe(false);
    expect(state.tabs.some((t) => t.sessionId === "session-1")).toBe(false);
  });

  it("openTerminalTab 创建新标签页", () => {
    const config = makeTestConfig();
    const store = useSessionStore.getState();
    store.addSession("session-1", config);
    const key = store.openTerminalTab("session-1", "测试终端");

    const state = useSessionStore.getState();
    expect(state.tabs.length).toBe(1);
    expect(state.tabs[0].type).toBe("terminal");
    expect(state.activeTabKey).toBe(key);
  });

  it("closeTab 自动切换到相邻标签页", () => {
    const config = makeTestConfig();
    const store = useSessionStore.getState();
    store.addSession("session-1", config);
    store.addSession("session-2", config);
    const key1 = store.openTerminalTab("session-1", "终端 1");
    store.openTerminalTab("session-2", "终端 2");

    // 关闭第一个标签页，应切换到第二个
    store.closeTab(key1);

    const state = useSessionStore.getState();
    expect(state.tabs.length).toBe(1);
    expect(state.tabs[0].sessionId).toBe("session-2");
    expect(state.activeTabKey).toBe(state.tabs[0].key);
  });

  it("profiles 增删查", () => {
    const store = useSessionStore.getState();
    const profile = {
      id: "",
      name: "生产",
      host: "prod.example.com",
      port: 22,
      username: "admin",
      auth_type: "key",
      created_at: 0,
      updated_at: 0,
    };

    store.addProfile(profile);
    expect(useSessionStore.getState().profiles.length).toBe(1);

    store.removeProfile(useSessionStore.getState().profiles[0].id);
    expect(useSessionStore.getState().profiles.length).toBe(0);
  });
});
