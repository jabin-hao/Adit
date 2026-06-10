use tokio::sync::mpsc;

/// PTY 数据通道 —— 封装 stdin/stdout/stderr 的 mpsc channel pair
///
/// 前端用户按键通过 stdin_tx 发送到 SSH channel；
/// SSH 服务器输出通过 stdout_rx / stderr_rx 传回前端。
pub struct DataChannel {
    /// 前端 → SSH（用户键盘输入）
    pub stdin_tx: mpsc::Sender<Vec<u8>>,
    /// SSH → 前端（远程 stdout 输出）
    pub stdout_rx: mpsc::Receiver<Vec<u8>>,
    /// SSH → 前端（远程 stderr 输出）
    pub stderr_rx: mpsc::Receiver<Vec<u8>>,
}

impl DataChannel {
    /// 创建一对通道，buffer_size 控制缓冲区大小
    pub fn new(
        buffer_size: usize,
    ) -> (Self, mpsc::Receiver<Vec<u8>>, mpsc::Sender<Vec<u8>>, mpsc::Sender<Vec<u8>>) {
        let (stdin_tx, stdin_rx) = mpsc::channel(buffer_size);
        let (stdout_tx, stdout_rx) = mpsc::channel(buffer_size);
        let (stderr_tx, stderr_rx) = mpsc::channel(buffer_size);

        let channel = Self { stdin_tx, stdout_rx, stderr_rx };

        (channel, stdin_rx, stdout_tx, stderr_tx)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_channel_create_and_send() {
        let (channel, mut stdin_rx, _stdout_tx, _stderr_tx) = DataChannel::new(16);

        channel.stdin_tx.send(b"hello".to_vec()).await.unwrap();
        let data = stdin_rx.recv().await.unwrap();
        assert_eq!(data, b"hello");
    }
}
