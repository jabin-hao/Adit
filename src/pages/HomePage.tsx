import { IconPlugConnected } from "@tabler/icons-react";
import { useSessionStore } from "@/store/sessionStore";
import { tauri } from "@/lib/tauri";
import { ConnectionCard } from "@/components/connection/ConnectionCard";
import { ConnectionForm, type FormValues } from "@/components/connection/ConnectionForm";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

interface Props { onOpenTerminal: (id: string, title: string) => void; }

export function HomePage({ onOpenTerminal }: Props) {
  const { profiles, setProfiles, addProfile } = useSessionStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  useEffect(() => { tauri.listProfiles().then(setProfiles).catch(console.error); }, [setProfiles]);

  const save = useCallback(async (v: FormValues) => {
    const p: Profile = { id: editingProfile?.id ?? "", ...v, created_at: editingProfile?.created_at ?? 0, updated_at: 0 };
    try { const s = await tauri.saveProfile(p); addProfile(s); setFormOpen(false); setEditingProfile(null); } catch (e) { console.error(e); }
  }, [editingProfile, addProfile]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8"><h1 className="text-xl font-bold">Adit</h1><p className="text-sm text-muted-foreground mt-0.5">跨平台 SSH/SFTP 客户端</p></div>
      {profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
          <IconPlugConnected size={40} className="opacity-30" />
          <span>还没有保存的连接</span>
          <Button variant="link" onClick={() => setFormOpen(true)}>创建第一个连接</Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">{profiles.map((p) => <ConnectionCard key={p.id} profile={p} onConnect={(pp) => onOpenTerminal(pp.id, pp.name)} />)}</div>
      )}
      <ConnectionForm open={formOpen} editingProfile={editingProfile} onClose={() => { setFormOpen(false); setEditingProfile(null); }} onSave={save} />
    </div>
  );
}
