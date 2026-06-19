<p align="center">
  <img src="logo.png" alt="Adit Logo" width="128">
</p>

# Adit

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://github.com/jabin-hao/Adit/releases"><img src="https://img.shields.io/github/v/release/jabin-hao/Adit" alt="Release"></a>
  <a href="https://github.com/jabin-hao/Adit/stargazers"><img src="https://img.shields.io/github/stars/jabin-hao/Adit" alt="Stars"></a>
  <br>
  <img src="https://img.shields.io/badge/Rust-1.77+-orange?logo=rust" alt="Rust">
  <img src="https://img.shields.io/badge/Tauri-2.x-ffc131?logo=tauri" alt="Tauri">
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Bun-1.1+-fbf0df?logo=bun" alt="Bun">
  <img src="https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss" alt="Tailwind">
</p>

> *Adit*（矿井入口）—— 进入远程服务器的通道。

基于 [Tauri](https://tauri.app) + [React](https://react.dev) + [Rust](https://www.rust-lang.org) 的跨平台 SSH/SFTP 客户端。

## 功能

- 🔐 **SSH/SFTP** — 支持密码、密钥、SSH Agent 认证
- 📁 **文件管理** — 图形化浏览、上传、下载远程文件
- 🖥️ **终端仿真** — 基于 xterm.js 的完整 SSH 终端
- 📋 **多标签页** — 一个窗口管理多台服务器
- 🎨 **明暗主题** — 一键切换
- ⚡ **轻量高效** — 安装包仅 ~5MB，Rust 后端处理 I/O

## 快速开始

### 环境要求

- [Rust](https://rustup.rs) >= 1.77
- [Bun](https://bun.sh) >= 1.1

### 安装运行

```bash
git clone https://github.com/jabin-hao/Adit.git
cd adit
bun install
bun dev
```

### 构建

```bash
bun run build
```

## 项目结构

```
adit/
├── src/                # React 前端（TypeScript、Ant Design、Zustand）
├── src-tauri/          # Rust 后端（russh、tokio、Tauri 命令）
├── docs/               # 文档
└── README.md
```

## 技术栈

| 层 | 技术 |
|------|------|
| 桌面框架 | Tauri 2.x |
| 后端 | Rust + russh + tokio |
| 前端 | React 19 + TypeScript + Bun |
| UI 组件 | Ant Design 5 + Tailwind CSS |
| 终端 | xterm.js |
| 状态管理 | Zustand |

## 常用命令

| 命令 | 说明 |
|------|------|
| `bun dev` | 启动开发模式 |
| `bun run build` | 生产构建 |
| `bun run lint` | 代码检查 |
| `bun run check` | 类型检查 |
| `bun test` | 运行前端测试 |
| `cargo test` | 运行 Rust 测试 |

## 协议

[MIT](LICENSE) © 2026 Jianbin Hao

---

[English Version](../README.md)
