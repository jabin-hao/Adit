import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
}

export function ContextMenu({ x, y, onClose, children }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, [onClose]);

  // 防止菜单超出屏幕
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      ref.current.style.left = `${x - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight) {
      ref.current.style.top = `${y - rect.height}px`;
    }
  }, [x, y]);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-popover border border-border rounded shadow-md py-0.5 w-36"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

/* ── ContextMenuItem ───────────────────────── */

interface ContextMenuItemProps {
  icon?: React.ReactNode;
  label: string;
  shortcut?: string;
  danger?: boolean;
  onClick: () => void;
}

export function ContextMenuItem({ icon, label, shortcut, danger, onClick }: ContextMenuItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "w-full flex items-center justify-between px-2 py-1 text-[11px] transition-colors text-left",
        danger
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-accent/10",
      )}
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        {icon && <span className="flex items-center justify-center w-4 text-muted-foreground">{icon}</span>}
        {!icon && <span className="w-4" />}
        {label}
      </span>
      {shortcut && (
        <span className="text-[10px] text-muted-foreground/60 ml-4 tabular-nums">{shortcut}</span>
      )}
    </button>
  );
}

/* ── ContextMenuSeparator ──────────────────── */

export function ContextMenuSeparator() {
  return <div className="my-1 border-t border-border" />;
}
