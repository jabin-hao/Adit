use crate::types::error::CommandError;
use crate::types::sftp::FileEntry;

/// 列出远程目录内容
#[tauri::command]
pub async fn list_directory(
    session_id: String,
    path: String,
) -> Result<Vec<FileEntry>, CommandError> {
    // TODO: 调用 SftpClient::list_directory
    let _ = (session_id, path);
    Ok(vec![])
}

/// 获取文件/目录元信息
#[tauri::command]
pub async fn stat_path(
    session_id: String,
    path: String,
) -> Result<FileEntry, CommandError> {
    // TODO: 调用 russh-sftp 的 stat/metadata
    let _ = (session_id, path);
    Err(CommandError::file_not_found("(占位)"))
}

/// 读取远程文件内容（返回字节数组）
#[tauri::command]
pub async fn read_file(
    session_id: String,
    remote_path: String,
    offset: u64,
    chunk_size: u64,
) -> Result<Vec<u8>, CommandError> {
    // TODO: 分块读取文件，支持断点续传
    let _ = (session_id, remote_path, offset, chunk_size);
    Ok(vec![])
}

/// 写入内容到远程文件
#[tauri::command]
pub async fn write_file(
    session_id: String,
    remote_path: String,
    data: Vec<u8>,
    overwrite: bool,
) -> Result<(), CommandError> {
    // TODO: 创建/覆盖远程文件
    let _ = (session_id, remote_path, data, overwrite);
    Ok(())
}

/// 创建远程目录
#[tauri::command]
pub async fn create_directory(
    session_id: String,
    path: String,
) -> Result<(), CommandError> {
    // TODO: 调用 russh-sftp 的 create_dir
    let _ = (session_id, path);
    Ok(())
}

/// 删除文件或空目录
#[tauri::command]
pub async fn remove_entry(
    session_id: String,
    path: String,
) -> Result<(), CommandError> {
    // TODO: 调用 russh-sftp 的 remove_file / remove_dir
    let _ = (session_id, path);
    Ok(())
}

/// 重命名/移动文件
#[tauri::command]
pub async fn rename_entry(
    session_id: String,
    from: String,
    to: String,
) -> Result<(), CommandError> {
    // TODO: 调用 russh-sftp 的 rename
    let _ = (session_id, from, to);
    Ok(())
}
