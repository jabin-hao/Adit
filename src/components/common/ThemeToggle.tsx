import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { AppSettings } from "@/lib/types";

export function ThemeToggle() {
  const { theme, toggle } = useAppTheme();
  const items: Array<{ key: AppSettings["theme"]; label: string; icon: React.ReactNode }> = [
    { key: "light", label: "亮色", icon: <IconSun size={15} /> },
    { key: "dark", label: "暗色", icon: <IconMoon size={15} /> },
    { key: "system", label: "跟随系统", icon: <IconDeviceDesktop size={15} /> },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">{theme === "dark" ? <IconMoon size={17} /> : <IconSun size={17} />}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item) => (
          <DropdownMenuItem key={item.key} onClick={() => toggle(item.key)} className="gap-2.5">
            {item.icon}<span className={theme === item.key ? "font-medium text-primary" : ""}>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
