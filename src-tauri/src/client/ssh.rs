use crate::event::events::SshOutputPayload;
use crate::types::connection::ConnectRequest;

/// SSH 客户端 —— 封装 russh 连接
///
/// 负责建立 TCP 连接、执行 SSH 握手、打开 PTY channel。
/// 具体的 russh Handler 实现留给你来完成。
pub struct SshClient;

impl SshClient {
    /// 建立一个新的 SSH 连接
    ///
    /// 成功返回 session_id，失败返回错误描述。
    pub async fn connect(
        _config: &ConnectRequest,
        _output_callback: impl Fn(SshOutputPayload) + Send + 'static,
    ) -> Result<String, String> {
        // TODO: 实现完整的 russh 连接流程
        // 1. 解析 host:port，建立 TCP 连接
        // 2. 调用 russh::client::connect 进行 SSH 握手
        // 3. 调用 auth::authenticate 完成认证
        // 4. 打开 session channel
        // 5. 请求 PTY（xterm-256color，默认 80x24）
        // 6. 启动 shell
        // 7. 启动 tokio task 循环读取 channel 数据，通过 output_callback 发送
        Ok("session-uuid-placeholder".into())
    }

    /// 断开连接
    pub async fn disconnect(_session_id: &str) -> Result<(), String> {
        // TODO: 关闭 channel、断开 TCP 连接
        Ok(())
    }
}
