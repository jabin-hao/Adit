/**
 * 设置页面 —— 主题、字体、快捷键等
 *
 * TODO: 完善设置项
 * - 终端字体大小调节
 * - 字体族选择
 * - 快捷键绑定查看/自定义
 * - 关于 Adit 信息
 */
import { Card, Form, InputNumber, Select, Space, Typography } from "antd";
import { useConfigStore } from "../store/configStore";
import { useAppTheme } from "../hooks/useAppTheme";

export function SettingsPage() {
  const config = useConfigStore((s) => s.config);
  const setConfig = useConfigStore((s) => s.setConfig);
  const { theme, toggle } = useAppTheme();

  return (
    <div className="p-6 max-w-2xl">
      <Typography.Title level={3}>设置</Typography.Title>

      <Space direction="vertical" size="large" className="w-full">
        <Card title="外观">
          <Form layout="vertical">
            <Form.Item label="主题">
              <Select
                value={theme}
                onChange={(v) => toggle(v as "light" | "dark" | "system")}
                options={[
                  { value: "light", label: "☀️ 亮色" },
                  { value: "dark", label: "🌙 暗色" },
                  { value: "system", label: "💻 跟随系统" },
                ]}
              />
            </Form.Item>
          </Form>
        </Card>

        <Card title="终端">
          <Form layout="vertical">
            <Form.Item label="字体大小">
              <InputNumber
                min={10}
                max={24}
                value={config.font_size}
                onChange={(v) => v && setConfig({ font_size: v })}
              />
            </Form.Item>
            <Form.Item label="回滚行数">
              <InputNumber
                min={1000}
                max={50000}
                step={1000}
                value={config.scrollback_lines}
                onChange={(v) => v && setConfig({ scrollback_lines: v })}
              />
            </Form.Item>
          </Form>
        </Card>

        <Card title="关于">
          <Typography.Text type="secondary">
            Adit — 跨平台 SSH/SFTP 客户端
          </Typography.Text>
        </Card>
      </Space>
    </div>
  );
}
