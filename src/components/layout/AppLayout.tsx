import { useEffect, useState } from "react";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WindowControls } from "./WindowControls";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LayoutCtx, type LayoutContext } from "./useAppLayout";

/* ── Component ──────────────────────────────── */

interface Props {
  sidebar?: React.ReactNode;
  rightPanel?: React.ReactNode;
  footer?: React.ReactNode;
  onNewConnection?: () => void;
  onOpenSettings?: () => void;
  children: React.ReactNode;
}

export function AppLayout({ sidebar, rightPanel, footer, onNewConnection, onOpenSettings, children }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const ctx: LayoutContext = {
    sidebarCollapsed,
    rightCollapsed,
    toggleSidebar: () => setSidebarCollapsed((v) => !v),
    toggleRightPanel: () => setRightCollapsed((v) => !v),
    collapseSidebar: () => setSidebarCollapsed(true),
    collapseRightPanel: () => setRightCollapsed(true),
  };

  useEffect(() => {
    document.documentElement.classList.add("frameless");
    return () => document.documentElement.classList.remove("frameless");
  }, []);

  return (
    <LayoutCtx.Provider value={ctx}>
      <div className="h-screen flex flex-col">
        {/* 自定义标题栏 */}
        <header
          data-tauri-drag-region
          className="flex items-center justify-between h-8 border-b bg-background select-none shrink-0"
        >
          {/* 左侧：品牌 + 操作 */}
          <div className="flex items-center h-full gap-1">
            <span className="text-[11px] font-semibold px-3 text-muted-foreground tracking-wider select-none">
              Adit
            </span>
            {onNewConnection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNewConnection}
                className="h-full px-2.5 rounded-none text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/60"
              >
                新建连接
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-full px-2.5 rounded-none text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/60"
            >
              更多
            </Button>
          </div>

          {/* 右侧：设置 + 主题 + 面板切换 + 窗口控制 */}
          <div className="flex items-center h-full gap-1">
            {onOpenSettings && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenSettings}
                className="size-7 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60"
                aria-label="设置"
              >
                <Settings size={15} />
              </Button>
            )}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={ctx.toggleSidebar}
              className="size-7 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60"
              aria-label={sidebarCollapsed ? "展开左侧栏" : "折叠左侧栏"}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={ctx.toggleRightPanel}
              className="size-7 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 mr-1"
              aria-label={rightCollapsed ? "展开右侧栏" : "折叠右侧栏"}
            >
              {rightCollapsed ? <PanelRightOpen size={15} /> : <PanelRightClose size={15} />}
            </Button>
            <WindowControls />
          </div>
        </header>

        {/* 主体区域 */}
        <div className="flex flex-1 overflow-hidden">
          <aside
            className={cn(
              "border-r bg-sidebar border-sidebar-border flex-shrink-0 overflow-hidden transition-all duration-200",
              sidebarCollapsed ? "w-0 border-r-0" : "w-[270px]",
            )}
          >
            {!sidebarCollapsed && sidebar}
          </aside>

          <main className="flex-1 flex flex-col overflow-hidden bg-background">
            {children}
          </main>

          {rightPanel}
        </div>

        {footer}
      </div>
    </LayoutCtx.Provider>
  );
}
