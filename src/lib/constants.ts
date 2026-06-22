/** 全局常量定义 */

/** 默认 SSH 端口 */
export const DEFAULT_SSH_PORT = 22;

/** 默认终端字体大小 */
export const DEFAULT_FONT_SIZE = 14;

/** 终端回滚行数 */
export const DEFAULT_SCROLLBACK = 5000;

/** 默认心跳间隔（秒） */
export const DEFAULT_KEEPALIVE = 30;

/** 侧边栏默认宽度（px） */
export const DEFAULT_SIDEBAR_WIDTH = 280;

/** 侧边栏最小/最大宽度 */
export const SIDEBAR_MIN_WIDTH = 200;
export const SIDEBAR_MAX_WIDTH = 450;

/** 文件传输分块大小（字节） */
export const FILE_CHUNK_SIZE = 64 * 1024; // 64KB

/** stdin 通道缓冲区大小 */
export const STDIN_BUFFER_SIZE = 4096;

/** 默认终端字体族 */
export const DEFAULT_FONT_FAMILY =
  "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace";

/** Tokyo Night 终端主题 */
export const TERMINAL_THEME = {
  background: "#1a1b26",
  foreground: "#a9b1d6",
  cursor: "#c0caf5",
  selectionBackground: "#33467c",
  black: "#414868",
  red: "#f7768e",
  green: "#9ece6a",
  yellow: "#e0af68",
  blue: "#7aa2f7",
  magenta: "#bb9af7",
  cyan: "#7dcfff",
  white: "#c0caf5",
  brightBlack: "#414868",
  brightRed: "#f7768e",
  brightGreen: "#9ece6a",
  brightYellow: "#e0af68",
  brightBlue: "#7aa2f7",
  brightMagenta: "#bb9af7",
  brightCyan: "#7dcfff",
  brightWhite: "#c0caf5",
} as const;

/** 服务器状态轮询间隔（毫秒） */
export const SERVER_STATS_POLL_MS = 3000;
