/// 安全拼接远程路径，防止路径穿越攻击
///
/// # 示例
/// ```
/// # use adit_lib::utils::path::safe_join_path;
/// let result = safe_join_path("/home/user", "documents");
/// assert_eq!(result.unwrap(), "/home/user/documents");
///
/// let result = safe_join_path("/home/user", "../../etc/passwd");
/// assert!(result.is_err()); // 路径穿越被阻止
/// ```
pub fn safe_join_path(base: &str, child: &str) -> Result<String, String> {
    // 规范化 base 路径
    let base = base.trim_end_matches('/');

    // 拒绝以 / 开头的 child（防止绝对路径注入）
    if child.starts_with('/') {
        return Err("不允许使用绝对路径".into());
    }

    // 简单路径穿越检测
    if child.contains("..") {
        return Err("路径包含非法字符 ..".into());
    }

    if child.is_empty() || child == "." {
        return Ok(base.to_string());
    }

    Ok(format!("{}/{}", base, child))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_normal_join() {
        let result = safe_join_path("/home/user", "docs");
        assert_eq!(result.unwrap(), "/home/user/docs");
    }

    #[test]
    fn test_empty_child() {
        let result = safe_join_path("/home/user", "");
        assert_eq!(result.unwrap(), "/home/user");
    }

    #[test]
    fn test_dot_child() {
        let result = safe_join_path("/home/user", ".");
        assert_eq!(result.unwrap(), "/home/user");
    }

    #[test]
    fn test_reject_absolute_child() {
        let result = safe_join_path("/home/user", "/etc/passwd");
        assert!(result.is_err());
    }

    #[test]
    fn test_reject_path_traversal() {
        let result = safe_join_path("/home/user", "../../etc/passwd");
        assert!(result.is_err());
    }
}
