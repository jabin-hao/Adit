/**
 * useServerStats Hook —— 轮询获取服务器状态
 *
 * 当 sessionId 非 null 时，立即获取一次并按 SERVER_STATS_POLL_MS 间隔轮询。
 * 不依赖 session status === "connected"（get_server_stats 为 stub，
 * 且当前连接流程不经过 connectSsh/addSession，会话永不进入 connected）。
 * 待 SSH exec 实现后，Rust 命令体在会话未连接时返回错误，hook 的 error 态处理。
 */
import { useEffect, useState } from "react";
import { tauri } from "../lib/tauri";
import { SERVER_STATS_POLL_MS } from "../lib/constants";
import type { ServerStats } from "../lib/types";

export type ServerStatsStatus = "idle" | "loading" | "loaded" | "error";

export function useServerStats(sessionId: string | null) {
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [status, setStatus] = useState<ServerStatsStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  // 追踪上次 sessionId，在 render 阶段调整状态（React 推荐模式，避免 effect 内同步 setState）
  const [prevSessionId, setPrevSessionId] = useState<string | null | undefined>(undefined);

  if (sessionId !== prevSessionId) {
    setPrevSessionId(sessionId);
    setStats(null);
    setError(null);
    setStatus(sessionId ? "loading" : "idle");
  }

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    const fetchStats = async () => {
      try {
        const data = await tauri.getServerStats(sessionId);
        if (cancelled) return;
        setStats(data);
        setStatus("loaded");
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
        setStatus("error");
      }
    };

    // 立即获取一次（loading → loaded/error）
    fetchStats();

    // 轮询：仅更新 stats，不重设 loading
    const intervalId = setInterval(fetchStats, SERVER_STATS_POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [sessionId]);

  return { stats, status, error };
}
