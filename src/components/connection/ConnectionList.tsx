/**
 * 连接列表面板 —— 左侧侧边栏内容
 */
import { Button, List, Popconfirm, Space, Tag, Typography } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, FolderOpenOutlined } from "@ant-design/icons";
import type { Profile } from "../../lib/types";

interface ConnectionListProps {
  profiles: Profile[];
  onConnect: (profile: Profile) => void;
  onEdit: (profile: Profile) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export function ConnectionList({
  profiles,
  onConnect,
  onEdit,
  onDelete,
  onCreate,
}: ConnectionListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <Typography.Text strong>连接列表</Typography.Text>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={onCreate}>
          新建
        </Button>
      </div>

      {/* 列表 */}
      <div className="flex-1 overflow-y-auto">
        <List
          dataSource={profiles}
          locale={{ emptyText: "暂无保存的连接，点击「新建」添加" }}
          renderItem={(profile) => (
            <List.Item
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-4"
              onClick={() => onConnect(profile)}
              actions={[
                <Button
                  key="open"
                  type="text"
                  size="small"
                  icon={<FolderOpenOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onConnect(profile);
                  }}
                  title="打开 SFTP"
                />,
                <Button
                  key="edit"
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(profile);
                  }}
                />,
                <Popconfirm
                  key="delete"
                  title="确定删除此连接？"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    onDelete(profile.id);
                  }}
                  onCancel={(e) => e?.stopPropagation()}
                >
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    {profile.name}
                    <Tag color="blue" className="text-xs">
                      {profile.auth_type}
                    </Tag>
                  </Space>
                }
                description={
                  <Typography.Text type="secondary" className="text-xs">
                    {profile.username}@{profile.host}:{profile.port}
                  </Typography.Text>
                }
              />
            </List.Item>
          )}
        />
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <Typography.Text type="secondary" className="text-xs">
          双击连接打开终端，点击文件夹图标浏览文件
        </Typography.Text>
      </div>
    </div>
  );
}
