/**
 * SFTP 工具栏 —— 上传、新建文件夹、刷新等操作
 *
 * TODO: 实现具体功能
 */
import { Button, Space } from "antd";
import { UploadOutlined, FolderAddOutlined, ReloadOutlined } from "@ant-design/icons";

interface FileToolbarProps {
  onRefresh: () => void;
}

export function FileToolbar({ onRefresh }: FileToolbarProps) {
  return (
    <Space className="mb-2">
      <Button size="small" icon={<UploadOutlined />}>
        上传
      </Button>
      <Button size="small" icon={<FolderAddOutlined />}>
        新建文件夹
      </Button>
      <Button size="small" icon={<ReloadOutlined />} onClick={onRefresh}>
        刷新
      </Button>
    </Space>
  );
}
