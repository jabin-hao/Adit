/**
 * 主题切换 Hook
 */
import { useCallback } from "react";
import { useConfigStore } from "../store/configStore";
import type { AppSettings } from "../lib/types";

export function useAppTheme() {
  const theme = useConfigStore((s) => s.config.theme);
  const setConfig = useConfigStore((s) => s.setConfig);

  const toggle = useCallback(
    (value: AppSettings["theme"]) => {
      setConfig({ theme: value });
    },
    [setConfig],
  );

  return { theme, toggle };
}
