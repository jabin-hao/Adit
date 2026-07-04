import { useCallback, useEffect, useState } from "react";
import { Minus, Square, X, Copy } from "lucide-react";

export function WindowControls() {
  const [maximized, setMaximized] = useState(false);
  const [ready, setReady] = useState(false);

  // 延迟导入 —— 确保 Tauri runtime 就绪
  const minimize = useCallback(async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().minimize();
    } catch (e) {
      console.error("minimize:", e);
    }
  }, []);

  const toggleMaximize = useCallback(async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().toggleMaximize();
    } catch (e) {
      console.error("toggleMaximize:", e);
    }
  }, []);

  const close = useCallback(async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().close();
    } catch (e) {
      console.error("close:", e);
    }
  }, []);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    (async () => {
      try {
        const { getCurrentWindow } = await import("@tauri-apps/api/window");
        const w = getCurrentWindow();
        setMaximized(await w.isMaximized());
        const fn = await w.onResized(() => {
          w.isMaximized().then(setMaximized);
        });
        unlisten = fn;
      } catch {
        // 非 Tauri 环境静默忽略
      }
      setReady(true);
    })();
    return () => {
      unlisten?.();
    };
  }, []);

  if (!ready) return null;

  const btn =
    "flex items-center justify-center size-7 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded transition-colors";

  return (
    <div className="flex items-center h-full">
      <button type="button" className={btn} onClick={minimize} aria-label="最小化">
        <Minus size={14} />
      </button>
      <button type="button" className={btn} onClick={toggleMaximize} aria-label={maximized ? "还原" : "最大化"}>
        {maximized ? <Copy size={13} /> : <Square size={13} />}
      </button>
      <button
        type="button"
        className={`${btn} hover:bg-destructive hover:text-destructive-foreground`}
        onClick={close}
        aria-label="关闭"
      >
        <X size={15} />
      </button>
    </div>
  );
}
