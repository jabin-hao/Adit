import { IconFileX } from "@tabler/icons-react";

export function TransferProgress() {
  return (
    <div className="flex flex-col items-center justify-center py-4 text-muted-foreground text-xs gap-1.5">
      <IconFileX size={20} className="opacity-40" />
      <span>无传输任务</span>
    </div>
  );
}
