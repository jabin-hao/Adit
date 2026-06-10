/**
 * 主题切换按钮
 */
import { Button, Dropdown } from "antd";
import { BulbOutlined } from "@ant-design/icons";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppSettings } from "../../lib/types";

export function ThemeToggle() {
  const { theme, toggle } = useAppTheme();

  const items: Array<{ key: AppSettings["theme"]; label: string }> = [
    { key: "light", label: "亮色" },
    { key: "dark", label: "暗色" },
    { key: "system", label: "跟随系统" },
  ];

  return (
    <Dropdown
      menu={{
        items,
        selectedKeys: [theme],
        onClick: ({ key }) => toggle(key as AppSettings["theme"]),
      }}
    >
      <Button type="text" icon={<BulbOutlined />} />
    </Dropdown>
  );
}
