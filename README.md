<p align="center">
  <img src="docs/logo.png" alt="Adit Logo" width="128">
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

> *Adit* — a mine entrance, your gateway to remote servers.

A cross-platform SSH/SFTP client built with [Tauri](https://tauri.app) + [React](https://react.dev) + [Rust](https://www.rust-lang.org).

## Features

- 🔐 **SSH/SFTP** — password, key, and SSH agent authentication
- 📁 **File Manager** — browse, upload, download, and edit remote files
- 🖥️ **Terminal** — full SSH terminal emulation via xterm.js
- 📋 **Tabbed UI** — manage multiple servers in one window
- 🎨 **Light/Dark** — Ant Design theme switching
- ⚡ **Lightweight** — ~5MB binary, Rust backend for I/O

## Quick Start

### Prerequisites

- [Rust](https://rustup.rs) >= 1.77
- [Bun](https://bun.sh) >= 1.1
- Platform build dependencies (see [Tauri Prerequisites](https://tauri.app/start/prerequisites/))

### Install & Run

```bash
git clone https://github.com/jabin-hao/Adit.git
cd adit
bun install
bun dev
```

### Build

```bash
bun run build
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop | Tauri 2.x |
| Backend | Rust + russh + tokio |
| Frontend | React 19 + TypeScript + Bun |
| UI | Ant Design 5 + Tailwind CSS |
| Terminal | xterm.js |
| State | Zustand |

## Project Structure

```
adit/
├── src/                # React frontend (TypeScript, Ant Design, Zustand)
├── src-tauri/          # Rust backend (russh, tokio, Tauri commands)
├── docs/               # Documentation
└── README.md
```

## Commands

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev mode |
| `bun run build` | Production build |
| `bun run lint` | ESLint check |
| `bun run check` | TypeScript check |
| `bun test` | Run frontend tests |
| `cargo test` | Run Rust tests |

## Documentation

- [中文文档](./docs/README.zh-CN.md)

## Contributing

Issues and PRs are welcome!

```bash
bun run lint
bun run check
```

Please ensure:
- Code passes lint and type checks
- New features include tests
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org)

## License

[MIT](LICENSE) © 2026 Jabin Hao

---

## Links

- [Tauri Docs](https://tauri.app/docs)
- [russh Docs](https://docs.rs/russh)
- [xterm.js Docs](https://xtermjs.org)
