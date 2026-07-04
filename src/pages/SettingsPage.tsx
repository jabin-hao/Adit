import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Monitor, Code, Palette, Keyboard, RefreshCw, Terminal, Info } from "lucide-react";
import { useConfigStore } from "@/store/configStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tauri } from "@/lib/tauri";

type Section = "editor" | "appearance" | "shortcuts" | "sync" | "mcp" | "about";

const sections: Array<{ key: Section; label: string; icon: React.ReactNode }> = [
  { key: "editor", label: "编辑器", icon: <Code size={16} /> },
  { key: "appearance", label: "外观", icon: <Palette size={16} /> },
  { key: "shortcuts", label: "快捷键", icon: <Keyboard size={16} /> },
  { key: "sync", label: "同步", icon: <RefreshCw size={16} /> },
  { key: "mcp", label: "MCP", icon: <Terminal size={16} /> },
  { key: "about", label: "关于", icon: <Info size={16} /> },
];

export function SettingsPage() {
  const [active, setActive] = useState<Section>("editor");
  const config = useConfigStore((s) => s.config);
  const setConfig = useConfigStore((s) => s.setConfig);
  const { toggle } = useAppTheme();
  const theme = config.theme;

  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) {
      tauri.saveSettings(config).catch(console.error);
    } else {
      mounted.current = true;
    }
  }, [config]);

  const themeOpts = [
    { k: "light" as const, i: <Sun size={16} />, l: "亮色" },
    { k: "dark" as const, i: <Moon size={16} />, l: "暗色" },
    { k: "system" as const, i: <Monitor size={16} />, l: "跟随系统" },
  ];

  return (
    <div className="flex flex-1 items-stretch">
      {/* 左侧菜单 —— h-full + items-stretch 让边框贯穿全高 */}
      <nav className="w-44 border-r flex-shrink-0 py-3 h-full">
        {sections.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(s.key)}
              className={cn(
                "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left",
                active === s.key
                  ? "bg-accent/10 text-foreground font-medium border-r-2 border-r-accent -mr-px"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              {s.icon}
              {s.label}
            </button>
        ))}
      </nav>

        {/* 右侧内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          {active === "editor" && <EditorSection config={config} setConfig={setConfig} />}
          {active === "appearance" && <AppearanceSection theme={theme} toggle={toggle} themeOpts={themeOpts} />}
          {active === "shortcuts" && <PlaceholderSection title="快捷键" description="自定义键盘快捷键（即将推出）" />}
          {active === "sync" && <PlaceholderSection title="同步" description="跨设备同步配置（即将推出）" />}
          {active === "mcp" && <PlaceholderSection title="MCP" description="Model Context Protocol 配置" />}
          {active === "about" && <AboutSection />}
        </div>
      </div>
  );
}

/* ── 编辑器 ─────────────────────────────────── */

function EditorSection({ config, setConfig }: { config: ReturnType<typeof useConfigStore.getState>["config"]; setConfig: (p: Partial<typeof config>) => void }) {
  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-base font-semibold">编辑器</h2>
      <Card>
        <CardHeader><CardTitle>字体</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">字体大小</label>
              <Input
                type="number"
                className="w-24"
                min={10}
                max={24}
                value={config.font_size}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v >= 10 && v <= 24) setConfig({ font_size: v });
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">回滚行数</label>
              <Input
                type="number"
                className="w-36"
                min={1000}
                max={50000}
                step={1000}
                value={config.scrollback_lines}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v >= 1000 && v <= 50000) setConfig({ scrollback_lines: v });
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── 外观 ──────────────────────────────────── */

function AppearanceSection({ theme, toggle, themeOpts }: { theme: string; toggle: (t: string) => void; themeOpts: Array<{ k: string; i: React.ReactNode; l: string }> }) {
  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-sm font-semibold">外观</h2>
      <Card>
        <CardHeader><CardTitle>主题</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {themeOpts.map((o) => (
              <Button
                key={o.k}
                variant={theme === o.k ? "default" : "outline"}
                size="sm"
                onClick={() => toggle(o.k)}
                className="gap-2"
              >
                {o.i}{o.l}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── 占位 ───────────────────────────────────── */

function PlaceholderSection({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-sm font-semibold">{title}</h2>
      <Card>
        <CardContent className="py-8">
          <p className="text-base text-muted-foreground text-center">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── 关于 ───────────────────────────────────── */

function AboutSection() {
  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-sm font-semibold">关于</h2>
      <Card>
        <CardContent className="py-6 space-y-3">
          <div>
            <h3 className="text-base font-bold">Adit</h3>
            <p className="text-sm text-muted-foreground mt-0.5">基于 Tauri 的跨平台 SSH/SFTP 客户端</p>
          </div>
          <div className="text-sm text-muted-foreground space-y-0.5">
            <p>Rust 后端处理网络 I/O 和系统调用</p>
            <p>React + TypeScript 前端构建用户界面</p>
            <p>通过 Tauri IPC 桥接前后端通信</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
