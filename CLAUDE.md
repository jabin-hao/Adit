# CLAUDE.md

这是 Adit 项目的 AI 辅助开发指南。编写或修改代码时请遵循以下约定。
一定要优先使用codegraph

## 项目概述

Adit — 基于 Tauri 的跨平台 SSH/SFTP 客户端。
- Rust 后端处理网络 I/O 和系统调用
- React + TypeScript 前端构建用户界面
- 通过 Tauri IPC 桥接前后端通信

## 开发命令

| 命令 | 说明 |
|------|------|
| `bun install` | 安装前端依赖 |
| `bun tauri dev` | 启动 Tauri 开发模式（含热更新） |
| `bun tauri build` | 生产构建 |
| `bun run lint` | ESLint 代码检查 |
| `bun run check` | TypeScript 类型检查 |
| `cargo check` | Rust 类型检查（在 `src-tauri/` 下） |
| `cargo test` | 运行 Rust 单元测试 |
| `bun test` | 运行前端测试 |

## 技术架构

### 前端 (src/)

- **框架**: React 18+ with TypeScript strict mode
- **构建工具**: Vite（通过 Tauri 插件集成）
- **状态管理**: Zustand — 轻量、不可变更新风格
- **UI 组件**: shadcn/ui + Radix UI — 基于 Radix primitives 构建，Tailwind CSS 样式
- **样式**: Tailwind CSS v4 + CSS 变量用于布局和主题切换
- **终端**: xterm.js 用于 SSH 终端仿真
- **代码风格**: ESLint + Prettier，遵循 Airbnb React 风格指南

#### 前端目录约定

```
src/
├── components/          # 可复用 UI 组件
│   ├── terminal/        # 终端相关组件
│   ├── file-manager/    # SFTP 文件管理组件
│   └── common/          # 通用组件（按钮、对话框等）
├── hooks/               # 自定义 React Hooks
│   ├── useSSH.ts        # SSH 连接管理
│   └── useTheme.ts      # 主题切换
├── store/               # Zustand stores
│   ├── sessionStore.ts  # 会话状态
│   └── configStore.ts   # 配置状态
├── lib/                 # 工具函数和类型定义
│   ├── types.ts         # TypeScript 类型定义
│   └── tauri.ts         # Tauri IPC 调用封装
├── App.tsx              # 根布局组件
└── main.tsx             # 应用入口
```

### 后端 (src-tauri/)

- **框架**: Tauri 2.x — 使用 `#[tauri::command]` 定义 IPC 接口
- **SSH**: `russh` 库处理 SSH/SFTP 协议
- **配置**: 配置文件存储在 Tauri 应用数据目录
- **错误处理**: `anyhow` 用于应用级错误，`thiserror` 用于库级错误
- **异步**: `tokio` 运行时

#### 后端目录约定

```
src-tauri/src/
├── main.rs              # Tauri 入口，注册插件和命令
├── lib.rs               # 核心类型和 trait 定义
├── commands/            # Tauri 命令（前端调用入口）
│   ├── mod.rs
│   ├── ssh.rs           # SSH 连接/断开/执行命令
│   └── sftp.rs          # SFTP 文件操作
├── ssh/                 # SSH 会话实现
│   ├── mod.rs
│   ├── session.rs       # SSH 会话管理
│   ├── channel.rs       # 数据通道
│   └── auth.rs          # 认证处理
└── config/              # 配置管理
    ├── mod.rs
    └── profile.rs       # 连接配置（主机地址、端口、认证等）
```

## 编码规范

### TypeScript

- 使用 `const` 声明常量，`let` 声明变量，禁用 `var`
- 使用 `interface` 而非 `type` 定义对象类型
- 异步操作使用 `async/await`，避免 Promise 链式调用
- Tauri API 调用统一在 `src/lib/tauri.ts` 中封装
- 组件文件使用 PascalCase，工具函数文件使用 camelCase
- 从 `@/components/ui` 按需引入 shadcn/ui 组件

### Rust

- 遵循标准 Rust 命名规范（snake_case 变量/函数，CamelCase 类型）
- 使用 `cargo fmt` 和 `cargo clippy` 保持代码质量
- 命令函数使用 `Result<T, String>` 返回类型（Tauri 序列化要求）
- SSH 敏感数据（密码/密钥）不得在日志中输出
- 使用 `tracing` crate 进行结构化日志记录

### 通用

- Git 提交信息使用中文，且必须使用例如init、feat、fix、style、chore等加冒号加信息作为标题
- Pull Request 需通过 CI 检查（lint + build + test）
- 新功能先在 Issue 中讨论再实现，并且在新分支内实现再合并，分支需要符合命名规范
- 异步消息的交互禁止使用 `alert` 和 `prompt`，使用 Dialog/Toast 等 shadcn/ui 组件

## 故障排除

### Cargo 网络问题（国内）

crates.io 在国内可能不稳定。若 `cargo check` 或 `cargo build` 因超时/SSL错误失败，在 `~/.cargo/config.toml` 中配置镜像：

```toml
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "sparse+https://mirrors.ustc.edu.cn/crates.io-index/"
```

备用镜像（按优先级排列）：
- `sparse+https://mirrors.tuna.tsinghua.edu.cn/crates.io-index/` — 清华 tuna
- `sparse+https://mirrors.ustc.edu.cn/crates.io-index/` — 中科大 ustc

清除缓存重试：
```bash
cargo clean
cargo check
```

### Tauri CLI

若 `cargo install tauri-cli` 失败，可使用 npm 包中自带的 CLI：
```bash
bun tauri dev      # 等同于 cargo tauri dev
bun tauri build    # 等同于 cargo tauri build
```

## 关键设计决策

1. **为什么用 Tauri 而不是 Electron?** — Tauri 体积更小（~5MB vs ~120MB），内存占用更低，Rust 后端在处理 SSH 网络 I/O 时更高效。
2. **为什么用 Bun 而不是 Node.js?** — Bun 启动更快，原生支持 TypeScript，与 Vite 集成更紧密。
3. **为什么用 russh 而不是 ssh2?** — russh 是纯 Rust 实现，异步原生支持，与 tokio 生态集成更好，且无需依赖系统 libssh。
4. **为什么用 shadcn/ui?** — 基于 Radix UI primitives 构建，完全可控的组件代码，Tailwind CSS 深度集成，无运行时依赖开销。
