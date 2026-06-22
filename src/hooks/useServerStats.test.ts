/**
 * T6 — useServerStats hook 单元测试
 *
 * 测试用例:
 *  (a) sessionId=null → status "idle", getServerStats NOT called
 *  (b) sessionId valid → getServerStats called, status "loaded", stats set (stub zeros)
 *  (c) getServerStats rejects → status "error", error set
 *  (d) 3s 轮询间隔 (vi.useFakeTimers) — sessionId 非 null 即轮询
 *
 * Mock 策略: vi.mock("@tauri-apps/api/core") 拦截 invoke，
 * tauri.getServerStats 内部调用 invoke("get_server_stats", { sessionId })。
 *
 * 参考: src/store/sessionStore.test.ts (vitest 风格);
 *       src/test/mocks/tauri.ts (mock 基础设施);
 *       src/hooks/useSSH.ts (hook + tauri 范式)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

// vitest hoists vi.mock calls; 工厂内用 vi.fn() 创建 mock
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

import { invoke } from "@tauri-apps/api/core";
import { useServerStats } from "./useServerStats";
import { SERVER_STATS_POLL_MS } from "../lib/constants";
import type { ServerStats } from "../lib/types";

const mockInvoke = invoke as unknown as ReturnType<typeof vi.fn>;

/** 构造全零 stub ServerStats（与 Rust ServerStats::default() 对齐） */
function makeStubStats(): ServerStats {
  return {
    cpuUsagePercent: 0,
    cpuCores: 0,
    loadAvg1: 0,
    loadAvg5: 0,
    loadAvg15: 0,
    memTotalMb: 0,
    memUsedMb: 0,
    memAvailableMb: 0,
    diskTotalGb: 0,
    diskUsedGb: 0,
    uptimeSecs: 0,
    hostname: "",
    osName: "",
    kernelVersion: "",
  };
}

describe("useServerStats", () => {
  beforeEach(() => {
    mockInvoke.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("(a) sessionId=null → status idle, invoke NOT called", () => {
    const { result } = renderHook(() => useServerStats(null));

    expect(result.current.status).toBe("idle");
    expect(result.current.stats).toBeNull();
    expect(result.current.error).toBeNull();
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it("(b) sessionId valid → invoke called, status loaded, stats set (stub zeros)", async () => {
    const stub = makeStubStats();
    mockInvoke.mockResolvedValue(stub);

    const { result } = renderHook(() => useServerStats("session-1"));

    // 刷新异步 effect 的 microtask 队列（fetchStats promise resolution）
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockInvoke).toHaveBeenCalledWith("get_server_stats", { sessionId: "session-1" });
    expect(result.current.status).toBe("loaded");
    expect(result.current.stats).toEqual(stub);
    expect(result.current.error).toBeNull();
  });

  it("(c) invoke rejects → status error, error set", async () => {
    mockInvoke.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useServerStats("session-1"));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBeTruthy();
    expect(result.current.stats).toBeNull();
  });

  it("(d) polls every SERVER_STATS_POLL_MS when sessionId is non-null", async () => {
    vi.useFakeTimers();
    const stub = makeStubStats();
    mockInvoke.mockResolvedValue(stub);

    renderHook(() => useServerStats("session-1"));

    // 初始调用 (useEffect 内的 fetchStats)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(mockInvoke).toHaveBeenCalledTimes(1);

    // 推进一个轮询周期 → 第 2 次调用
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SERVER_STATS_POLL_MS);
    });
    expect(mockInvoke).toHaveBeenCalledTimes(2);

    // 再推进一个轮询周期 → 第 3 次调用
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SERVER_STATS_POLL_MS);
    });
    expect(mockInvoke).toHaveBeenCalledTimes(3);
  });
});
