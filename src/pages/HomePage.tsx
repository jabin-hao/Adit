import { Plug } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import { tauri } from "@/lib/tauri";
import { ConnectionCard } from "@/components/connection/ConnectionCard";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface Props {
  onOpenTerminal: (id: string, title: string) => void;
  onOpenConnection: () => void;
}

export function HomePage({ onOpenTerminal, onOpenConnection }: Props) {
  const { profiles, setProfiles } = useSessionStore();
  useEffect(() => { tauri.listProfiles().then(setProfiles).catch(console.error); }, [setProfiles]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Adit</h1>
        <p className="text-sm text-muted-foreground mt-0.5">跨平台 SSH/SFTP 客户端</p>
      </div>
      {profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
          <Plug size={40} className="opacity-30" />
          <span>还没有保存的连接</span>
          <Button variant="link" onClick={onOpenConnection}>创建第一个连接</Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {profiles.map((p) => (
            <ConnectionCard key={p.id} profile={p} onConnect={(pp) => onOpenTerminal(pp.id, pp.name)} />
          ))}
        </div>
      )}
    </div>
  );
}
