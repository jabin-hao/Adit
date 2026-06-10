use serde::{Deserialize, Serialize};

/// 会话信息（前端展示用）
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionInfo {
    pub id: String,
    /// 连接时的名称
    pub name: String,
    /// 连接目标 host:port
    pub target: String,
    /// 当前状态
    pub status: SessionStatus,
}

/// 会话连接状态
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum SessionStatus {
    Connecting,
    Connected,
    Disconnected,
}
