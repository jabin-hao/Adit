use tauri::State;

use crate::session::SessionManager;
use crate::types::error::CommandError;
use crate::types::stats::ServerStats;

/// 获取服务器状态（CPU/内存/负载/磁盘/运行时长）
///
/// stub —— 待 SSH exec 实现后填充真实采集逻辑
/// （cat /proc/stat、free -m、df -h、uptime、hostnamectl）
///
/// 前端调用: `invoke("get_server_stats", { sessionId })`
#[tauri::command]
pub async fn get_server_stats(
    session_id: String,
    _sessions: State<'_, SessionManager>,
) -> Result<ServerStats, CommandError> {
    // TODO: 在 SSH session 上执行采集命令并解析输出
    // 当前为 stub，返回全零/空字符串占位
    let _ = session_id;
    Ok(ServerStats::default())
}
