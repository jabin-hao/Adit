use crate::ipc::config_commands::Profile;
use std::path::PathBuf;
use tokio::sync::Mutex;

/// 连接配置管理器 —— 将 Profile 列表持久化为 JSON 文件
///
/// 文件存储位置: {app_data_dir}/profiles.json
pub struct ProfileManager {
    file_path: PathBuf,
    cache: Mutex<Option<Vec<Profile>>>,
}

impl ProfileManager {
    /// 创建管理器，app_data_dir 由 Tauri 提供
    pub fn new(app_data_dir: PathBuf) -> Self {
        Self { file_path: app_data_dir.join("profiles.json"), cache: Mutex::new(None) }
    }

    /// 读取所有配置（带内存缓存）
    pub async fn load_all(&self) -> Result<Vec<Profile>, String> {
        let mut cache = self.cache.lock().await;

        if let Some(ref cached) = *cache {
            return Ok(cached.clone());
        }

        let profiles = self.read_from_disk().await?;
        *cache = Some(profiles.clone());
        Ok(profiles)
    }

    /// 保存配置（新增或更新）
    pub async fn save(&self, mut profile: Profile) -> Result<Profile, String> {
        let mut profiles = self.load_all().await?;
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();

        if profile.id.is_empty() {
            profile.id = uuid::Uuid::new_v4().to_string();
            profile.created_at = now;
        }
        profile.updated_at = now;

        // 更新或追加
        if let Some(existing) = profiles.iter_mut().find(|p| p.id == profile.id) {
            *existing = profile.clone();
        } else {
            profiles.push(profile.clone());
        }

        self.write_to_disk(&profiles).await?;
        *self.cache.lock().await = Some(profiles);

        Ok(profile)
    }

    /// 删除配置
    pub async fn delete(&self, id: &str) -> Result<(), String> {
        let mut profiles = self.load_all().await?;
        profiles.retain(|p| p.id != id);
        self.write_to_disk(&profiles).await?;
        *self.cache.lock().await = Some(profiles);
        Ok(())
    }

    // ── 内部方法 ──

    async fn read_from_disk(&self) -> Result<Vec<Profile>, String> {
        if !self.file_path.exists() {
            return Ok(vec![]);
        }
        let content = tokio::fs::read_to_string(&self.file_path)
            .await
            .map_err(|e| format!("读取配置文件失败: {}", e))?;
        serde_json::from_str(&content).map_err(|e| format!("解析配置文件失败: {}", e))
    }

    async fn write_to_disk(&self, profiles: &[Profile]) -> Result<(), String> {
        // 确保父目录存在
        if let Some(parent) = self.file_path.parent() {
            tokio::fs::create_dir_all(parent)
                .await
                .map_err(|e| format!("创建配置目录失败: {}", e))?;
        }
        let content =
            serde_json::to_string_pretty(profiles).map_err(|e| format!("序列化配置失败: {}", e))?;
        tokio::fs::write(&self.file_path, content)
            .await
            .map_err(|e| format!("写入配置文件失败: {}", e))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[tokio::test]
    async fn test_save_and_load() {
        let dir = tempdir().unwrap();
        let mgr = ProfileManager::new(dir.path().to_path_buf());

        let profile = Profile {
            id: String::new(),
            name: "测试服务器".into(),
            host: "192.168.1.1".into(),
            port: 22,
            username: "root".into(),
            auth_type: "password".into(),
            created_at: 0,
            updated_at: 0,
        };

        let saved = mgr.save(profile).await.unwrap();
        assert!(!saved.id.is_empty());

        let loaded = mgr.load_all().await.unwrap();
        assert_eq!(loaded.len(), 1);
        assert_eq!(loaded[0].name, "测试服务器");
    }

    #[tokio::test]
    async fn test_delete() {
        let dir = tempdir().unwrap();
        let mgr = ProfileManager::new(dir.path().to_path_buf());

        let profile = Profile {
            id: String::new(),
            name: "待删除".into(),
            host: "localhost".into(),
            port: 22,
            username: "test".into(),
            auth_type: "agent".into(),
            created_at: 0,
            updated_at: 0,
        };

        let saved = mgr.save(profile).await.unwrap();
        mgr.delete(&saved.id).await.unwrap();
        assert!(mgr.load_all().await.unwrap().is_empty());
    }

    #[tokio::test]
    async fn test_load_from_empty() {
        let dir = tempdir().unwrap();
        let mgr = ProfileManager::new(dir.path().to_path_buf());
        let profiles = mgr.load_all().await.unwrap();
        assert!(profiles.is_empty());
    }
}
