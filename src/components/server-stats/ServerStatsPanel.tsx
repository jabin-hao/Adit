import { IconCpu, IconDatabase, IconFileDatabase, IconServer } from "@tabler/icons-react";
import { useServerStats } from "@/hooks/useServerStats";
import { cn } from "@/lib/utils";

interface Props {
  sessionId: string | null;
  /** 父组件通过 aside className 控制折叠 */
  collapsed: boolean;
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

export function ServerStatsPanel({ sessionId, collapsed }: Props) {
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
          <div className="flex items-center px-4 py-3 border-b border-sidebar-border">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              服务器状态
            </h2>
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
                <section className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                      <IconCpu size={14} />
                      CPU 使用率
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {stats.cpuUsagePercent.toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar value={stats.cpuUsagePercent} max={100} />
                  <p className="text-[11px] text-muted-foreground/60">
                    {stats.cpuCores} 核心
                  </p>
                </section>

                {/* 内存 */}
                <section className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                      <IconDatabase size={14} />
                      内存
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {stats.memUsedMb} / {stats.memTotalMb} MB
                    </span>
                  </div>
                  <ProgressBar value={stats.memUsedMb} max={stats.memTotalMb} />
                </section>

                {/* 负载 */}
                <section className="space-y-1">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                    <IconServer size={14} />
                    系统负载
                  </span>
                  <div className="grid grid-cols-3 gap-1 text-center">
                    {[
                      ["1m", stats.loadAvg1],
                      ["5m", stats.loadAvg5],
                      ["15m", stats.loadAvg15],
                    ].map(([label, val]) => (
                      <div key={label} className="bg-muted/30 rounded-md px-2 py-1.5">
                        <div className="text-xs tabular-nums font-medium">
                          {(val as number).toFixed(1)}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{label}</div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 磁盘 */}
                <section className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                      <IconFileDatabase size={14} />
                      磁盘
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {stats.diskUsedGb.toFixed(1)} / {stats.diskTotalGb.toFixed(1)} GB
                    </span>
                  </div>
                  <ProgressBar value={stats.diskUsedGb} max={stats.diskTotalGb} />
                </section>

                {/* 系统信息 */}
                <section className="space-y-1 pt-1 border-t border-sidebar-border">
                  <span className="text-xs font-medium text-foreground/80">系统</span>
                  <dl className="space-y-0.5 text-[11px] text-muted-foreground">
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
