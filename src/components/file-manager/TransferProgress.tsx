/**
 * 文件传输进度条
 *
 * TODO: 监听 sftp-progress 事件，使用 Ant Design Progress 组件展示
 */
import { Empty } from "antd";

export function TransferProgress() {
  // TODO: 从 fileStore 读取传输任务，渲染进度条列表
  return <Empty description="无传输任务" />;
}
