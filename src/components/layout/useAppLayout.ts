import { createContext, useContext } from "react";

export interface LayoutContext {
  sidebarCollapsed: boolean;
  rightCollapsed: boolean;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  collapseSidebar: () => void;
  collapseRightPanel: () => void;
}

export const LayoutCtx = createContext<LayoutContext | null>(null);

const noop = () => {};
const fallback: LayoutContext = {
  sidebarCollapsed: false,
  rightCollapsed: false,
  toggleSidebar: noop,
  toggleRightPanel: noop,
  collapseSidebar: noop,
  collapseRightPanel: noop,
};

export const useAppLayout = () => useContext(LayoutCtx) ?? fallback;
