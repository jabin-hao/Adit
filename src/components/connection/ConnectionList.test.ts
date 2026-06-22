/**
 * T3 — ConnectionList 移除顶部按钮 + 折叠按钮迁至底部（后续 header 重构后又移除了底部按钮）
 *
 * 最新状态: 折叠按钮已迁移到 App.tsx header 栏右上角，ConnectionList 不再包含任何折叠按钮。
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const srcPath = resolve(__dirname, "ConnectionList.tsx");
const src = readFileSync(srcPath, "utf8");

// Extract the <header>...</header> element for header-specific assertions.
const headerElMatch = src.match(/<header[^>]*>[\s\S]*?<\/header>/);
const headerEl = headerElMatch ? headerElMatch[0] : "";

describe("src/components/connection/ConnectionList.tsx — T3 + header-refactor structure", () => {
  describe("Removed elements (must be GONE)", () => {
    it("no longer has a 新建 button in the top header", () => {
      expect(src).not.toMatch(/新建<\/Button>/);
    });

    it("no longer imports IconPlus", () => {
      expect(src).not.toMatch(/IconPlus/);
    });

    it("no longer imports IconLayoutSidebarRightCollapse", () => {
      expect(src).not.toMatch(/IconLayoutSidebarRightCollapse/);
    });

    it("no longer has collapse button in the <header> element", () => {
      expect(headerEl).not.toMatch(/IconLayoutSidebarRightCollapse/);
      expect(headerEl).not.toMatch(/onToggleCollapse/);
    });

    it("no longer has onToggleCollapse prop in interface or component", () => {
      expect(src).not.toMatch(/onToggleCollapse/);
    });

    it("no longer has the bottom bar with collapse button and hint text", () => {
      // The bottom bar div is gone entirely
      expect(src).not.toMatch(/双击连接/);
      expect(src).not.toMatch(/折叠侧栏/);
    });
  });

  describe("Preserved elements (must NOT have been touched)", () => {
    it("keeps the 连接列表 title", () => {
      expect(src).toMatch(/连接列表/);
    });

    it("keeps onCreate prop (still used by empty-state link)", () => {
      expect(src).toMatch(/onCreate/);
    });

    it("keeps the empty-state 新建一个连接 link", () => {
      expect(src).toMatch(/新建一个连接/);
    });

    it("keeps confirmDeleteId logic", () => {
      expect(src).toMatch(/confirmDeleteId/);
    });

    it("keeps connection item rendering (onDoubleClick)", () => {
      expect(src).toMatch(/onDoubleClick/);
    });
  });
});
