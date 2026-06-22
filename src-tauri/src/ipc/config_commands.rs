use serde::{Deserialize, Serialize};
use tauri::State;

use crate::config::profile::ProfileManager;
use crate::types::error::CommandError;

/// 已保存的连接配置
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Profile {
    pub id: String,
    pub name: String,
    pub host: String,
    pub port: u16,
    pub username: String,
    pub auth_type: String, // "password" | "key" | "agent"
    pub group: String,     // 分组名，空字符串表示未分组
    pub created_at: u64,
    pub updated_at: u64,
}

/// 应用设置
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub theme: String,       // "light" | "dark" | "system"
    pub font_size: u32,      // 终端字体大小
    pub font_family: String, // 终端字体族
    pub default_port: u16,
    pub scrollback_lines: u32,
}

/// 保存连接配置
#[tauri::command]
pub async fn save_profile(
    profile: Profile,
    profiles: State<'_, ProfileManager>,
) -> Result<Profile, CommandError> {
    profiles.save(profile).await.map_err(CommandError::io_error)
}

/// 列出所有已保存的连接配置
#[tauri::command]
pub async fn list_profiles(
    profiles: State<'_, ProfileManager>,
) -> Result<Vec<Profile>, CommandError> {
    profiles.load_all().await.map_err(CommandError::io_error)
}

/// 删除指定连接配置
#[tauri::command]
pub async fn delete_profile(
    id: String,
    profiles: State<'_, ProfileManager>,
) -> Result<(), CommandError> {
    profiles.delete(&id).await.map_err(CommandError::io_error)
}

/// 读取应用设置
#[tauri::command]
pub async fn get_settings(// settings: State<'_, AppSettingsManager>,  // TODO: 实现后取消注释
) -> Result<AppSettings, CommandError> {
    // TODO: 从磁盘加载设置
    Ok(AppSettings {
        theme: "system".into(),
        font_size: 14,
        font_family: "'JetBrains Mono', monospace".into(),
        default_port: 22,
        scrollback_lines: 5000,
    })
}

/// 保存应用设置
#[tauri::command]
pub async fn save_settings(
    _settings: AppSettings,
    // settings_state: State<'_, AppSettingsManager>,
) -> Result<(), CommandError> {
    // TODO: 持久化到磁盘
    Ok(())
}
