use tauri::State;

use crate::session::SessionManager;
use crate::types::connection::{ConnectRequest, DisconnectRequest, PtyResizeRequest};
use crate::types::error::CommandError;

/// 建立 SSH 连接
///
/// 前端调用: `invoke("connect_ssh", { config })`
#[tauri::command]
pub async fn connect_ssh(
    config: ConnectRequest,
    sessions: State<'_, SessionManager>,
) -> Result<String, CommandError> {
    // 参数校验
    config.validate().map_err(CommandError::invalid_input)?;

    // 创建会话
    let id = sessions.create_session(&config).await.map_err(CommandError::io_error)?;

    // TODO: 在这里调用 client::ssh::connect 建立真实的 SSH 连接
    // 连接成功后 emit "ssh-connected" 事件，更新状态为 Connected
    // 连接失败则 remove_session 并返回错误

    Ok(id)
}

/// 断开 SSH 连接
#[tauri::command]
pub async fn disconnect_ssh(
    req: DisconnectRequest,
    sessions: State<'_, SessionManager>,
) -> Result<(), CommandError> {
    // TODO: 先调用 client::ssh::disconnect 关闭网络连接
    sessions
        .remove_session(&req.session_id)
        .await
        .map_err(|_| CommandError::session_not_found(&req.session_id))?;

    Ok(())
}

/// 向终端写入数据（用户按键）
#[tauri::command]
pub async fn write_stdin(
    session_id: String,
    data: Vec<u8>,
    sessions: State<'_, SessionManager>,
) -> Result<(), CommandError> {
    sessions
        .write_stdin(&session_id, &data)
        .await
        .map_err(|_| CommandError::session_not_found(&session_id))
}

/// 调整 PTY 大小（终端窗口尺寸变化）
#[tauri::command]
pub async fn resize_pty(
    req: PtyResizeRequest,
    // sessions: State<'_, SessionManager>,  // TODO: 取消注释，调用 russh pty resize
) -> Result<(), CommandError> {
    // TODO: 调用 russh channel 的 window-change 请求
    let _ = (req.cols, req.rows);
    Ok(())
}

/// 执行单条命令（非交互式）
#[tauri::command]
pub async fn exec_command(
    session_id: String,
    command: String,
    timeout_secs: u32,
    // sessions: State<'_, SessionManager>,
) -> Result<String, CommandError> {
    // TODO: 在 SSH session 上执行单条命令，返回 stdout 输出
    // 支持 timeout_secs 超时控制
    let _ = (session_id, command, timeout_secs);
    Ok("命令执行结果占位".into())
}
