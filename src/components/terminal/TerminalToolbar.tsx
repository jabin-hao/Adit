/**
 * 终端工具栏 —— 复制、粘贴、清屏等操作
 *
 * TODO: 实现具体功能
 * - 复制选中文本到剪贴板（利用 Tauri clipboard plugin）
 * - 粘贴剪贴板内容到终端
 * - 清屏（发送 Ctrl+L）
 * - 换行设置切换
 */
import { Space, Typography } from "antd";
import IconButton from "../common/IconButton";

interface TerminalToolbarProps {
  sessionId: string;
}

export function TerminalToolbar({ sessionId: _sessionId }: TerminalToolbarProps) {
  return (
    <div className="flex items-center justify-between px-3 py-1 bg-gray-800 border-b border-gray-700">
      <Typography.Text className="text-gray-300 text-xs">
        {/* TODO: 显示当前连接信息 */}
        终端
      </Typography.Text>
      <Space size="small">
        {/* TODO: 实现具体功能 */}
        <IconButton tooltip="复制" icon="📋" onClick={() => {}} />
        <IconButton tooltip="粘贴" icon="📄" onClick={() => {}} />
        <IconButton tooltip="清屏" icon="🧹" onClick={() => {}} />
      </Space>
    </div>
  );
}
