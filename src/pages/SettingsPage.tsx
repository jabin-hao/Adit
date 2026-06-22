import { IconSun, IconMoon, IconDeviceDesktop, IconArrowLeft } from "@tabler/icons-react";
import { useConfigStore } from "@/store/configStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SettingsPageProps {
  /** 返回按钮回调（T4 实现具体 UI；T2 仅做 prop 前向声明以保证编译） */
  onBack?: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps = {}) {
  const config = useConfigStore((s) => s.config);
  const setConfig = useConfigStore((s) => s.setConfig);
  const { toggle } = useAppTheme();
  const theme = config.theme;
  const opts = [{ k: "light" as const, i: <IconSun size={16} />, l: "亮色" }, { k: "dark" as const, i: <IconMoon size={16} />, l: "暗色" }, { k: "system" as const, i: <IconDeviceDesktop size={16} />, l: "跟随系统" }];

  return (
    <div className="p-8 max-w-xl mx-auto">
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 mb-4">
          <IconArrowLeft size={15} />返回
        </Button>
      )}
      <h1 className="text-lg font-bold mb-8">设置</h1>
      <div className="space-y-5">
        <Card><CardHeader><CardTitle>外观</CardTitle></CardHeader><CardContent>
          <div className="flex gap-2">{opts.map((o) => <Button key={o.k} variant={theme === o.k ? "default" : "outline"} size="sm" onClick={() => toggle(o.k)} className="gap-2">{o.i}{o.l}</Button>)}</div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>终端</CardTitle></CardHeader><CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium mb-1.5 block">字体大小</label><Input type="number" className="w-24" min={10} max={24} value={config.font_size} onChange={(e) => { const v = Number(e.target.value); if (v >= 10 && v <= 24) setConfig({ font_size: v }); }} /></div>
            <div><label className="text-xs font-medium mb-1.5 block">回滚行数</label><Input type="number" className="w-36" min={1000} max={50000} step={1000} value={config.scrollback_lines} onChange={(e) => { const v = Number(e.target.value); if (v >= 1000 && v <= 50000) setConfig({ scrollback_lines: v }); }} /></div>
          </div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>关于</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Adit — 基于 Tauri 的跨平台 SSH/SFTP 客户端</p></CardContent></Card>
      </div>
    </div>
  );
}
