use serde::{Deserialize, Serialize};

/// 服务器状态信息（前端展示用）
///
/// stub —— 待 SSH exec 实现后填充真实采集逻辑
/// （cat /proc/stat、free -m、df -h、uptime、hostnamectl）
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ServerStats {
    /// CPU 使用率（百分比）
    pub cpu_usage_percent: f64,
    /// CPU 逻辑核心数
    pub cpu_cores: u32,
    /// 1 分钟负载平均
    pub load_avg_1: f64,
    /// 5 分钟负载平均
    pub load_avg_5: f64,
    /// 15 分钟负载平均
    pub load_avg_15: f64,
    /// 内存总量（MB）
    pub mem_total_mb: u64,
    /// 已用内存（MB）
    pub mem_used_mb: u64,
    /// 可用内存（MB）
    pub mem_available_mb: u64,
    /// 磁盘总量（GB）
    pub disk_total_gb: f64,
    /// 已用磁盘（GB）
    pub disk_used_gb: f64,
    /// 系统运行时长（秒）
    pub uptime_secs: u64,
    /// 主机名
    pub hostname: String,
    /// 操作系统名称
    pub os_name: String,
    /// 内核版本
    pub kernel_version: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_stats_stub_default() {
        let s = ServerStats::default();
        assert_eq!(s.cpu_usage_percent, 0.0);
        assert_eq!(s.cpu_cores, 0);
        assert_eq!(s.load_avg_1, 0.0);
        assert_eq!(s.load_avg_5, 0.0);
        assert_eq!(s.load_avg_15, 0.0);
        assert_eq!(s.mem_total_mb, 0);
        assert_eq!(s.mem_used_mb, 0);
        assert_eq!(s.mem_available_mb, 0);
        assert_eq!(s.disk_total_gb, 0.0);
        assert_eq!(s.disk_used_gb, 0.0);
        assert_eq!(s.uptime_secs, 0);
        assert!(s.hostname.is_empty());
        assert!(s.os_name.is_empty());
        assert!(s.kernel_version.is_empty());
    }
}
