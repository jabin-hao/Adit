import { IconArrowUp, IconFolder, IconFile, IconDownload, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSftp } from "@/hooks/useSftp";
import { useFileStore } from "@/store/fileStore";

interface Props { sessionId: string; }

export function FileTable({ sessionId }: Props) {
  const { currentPath, navigateTo, goUp, remove } = useSftp(sessionId);
  const files = useFileStore((s) => s.fileLists.get(sessionId) ?? []);
  const loading = useFileStore((s) => s.loading);
  if (loading) return <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">加载中...</div>;

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <Button variant="outline" size="sm" onClick={goUp}><IconArrowUp />上级目录</Button>
        <span className="text-xs text-muted-foreground font-mono">{currentPath}</span>
      </div>
      <div className="flex-1 overflow-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow><TableHead>名称</TableHead><TableHead className="w-24">大小</TableHead><TableHead className="w-28">权限</TableHead><TableHead className="w-44">修改时间</TableHead><TableHead className="w-20">操作</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {files.map((f) => (
              <TableRow key={f.path} onDoubleClick={() => navigateTo(f)}>
                <TableCell><span onClick={() => navigateTo(f)} className="inline-flex items-center gap-2 hover:text-primary transition-colors font-medium cursor-pointer">{f.is_dir ? <IconFolder size={16} className="text-amber-500" /> : <IconFile size={16} className="text-muted-foreground" />}{f.name}</span></TableCell>
                <TableCell className="text-muted-foreground tabular-nums text-xs">{f.is_dir ? "—" : fmtSize(f.size)}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{f.permissions}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{f.modified_at ? new Date(f.modified_at * 1000).toLocaleString() : "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    {!f.is_dir && <Button variant="ghost" size="icon" className="size-7" title="下载"><IconDownload size={14} /></Button>}
                    <Button variant="ghost" size="icon" className="size-7 text-destructive" title="删除" onClick={() => remove(f.path)}><IconTrash size={14} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {files.length === 0 && <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">目录为空</div>}
      </div>
    </div>
  );
}

function fmtSize(b: number): string {
  if (b === 0) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / 1024 ** i).toFixed(1)} ${u[i]}`;
}
