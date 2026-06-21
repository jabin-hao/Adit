/**
 * 底部状态栏 —— 显示连接状态、会话数、应用版本
 */
import { Badge, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { tauri } from "../../lib/tauri";
import { useSessionStore } from "../../store/sessionStore";

interface StatusBarProps {
  activeSessionId: string | null;
}

export function StatusBar({ activeSessionId }: StatusBarProps) {
  const [version, setVersion] = useState("");
  const sessions = useSessionStore((s) => s.sessions);
  const activeSession = activeSessionId ? sessions.get(activeSessionId) : undefined;

  useEffect(() => {
    tauri.getVersion().then(setVersion).catch(() => setVersion("unknown"));
  }, []);

  const statusColor =
    activeSession?.status === "connected"
      ? "green"
      : activeSession?.status === "connecting"
        ? "orange"
        : "gray";

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <Space>
        <Badge color={statusColor} text={activeSession?.status ?? "未连接"} />
        <Typography.Text type="secondary" className="text-xs">
          会话数: {sessions.size}
        </Typography.Text>
      </Space>
      <Typography.Text type="secondary" className="text-xs">
        Adit v{version}
      </Typography.Text>
    </div>
  );
}
