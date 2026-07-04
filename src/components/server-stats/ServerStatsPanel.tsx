import { Cpu, Database, HardDrive, Server, PanelRightClose } from "lucide-react";
import { useServerStats } from "@/hooks/useServerStats";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  sessionId: string | null;
  /** 父组件通过 aside className 控制折叠 */
  collapsed: boolean;
  onToggleCollapse?: () => void;
}

/** 格式化秒数为 Xd Xh Xm 可读格式 */
function fmtUptime(secs: number): string {
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  parts.push(`${m}m`);
  return parts.join(" ");
}

/** 进度条子组件 */
function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1.5 rounded-full bg-muted/50">
      <div
        className="h-full rounded-full bg-accent transition-all duration-500 ease-[var(--ease-geist)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ServerStatsPanel({ sessionId, collapsed, onToggleCollapse }: Props) {
  const { stats, status, error } = useServerStats(sessionId);

  return (
    <aside
      className={cn(
        "border-l border-sidebar-border flex-shrink-0 overflow-hidden transition-all duration-200",
        collapsed ? "w-0 border-l-0" : "w-[300px]",
      )}
    >
      {!collapsed && (
        <div className="flex flex-col h-full bg-sidebar">
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-3 h-8 border-b border-sidebar-border">
            <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              服务器状态
            </h2>
            {onToggleCollapse && (
              <Button variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-foreground" onClick={onToggleCollapse} aria-label="折叠侧栏">
                <PanelRightClose size={13} />
              </Button>
            )}
          </div>

          {/* 内容区 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {status === "idle" && (
              <div className="text-center text-muted-foreground text-sm py-12">
                无活动会话
              </div>
            )}

            {status === "loading" && (
              <div className="text-center text-muted-foreground text-sm py-12">
                加载中…
              </div>
            )}

            {status === "error" && (
              <div className="text-center text-destructive text-sm py-12">
                状态获取失败
                {error && (
                  <span className="block text-xs text-muted-foreground mt-1">
                    {error}
                  </span>
                )}
              </div>
            )}

            {status === "loaded" && stats && (
              <>
                {/* CPU */}
                <section className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-medium text-foreground/80">
                      <Cpu size={12} />
                      CPU 使用率
                    </span>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {stats.cpuUsagePercent.toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar value={stats.cpuUsagePercent} max={100} />
                  <p className="text-[10px] text-muted-foreground/60">
                    {stats.cpuCores} 核心
                  </p>
                </section>

                {/* 内存 */}
                <section className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-medium text-foreground/80">
                      <Database size={12} />
                      内存
                    </span>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {stats.memUsedMb} / {stats.memTotalMb} MB
                    </span>
                  </div>
                  <ProgressBar value={stats.memUsedMb} max={stats.memTotalMb} />
                </section>

                {/* 负载 */}
                <section className="space-y-1">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-foreground/80">
                    <Server size={12} />
                    系统负载
                  </span>
                  <div className="grid grid-cols-3 gap-1 text-center">
                    {[
                      ["1m", stats.loadAvg1],
                      ["5m", stats.loadAvg5],
                      ["15m", stats.loadAvg15],
                    ].map(([label, val]) => (
                      <div key={label} className="bg-muted/30 rounded px-1.5 py-1">
                        <div className="text-xs tabular-nums font-medium">
                          {(val as number).toFixed(1)}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{label}</div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 磁盘 */}
                <section className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-medium text-foreground/80">
                      <HardDrive size={12} />
                      磁盘
                    </span>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {stats.diskUsedGb.toFixed(1)} / {stats.diskTotalGb.toFixed(1)} GB
                    </span>
                  </div>
                  <ProgressBar value={stats.diskUsedGb} max={stats.diskTotalGb} />
                </section>

                {/* 系统信息 */}
                <section className="space-y-0.5 pt-1 border-t border-sidebar-border">
                  <span className="text-[11px] font-medium text-foreground/80">系统</span>
                  <dl className="space-y-0 text-[10px] text-muted-foreground">
                    {stats.hostname && (
                      <div className="flex justify-between">
                        <dt>主机名</dt>
                        <dd className="tabular-nums">{stats.hostname}</dd>
                      </div>
                    )}
                    {stats.osName && (
                      <div className="flex justify-between">
                        <dt>操作系统</dt>
                        <dd>{stats.osName}</dd>
                      </div>
                    )}
                    {stats.kernelVersion && (
                      <div className="flex justify-between">
                        <dt>内核</dt>
                        <dd>{stats.kernelVersion}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt>运行时长</dt>
                      <dd className="tabular-nums">{fmtUptime(stats.uptimeSecs)}</dd>
                    </div>
                  </dl>
                </section>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
