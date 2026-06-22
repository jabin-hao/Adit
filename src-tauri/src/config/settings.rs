use crate::ipc::config_commands::AppSettings;
use std::path::PathBuf;
use tokio::sync::Mutex;

/// 应用设置管理器 —— 将 AppSettings 持久化为 JSON 文件
///
/// 文件存储位置: {app_data_dir}/settings.json
pub struct AppSettingsManager {
    file_path: PathBuf,
    cache: Mutex<Option<AppSettings>>,
}

impl AppSettingsManager {
    pub fn new(app_data_dir: PathBuf) -> Self {
        Self {
            file_path: app_data_dir.join("settings.json"),
            cache: Mutex::new(None),
        }
    }

    /// 读取设置（带内存缓存）
    pub async fn load(&self) -> Result<AppSettings, String> {
        let mut cache = self.cache.lock().await;

        if let Some(ref cached) = *cache {
            return Ok(cached.clone());
        }

        let settings = self.read_from_disk().await?;
        *cache = Some(settings.clone());
        Ok(settings)
    }

    /// 保存设置
    pub async fn save(&self, settings: AppSettings) -> Result<(), String> {
        self.write_to_disk(&settings).await?;
        *self.cache.lock().await = Some(settings);
        Ok(())
    }

    // ── 内部方法 ──

    async fn read_from_disk(&self) -> Result<AppSettings, String> {
        if !self.file_path.exists() {
            return Ok(AppSettings::default());
        }
        let content = tokio::fs::read_to_string(&self.file_path)
            .await
            .map_err(|e| format!("读取设置文件失败: {}", e))?;
        serde_json::from_str(&content)
            .map_err(|e| format!("解析设置文件失败: {}", e))
    }

    async fn write_to_disk(&self, settings: &AppSettings) -> Result<(), String> {
        if let Some(parent) = self.file_path.parent() {
            tokio::fs::create_dir_all(parent)
                .await
                .map_err(|e| format!("创建设置目录失败: {}", e))?;
        }
        let content = serde_json::to_string_pretty(settings)
            .map_err(|e| format!("序列化设置失败: {}", e))?;
        tokio::fs::write(&self.file_path, content)
            .await
            .map_err(|e| format!("写入设置文件失败: {}", e))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[tokio::test]
    async fn test_save_and_load_defaults() {
        let dir = tempdir().unwrap();
        let mgr = AppSettingsManager::new(dir.path().to_path_buf());

        let defaults = AppSettings::default();
        mgr.save(defaults.clone()).await.unwrap();

        let loaded = mgr.load().await.unwrap();
        assert_eq!(loaded.theme, "system");
        assert_eq!(loaded.font_size, 14);
    }

    #[tokio::test]
    async fn test_load_from_empty() {
        let dir = tempdir().unwrap();
        let mgr = AppSettingsManager::new(dir.path().to_path_buf());
        let settings = mgr.load().await.unwrap();
        assert_eq!(settings.theme, "system");
    }
}
