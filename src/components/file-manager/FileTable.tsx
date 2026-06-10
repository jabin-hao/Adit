/**
 * SFTP 文件列表组件
 *
 * TODO: 完善文件操作（上传/下载/删除/重命名/权限修改）
 */
import { Button, Space, Table, Typography } from "antd";
import {
  FileOutlined,
  FolderOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useSftp } from "../../hooks/useSftp";
import { useFileStore } from "../../store/fileStore";
import type { FileEntry } from "../../lib/types";

interface FileTableProps {
  sessionId: string;
}

export function FileTable({ sessionId }: FileTableProps) {
  const { currentPath, navigateTo, goUp, remove } = useSftp(sessionId);
  const files = useFileStore((s) => s.fileLists.get(sessionId) ?? []);
  const loading = useFileStore((s) => s.loading);

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: FileEntry) => (
        <Space
          className="cursor-pointer hover:text-blue-500"
          onClick={() => navigateTo(record)}
        >
          {record.is_dir ? <FolderOutlined /> : <FileOutlined />}
          <Typography.Text>{record.name}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      width: 100,
      render: (size: number, record: FileEntry) =>
        record.is_dir ? "-" : formatFileSize(size),
    },
    {
      title: "权限",
      dataIndex: "permissions",
      key: "permissions",
      width: 110,
    },
    {
      title: "修改时间",
      dataIndex: "modified_at",
      key: "modified_at",
      width: 180,
      render: (ts: number) =>
        ts ? new Date(ts * 1000).toLocaleString() : "-",
    },
    {
      title: "操作",
      key: "actions",
      width: 100,
      render: (_: unknown, record: FileEntry) => (
        <Space size="small">
          {!record.is_dir && (
            <Button type="text" size="small" icon={<DownloadOutlined />} />
          )}
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => remove(record.path)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col p-2">
      <Space className="mb-2">
        <Button size="small" onClick={goUp}>
          ⬆ 上级目录
        </Button>
        <Typography.Text type="secondary" className="text-sm">
          {currentPath}
        </Typography.Text>
      </Space>
      <Table
        size="small"
        columns={columns}
        dataSource={files}
        rowKey="path"
        loading={loading}
        pagination={false}
        scroll={{ y: "calc(100vh - 200px)" }}
        onRow={(record) => ({
          onDoubleClick: () => navigateTo(record),
        })}
      />
    </div>
  );
}

/** 格式化文件大小 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`;
}
