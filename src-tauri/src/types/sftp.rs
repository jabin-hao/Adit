use serde::{Deserialize, Serialize};

/// 远程文件/目录条目
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileEntry {
    /// 文件/目录名（不含路径）
    pub name: String,
    /// 从远程根目录开始的绝对路径
    pub path: String,
    /// 是否为目录
    pub is_dir: bool,
    /// 是否为符号链接
    pub is_symlink: bool,
    /// 文件大小（字节，目录为 0）
    pub size: u64,
    /// Unix 权限字符串（如 "rwxr-xr-x"）
    pub permissions: String,
    /// 所有者用户名
    pub owner: String,
    /// 所属组
    pub group: String,
    /// 最后修改时间（Unix 时间戳）
    pub modified_at: i64,
}

/// 文件类型枚举
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FileType {
    File,
    Directory,
    Symlink,
}

/// SFTP 会话信息
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SftpSessionInfo {
    /// 关联的 SSH 会话 ID
    pub session_id: String,
    /// SFTP 是否已连接
    pub connected: bool,
    /// 当前工作目录
    pub current_dir: String,
}
