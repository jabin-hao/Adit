# Adit

> Adit — 矿井的水平入口，象征着进入远程服务器的通道。

基于 [Tauri](https://tauri.app) 的跨平台 SSH/SFTP 客户端，Rust 后端处理网络 I/O，React + TypeScript 构建用户界面。

## ✨ 特性

- 🖥️ **跨平台** — Windows、macOS、Linux 原生支持
- 🔐 **SSH/SFTP** — 支持密码、私钥、SSH Agent 多种认证
- 📁 **文件管理** — 图形化 SFTP 文件浏览、上传、下载
- 🎨 **现代界面** — React + Ant Design，明暗主题切换
- ⚡ **高性能** — Rust 后端处理网络 I/O，Bun 运行时驱动前端
- 📋 **多标签页** — 终端和 SFTP 以标签页管理，可同时连接多台服务器
- 🔧 **配置持久化** — 连接配置保存到本地 JSON 文件

## 🛠️ 技术栈

| 层 | 技术 |
|------|----------|
| **桌面框架** | [Tauri 2.x](https://tauri.app) |
| **后端语言** | [Rust](https://www.rust-lang.org) edition 2021 |
| **SSH 库** | [russh 0.44](https://github.com/warp-tech/russh) + [russh-sftp 2.0](https://crates.io/crates/russh-sftp) |
| **异步运行时** | [tokio](https://tokio.rs) |
| **前端运行时** | [Bun](https://bun.sh) |
| **UI 框架** | [React 19](https://react.dev) + [TypeScript 6](https://www.typescriptlang.org) |
| **组件库** | [Ant Design 5.x](https://ant.design) |
| **终端** | [xterm.js 5.5](https://xtermjs.org) |
| **状态管理** | [Zustand 5](https://zustand-demo.pmnd.rs) |
| **样式** | [Tailwind CSS 4](https://tailwindcss.com) |
| **测试** | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com/react) |
| **包管理** | [Bun](https://bun.sh) |

## 🚀 快速开始

### 前置依赖

- [Rust](https://rustup.rs) >= 1.77
- [Bun](https://bun.sh) >= 1.1
- 平台构建依赖（详见 [Tauri 前置要求](https://tauri.app/start/prerequisites/)）

### 开发

```bash
# 克隆仓库
git clone https://github.com/your-org/adit.git
cd adit

# 安装前端依赖
bun install

# 启动开发模式（前后端热更新）
bun dev
```

### 常用命令

| 命令 | 说明 |
|------|------|
| `bun dev` | 启动 Tauri 开发模式 |
| `bun run build` | 生产构建打包 |
| `bun run lint` | ESLint 代码检查 |
| `bun run check` | TypeScript 类型检查 |
| `bun test` | 运行前端测试 |
| `bun run test:watch` | 前端测试监听模式 |
| `cargo test` | 运行 Rust 测试（在 `src-tauri/` 下） |
| `cargo clippy` | Rust 代码检查（在 `src-tauri/` 下） |

## 📁 项目结构

```
adit/
├── .editorconfig
├── .gitattributes
├── .github/workflows/ci.yml        # CI 流水线
├── .vscode/                         # 编辑器统一配置
│
├── src/                             # React 前端
│   ├── main.tsx                     # 应用入口
│   ├── App.tsx                      # 根布局（Ant Design Layout + Tabs）
│   ├── pages/                       # 页面级组件
│   │   ├── HomePage.tsx             # 首页（连接列表）
│   │   ├── TerminalPage.tsx         # 终端页面
│   │   ├── FileManagerPage.tsx      # SFTP 文件管理
│   │   └── SettingsPage.tsx         # 设置页
│   ├── components/                  # 可复用 UI 组件
│   │   ├── terminal/                # 终端相关
│   │   ├── file-manager/            # SFTP 文件管理
│   │   ├── connection/              # 连接表单/列表
│   │   └── common/                  # 通用组件
│   ├── hooks/                       # 自定义 Hooks
│   │   ├── useSSH.ts                # SSH 连接管理
│   │   ├── useTerminal.ts           # xterm.js 生命周期
│   │   ├── useSftp.ts               # SFTP 文件操作
│   │   └── useAppTheme.ts           # 主题切换
│   ├── store/                       # Zustand 状态管理
│   │   ├── sessionStore.ts          # 会话 + 标签页 + profiles
│   │   ├── configStore.ts           # 应用配置
│   │   └── fileStore.ts             # 文件浏览 + 传输状态
│   ├── lib/                         # 工具和类型
│   │   ├── types.ts                 # IPC 类型（与 Rust 对应）
│   │   ├── tauri.ts                 # Tauri IPC 封装
│   │   ├── constants.ts             # 常量定义
│   │   └── validators.ts            # 表单校验函数
│   ├── test/                        # 测试基础设施
│   │   ├── setup.ts                 # 全局 Mock
│   │   ├── test-utils.tsx            # 自定义 render
│   │   └── mocks/tauri.ts           # Tauri API Mock
│   └── styles/                      # 全局样式
│       ├── index.css                # Tailwind + reset
│       └── theme.css                # Ant Design token 覆写
│
├── src-tauri/                       # Tauri + Rust 后端
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── rustfmt.toml
│   ├── capabilities/default.json
│   ├── tests/                       # 集成测试
│   │   ├── integration_test.rs      # SSH 端到端测试
│   │   └── fixtures/                # 测试密钥
│   └── src/
│       ├── main.rs                  # 入口
│       ├── lib.rs                   # 模块组装 + run() + 命令注册
│       ├── types/                   # 数据类型（IPC 契约权威源）
│       │   ├── connection.rs        # ConnectRequest, AuthMethod
│       │   ├── session.rs           # SessionInfo, SessionStatus
│       │   ├── sftp.rs              # FileEntry, FileType
│       │   └── error.rs             # CommandError
│       ├── ipc/                     # Tauri 命令处理器
│       │   ├── ssh_commands.rs      # SSH 连接/断开/输入/pty
│       │   ├── sftp_commands.rs     # SFTP 文件操作
│       │   └── config_commands.rs   # 配置 CRUD
│       ├── client/                  # SSH/SFTP 协议层
│       │   ├── ssh.rs               # russh 客户端
│       │   ├── sftp.rs              # SFTP 子客户端
│       │   ├── auth.rs              # 认证
│       │   └── channel.rs           # 数据通道
│       ├── session/                 # 会话管理
│       │   └── manager.rs           # SessionManager
│       ├── config/                  # 配置持久化
│       │   ├── profile.rs           # ProfileManager
│       │   └── settings.rs          # AppSettingsManager
│       ├── event/                   # 事件定义
│       │   └── events.rs            # SshOutputPayload, SftpProgressPayload
│       ├── error/                   # 错误类型（预留）
│       └── utils/                   # 工具函数
│           └── path.rs              # 远程路径安全拼接
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
```

## 🔌 前后端通信

Tauri IPC 本质是 **RPC（Remote Procedure Call）**。遵循 Tauri 官方惯例：

### 命令命名

Rust 侧 `snake_case`，Tauri 自动转换为 JS 的 `camelCase`：

| Rust 命令 | JS 调用 | 说明 |
|------|------|------|
| `connect_ssh` | `tauri.connectSsh(...)` | 建立连接 |
| `disconnect_ssh` | `tauri.disconnectSsh(...)` | 断开 |
| `write_stdin` | `tauri.writeStdin(...)` | 终端输入 |
| `resize_pty` | `tauri.resizePty(...)` | 窗口大小变化 |
| `list_directory` | `tauri.listDirectory(...)` | 列出远程目录 |
| `save_profile` | `tauri.saveProfile(...)` | 保存连接配置 |
| `get_settings` | `tauri.getSettings()` | 读取设置 |

### 事件推送

后端通过 Tauri Event 向前端推送实时数据：

| 事件 | 方向 | 说明 |
|------|------|------|
| `ssh-output` | Rust → JS | 终端 stdout/stderr 数据 |
| `ssh-connected` | Rust → JS | 连接建立 |
| `ssh-disconnected` | Rust → JS | 连接断开 |
| `sftp-progress` | Rust → JS | 文件传输进度 |

### 返回类型

所有命令返回 `Result<T, CommandError>`，错误码：`AUTH_FAILED`、`CONNECTION_TIMEOUT`、`SESSION_NOT_FOUND`、`PERMISSION_DENIED` 等。

## 🧪 测试

| 测试层级 | 运行命令 | 说明 |
|------|------|------|
| Rust 单元测试 | `cargo test` | `#[cfg(test)]` 模块 |
| Rust 集成测试 | `cargo test --test integration_test` | 本地 mock SSH 服务器 |
| 前端单元测试 | `bun test` | Vitest + Testing Library |
| 前端覆盖率 | `bun test -- --coverage` | v8 provider |
| 代码检查 | `bun run lint && bun run check && cargo clippy` | 全栈检查 |

## 📦 CI / CD

CI 通过 GitHub Actions 在 push/PR 时自动运行，分三个阶段：

1. **Lint & Check** — ESLint + TypeScript + Clippy + rustfmt
2. **Test** — `bun test` + `cargo test`
3. **Build** — 多平台矩阵构建（Windows / macOS / Linux）

## 📄 许可

[MIT](LICENSE) © 2026 Jianbin Hao
