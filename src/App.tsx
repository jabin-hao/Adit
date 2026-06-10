/**
 * 根布局组件
 *
 * 结构：Layout(Sider + Content + Footer)
 * - Sider: ConnectionList（连接列表）
 * - Content: Tabs（首页 / 终端 / SFTP）
 * - Footer: StatusBar
 */
import { useCallback, useEffect, useState } from "react";
import { ConfigProvider, Layout, Tabs, theme } from "antd";
import type { TabsProps } from "antd";
import { useSessionStore } from "./store/sessionStore";
import { useAppTheme } from "./hooks/useAppTheme";
import { tauri } from "./lib/tauri";
import { ConnectionList } from "./components/connection/ConnectionList";
import { ConnectionForm, type FormValues } from "./components/connection/ConnectionForm";
import { StatusBar } from "./components/common/StatusBar";
import { ThemeToggle } from "./components/common/ThemeToggle";
import { HomePage } from "./pages/HomePage";
import { TerminalPage } from "./pages/TerminalPage";
import { FileManagerPage } from "./pages/FileManagerPage";
import { SettingsPage } from "./pages/SettingsPage";
import type { Profile } from "./lib/types";
import "./styles/index.css";

const { Sider, Content, Footer } = Layout;

function App() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const { theme: appTheme } = useAppTheme();
  const {
    tabs,
    activeTabKey,
    profiles,
    setProfiles,
    addProfile,
    removeProfile,
    openTerminalTab,
    closeTab,
    setActiveTab,
  } = useSessionStore();

  // 加载已保存的 profiles
  useEffect(() => {
    tauri.listProfiles().then(setProfiles).catch(console.error);
  }, [setProfiles]);

  // 处理连接表单提交
  const handleSaveProfile = useCallback(
    async (values: FormValues) => {
      const profile: Profile = {
        id: editingProfile?.id ?? "",
        ...values,
        created_at: editingProfile?.created_at ?? 0,
        updated_at: 0,
      };
      try {
        const saved = await tauri.saveProfile(profile);
        addProfile(saved);
        setFormOpen(false);
        setEditingProfile(null);
      } catch (err) {
        console.error("保存失败:", err);
      }
    },
    [editingProfile, addProfile],
  );

  // 处理删除 profile
  const handleDeleteProfile = useCallback(
    async (id: string) => {
      await tauri.deleteProfile(id);
      removeProfile(id);
    },
    [removeProfile],
  );

  // 从 connection list 双击连接
  const handleConnect = useCallback(
    (profile: Profile) => {
      openTerminalTab(profile.id, profile.name);
    },
    [openTerminalTab],
  );

  // 构建 Tabs items
  const tabItems: TabsProps["items"] = [
    // 首页固定标签页
    {
      key: "home",
      label: "🏠 首页",
      closable: false,
      children: (
        <HomePage
          onOpenTerminal={(sessionId, title) => openTerminalTab(sessionId, title)}
        />
      ),
    },
    // 设置固定标签页
    {
      key: "settings",
      label: "⚙️ 设置",
      closable: false,
      children: <SettingsPage />,
    },
    // 动态会话标签页
    ...tabs.map((tab) => ({
      key: tab.key,
      label: tab.title,
      closable: true,
      children:
        tab.type === "terminal" ? (
          <TerminalPage sessionId={tab.sessionId} />
        ) : (
          <FileManagerPage sessionId={tab.sessionId} />
        ),
    })),
  ];

  // 确定 Ant Design 主题算法
  const antdTheme = {
    algorithm:
      appTheme === "dark"
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm,
    token: { borderRadius: 6 },
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <Layout style={{ height: "100vh" }}>
        {/* 左侧边栏 */}
        <Sider
          width={280}
          theme={appTheme === "dark" ? "dark" : "light"}
          className="overflow-hidden"
        >
          <ConnectionList
            profiles={profiles}
            onConnect={handleConnect}
            onEdit={(p) => {
              setEditingProfile(p);
              setFormOpen(true);
            }}
            onDelete={handleDeleteProfile}
            onCreate={() => {
              setEditingProfile(null);
              setFormOpen(true);
            }}
          />
        </Sider>

        {/* 主区域 */}
        <Layout>
          {/* 顶部操作栏 */}
          <div className="flex items-center justify-end px-3 py-1 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <ThemeToggle />
          </div>

          {/* 内容区 */}
          <Content className="overflow-hidden">
            <Tabs
              activeKey={activeTabKey ?? "home"}
              onChange={setActiveTab}
              onEdit={(key, action) => {
                if (action === "remove" && typeof key === "string") {
                  closeTab(key);
                }
              }}
              type="editable-card"
              hideAdd
              items={tabItems}
              className="h-full"
              style={{ height: "100%" }}
              tabBarStyle={{ margin: 0, paddingLeft: 8 }}
            />
          </Content>

          {/* 底部状态栏 */}
          <Footer style={{ padding: 0 }}>
            <StatusBar activeSessionId={activeTabKey} />
          </Footer>
        </Layout>
      </Layout>

      {/* 连接编辑表单 */}
      <ConnectionForm
        open={formOpen}
        editingProfile={editingProfile}
        onClose={() => {
          setFormOpen(false);
          setEditingProfile(null);
        }}
        onSave={handleSaveProfile}
      />
    </ConfigProvider>
  );
}

export default App;
