/**
 * Adit 前端类型定义 —— 与 Rust types/ 保持一致
 *
 * 命名规则：
 * - Rust snake_case 字段在 Tauri IPC 中自动转为 camelCase
 * - enum 的 tagged union 通过 serde(tag = "type") 区分
 */

// ── 认证方式 ────────────────────────────────────

export interface AuthMethodPassword {
  type: "password";
  password: string;
}

export interface AuthMethodKey {
  type: "key";
  key_path: string;
  passphrase?: string | null;
}

export interface AuthMethodAgent {
  type: "agent";
}

export type AuthMethod = AuthMethodPassword | AuthMethodKey | AuthMethodAgent;

// ── 连接请求/响应 ───────────────────────────────

export interface ConnectRequest {
  name: string;
  host: string;
  port: number;
  username: string;
  auth: AuthMethod;
  keepalive_secs: number;
}

export interface DisconnectRequest {
  session_id: string;
}

export interface PtyResizeRequest {
  session_id: string;
  cols: number;
  rows: number;
}

// ── 会话信息 ────────────────────────────────────

export type SessionStatus = "connecting" | "connected" | "disconnected";

export interface SessionInfo {
  id: string;
  name: string;
  target: string;
  status: SessionStatus;
}

// ── SFTP 文件条目 ───────────────────────────────

export interface FileEntry {
  name: string;
  path: string;
  is_dir: boolean;
  is_symlink: boolean;
  size: number;
  permissions: string;
  owner: string;
  group: string;
  modified_at: number;
}

// ── 事件 Payload ────────────────────────────────

export interface SshOutputPayload {
  session_id: string;
  data: number[];
  stream: "stdout" | "stderr";
}

export interface SshConnectedPayload {
  session_id: string;
  host: string;
}

export interface SshDisconnectedPayload {
  session_id: string;
  reason: string;
  is_error: boolean;
}

export interface SftpProgressPayload {
  session_id: string;
  direction: "upload" | "download";
  remote_path: string;
  bytes_transferred: number;
  total_bytes: number;
}

export interface SftpCompletedPayload {
  session_id: string;
  direction: "upload" | "download";
  remote_path: string;
  success: boolean;
}

// ── 配置 ────────────────────────────────────────

export interface Profile {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  auth_type: string;
  group: string;
  created_at: number;
  updated_at: number;
}

export interface AppSettings {
  theme: string;
  font_size: number;
  font_family: string;
  default_port: number;
  scrollback_lines: number;
}

// ── 错误 ─────────────────────────────────────────

/** Rust CommandError 的前端镜像 */
export interface CommandError {
  code: string;
  message: string;
}

/** 错误码枚举 */
export const ErrorCode = {
  AUTH_FAILED: "AUTH_FAILED",
  CONNECTION_TIMEOUT: "CONNECTION_TIMEOUT",
  HOST_UNREACHABLE: "HOST_UNREACHABLE",
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
  SFTP_NOT_AVAILABLE: "SFTP_NOT_AVAILABLE",
  FILE_NOT_FOUND: "FILE_NOT_FOUND",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  INVALID_INPUT: "INVALID_INPUT",
  IO_ERROR: "IO_ERROR",
  UNKNOWN: "UNKNOWN",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

// ── 标签页 ──────────────────────────────────────

export interface SessionTab {
  key: string;
  sessionId: string;
  title: string;
  type: "terminal" | "sftp";
}

// ── 服务器状态 ──────────────────────────────────

/** 服务器状态信息（与 Rust types::stats::ServerStats camelCase 对齐） */
export interface ServerStats {
  cpuUsagePercent: number;
  cpuCores: number;
  loadAvg1: number;
  loadAvg5: number;
  loadAvg15: number;
  memTotalMb: number;
  memUsedMb: number;
  memAvailableMb: number;
  diskTotalGb: number;
  diskUsedGb: number;
  uptimeSecs: number;
  hostname: string;
  osName: string;
  kernelVersion: string;
}
