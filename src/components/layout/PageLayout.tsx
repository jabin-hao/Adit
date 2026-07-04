import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  /** 返回按钮回调 */
  onBack?: () => void;
  /** 页面标题 */
  title?: string;
  /** 标题右侧操作区 */
  actions?: React.ReactNode;
  /** 最大内容宽度，默认无限制 */
  maxWidth?: string;
  children: React.ReactNode;
}

export function PageLayout({ onBack, title, actions, maxWidth, children }: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 页头 */}
      {(onBack || title || actions) && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 h-7 text-xs shrink-0">
                <ArrowLeft size={13} />返回
              </Button>
            )}
            {title && <h1 className="text-sm font-semibold truncate">{title}</h1>}
          </div>
          {actions && <div className="flex items-center gap-1 shrink-0">{actions}</div>}
        </div>
      )}

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto p-6" style={maxWidth ? { maxWidth } : undefined}>
        {children}
      </div>
    </div>
  );
}
