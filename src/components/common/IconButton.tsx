/**
 * 通用图标按钮 —— 带 tooltip 的简单按钮
 */
import { Button, Tooltip } from "antd";

interface IconButtonProps {
  tooltip: string;
  icon: string;
  onClick: () => void;
  danger?: boolean;
}

export default function IconButton({ tooltip, icon, onClick, danger }: IconButtonProps) {
  return (
    <Tooltip title={tooltip}>
      <Button type="text" size="small" danger={danger} onClick={onClick}>
        {icon}
      </Button>
    </Tooltip>
  );
}
