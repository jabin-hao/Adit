/**
 * SFTP 文件操作 Hook
 */
import { useCallback } from "react";
import { tauri } from "../lib/tauri";
import { useFileStore } from "../store/fileStore";
import type { FileEntry } from "../lib/types";

export function useSftp(sessionId: string) {
  const { currentPaths, setCurrentPath, setFileList, setLoading } = useFileStore();

  const currentPath = currentPaths.get(sessionId) ?? "/";

  /** 列出当前目录 */
  const listDir = useCallback(
    async (path?: string) => {
      const targetPath = path ?? currentPath;
      setLoading(true);
      try {
        const files = await tauri.listDirectory(sessionId, targetPath);
        setCurrentPath(sessionId, targetPath);
        setFileList(sessionId, files);
      } catch {
        setLoading(false);
      }
    },
    [sessionId, currentPath, setCurrentPath, setFileList, setLoading],
  );

  /** 导航到子目录 */
  const navigateTo = useCallback(
    (dir: FileEntry) => {
      if (dir.is_dir) {
        void listDir(dir.path);
      }
    },
    [listDir],
  );

  /** 返回上级目录 */
  const goUp = useCallback(() => {
    const parent = currentPath.split("/").slice(0, -1).join("/") || "/";
    void listDir(parent);
  }, [currentPath, listDir]);

  /** 删除文件 */
  const remove = useCallback(
    async (path: string) => {
      await tauri.removeEntry(sessionId, path);
      void listDir(); // 刷新列表
    },
    [sessionId, listDir],
  );

  return { currentPath, listDir, navigateTo, goUp, remove };
}
