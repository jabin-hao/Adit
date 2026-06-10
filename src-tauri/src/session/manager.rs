use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::client::channel::DataChannel;
use crate::types::connection::ConnectRequest;
use crate::types::session::{SessionInfo, SessionStatus};

/// 单个 SSH 会话的内部状态
struct Session {
    pub info: SessionInfo,
    pub channel: DataChannel,
    // TODO: 添加 russh Handle（用于 PTY resize 等操作）
}

/// 会话管理器 —— Tauri 的 managed state
///
/// 管理所有活跃的 SSH 会话，通过 Arc<Mutex<>> 支持跨命令共享。
/// 由 Tauri Builder 在 setup 阶段注入。
pub struct SessionManager {
    sessions: Arc<Mutex<HashMap<String, Session>>>,
}

impl Default for SessionManager {
    fn default() -> Self {
        Self::new()
    }
}

impl SessionManager {
    /// 创建空的会话管理器
    pub fn new() -> Self {
        Self { sessions: Arc::new(Mutex::new(HashMap::new())) }
    }

    /// 创建新会话（占位——不建立真实连接）
    ///
    /// 返回 session_id，同时创建 DataChannel 供后续读写。
    pub async fn create_session(&self, config: &ConnectRequest) -> Result<String, String> {
        let id = uuid::Uuid::new_v4().to_string();
        let (channel, _stdin_rx, _stdout_tx, _stderr_tx) = DataChannel::new(4096);

        let session = Session {
            info: SessionInfo {
                id: id.clone(),
                name: config.name.clone(),
                target: format!("{}:{}", config.host, config.port),
                status: SessionStatus::Connecting,
            },
            channel,
        };

        self.sessions.lock().await.insert(id.clone(), session);
        Ok(id)
    }

    /// 获取会话信息列表（供前端刷新侧边栏）
    pub async fn list_sessions(&self) -> Vec<SessionInfo> {
        self.sessions.lock().await.values().map(|s| s.info.clone()).collect()
    }

    /// 更新会话状态
    pub async fn update_status(&self, id: &str, status: SessionStatus) -> Result<(), String> {
        let mut sessions = self.sessions.lock().await;
        if let Some(session) = sessions.get_mut(id) {
            session.info.status = status;
            Ok(())
        } else {
            Err(format!("会话 {} 不存在", id))
        }
    }

    /// 移除会话（断开连接后调用）
    pub async fn remove_session(&self, id: &str) -> Result<(), String> {
        self.sessions
            .lock()
            .await
            .remove(id)
            .map(|_| ())
            .ok_or_else(|| format!("会话 {} 不存在", id))
    }

    /// 向指定会话写入 stdin 数据
    pub async fn write_stdin(&self, id: &str, data: &[u8]) -> Result<(), String> {
        let sessions = self.sessions.lock().await;
        if let Some(session) = sessions.get(id) {
            session
                .channel
                .stdin_tx
                .send(data.to_vec())
                .await
                .map_err(|_| "stdin 通道已关闭".to_string())
        } else {
            Err(format!("会话 {} 不存在", id))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_create_and_list_sessions() {
        let mgr = SessionManager::new();
        let config = ConnectRequest {
            name: "测试服务器".into(),
            host: "localhost".into(),
            port: 22,
            username: "test".into(),
            auth: crate::types::connection::AuthMethod::Agent,
            keepalive_secs: 30,
        };

        let id = mgr.create_session(&config).await.unwrap();
        assert!(!id.is_empty());

        let sessions = mgr.list_sessions().await;
        assert_eq!(sessions.len(), 1);
        assert_eq!(sessions[0].name, "测试服务器");
    }

    #[tokio::test]
    async fn test_remove_session() {
        let mgr = SessionManager::new();
        let config = ConnectRequest {
            name: "测试".into(),
            host: "localhost".into(),
            port: 22,
            username: "test".into(),
            auth: crate::types::connection::AuthMethod::Agent,
            keepalive_secs: 30,
        };

        let id = mgr.create_session(&config).await.unwrap();
        mgr.remove_session(&id).await.unwrap();
        assert!(mgr.list_sessions().await.is_empty());
    }
}
