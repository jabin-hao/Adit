/**
 * 远程路径面包屑导航
 *
 * TODO: 使用 Ant Design Breadcrumb 组件，实现点击路径段跳转
 * 当前占位，具体实现留给你完成。
 */
import { Typography } from "antd";

interface FileBreadcrumbProps {
  path: string;
}

export function FileBreadcrumb({ path }: FileBreadcrumbProps) {
  return <Typography.Text type="secondary">{path}</Typography.Text>;
}
