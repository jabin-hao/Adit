# Adit

Adit 是一款现代化的跨平台 SSH/SFTP 客户端，基于 [Tauri](https://tauri.app) 构建，兼具原生性能与 Web 技术的灵活界面。

> **Adit** 一词意为矿井的水平入口，象征着进入远程服务器的通道。

## ✨ 特性

- 🖥️ **跨平台** — Windows、macOS、Linux 原生支持，体积小、内存占用低
- 🔐 **SSH/SFTP** — 支持密码、密钥、代理跳转等多种连接方式
- 📁 **文件管理** — 图形化 SFTP 文件浏览、拖拽上传下载
- 🎨 **现代界面** — React + Ant Design，支持明暗主题切换
- ⚡ **高性能** — Rust 后端处理网络 I/O，Bun 运行时驱动前端
- 🔧 **配置管理** — 导入/导出连接配置，多 Profile 支持
- 📋 **剪贴板同步** — 终端与本地系统剪贴板互通

## 🛠️ 技术栈

| 层 | 技术 |
|------|----------|
| **桌面框架** | [Tauri 2.x](https://tauri.app) |
| **后端语言** | [Rust](https://www.rust-lang.org) |
| **SSH 库** | [russh](https://github.com/warp-tech/russh) |
| **前端运行时** | [Bun](https://bun.sh) |
| **UI 框架** | [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| **组件库** | [Ant Design](https://ant.design) |
| **终端组件** | [xterm.js](https://xtermjs.org) |
| **状态管理** | [Zustand](https://zustand-demo.pmnd.rs) |
| **样式** | [Tailwind CSS](https://tailwindcss.com) |

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

# 启动开发模式（热更新）
bun tauri dev
```

### 构建

```bash
# 生产构建
bun tauri build
```

构建产物位于 `src-tauri/target/release/`。

## 📁 项目结构

```
adit/
├── src/                    # React 前端源码
│   ├── components/         # UI 组件
│   ├── hooks/              # 自定义 Hooks
│   ├── store/              # Zustand 状态管理
│   ├── lib/                # 工具函数
│   ├── App.tsx             # 根组件
│   └── main.tsx            # 入口文件
├── src-tauri/              # Tauri + Rust 后端
│   ├── src/                # Rust 源码
│   │   ├── main.rs         # 入口
│   │   ├── lib.rs          # 核心库
│   │   ├── commands/       # Tauri 命令定义
│   │   ├── ssh/            # SSH/SFTP 会话管理
│   │   └── config/         # 配置管理
│   ├── Cargo.toml
│   └── tauri.conf.json     # Tauri 配置
├── public/                 # 静态资源
├── package.json
├── tsconfig.json
├── bun.lockb
└── README.md
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。请确保代码通过 `bun run lint` 和 `bun run check` 检查。

## 📄 许可

[MIT](LICENSE) © 2026 Jabin Hao
