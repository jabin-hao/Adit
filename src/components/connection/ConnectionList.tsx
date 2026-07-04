import { useState, useMemo, useEffect, useRef } from "react";
import { Folder, Pencil, ChevronRight, PanelLeftClose, ListChevronsUpDown, ListChevronsDownUp, FolderPlus, RefreshCw, Search, SlidersHorizontal, Pin, Copy, Plus, Layers, FilePen, Trash, Server, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from "@/components/common/ContextMenu";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ConnectionListProps {
  profiles: Profile[]; onConnect: (p: Profile) => void;
  onDelete: (id: string) => void; onCreate: () => void;
  onEditDrawer?: (p: Profile) => void;
  onRenameGroup?: (oldName: string, newName: string) => void;
  onUngroup?: (group: string) => void;
  onMoveToGroup?: (profileId: string, group: string) => void;
  onToggleCollapse?: () => void;
  onCreateGroup?: (name: string) => void;
  onRefresh?: () => void;
}

interface GroupEntry {
  name: string;
  profiles: Profile[];
}

export function ConnectionList({ profiles, onConnect, onDelete, onCreate, onEditDrawer, onRenameGroup, onUngroup, onMoveToGroup, onToggleCollapse, onCreateGroup, onRefresh }: ConnectionListProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  /** 新建分组的位置：null = 顶层，字符串 = 父分组路径 */
  const [newGroupParent, setNewGroupParent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  /** 本地空分组 */
  const [pendingGroups, setPendingGroups] = useState<Set<string>>(new Set());
  const [profileMenu, setProfileMenu] = useState<{ x: number; y: number; profile: Profile } | null>(null);
  const [groupMenu, setGroupMenu] = useState<{ x: number; y: number; groupName: string } | null>(null);
  /** 删除分组二次确认 */
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState<string | null>(null);
  const [defaultMenu, setDefaultMenu] = useState<{ x: number; y: number } | null>(null);

  // 当 profile 已属于某 pending 分组时，自动移除 pending 状态
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPendingGroups((prev) => {
      const next = new Set(prev);
      for (const name of prev) {
        if (profiles.some((p) => (p.group || "") === name)) {
          next.delete(name);
        }
      }
      return next.size === prev.size ? prev : next;
    });
  }, [profiles]);

  // 按搜索过滤 profiles
  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) return profiles;
    const q = searchQuery.toLowerCase();
    return profiles.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.host.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q),
    );
  }, [profiles, searchQuery]);

  const groups = useMemo<GroupEntry[]>(() => {
    const map = new Map<string, Profile[]>();
    for (const p of filteredProfiles) {
      const g = p.group || "";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(p);
    }
    // 合并本地空分组
    for (const name of pendingGroups) {
      if (!map.has(name)) {
        map.set(name, []);
      }
    }
    const entries: GroupEntry[] = [];
    for (const [name, items] of map) {
      entries.push({ name: name || "默认", profiles: items });
    }
    // 按路径排序：顶层在前，子分组在后
    entries.sort((a, b) => {
      if (a.name === "默认") return 1;
      if (b.name === "默认") return -1;
      return a.name.localeCompare(b.name);
    });
    return entries;
  }, [filteredProfiles, pendingGroups]);

  /** 分组层级深度（/ 分隔符数量） */
  const groupDepth = (name: string) => (name.match(/\//g) || []).length;

  /** 取路径最后一段作为显示名 */
  const groupLabel = (name: string) => {
    const parts = name.split("/");
    return parts[parts.length - 1];
  };

  const toggleGroup = (name: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const collapseAll = () => {
    const allNames = groups.map((g) => g.name);
    setCollapsedGroups(new Set(allNames));
  };

  const expandAll = () => {
    setCollapsedGroups(new Set());
  };

  const allCollapsed = groups.length > 0 && groups.every((g) => collapsedGroups.has(g.name));

  const startRename = (name: string) => {
    setEditingGroup(name);
    setEditValue(groupLabel(name));
  };

  const submitRename = () => {
    if (!editingGroup || !editValue.trim()) return;
    const parts = editingGroup.split("/");
    parts[parts.length - 1] = editValue.trim();
    const newName = parts.join("/");
    if (newName !== editingGroup) {
      onRenameGroup?.(editingGroup, newName);
    }
    setEditingGroup(null);
  };

  const submitNewGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;
    // 子分组时自动拼接父路径
    const fullName = newGroupParent ? `${newGroupParent}/${name}` : name;
    if (groups.some((g) => g.name === fullName)) return;
    setPendingGroups((prev) => new Set(prev).add(fullName));
    onCreateGroup?.(fullName);
    setNewGroupName("");
    setNewGroupParent(null);
  };

  const handleProfileMenu = (e: React.MouseEvent, profile: Profile) => {
    e.preventDefault();
    setProfileMenu({ x: e.clientX, y: e.clientY, profile });
  };

  const handleGroupMenu = (e: React.MouseEvent, groupName: string) => {
    e.preventDefault();
    setGroupMenu({ x: e.clientX, y: e.clientY, groupName });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
    }
  };

  const btnSm = "size-5 text-muted-foreground hover:text-foreground";

  return (
    <div className="flex flex-col h-full" onClick={() => { setProfileMenu(null); setGroupMenu(null); setDefaultMenu(null); }}>
      {/* 标题栏 + 操作按钮 */}
      <header className="px-3 h-8 border-b flex items-center justify-between shrink-0">
        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">连接列表</h2>
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className={btnSm}
                onClick={allCollapsed ? expandAll : collapseAll} aria-label={allCollapsed ? "展开全部" : "折叠全部"}>
                {allCollapsed ? <ListChevronsDownUp size={12} /> : <ListChevronsUpDown size={12} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{allCollapsed ? "展开全部" : "折叠全部"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className={btnSm}
                onClick={() => setNewGroupParent((v) => v === null ? "" : null)} aria-label="新建分组">
                <FolderPlus size={12} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>新建分组</TooltipContent>
          </Tooltip>
          {onRefresh && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className={btnSm}
                  onClick={onRefresh} aria-label="刷新">
                  <RefreshCw size={12} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>刷新</TooltipContent>
            </Tooltip>
          )}
          {onToggleCollapse && (
            <Button variant="ghost" size="icon" className={cn(btnSm, "ml-0.5")} onClick={onToggleCollapse} aria-label="折叠侧栏">
              <PanelLeftClose size={13} />
            </Button>
          )}
        </div>
      </header>

      {/* 搜索栏 */}
      <div className="px-2 py-1.5 border-b flex items-center gap-1 shrink-0">
        <div className="relative flex-1">
          <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            className="h-7 pl-6 pr-2 text-[11px]"
            placeholder="搜索连接..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className={cn(btnSm, searchQuery ? "text-accent" : "")} aria-label="筛选">
              <SlidersHorizontal size={11} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>筛选</TooltipContent>
        </Tooltip>
      </div>

      {/* 分组列表 */}
      <div className="flex-1 overflow-y-auto py-0.5"
        onContextMenu={(e) => {
          // 只在空白区域弹出
          const target = e.target as HTMLElement;
          if (target.closest("[data-context-item]")) return;
          e.preventDefault();
          setDefaultMenu({ x: e.clientX, y: e.clientY });
        }}
      >
        {profiles.length === 0 && pendingGroups.size === 0 && newGroupParent === null ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-3">
            <Folder size={28} className="opacity-30" />
            <span>暂无保存的连接</span>
            <Button variant="link" onClick={onCreate}>新建一个连接</Button>
          </div>
        ) : filteredProfiles.length === 0 && pendingGroups.size === 0 && newGroupParent === null ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
            <Search size={24} className="opacity-30" />
            <span>无匹配结果</span>
          </div>
        ) : (
          <>
            {/* 顶层新建分组 */}
            {newGroupParent === "" && (
              <NewGroupRow
                value={newGroupName}
                onChange={setNewGroupName}
                onSubmit={submitNewGroup}
                onCancel={() => { setNewGroupParent(null); setNewGroupName(""); }}
              />
            )}
            {groups.map((group) => {
            const isCollapsed = collapsedGroups.has(group.name);
            return (
              <div key={group.name} className="mb-0.5">
                <div
                  data-context-item
                  className="flex items-center gap-1 mx-1 mt-1 mb-0 px-2 h-7 rounded hover:bg-accent/5 cursor-pointer"
                  style={{ marginLeft: `${4 + groupDepth(group.name) * 12}px` }}
                  onClick={() => toggleGroup(group.name)}
                  onContextMenu={(e) => { e.stopPropagation(); handleGroupMenu(e, group.name); }}
                >
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleGroup(group.name); }}
                    className="p-0.5 rounded hover:bg-accent/10 transition-colors"
                    aria-label={isCollapsed ? "展开" : "折叠"}
                  >
                    <ChevronRight
                      size={12}
                      className={`text-muted-foreground transition-transform duration-150 ${isCollapsed ? "" : "rotate-90"}`}
                    />
                  </button>

                  {/* VS Code 风格 inline 编辑 */}
                  {editingGroup === group.name ? (
                    <input
                      className="flex-1 text-[11px] font-semibold uppercase tracking-wider bg-accent/10 border border-accent rounded px-1 py-px outline-none text-foreground min-w-0"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitRename();
                        if (e.key === "Escape") setEditingGroup(null);
                      }}
                      onBlur={submitRename}
                      autoFocus
                    />
                  ) : (
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none flex-1 truncate">
                      {groupLabel(group.name)}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground/50 tabular-nums mr-1">{group.profiles.length}</span>
                </div>

                {/* 子分组输入 */}
                {newGroupParent === group.name && (
                  <NewGroupRow
                    value={newGroupName}
                    onChange={setNewGroupName}
                    onSubmit={submitNewGroup}
                    onCancel={() => { setNewGroupParent(null); setNewGroupName(""); }}
                  />
                )}

                {!isCollapsed && group.profiles.map((p) => (
                  <div key={p.id}
                    data-context-item
                    onDoubleClick={() => onConnect(p)}
                    onKeyDown={(e) => e.key === "Enter" && onConnect(p)}
                    onContextMenu={(e) => handleProfileMenu(e, p)}
                    role="button" tabIndex={0}
                    className="flex items-center gap-2 my-px px-2 h-7 rounded hover:bg-accent/5 cursor-pointer transition-colors"
                    style={{ marginLeft: `${16 + groupDepth(group.name) * 12}px`, marginRight: "4px" }}
                  >
                    <Server size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-[13px] truncate">{p.name}</span>
                  </div>
                ))}
                {/* 删除确认 */}
                {confirmDeleteGroup === group.name && (
                  <div className="flex items-center gap-2 ml-4 mr-1 mb-1 px-2 py-1 text-[11px]">
                    <span className="text-destructive font-medium">删除分组「{groupLabel(group.name)}」？</span>
                    <Button variant="ghost" size="icon" className="text-destructive size-6 text-xs"
                      onClick={() => { onUngroup?.(group.name); setConfirmDeleteGroup(null); }}>是</Button>
                    <Button variant="ghost" size="icon" className="size-6 text-xs text-muted-foreground"
                      onClick={() => setConfirmDeleteGroup(null)}>否</Button>
                  </div>
                )}
              </div>
            );
          })}
          </>
        )}
      </div>

      {/* 连接右键菜单 */}
      {profileMenu && (
        <ContextMenu x={profileMenu.x} y={profileMenu.y} onClose={() => setProfileMenu(null)}>
          <ContextMenuItem icon={<Plug size={12} />} label="连接"
            onClick={() => { onConnect(profileMenu.profile); setProfileMenu(null); }} />
          <ContextMenuItem icon={<Pencil size={12} />} label="编辑"
            onClick={() => {
              if (onEditDrawer) onEditDrawer(profileMenu.profile);
              else onCreate();
              setProfileMenu(null);
            }} />
          <ContextMenuSeparator />
          {/* 移动到分组 —— hover 展开子菜单 */}
          <MoveToMenu
            groups={groups}
            currentGroup={profileMenu.profile.group || ""}
            onMove={(g) => { onMoveToGroup?.(profileMenu.profile.id, g); setProfileMenu(null); }}
          />
          <ContextMenuSeparator />
          <ContextMenuItem icon={<Trash size={12} />} label="删除" danger
            onClick={() => { onDelete(profileMenu.profile.id); setProfileMenu(null); }} />
        </ContextMenu>
      )}

      {/* 分组右键菜单 */}
      {groupMenu && (
        <ContextMenu x={groupMenu.x} y={groupMenu.y} onClose={() => setGroupMenu(null)}>
          {groupMenu.groupName !== "默认" && (
            <ContextMenuItem icon={<Pin size={12} />} label="置顶"
              onClick={() => setGroupMenu(null)} />
          )}
          <ContextMenuItem icon={<Copy size={12} />} label="复制名称"
            onClick={() => { copyToClipboard(groupMenu.groupName); setGroupMenu(null); }} />
          {groupMenu.groupName !== "默认" && (
            <ContextMenuItem icon={<FolderPlus size={12} />} label="新建子分组"
              onClick={() => { setNewGroupName(groupMenu.groupName + "/"); setNewGroupParent(groupMenu.groupName); setGroupMenu(null); }} />
          )}
          <ContextMenuItem icon={<Plus size={12} />} label="新建连接"
            onClick={() => { onCreate(); setGroupMenu(null); }} />
          {groupMenu.groupName === "默认" && (
            <ContextMenuItem icon={<FolderPlus size={12} />} label="新建分组"
              onClick={() => { setNewGroupParent(""); setGroupMenu(null); }} />
          )}
          {groupMenu.groupName !== "默认" && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem icon={<FilePen size={12} />} label="重命名分组"
                onClick={() => { startRename(groupMenu.groupName); setGroupMenu(null); }} />
              <ContextMenuItem icon={<Trash size={12} />} label="删除分组" danger
                onClick={() => { setConfirmDeleteGroup(groupMenu.groupName); setGroupMenu(null); }} />
            </>
          )}
        </ContextMenu>
      )}
      {/* 空白区域右键菜单 */}
      {defaultMenu && (
        <ContextMenu x={defaultMenu.x} y={defaultMenu.y} onClose={() => setDefaultMenu(null)}>
          <ContextMenuItem icon={<Plus size={12} />} label="新建连接"
            onClick={() => { onCreate(); setDefaultMenu(null); }} />
          <ContextMenuItem icon={<FolderPlus size={12} />} label="新建分组"
            onClick={() => { setNewGroupParent(""); setDefaultMenu(null); }} />
        </ContextMenu>
      )}
    </div>
  );
}

/* ── NewGroupRow ────────────────────────── */

function NewGroupRow({ value, onChange, onSubmit, onCancel }: {
  value: string; onChange: (v: string) => void; onSubmit: () => void; onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-1 mx-1 mt-1 mb-0 px-2 h-7"
      style={{ marginLeft: "4px" }}>
      <span className="p-0.5 opacity-30"><ChevronRight size={12} /></span>
      <input
        className="flex-1 text-[11px] font-semibold uppercase tracking-wider bg-accent/10 border border-accent rounded px-1 py-px outline-none text-foreground min-w-0"
        placeholder="分组名"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); onSubmit(); }
          if (e.key === "Escape") onCancel();
        }}
        onBlur={() => { if (value.trim()) onSubmit(); else onCancel(); }}
        autoFocus
      />
      <span className="text-[10px] text-muted-foreground/50 tabular-nums mr-1">0</span>
    </div>
  );
}

/* ── MoveToMenu ─────────────────────────── */

function MoveToMenu({ groups, currentGroup, onMove }: {
  groups: GroupEntry[];
  currentGroup: string;
  onMove: (group: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const depth = (name: string) => (name.match(/\//g) || []).length;

  const handleEnter = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button type="button"
        className="w-full flex items-center justify-between px-2 py-1 text-[11px] text-left text-foreground hover:bg-accent/10 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Layers size={12} className="text-muted-foreground" />
          移动到分组
        </span>
        <ChevronRight size={12} className="text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute left-full top-0 ml-0.5 bg-popover border border-border rounded shadow-md py-0.5 w-36 z-[60]">
          {groups.filter((g) => g.name !== currentGroup && g.name !== "默认").map((g) => (
            <button key={g.name} type="button"
              className="w-full flex items-center gap-2 px-2 py-1 text-[11px] text-left text-foreground hover:bg-accent/10 transition-colors"
              style={{ paddingLeft: `${8 + depth(g.name) * 10}px` }}
              onClick={() => onMove(g.name)}>
              <Folder size={10} className="text-muted-foreground shrink-0" />
              {g.name.includes("/") ? g.name.split("/").pop() : g.name}
            </button>
          ))}
          {currentGroup && (
            <>
              <div className="my-0.5 border-t border-border" />
              <button type="button"
                className="w-full flex items-center gap-2 px-2 py-1 text-[11px] text-left text-muted-foreground hover:bg-accent/10 transition-colors"
                onClick={() => onMove("")}>
                <ChevronRight size={10} className="opacity-0" />
                取消分组
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
