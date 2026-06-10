use crate::types::connection::AuthMethod;

/// 认证结果
pub enum AuthResult {
    Success,
    Failure(String),
}

/// 处理 SSH 认证
///
/// 支持三种方式：密码、私钥（含口令）、SSH Agent。
/// 具体 russh 调用留给你实现。
pub async fn authenticate(
    _username: &str,
    _method: &AuthMethod,
    _host: &str,
    _port: u16,
) -> Result<AuthResult, String> {
    // TODO: 实现 russh 认证逻辑
    // - Password: 直接调用 russh 的密码认证
    // - Key: 读取私钥文件，解析后调用 russh 的公钥认证（注意 passphrase 解密）
    // - Agent: 连接 SSH_AUTH_SOCK (Unix) 或 Pageant (Windows)
    //   注意 Windows 下 Agent 支持可能不完整，需降级处理
    Ok(AuthResult::Success)
}

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: 添加认证逻辑的单元测试
    // - 密码为空时返回 Failure
    // - 密钥文件不存在时返回 Failure
    // - Agent 不可用时正确降级
}
