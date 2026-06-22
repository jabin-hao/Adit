import { IconUpload, IconFolderPlus, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface Props { onRefresh: () => void; }

export function FileToolbar({ onRefresh }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm"><IconUpload />上传</Button>
      <Button variant="outline" size="sm"><IconFolderPlus />新建文件夹</Button>
      <Button variant="outline" size="sm" onClick={onRefresh}><IconRefresh />刷新</Button>
    </div>
  );
}
