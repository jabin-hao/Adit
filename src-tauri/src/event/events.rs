use serde::{Deserialize, Serialize};

/// 终端输出事件 —— 后端通过 emit("ssh-output", payload) 推送给前端
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SshOutputPayload {
    pub session_id: String,
    /// 原始字节数据
    pub data: Vec<u8>,
    /// 输出流类型
    pub stream: OutputStream,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum OutputStream {
    Stdout,
    Stderr,
}

/// 连接成功事件
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SshConnectedPayload {
    pub session_id: String,
    pub host: String,
}

/// 连接断开事件
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SshDisconnectedPayload {
    pub session_id: String,
    /// 断开原因描述
    pub reason: String,
    /// 是否异常断开（vs 用户主动断开）
    pub is_error: bool,
}

/// SFTP 传输进度事件
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SftpProgressPayload {
    pub session_id: String,
    /// 传输方向
    pub direction: TransferDirection,
    /// 远程文件路径
    pub remote_path: String,
    /// 已传输字节数
    pub bytes_transferred: u64,
    /// 总字节数
    pub total_bytes: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum TransferDirection {
    Upload,
    Download,
}

/// SFTP 传输完成事件
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SftpCompletedPayload {
    pub session_id: String,
    pub direction: TransferDirection,
    pub remote_path: String,
    pub success: bool,
}
