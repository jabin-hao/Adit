import { useCallback, useEffect, useState } from "react";
import { IconTerminal2, IconFolder, IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconLayoutSidebarRightCollapse, IconLayoutSidebarRightExpand } from "@tabler/icons-react";
import { ServerStatsPanel } from "@/components/server-stats/ServerStatsPanel";
import { useSessionStore } from "@/store/sessionStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { tauri } from "@/lib/tauri";
import { ConnectionList } from "@/components/connection/ConnectionList";
import { ConnectionForm, type FormValues } from "@/components/connection/ConnectionForm";
import { HomePage } from "@/pages/HomePage";
import { TerminalPage } from "@/pages/TerminalPage";
import { FileManagerPage } from "@/pages/FileManagerPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BottomBar } from "@/components/common/BottomBar";
import type { Profile } from "@/lib/types";
import "@/styles/index.css";

function App() {
  const [formOpen, setFormOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const { theme: appTheme } = useAppTheme();
  const { tabs, activeTabKey, profiles, setProfiles, addProfile, removeProfile, openTerminalTab, closeTab, setActiveTab } = useSessionStore();

  useEffect(() => { tauri.listProfiles().then(setProfiles).catch(console.error); }, [setProfiles]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark",
      appTheme === "dark" || (appTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches));
  }, [appTheme]);

  const handleSaveProfile = useCallback(async (values: FormValues) => {
    const profile: Profile = { id: editingProfile?.id ?? "", ...values, created_at: editingProfile?.created_at ?? 0, updated_at: 0 };
    try { const saved = await tauri.saveProfile(profile); addProfile(saved); setFormOpen(false); setEditingProfile(null); }
    catch (err) { console.error(err); }
  }, [editingProfile, addProfile]);

  const handleDeleteProfile = useCallback(async (id: string) => { await tauri.deleteProfile(id); removeProfile(id); }, [removeProfile]);
  const handleConnect = useCallback((profile: Profile) => { openTerminalTab(profile.id, profile.name); }, [openTerminalTab]);

  // ── 分组管理 ──
  const handleRenameGroup = useCallback(async (oldName: string, newName: string) => {
    const affected = profiles.filter((p) => p.group === oldName);
    for (const p of affected) {
      try { const saved = await tauri.saveProfile({ ...p, group: newName }); addProfile(saved); } catch (err) { console.error(err); }
    }
  }, [profiles, addProfile]);

  const handleUngroup = useCallback(async (group: string) => {
    const affected = profiles.filter((p) => p.group === group);
    for (const p of affected) {
      try { const saved = await tauri.saveProfile({ ...p, group: "" }); addProfile(saved); } catch (err) { console.error(err); }
    }
  }, [profiles, addProfile]);

  const handleMoveToGroup = useCallback(async (profileId: string, group: string) => {
    const p = profiles.find((pr) => pr.id === profileId);
    if (!p) return;
    try { const saved = await tauri.saveProfile({ ...p, group }); addProfile(saved); } catch (err) { console.error(err); }
  }, [profiles, addProfile]);

  // 仅动态终端/SFTP 标签；Home/Settings 不再作为静态标签（T2）
  const effectiveKey = activeTabKey && tabs.some((t) => t.key === activeTabKey) ? activeTabKey : (tabs[0]?.key ?? "");
  const activeTab = tabs.find((t) => t.key === effectiveKey);

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col">
        {/* VS Code 风格顶部 header */}
        <header className="flex items-center justify-between h-9 px-4 border-b bg-background select-none shrink-0">
          <span className="text-[11px] font-semibold text-muted-foreground tracking-wider">Adit</span>
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon"
              onClick={() => setSidebarCollapsed(v => !v)}
              className="size-7 text-muted-foreground hover:text-foreground"
              aria-label={sidebarCollapsed ? "展开左侧栏" : "折叠左侧栏"}>
              {sidebarCollapsed ? <IconLayoutSidebarLeftExpand size={15} /> : <IconLayoutSidebarLeftCollapse size={15} />}
            </Button>
            <Button variant="ghost" size="icon"
              onClick={() => setRightCollapsed(v => !v)}
              className="size-7 text-muted-foreground hover:text-foreground"
              aria-label={rightCollapsed ? "展开右侧栏" : "折叠右侧栏"}>
              {rightCollapsed ? <IconLayoutSidebarRightExpand size={15} /> : <IconLayoutSidebarRightCollapse size={15} />}
            </Button>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className={cn(
            "border-r bg-sidebar border-sidebar-border flex-shrink-0 overflow-hidden transition-all duration-200",
            sidebarCollapsed ? "w-0 border-r-0" : "w-[270px]"
          )}>
            {!sidebarCollapsed && (
              <ConnectionList profiles={profiles} onConnect={handleConnect}
                onEdit={(p) => { setEditingProfile(p); setFormOpen(true); }}
                onDelete={handleDeleteProfile} onCreate={() => { setEditingProfile(null); setFormOpen(true); }}
                onRenameGroup={handleRenameGroup} onUngroup={handleUngroup} onMoveToGroup={handleMoveToGroup} />
            )}
          </aside>

          <main className="flex-1 flex flex-col overflow-hidden bg-background relative">
            {showSettings ? (
              <SettingsPage onBack={() => setShowSettings(false)} />
            ) : tabs.length > 0 ? (
              <Tabs value={effectiveKey} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center border-b">
                  <TabsList className="flex-1 overflow-x-auto rounded-none bg-transparent p-0 h-auto">
                    {tabs.map((tab) => (
                      <TabsTrigger key={tab.key} value={tab.key} className="gap-1.5 rounded-none pr-1.5 group">
                        {tab.type === "terminal" ? <IconTerminal2 size={14} /> : <IconFolder size={14} />}
                        {tab.title}
                        <span onClick={(e) => { e.stopPropagation(); closeTab(tab.key); }}
                          className="ml-1 p-0.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">×</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                {tabs.map((tab) => (
                  <TabsContent key={tab.key} value={tab.key} className="flex-1 overflow-hidden data-[state=inactive]:hidden">
                    {tab.type === "terminal" ? <TerminalPage sessionId={tab.sessionId} /> : <FileManagerPage sessionId={tab.sessionId} />}
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <HomePage onOpenTerminal={(id, t) => openTerminalTab(id, t)} />
            )}
          </main>

          <ServerStatsPanel sessionId={activeTab?.sessionId ?? null} collapsed={rightCollapsed} />
        </div>
        <BottomBar activeSessionId={activeTabKey} onOpenSettings={() => setShowSettings(true)} />
        <ConnectionForm open={formOpen} editingProfile={editingProfile}
          onClose={() => { setFormOpen(false); setEditingProfile(null); }} onSave={handleSaveProfile} />
      </div>
    </TooltipProvider>
  );
}

export default App;
