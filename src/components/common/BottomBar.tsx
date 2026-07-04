import { useEffect, useState } from "react";
import { Plug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { tauri } from "@/lib/tauri";
import { useSessionStore } from "@/store/sessionStore";

interface Props {
  activeSessionId: string | null;
}

export function BottomBar({ activeSessionId }: Props) {
  const [version, setVersion] = useState("");
  const sessions = useSessionStore((s) => s.sessions);
  const active = activeSessionId ? sessions.get(activeSessionId) : undefined;
  useEffect(() => { tauri.getVersion().then(setVersion).catch(() => setVersion("unknown")); }, []);

  const dot = active?.status === "connected" ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]"
    : active?.status === "connecting" ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]" : "bg-muted-foreground/40";

  return (
    <footer className="flex items-center justify-between px-3 h-6 border-t bg-muted/30 text-[10px]">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1">
          <span className={`inline-block size-1 rounded-full ${dot}`} />
          <Badge variant="outline" className="text-[9px] py-0 px-1 font-normal">{active?.status ?? "未连接"}</Badge>
        </span>
        <span className="text-muted-foreground/60">会话数 {sessions.size}</span>
      </div>
      <span className="flex items-center gap-1 text-muted-foreground/60"><Plug size={9} /> Adit v{version}</span>
    </footer>
  );
}
