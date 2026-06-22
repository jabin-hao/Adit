import { useState, useCallback } from "react";
import { DEFAULT_SSH_PORT } from "@/lib/constants";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSessionStore } from "@/store/sessionStore";
import type { Profile } from "@/lib/types";

interface ConnectionFormProps {
  open: boolean;
  editingProfile?: Profile | null;
  onClose: () => void;
  onSave: (values: FormValues) => void;
}

export interface FormValues {
  name: string; host: string; port: number; username: string;
  auth_type: "password" | "key" | "agent";
  group: string;
}

export function ConnectionForm({ open, editingProfile, onClose, onSave }: ConnectionFormProps) {
  const isEdit = editingProfile !== null && editingProfile !== undefined;
  return (
    <Drawer open={open} onClose={onClose} direction="right">
      <DrawerContent>
        <DrawerHeader><DrawerTitle>{isEdit ? "编辑连接" : "新建连接"}</DrawerTitle></DrawerHeader>
        <FormBody key={editingProfile?.id ?? "new"} editingProfile={editingProfile} onClose={onClose} onSave={onSave} />
      </DrawerContent>
    </Drawer>
  );
}

function FormBody({ editingProfile, onClose, onSave }: { editingProfile?: Profile | null; onClose: () => void; onSave: (values: FormValues) => void }) {
  const [name, setName] = useState(editingProfile?.name ?? "");
  const [host, setHost] = useState(editingProfile?.host ?? "");
  const [port, setPort] = useState(String(editingProfile?.port ?? DEFAULT_SSH_PORT));
  const [username, setUsername] = useState(editingProfile?.username ?? "");
  const [authType, setAuthType] = useState<string>(editingProfile?.auth_type ?? "password");
  const [group, setGroup] = useState(editingProfile?.group ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 从现有 profiles 提取唯一分组名（排空）
  const profiles = useSessionStore((s) => s.profiles);
  const existingGroups = [...new Set(profiles.map((p) => p.group).filter(Boolean))];

  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "不能为空"; else if (name.trim().length > 64) e.name = "不超过64字符";
    if (!host.trim()) e.host = "不能为空";
    const p = Number(port); if (!port || p < 1 || p > 65535) e.port = "1–65535";
    if (!username.trim()) e.username = "不能为空";
    setErrors(e); return Object.keys(e).length === 0;
  }, [name, host, port, username]);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div className="space-y-1.5"><Label htmlFor="c-name">连接名称</Label><Input id="c-name" placeholder="如：生产服务器" maxLength={64} value={name} onChange={(e) => setName(e.target.value)} />{errors.name && <p className="text-xs text-destructive">{errors.name}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="c-host">主机地址</Label><Input id="c-host" placeholder="192.168.1.1 或 example.com" value={host} onChange={(e) => setHost(e.target.value)} />{errors.host && <p className="text-xs text-destructive">{errors.host}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="c-port">端口</Label><Input id="c-port" type="number" min={1} max={65535} value={port} onChange={(e) => setPort(e.target.value)} />{errors.port && <p className="text-xs text-destructive">{errors.port}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="c-user">用户名</Label><Input id="c-user" placeholder="root" value={username} onChange={(e) => setUsername(e.target.value)} />{errors.username && <p className="text-xs text-destructive">{errors.username}</p>}</div>
        <div className="space-y-1.5"><Label>认证方式</Label>
          <Select value={authType} onValueChange={setAuthType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="password">密码</SelectItem>
              <SelectItem value="key">私钥</SelectItem>
              <SelectItem value="agent">SSH Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label htmlFor="c-group">分组</Label>
          <Input id="c-group" placeholder="默认" list="group-suggestions" value={group} onChange={(e) => setGroup(e.target.value)} />
          {existingGroups.length > 0 && (
            <datalist id="group-suggestions">{existingGroups.map((g) => <option key={g} value={g} />)}</datalist>
          )}
        </div>
      </div>
      <DrawerFooter>
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button onClick={() => validate() && onSave({ name: name.trim(), host: host.trim(), port: Number(port), username: username.trim(), auth_type: authType as FormValues["auth_type"], group: group.trim() })}>保存</Button>
      </DrawerFooter>
    </>
  );
}
