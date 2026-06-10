/**
 * 终端容器组件 —— 渲染 xterm.js 并连接到 SSH session
 *
 * 这是 Adit 最核心的组件，负责：
 * 1. 创建 xterm.js Terminal 实例（通过 useTerminal hook）
 * 2. 将用户按键发送到 SSH channel（通过 useSSH hook）
 * 3. 监听容器尺寸变化并通知后端调整 PTY
 */
import { useTerminal } from "../../hooks/useTerminal";
import { useSSH } from "../../hooks/useSSH";
import "@xterm/xterm/css/xterm.css";

interface TerminalViewProps {
  sessionId: string;
}

export function TerminalView({ sessionId }: TerminalViewProps) {
  const { writeStdIn } = useSSH();

  const { terminalRef } = useTerminal({
    sessionId,
    onData: (data) => {
      void writeStdIn(sessionId, data);
    },
  });

  return (
    <div
      ref={terminalRef}
      className="h-full w-full"
      style={{ background: "#1a1b26" }}
    />
  );
}
