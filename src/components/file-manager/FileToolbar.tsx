import { Upload, FolderPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { onRefresh: () => void; }

export function FileToolbar({ onRefresh }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm"><Upload />上传</Button>
      <Button variant="outline" size="sm"><FolderPlus />新建文件夹</Button>
      <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw />刷新</Button>
    </div>
  );
}
