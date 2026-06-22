/// Adit — 跨平台 SSH/SFTP 客户端
///
/// Tauri 后端入口，负责：
/// 1. 定义 IPC 数据类型（types/）
/// 2. 注册 Tauri 命令处理器（ipc/）
/// 3. 管理 SSH 会话和配置（session/、config/）
/// 4. 通过 Tauri Event 向前端推送实时数据（event/）
use tauri::Manager;

// ── 模块声明 ──────────────────────────────────────

pub mod client;
pub mod config;
pub mod event;
pub mod ipc;
pub mod session;
pub mod types;
pub mod utils;

// ── 类型重导出（前端通过 invoke 使用） ──────────

pub use types::connection::{AuthMethod, ConnectRequest, DisconnectRequest, PtyResizeRequest};
pub use types::error::CommandError;
pub use types::session::{SessionInfo, SessionStatus};
pub use types::sftp::{FileEntry, FileType};

// ── 旧版命令（保留兼容） ──────────────────────────

/// 获取应用版本号
#[tauri::command]
fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// 验证连接配置
#[tauri::command]
fn validate_config(config: ConnectRequest) -> Result<ConnectRequest, String> {
    config.validate()?;
    Ok(config)
}

// ── 应用入口 ──────────────────────────────────────

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // ── Tauri 插件 ──
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        // ── 注册所有命令 ──
        .invoke_handler(tauri::generate_handler![
            // 旧版
            get_version,
            validate_config,
            // SSH 命令
            ipc::ssh_commands::connect_ssh,
            ipc::ssh_commands::disconnect_ssh,
            ipc::ssh_commands::write_stdin,
            ipc::ssh_commands::resize_pty,
            ipc::ssh_commands::exec_command,
            // 服务器状态命令
            ipc::stats_commands::get_server_stats,
            // SFTP 命令
            ipc::sftp_commands::list_directory,
            ipc::sftp_commands::stat_path,
            ipc::sftp_commands::read_file,
            ipc::sftp_commands::write_file,
            ipc::sftp_commands::create_directory,
            ipc::sftp_commands::remove_entry,
            ipc::sftp_commands::rename_entry,
            // 配置命令
            ipc::config_commands::save_profile,
            ipc::config_commands::list_profiles,
            ipc::config_commands::delete_profile,
            ipc::config_commands::get_settings,
            ipc::config_commands::save_settings,
        ])
        // ── 应用初始化 ──
        .setup(|app| {
            // 注入 SessionManager 和 ProfileManager 为 Tauri managed state
            let session_mgr = session::SessionManager::new();
            app.manage(session_mgr);

            let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
            let profile_mgr = config::ProfileManager::new(app_data_dir.clone());
            app.manage(profile_mgr);

            let settings_mgr = config::AppSettingsManager::new(app_data_dir);
            app.manage(settings_mgr);

            // 开发模式：启用日志和 DevTools
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default().level(log::LevelFilter::Info).build(),
                )?;
                if let Some(window) = app.get_webview_window("main") {
                    window.open_devtools();
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("启动 Adit 时出错");
}
