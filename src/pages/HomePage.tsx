/**
 * 首页 —— 显示保存的连接列表和快速连接入口
 *
 * 工作流程：
 * 1. 加载已保存的 profiles
 * 2. 展示为卡片列表（双击连接 → 打开终端标签页）
 * 3. "新建连接"按钮打开 ConnectionForm
 */
import { useCallback, useEffect, useState } from "react";
import { Empty, Flex, Typography } from "antd";
import { useSessionStore } from "../store/sessionStore";
import { tauri } from "../lib/tauri";
import { ConnectionCard } from "../components/connection/ConnectionCard";
import { ConnectionForm, type FormValues } from "../components/connection/ConnectionForm";
import type { Profile } from "../lib/types";

interface HomePageProps {
  onOpenTerminal: (sessionId: string, title: string) => void;
}

export function HomePage({ onOpenTerminal }: HomePageProps) {
  const { profiles, setProfiles, addProfile } = useSessionStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  // 加载已保存的 profiles
  useEffect(() => {
    tauri.listProfiles().then(setProfiles).catch(console.error);
  }, [setProfiles]);

  // 保存（新建或编辑）
  const handleSave = useCallback(
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
        console.error("保存配置失败:", err);
      }
    },
    [editingProfile, addProfile],
  );

  // 连接
  const handleConnect = useCallback(
    async (profile: Profile) => {
      // 使用已保存的配置建立连接
      // TODO: 需要完整 ConnectRequest（含 auth），Profile 目前只存 auth_type
      // 这里作为示例，仅打开终端标签页
      onOpenTerminal(profile.id, profile.name);
    },
    [onOpenTerminal],
  );

  return (
    <div className="p-6">
      <Typography.Title level={3} className="mb-4">
        Adit — SSH 客户端
      </Typography.Title>

      {profiles.length === 0 ? (
        <Empty description="暂无保存的连接">
          <a onClick={() => setFormOpen(true)}>新建连接</a>
        </Empty>
      ) : (
        <Flex wrap gap="middle">
          {profiles.map((p) => (
            <ConnectionCard key={p.id} profile={p} onConnect={handleConnect} />
          ))}
        </Flex>
      )}

      {/* 新建/编辑表单 */}
      <ConnectionForm
        open={formOpen}
        editingProfile={editingProfile}
        onClose={() => {
          setFormOpen(false);
          setEditingProfile(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
