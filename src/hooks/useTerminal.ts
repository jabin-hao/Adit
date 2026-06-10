/**
 * xterm.js 终端 Hook —— 完整的终端生命周期管理
 *
 * 功能：
 * - 创建/销毁 Terminal 实例
 * - 自动适应容器大小（FitAddon + ResizeObserver）
 * - 监听 SSH 输出事件并写入终端
 * - 用户按键通过 onData 回调发送到 SSH channel
 */
import { useCallback, useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { useConfigStore } from "../store/configStore";
import { onSshOutput } from "../lib/tauri";
import { TERMINAL_THEME } from "../lib/constants";

interface UseTerminalOptions {
  sessionId: string;
  /** 用户按键回调 —— 应将数据发送到 SSH channel */
  onData: (data: Uint8Array) => void;
}

interface UseTerminalReturn {
  /** 挂载到终端容器 div 上的 ref */
  terminalRef: React.RefObject<HTMLDivElement | null>;
  /** 手动触发重新 fit */
  fitTerminal: () => void;
}

export function useTerminal({ sessionId, onData }: UseTerminalOptions): UseTerminalReturn {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const termInstance = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  const fontSize = useConfigStore((s) => s.config.font_size);
  const fontFamily = useConfigStore((s) => s.config.font_family);
  const scrollback = useConfigStore((s) => s.config.scrollback_lines);

  // 初始化终端实例
  useEffect(() => {
    if (!terminalRef.current) return;

    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;

    const term = new Terminal({
      fontSize,
      fontFamily,
      scrollback,
      cursorBlink: true,
      cursorStyle: "block",
      convertEol: true,
      theme: TERMINAL_THEME,
    });

    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());
    term.open(terminalRef.current);

    // 用户输入 → 父组件
    term.onData((data: string) => {
      const encoder = new TextEncoder();
      onData(encoder.encode(data));
    });

    termInstance.current = term;

    // 延迟 fit 确保 DOM 渲染完成
    const timer = requestAnimationFrame(() => {
      fitAddon.fit();
    });

    return () => {
      cancelAnimationFrame(timer);
      term.dispose();
      termInstance.current = null;
      fitAddonRef.current = null;
    };
    // 仅在 sessionId 变更时重新初始化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // 监听 SSH 输出 → 写入终端
  useEffect(() => {
    const unsubscribePromise = onSshOutput((payload) => {
      if (payload.session_id === sessionId && termInstance.current) {
        termInstance.current.write(new Uint8Array(payload.data));
      }
    });

    return () => {
      unsubscribePromise.then((fn) => fn());
    };
  }, [sessionId]);

  // 容器尺寸变化 → 重新 fit
  const fitTerminal = useCallback(() => {
    if (fitAddonRef.current) {
      fitAddonRef.current.fit();
    }
  }, []);

  // ResizeObserver 监听容器尺寸
  useEffect(() => {
    if (!terminalRef.current) return;
    const observer = new ResizeObserver(() => {
      fitTerminal();
    });
    observer.observe(terminalRef.current);
    return () => observer.disconnect();
  }, [fitTerminal]);

  return { terminalRef, fitTerminal };
}
