import { Sun, Moon, Monitor } from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/components/ui/button";

const icons: Record<string, React.ReactNode> = {
  light: <Sun size={13} />,
  dark: <Moon size={13} />,
  system: <Monitor size={13} />,
};

export function ThemeToggle() {
  const { theme, cycleTheme } = useAppTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60"
      onClick={cycleTheme}
      aria-label={`主题：${theme}`}
      title={`当前：${theme === "light" ? "亮色" : theme === "dark" ? "暗色" : "跟随系统"}（点击切换）`}
    >
      {icons[theme]}
    </Button>
  );
}
