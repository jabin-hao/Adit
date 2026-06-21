/**
 * SFTP 文件管理页面
 */
import { useEffect } from "react";
import { FileTable } from "../components/file-manager/FileTable";
import { FileToolbar } from "../components/file-manager/FileToolbar";
import { TransferProgress } from "../components/file-manager/TransferProgress";
import { useSftp } from "../hooks/useSftp";

interface FileManagerPageProps {
  sessionId: string;
}

export function FileManagerPage({ sessionId }: FileManagerPageProps) {
  const { listDir } = useSftp(sessionId);

  // 首次加载根目录
  useEffect(() => {
    void listDir("/");
  }, [listDir]);

  return (
    <div className="flex flex-col h-full p-2">
      <FileToolbar onRefresh={() => listDir()} />
      <div className="flex-1 overflow-hidden">
        <FileTable sessionId={sessionId} />
      </div>
      <TransferProgress />
    </div>
  );
}
