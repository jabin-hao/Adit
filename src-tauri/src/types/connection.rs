use serde::{Deserialize, Serialize};

/// 建立 SSH 连接的请求
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectRequest {
    /// 连接显示名称（如 "生产服务器"）
    pub name: String,
    /// 主机地址（IP 或域名）
    pub host: String,
    /// SSH 端口（默认 22）
    pub port: u16,
    /// 登录用户名
    pub username: String,
    /// 认证方式
    pub auth: AuthMethod,
    /// 心跳间隔（秒），0 表示不启用心跳
    pub keepalive_secs: u32,
}

/// 认证方式（tagged union，前端根据 type 字段判断）
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum AuthMethod {
    /// 密码认证
    #[serde(rename = "password")]
    Password { password: String },
    /// 私钥认证
    #[serde(rename = "key")]
    Key {
        /// 私钥文件路径（本地绝对路径）
        key_path: String,
        /// 私钥口令（无口令则为 null）
        passphrase: Option<String>,
    },
    /// SSH Agent 认证
    #[serde(rename = "agent")]
    Agent,
}

/// 断开连接的请求
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DisconnectRequest {
    pub session_id: String,
}

/// 终端窗口大小调整请求
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PtyResizeRequest {
    pub session_id: String,
    /// 列数（字符宽度）
    pub cols: u16,
    /// 行数（字符高度）
    pub rows: u16,
}

impl ConnectRequest {
    /// 校验请求参数的合法性
    pub fn validate(&self) -> Result<(), String> {
        if self.name.trim().is_empty() {
            return Err("连接名称不能为空".into());
        }
        if self.host.trim().is_empty() {
            return Err("主机地址不能为空".into());
        }
        if self.port == 0 {
            return Err("端口号不能为 0".into());
        }
        if self.username.trim().is_empty() {
            return Err("用户名不能为空".into());
        }
        Ok(())
    }
}
