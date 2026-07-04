/**
 * Tauri IPC 封装 —— 类型安全的 invoke + event listen
 *
 * 命名规则：
 * - Rust 命令名使用 snake_case（Tauri 内置）
 * - 前端调用时 Tauri 自动转为 camelCase
 * - 事件名使用 kebab-case
 */
import { invoke } from "@tauri-apps/api/core";
import { type UnlistenFn, listen } from "@tauri-apps/api/event";
import type {
  AppSettings,
  ConnectRequest,
  DisconnectRequest,
  FileEntry,
  Profile,
  PtyResizeRequest,
  ServerStats,
  SftpCompletedPayload,
  SftpProgressPayload,
  SshConnectedPayload,
  SshDisconnectedPayload,
  SshOutputPayload,
} from "./types";

// ── SSH 命令 ────────────────────────────────────

export const tauri = {
  /** 建立 SSH 连接，返回 session_id */
  connectSsh(config: ConnectRequest): Promise<string> {
    return invoke<string>("connect_ssh", { config });
  },

  /** 断开连接 */
  disconnectSsh(req: DisconnectRequest): Promise<void> {
    return invoke("disconnect_ssh", { req });
  },

  /** 写入终端 stdin（用户按键） */
  writeStdin(sessionId: string, data: number[]): Promise<void> {
    return invoke("write_stdin", { sessionId, data });
  },

  /** 调整 PTY 大小 */
  resizePty(req: PtyResizeRequest): Promise<void> {
    return invoke("resize_pty", { req });
  },

  /** 执行单条命令（非交互式） */
  execCommand(sessionId: string, command: string, timeoutSecs: number): Promise<string> {
    return invoke("exec_command", { sessionId, command, timeoutSecs });
  },

  // ── 服务器状态命令 ──────────────────────────────

  /** 获取服务器状态（CPU/内存/负载/磁盘/运行时长） */
  getServerStats(sessionId: string): Promise<ServerStats> {
    return invoke<ServerStats>("get_server_stats", { sessionId });
  },

  // ── SFTP 命令 ──────────────────────────────────

  /** 列出目录内容 */
  listDirectory(sessionId: string, path: string): Promise<FileEntry[]> {
    return invoke("list_directory", { sessionId, path });
  },

  /** 获取文件元信息 */
  statPath(sessionId: string, path: string): Promise<FileEntry> {
    return invoke("stat_path", { sessionId, path });
  },

  /** 读取远程文件内容 */
  readFile(sessionId: string, remotePath: string, offset: number, chunkSize: number): Promise<number[]> {
    return invoke("read_file", { sessionId, remotePath, offset, chunkSize });
  },

  /** 写入远程文件 */
  writeFile(sessionId: string, remotePath: string, data: number[], overwrite: boolean): Promise<void> {
    return invoke("write_file", { sessionId, remotePath, data, overwrite });
  },

  /** 创建远程目录 */
  createDirectory(sessionId: string, path: string): Promise<void> {
    return invoke("create_directory", { sessionId, path });
  },

  /** 删除文件或目录 */
  removeEntry(sessionId: string, path: string): Promise<void> {
    return invoke("remove_entry", { sessionId, path });
  },

  /** 重命名/移动 */
  renameEntry(sessionId: string, from: string, to: string): Promise<void> {
    return invoke("rename_entry", { sessionId, from, to });
  },

  // ── 配置命令 ──────────────────────────────────

  /** 保存连接配置 */
  saveProfile(profile: Profile): Promise<Profile> {
    return invoke("save_profile", { profile });
  },

  /** 列出所有配置 */
  listProfiles(): Promise<Profile[]> {
    return invoke("list_profiles");
  },

  /** 删除配置 */
  deleteProfile(id: string): Promise<void> {
    return invoke("delete_profile", { id });
  },

  /** 读取应用设置 */
  getSettings(): Promise<AppSettings> {
    return invoke("get_settings");
  },

  /** 保存应用设置 */
  saveSettings(settings: AppSettings): Promise<void> {
    return invoke("save_settings", { newSettings: settings });
  },

  // ── 应用命令 ──────────────────────────────────

  /** 获取应用版本 */
  getVersion(): Promise<string> {
    return invoke<string>("get_version");
  },
};

// ── 事件监听 ────────────────────────────────────

/** 监听 SSH 终端输出 */
export function onSshOutput(callback: (payload: SshOutputPayload) => void): Promise<UnlistenFn> {
  return listen<SshOutputPayload>("ssh-output", (event) => callback(event.payload));
}

/** 监听连接成功 */
export function onSshConnected(callback: (payload: SshConnectedPayload) => void): Promise<UnlistenFn> {
  return listen<SshConnectedPayload>("ssh-connected", (event) => callback(event.payload));
}

/** 监听连接断开 */
export function onSshDisconnected(
  callback: (payload: SshDisconnectedPayload) => void,
): Promise<UnlistenFn> {
  return listen<SshDisconnectedPayload>("ssh-disconnected", (event) => callback(event.payload));
}

/** 监听 SFTP 传输进度 */
export function onSftpProgress(callback: (payload: SftpProgressPayload) => void): Promise<UnlistenFn> {
  return listen<SftpProgressPayload>("sftp-progress", (event) => callback(event.payload));
}

/** 监听 SFTP 传输完成 */
export function onSftpCompleted(
  callback: (payload: SftpCompletedPayload) => void,
): Promise<UnlistenFn> {
  return listen<SftpCompletedPayload>("sftp-completed", (event) => callback(event.payload));
}
