import { useState, useMemo } from "react";
import { IconFolder, IconEdit, IconTrash, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Profile } from "@/lib/types";

interface ConnectionListProps {
  profiles: Profile[]; onConnect: (p: Profile) => void; onEdit: (p: Profile) => void;
  onDelete: (id: string) => void; onCreate: () => void;
  onRenameGroup?: (oldName: string, newName: string) => void;
  onUngroup?: (group: string) => void;
  onMoveToGroup?: (profileId: string, group: string) => void;
}

interface GroupEntry {
  name: string;
  profiles: Profile[];
}

export function ConnectionList({ profiles, onConnect, onEdit, onDelete, onCreate, onRenameGroup, onUngroup, onMoveToGroup }: ConnectionListProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const groups = useMemo<GroupEntry[]>(() => {
    const map = new Map<string, Profile[]>();
    for (const p of profiles) {
      const g = p.group || "";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(p);
    }
    const entries: GroupEntry[] = [];
    for (const [name, items] of map) {
      entries.push({ name: name || "默认", profiles: items });
    }
    entries.sort((a, b) => {
      if (a.name === "默认") return 1;
      if (b.name === "默认") return -1;
      return a.name.localeCompare(b.name);
    });
    return entries;
  }, [profiles]);

  const toggleGroup = (name: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const startRename = (name: string) => {
    setEditingGroup(name);
    setEditValue(name);
  };

  const submitRename = () => {
    if (editingGroup && editValue.trim() && editValue.trim() !== editingGroup) {
      onRenameGroup?.(editingGroup, editValue.trim());
    }
    setEditingGroup(null);
  };

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; profileId: string; currentGroup: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, profileId: string, currentGroup: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, profileId, currentGroup });
  };

  const allGroupNames = useMemo(() => {
    return [...new Set(profiles.map((p) => p.group).filter(Boolean))];
  }, [profiles]);

  return (
    <div className="flex flex-col h-full" onClick={() => setContextMenu(null)}>
      <header className="px-4 py-3.5 border-b">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">连接列表</h2>
      </header>
      <div className="flex-1 overflow-y-auto py-0.5">
        {profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-3">
            <IconFolder size={28} className="opacity-30" />
            <span>暂无保存的连接</span>
            <Button variant="link" onClick={onCreate}>新建一个连接</Button>
          </div>
        ) : (
          groups.map((group) => {
            const isCollapsed = collapsedGroups.has(group.name);
            return (
              <div key={group.name} className="mb-0.5">
                <div className="flex items-center gap-1 mx-2 mt-1.5 mb-0.5 px-2 py-1 rounded-md hover:bg-accent/5 group/gh">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.name)}
                    className="p-0.5 rounded hover:bg-accent/10 transition-colors"
                    aria-label={isCollapsed ? "展开" : "折叠"}
                  >
                    <IconChevronRight
                      size={12}
                      className={`text-muted-foreground transition-transform duration-150 ${isCollapsed ? "" : "rotate-90"}`}
                    />
                  </button>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none flex-1">
                    {group.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50 tabular-nums mr-1">{group.profiles.length}</span>
                  {group.name !== "默认" && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover/gh:opacity-100 transition-opacity">
                      <Tooltip><TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-5"
                          onClick={(e) => { e.stopPropagation(); startRename(group.name); }}><IconEdit size={11} /></Button>
                      </TooltipTrigger><TooltipContent>重命名</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-5 text-destructive"
                          onClick={(e) => { e.stopPropagation(); onUngroup?.(group.name); }}><IconTrash size={11} /></Button>
                      </TooltipTrigger><TooltipContent>取消分组</TooltipContent></Tooltip>
                    </div>
                  )}
                </div>

                {editingGroup === group.name && (
                  <div className="mx-2 mb-1 px-2 flex items-center gap-1">
                    <input
                      className="flex-1 text-[11px] px-1.5 py-0.5 rounded border border-input bg-transparent outline-none focus:border-accent"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") submitRename(); if (e.key === "Escape") setEditingGroup(null); }}
                      onBlur={submitRename}
                      autoFocus
                    />
                  </div>
                )}

                {!isCollapsed && group.profiles.map((p) => (
                  <div key={p.id}
                    onDoubleClick={() => onConnect(p)}
                    onKeyDown={(e) => e.key === "Enter" && onConnect(p)}
                    onContextMenu={(e) => handleContextMenu(e, p.id, p.group || "")}
                    role="button" tabIndex={0}
                    className="group flex items-center justify-between mx-2 my-px px-3 py-2.5 rounded-lg hover:bg-accent/5 cursor-pointer transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium truncate">{p.name}</span>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/30 text-primary">{p.auth_type}</Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate mt-0.5">{p.username}@{p.host}:{p.port}</div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-7" onClick={(e) => { e.stopPropagation(); onConnect(p); }}><IconFolder size={14} /></Button></TooltipTrigger><TooltipContent>打开终端</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-7" onClick={(e) => { e.stopPropagation(); onEdit(p); }}><IconEdit size={14} /></Button></TooltipTrigger><TooltipContent>编辑</TooltipContent></Tooltip>
                      {confirmDeleteId === p.id ? (
                        <span className="flex items-center gap-1 text-xs">
                          <span className="text-destructive font-medium">删除?</span>
                          <Button variant="ghost" size="icon" className="text-destructive size-7" onClick={(e) => { e.stopPropagation(); onDelete(p.id); setConfirmDeleteId(null); }}>是</Button>
                          <Button variant="ghost" size="icon" className="size-7" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}>否</Button>
                        </span>
                      ) : (
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(p.id); }}><IconTrash size={14} /></Button></TooltipTrigger><TooltipContent>删除</TooltipContent></Tooltip>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>

      {contextMenu && allGroupNames.length > 0 && (
        <div
          className="fixed z-50 bg-popover border border-border rounded-md shadow-md py-1 min-w-[140px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2 py-0.5 text-[10px] text-muted-foreground uppercase tracking-wider">移动到</div>
          {allGroupNames.filter((g) => g !== contextMenu.currentGroup).map((g) => (
            <button key={g} className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent/10 transition-colors"
              onClick={() => { onMoveToGroup?.(contextMenu.profileId, g); setContextMenu(null); }}>
              {g}
            </button>
          ))}
          {contextMenu.currentGroup && (
            <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent/10 transition-colors text-muted-foreground"
              onClick={() => { onMoveToGroup?.(contextMenu.profileId, ""); setContextMenu(null); }}>
              取消分组
            </button>
          )}
        </div>
      )}
    </div>
  );
}
