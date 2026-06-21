/**
 * 终端页面 —— 组合 TerminalToolbar + TerminalView
 *
 * 这是每个终端标签页的内容。
 * 连接建立后，此页面是主要交互界面。
 */
import { TerminalView } from "../components/terminal/TerminalView";
import { TerminalToolbar } from "../components/terminal/TerminalToolbar";

interface TerminalPageProps {
  sessionId: string;
}

export function TerminalPage({ sessionId }: TerminalPageProps) {
  return (
    <div className="flex flex-col h-full">
      <TerminalToolbar sessionId={sessionId} />
      <div className="flex-1 overflow-hidden">
        <TerminalView sessionId={sessionId} />
      </div>
    </div>
  );
}
