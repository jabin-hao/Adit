/// SSH/SFTP 协议客户端层
///
/// 直接与 russh 库交互，处理认证、通道、数据传输等底层协议操作。
/// 上层 session/ 模块调用本层来管理连接生命周期。

pub mod auth;
pub mod channel;
pub mod ssh;
pub mod sftp;
