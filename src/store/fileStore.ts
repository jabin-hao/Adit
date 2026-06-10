/**
 * 文件管理状态 —— 当前浏览的远程目录、选中文件、传输任务
 */
import { create } from "zustand";
import type { FileEntry } from "../lib/types";

interface TransferTask {
  id: string;
  sessionId: string;
  remotePath: string;
  direction: "upload" | "download";
  totalBytes: number;
  transferredBytes: number;
  status: "pending" | "transferring" | "completed" | "failed";
}

interface FileStore {
  // ── 当前浏览状态（按 sessionId 分） ──
  currentPaths: Map<string, string>;
  fileLists: Map<string, FileEntry[]>;
  loading: boolean;

  // ── 选中文件 ──
  selectedFiles: string[];

  // ── 传输任务 ──
  transfers: TransferTask[];

  // ── 操作 ──
  setCurrentPath: (sessionId: string, path: string) => void;
  setFileList: (sessionId: string, files: FileEntry[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedFiles: (files: string[]) => void;
  addTransfer: (task: TransferTask) => void;
  updateTransfer: (id: string, partial: Partial<TransferTask>) => void;
  removeTransfer: (id: string) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  currentPaths: new Map(),
  fileLists: new Map(),
  loading: false,
  selectedFiles: [],
  transfers: [],

  setCurrentPath: (sessionId, path) =>
    set((state) => {
      const newPaths = new Map(state.currentPaths);
      newPaths.set(sessionId, path);
      return { currentPaths: newPaths };
    }),

  setFileList: (sessionId, files) =>
    set((state) => {
      const newLists = new Map(state.fileLists);
      newLists.set(sessionId, files);
      return { fileLists: newLists, loading: false };
    }),

  setLoading: (loading) => set({ loading }),

  setSelectedFiles: (files) => set({ selectedFiles: files }),

  addTransfer: (task) =>
    set((state) => ({
      transfers: [...state.transfers, task],
    })),

  updateTransfer: (id, partial) =>
    set((state) => ({
      transfers: state.transfers.map((t) =>
        t.id === id ? { ...t, ...partial } : t,
      ),
    })),

  removeTransfer: (id) =>
    set((state) => ({
      transfers: state.transfers.filter((t) => t.id !== id),
    })),
}));
