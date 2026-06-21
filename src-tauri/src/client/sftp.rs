use crate::types::sftp::FileEntry;

/// SFTP 子客户端 —— 基于 russh-sftp
///
/// 在已有 SSH 连接上打开 SFTP channel，执行文件操作。
pub struct SftpClient;

impl SftpClient {
    /// 在给定 SSH 会话上开启 SFTP 通道
    pub async fn open(_session_id: &str) -> Result<String, String> {
        // TODO: 从 SessionManager 获取 SSH handle，打开 SFTP channel
        Ok("sftp-uuid-placeholder".into())
    }

    /// 列出目录内容
    pub async fn list_directory(_sftp_id: &str, _path: &str) -> Result<Vec<FileEntry>, String> {
        // TODO: 调用 russh-sftp 的 read_dir
        // 将返回的元数据转换为 FileEntry 列表
        Ok(vec![])
    }
}
