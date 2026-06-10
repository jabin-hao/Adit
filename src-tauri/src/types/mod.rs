/// Adit 数据类型定义 —— IPC 契约的权威来源
///
/// 所有 struct 通过 serde 序列化，前后端共享。
/// 前端在 `src/lib/types.ts` 中维护对应的 TypeScript interface。
pub mod connection;
pub mod error;
pub mod session;
pub mod sftp;

// 重导出常用类型
pub use connection::{AuthMethod, ConnectRequest, DisconnectRequest, PtyResizeRequest};
pub use error::CommandError;
pub use session::{SessionInfo, SessionStatus};
pub use sftp::{FileEntry, FileType};
