import { useEffect, useState } from "react";
import { IconSettings, IconPlugConnected } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { tauri } from "@/lib/tauri";
import { useSessionStore } from "@/store/sessionStore";

interface Props {
  activeSessionId: string | null;
  onOpenSettings: () => void;
}

export function BottomBar({ activeSessionId, onOpenSettings }: Props) {
  const [version, setVersion] = useState("");
  const sessions = useSessionStore((s) => s.sessions);
  const active = activeSessionId ? sessions.get(activeSessionId) : undefined;
  useEffect(() => { tauri.getVersion().then(setVersion).catch(() => setVersion("unknown")); }, []);

  const dot = active?.status === "connected" ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]"
    : active?.status === "connecting" ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]" : "bg-muted-foreground/40";

  return (
    <footer className="flex items-center justify-between px-4 py-1.5 border-t bg-muted/30 text-[11px]">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5">
          <span className={`inline-block size-1.5 rounded-full ${dot}`} />
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">{active?.status ?? "未连接"}</Badge>
        </span>
        <span className="text-muted-foreground/60">会话数 {sessions.size}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onOpenSettings} aria-label="设置">
          <IconSettings size={15} />
        </Button>
        <ThemeToggle />
        <span className="flex items-center gap-1.5 text-muted-foreground/60"><IconPlugConnected size={11} /> Adit v{version}</span>
      </div>
    </footer>
  );
}
