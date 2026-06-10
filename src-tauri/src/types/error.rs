use serde::Serialize;

/// 命令返回的统一错误结构
///
/// Tauri 命令返回 `Result<T, CommandError>`，
/// 前端通过 error.code 判断错误类型，error.message 展示给用户。
#[derive(Debug, Clone, Serialize)]
pub struct CommandError {
    /// 机器可读错误码
    pub code: String,
    /// 人类可读错误消息（中文）
    pub message: String,
}

impl CommandError {
    pub fn new(code: impl Into<String>, message: impl Into<String>) -> Self {
        Self {
            code: code.into(),
            message: message.into(),
        }
    }

    // ── 常用错误构造快捷方法 ──

    pub fn auth_failed(msg: impl Into<String>) -> Self {
        Self::new("AUTH_FAILED", msg)
    }

    pub fn connection_timeout() -> Self {
        Self::new("CONNECTION_TIMEOUT", "连接超时")
    }

    pub fn host_unreachable() -> Self {
        Self::new("HOST_UNREACHABLE", "主机不可达")
    }

    pub fn session_not_found(id: &str) -> Self {
        Self::new("SESSION_NOT_FOUND", format!("会话 {} 不存在", id))
    }

    pub fn sftp_not_available() -> Self {
        Self::new("SFTP_NOT_AVAILABLE", "SFTP 通道未建立")
    }

    pub fn file_not_found(path: &str) -> Self {
        Self::new("FILE_NOT_FOUND", format!("文件 {} 不存在", path))
    }

    pub fn permission_denied() -> Self {
        Self::new("PERMISSION_DENIED", "权限不足")
    }

    pub fn invalid_input(msg: impl Into<String>) -> Self {
        Self::new("INVALID_INPUT", msg)
    }

    pub fn io_error(msg: impl Into<String>) -> Self {
        Self::new("IO_ERROR", msg)
    }
}

// 允许从字符串自动转换（简化简单错误的构造）
impl From<&str> for CommandError {
    fn from(s: &str) -> Self {
        Self::new("UNKNOWN", s)
    }
}

impl From<String> for CommandError {
    fn from(s: String) -> Self {
        Self::new("UNKNOWN", s)
    }
}
