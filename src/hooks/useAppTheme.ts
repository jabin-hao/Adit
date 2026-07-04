/**
 * 主题切换 Hook
 */
import { useCallback } from "react";
import { useConfigStore } from "../store/configStore";
import type { AppSettings } from "../lib/types";

const cycle: AppSettings["theme"][] = ["light", "dark", "system"];

export function useAppTheme() {
  const theme = useConfigStore((s) => s.config.theme);
  const setConfig = useConfigStore((s) => s.setConfig);

  const toggle = useCallback(
    (value: AppSettings["theme"]) => {
      setConfig({ theme: value });
    },
    [setConfig],
  );

  /** 点击循环切换 light → dark → system → light */
  const cycleTheme = useCallback(() => {
    const idx = cycle.indexOf(theme);
    setConfig({ theme: cycle[(idx + 1) % cycle.length] });
  }, [theme, setConfig]);

  return { theme, toggle, cycleTheme };
}
