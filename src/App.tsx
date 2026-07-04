import { useCallback, useEffect, useState } from "react";
import { Terminal, Folder, Settings, Plus, Pencil, X } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import { useConfigStore } from "@/store/configStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { tauri } from "@/lib/tauri";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppLayout } from "@/components/layout/useAppLayout";
import { ConnectionList } from "@/components/connection/ConnectionList";
import { ConnectionFormTab } from "@/components/connection/ConnectionFormTab";
import { ConnectionForm, type FormValues } from "@/components/connection/ConnectionForm";
import { HomePage } from "@/pages/HomePage";
import { TerminalPage } from "@/pages/TerminalPage";
import { FileManagerPage } from "@/pages/FileManagerPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BottomBar } from "@/components/common/BottomBar";
import { ServerStatsPanel } from "@/components/server-stats/ServerStatsPanel";
import type { Profile } from "@/lib/types";
import "@/styles/index.css";

function App() {
  const { theme: appTheme } = useAppTheme();
  const loadFromBackend = useConfigStore((s) => s.loadFromBackend);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const addProfile = useSessionStore((s) => s.addProfile);
  const setProfiles = useSessionStore((s) => s.setProfiles);
  const openSettingsTab = useSessionStore((s) => s.openSettingsTab);

  // 启动时加载预置数据
  useEffect(() => {
    tauri.listProfiles().then(setProfiles).catch(console.error);
    tauri.getSettings().then(loadFromBackend).catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveProfile = useCallback(
    async (values: FormValues) => {
      const profile: Profile = {
        id: editingProfile?.id ?? "",
        ...values,
        created_at: editingProfile?.created_at ?? Date.now(),
        updated_at: Date.now(),
      };
      try {
        const saved = await tauri.saveProfile(profile);
        addProfile(saved);
        setDrawerOpen(false);
        setEditingProfile(null);
      } catch (err) {
        console.error(err);
      }
    },
    [editingProfile, addProfile],
  );

  useEffect(() => {
    tauri.getSettings().then(loadFromBackend).catch(console.error);
  }, [loadFromBackend]);
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      appTheme === "dark" ||
        (appTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches),
    );
  }, [appTheme]);

  return (
    <TooltipProvider>
      <AppLayout sidebar={<Sidebar onNewConnection={() => setDrawerOpen(true)} onEditConnection={(p) => { setEditingProfile(p); setDrawerOpen(true); }} />} rightPanel={<RightPanel />} footer={<Footer />} onNewConnection={() => { setEditingProfile(null); setDrawerOpen(true); }} onOpenSettings={openSettingsTab}>
        <MainContent onNewConnection={() => setDrawerOpen(true)} />
      </AppLayout>
      <ConnectionForm
        open={drawerOpen}
        editingProfile={editingProfile}
        onClose={() => { setDrawerOpen(false); setEditingProfile(null); }}
        onSave={handleSaveProfile}
      />
    </TooltipProvider>
  );
}

/* ── 左侧栏 ─────────────────────────────────── */

function Sidebar({ onNewConnection, onEditConnection }: { onNewConnection: () => void; onEditConnection: (p: Profile) => void }) {
  const { collapseSidebar } = useAppLayout();
  const { profiles, addProfile, removeProfile, setProfiles, openTerminalTab } =
    useSessionStore();

  const handleConnect = useCallback(
    (profile: Profile) => openTerminalTab(profile.id, profile.name),
    [openTerminalTab],
  );
  const handleDelete = useCallback(
    async (id: string) => {
      await tauri.deleteProfile(id);
      removeProfile(id);
    },
    [removeProfile],
  );
  const handleRenameGroup = useCallback(
    async (oldName: string, newName: string) => {
      const affected = profiles.filter((p) => p.group === oldName);
      for (const p of affected) {
        try {
          const saved = await tauri.saveProfile({ ...p, group: newName });
          addProfile(saved);
        } catch (err) {
          console.error(err);
        }
      }
    },
    [profiles, addProfile],
  );
  const handleUngroup = useCallback(
    async (group: string) => {
      const affected = profiles.filter((p) => p.group === group);
      for (const p of affected) {
        try {
          const saved = await tauri.saveProfile({ ...p, group: "" });
          addProfile(saved);
        } catch (err) {
          console.error(err);
        }
      }
    },
    [profiles, addProfile],
  );
  const handleMoveToGroup = useCallback(
    async (profileId: string, group: string) => {
      const p = profiles.find((pr) => pr.id === profileId);
      if (!p) return;
      try {
        const saved = await tauri.saveProfile({ ...p, group });
        addProfile(saved);
      } catch (err) {
        console.error(err);
      }
    },
    [profiles, addProfile],
  );

  const handleRefresh = useCallback(() => {
    tauri.listProfiles().then(setProfiles).catch(console.error);
  }, [setProfiles]);

  return (
    <ConnectionList
      profiles={profiles}
      onConnect={handleConnect}
      onDelete={handleDelete}
      onCreate={onNewConnection}
      onEditDrawer={onEditConnection}
      onRenameGroup={handleRenameGroup}
      onUngroup={handleUngroup}
      onMoveToGroup={handleMoveToGroup}
      onToggleCollapse={collapseSidebar}
      onRefresh={handleRefresh}
    />
  );
}

/* ── 右侧面板 ───────────────────────────────── */

function RightPanel() {
  const { rightCollapsed, collapseRightPanel } = useAppLayout();
  const { tabs, activeTabKey } = useSessionStore();
  const activeTab = tabs.find((t) => t.key === activeTabKey);

  return (
    <ServerStatsPanel
      sessionId={activeTab?.sessionId ?? null}
      collapsed={rightCollapsed}
      onToggleCollapse={collapseRightPanel}
    />
  );
}

/* ── 底栏 ───────────────────────────────────── */

function Footer() {
  const { tabs, activeTabKey } = useSessionStore();
  const effectiveKey =
    activeTabKey && tabs.some((t) => t.key === activeTabKey)
      ? activeTabKey
      : (tabs[0]?.key ?? "");
  return (
    <BottomBar activeSessionId={effectiveKey} />
  );
}

/* ── 主内容区 ───────────────────────────────── */

function MainContent({ onNewConnection }: { onNewConnection: () => void }) {
  const { tabs, activeTabKey, openTerminalTab, closeTab, setActiveTab, addProfile } =
    useSessionStore();

  const effectiveKey =
    activeTabKey && tabs.some((t) => t.key === activeTabKey)
      ? activeTabKey
      : (tabs[0]?.key ?? "");

  const handleSaveProfile = useCallback(
    async (values: FormValues, editingProfile?: Profile | null) => {
      const profile: Profile = {
        id: editingProfile?.id ?? "",
        ...values,
        created_at: editingProfile?.created_at ?? 0,
        updated_at: 0,
      };
      try {
        const saved = await tauri.saveProfile(profile);
        addProfile(saved);
        const tabKey = editingProfile
          ? `conn-${editingProfile.id}`
          : tabs.find((t) => t.type === "connection" && t.key.startsWith("conn-new-"))?.key;
        if (tabKey) closeTab(tabKey);
      } catch (err) {
        console.error(err);
      }
    },
    [addProfile, closeTab, tabs],
  );

  const tabIcon = (tab: (typeof tabs)[number]) => {
    switch (tab.type) {
      case "terminal":
        return <Terminal size={13} />;
      case "sftp":
        return <Folder size={13} />;
      case "settings":
        return <Settings size={13} />;
      case "connection":
        return tab.editingProfile ? <Pencil size={13} /> : <Plus size={13} />;
    }
  };

  if (tabs.length === 0) {
    return (
      <HomePage
        onOpenTerminal={(id, t) => openTerminalTab(id, t)}
        onOpenConnection={onNewConnection}
      />
    );
  }

  return (
    <>
      {/* 标签栏 */}
      <div className="flex items-center border-b bg-muted/50 h-8 shrink-0">
        <div className="flex overflow-x-auto h-full">
          {tabs.map((tab) => {
            const active = effectiveKey === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-none inline-flex items-center gap-1.5 h-full px-3 text-xs border-r border-border/50 group select-none",
                  active ? "bg-background text-foreground" : "text-muted-foreground hover:bg-muted/60",
                )}
              >
                {tabIcon(tab)}
                <span className="truncate max-w-[120px]">{tab.title}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.key);
                  }}
                  className="ml-0.5 p-0.5 rounded-sm text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <X size={11} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 标签内容 */}
      {tabs.map((tab) => (
        <div
          key={tab.key}
          className={cn("flex-1 flex flex-col overflow-hidden", effectiveKey !== tab.key && "hidden")}
        >
          {tab.type === "terminal" && <TerminalPage sessionId={tab.sessionId!} />}
          {tab.type === "sftp" && <FileManagerPage sessionId={tab.sessionId!} />}
          {tab.type === "settings" && <SettingsPage />}
          {tab.type === "connection" && (
            <ConnectionFormTab
              editingProfile={tab.editingProfile}
              onClose={() => closeTab(tab.key)}
              onSave={(values) => handleSaveProfile(values, tab.editingProfile)}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default App;
