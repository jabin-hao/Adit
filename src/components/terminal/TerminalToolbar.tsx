import { Clipboard, FileText, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props { sessionId: string; }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TerminalToolbar(_props: Props) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-700">
      <span className="text-[11px] text-slate-400 font-medium tracking-wide">终端</span>
      <div className="flex items-center gap-0.5">
        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-7 text-slate-400 hover:text-slate-200 hover:bg-slate-800"><Clipboard size={14} /></Button></TooltipTrigger><TooltipContent>复制</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-7 text-slate-400 hover:text-slate-200 hover:bg-slate-800"><FileText size={14} /></Button></TooltipTrigger><TooltipContent>粘贴</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-7 text-slate-400 hover:text-slate-200 hover:bg-slate-800"><Eraser size={14} /></Button></TooltipTrigger><TooltipContent>清屏</TooltipContent></Tooltip>
      </div>
    </div>
  );
}
