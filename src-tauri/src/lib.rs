/// Adit — 跨平台 SSH/SFTP 客户端
///
/// Tauri 后端，负责窗口管理、系统调用和 IPC 通信。

use serde::{Deserialize, Serialize};
use tauri::Manager;

// ── 数据类型定义 ──────────────────────────────────────

/// 连接配置
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectionConfig {
    /// 显示名称
    pub name: String,
    /// 主机地址
    pub host: String,
    /// 端口（默认 22）
    pub port: u16,
    /// 用户名
    pub username: String,
    /// 认证方式
    pub auth: AuthMethod,
}

/// 认证方式
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum AuthMethod {
    /// 密码认证
    #[serde(rename = "password")]
    Password { password: String },
    /// 密钥认证
    #[serde(rename = "key")]
    Key {
        /// 私钥路径
        key_path: String,
        /// 密钥口令（可选）
        passphrase: Option<String>,
    },
    /// 免密（从 ssh-agent 获取）
    #[serde(rename = "agent")]
    Agent,
}

/// 会话信息（前端展示用）
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionInfo {
    pub id: String,
    pub config: ConnectionConfig,
    pub status: SessionStatus,
}

/// 会话状态
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SessionStatus {
    Connecting,
    Connected,
    Disconnected,
}

// ── Tauri 命令 ──────────────────────────────────────

/// 获取应用版本号
#[tauri::command]
fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// 验证连接配置（供前端校验表单）
#[tauri::command]
fn validate_config(config: ConnectionConfig) -> Result<ConnectionConfig, String> {
    if config.name.trim().is_empty() {
        return Err("名称不能为空".into());
    }
    if config.host.trim().is_empty() {
        return Err("主机地址不能为空".into());
    }
    if config.port == 0 {
        return Err("端口号无效".into());
    }
    if config.username.trim().is_empty() {
        return Err("用户名不能为空".into());
    }
    Ok(config)
}

// ── 应用入口 ──────────────────────────────────────

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![get_version, validate_config])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("启动 Adit 时出错");
}
