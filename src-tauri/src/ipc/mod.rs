/// Tauri IPC 命令处理器
///
/// 每个子模块对应一类 Tauri command，是前端 invoke 的直接入口。
/// 命令函数负责：参数校验 → 调用底层 client/session/config → 返回 Result
pub mod config_commands;
pub mod sftp_commands;
pub mod ssh_commands;
