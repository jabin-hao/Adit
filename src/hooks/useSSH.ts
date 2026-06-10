/**
 * SSH 连接 Hook —— 封装连接/断开/输入/pty 调整
 */
import { useCallback, useEffect } from "react";
import { useSessionStore } from "../store/sessionStore";
import { tauri, onSshConnected, onSshDisconnected } from "../lib/tauri";
import type { ConnectRequest } from "../lib/types";

export function useSSH() {
  const { addSession, updateSessionStatus, removeSession } = useSessionStore();

  // 监听连接状态事件
  useEffect(() => {
    const unsubs: Array<() => void> = [];

    onSshConnected(({ session_id }) => {
      updateSessionStatus(session_id, "connected");
    }).then((fn) => unsubs.push(fn));

    onSshDisconnected(({ session_id }) => {
      updateSessionStatus(session_id, "disconnected");
    }).then((fn) => unsubs.push(fn));

    return () => {
      unsubs.forEach((fn) => fn());
    };
  }, [updateSessionStatus]);

  /** 建立连接 */
  const connect = useCallback(
    async (config: ConnectRequest): Promise<string> => {
      const id = await tauri.connectSsh(config);
      addSession(id, config);
      return id;
    },
    [addSession],
  );

  /** 断开连接 */
  const disconnect = useCallback(
    async (sessionId: string): Promise<void> => {
      await tauri.disconnectSsh({ session_id: sessionId });
      removeSession(sessionId);
    },
    [removeSession],
  );

  /** 写入终端输入 */
  const writeStdIn = useCallback(
    async (sessionId: string, data: Uint8Array): Promise<void> => {
      await tauri.writeStdin(sessionId, Array.from(data));
    },
    [],
  );

  /** 调整 PTY 大小 */
  const resizePty = useCallback(
    async (sessionId: string, cols: number, rows: number): Promise<void> => {
      await tauri.resizePty({ session_id: sessionId, cols, rows });
    },
    [],
  );

  return { connect, disconnect, writeStdIn, resizePty };
}
