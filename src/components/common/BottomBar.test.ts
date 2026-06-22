/**
 * T5 — BottomBar (合并 StatusBar + 设置按钮 + ThemeToggle)
 *
 * Characterization + proof test (vitest, reads App.tsx + BottomBar.tsx as text).
 *
 * Strategy (per plan `.omo/plans/layout-3column-geist.md` T5):
 *  1. Baseline characterization: pins CURRENT behavior (placeholder bottom bar
 *     with "状态栏占位" text in App.tsx, no BottomBar.tsx file). Passes on
 *     unchanged code.
 *  2. Failing-first proof: assertions for NEW structure (`<BottomBar` in
 *     App.tsx, BottomBar.tsx exists with right props/structure, placeholder
 *     gone) — must FAIL (red) BEFORE the edit, then PASS (green) AFTER.
 *
 * Test approach: source-text regex assertions (same pattern as T1/T2 tests).
 * Rendering BottomBar via @testing-library/react would require mocking tauri,
 * useAppTheme, useSessionStore, DropdownMenu — heavy and flaky. The spec
 * explicitly permits a regex/AST-style test on source text.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const appPath = resolve(__dirname, "../../App.tsx");
const app = readFileSync(appPath, "utf8");

const bottomBarPath = resolve(__dirname, "BottomBar.tsx");
const bottomBarExists = existsSync(bottomBarPath);
const bottomBar = bottomBarExists ? readFileSync(bottomBarPath, "utf8") : "";

describe("src/components/common/BottomBar — T5 NEW structure (must pass AFTER edit)", () => {
  describe("App.tsx — placeholder GONE, BottomBar PRESENT", () => {
    it("no longer renders the 状态栏占位 placeholder text", () => {
      expect(app).not.toMatch(/状态栏占位/);
    });

    it("no longer has the inline placeholder settings button JSX", () => {
      // The placeholder had an inline <IconSettings size={15} /> button;
      // after T5 the settings button lives inside BottomBar.tsx, not App.tsx.
      expect(app).not.toMatch(/<IconSettings/);
    });

    it("renders <BottomBar with activeSessionId + onOpenSettings props", () => {
      expect(app).toMatch(/<BottomBar\s+activeSessionId=\{[^}]+\}\s+onOpenSettings=\{[^}]+\}\s*\/>/);
    });

    it("imports BottomBar from @/components/common/BottomBar", () => {
      expect(app).toMatch(/import\s+\{\s*BottomBar\s*\}\s+from\s+"@\/components\/common\/BottomBar"/);
    });
  });

  describe("BottomBar.tsx — exists with correct structure", () => {
    it("BottomBar.tsx file exists", () => {
      expect(bottomBarExists).toBe(true);
    });

    it("declares props interface with activeSessionId + onOpenSettings", () => {
      expect(bottomBar).toMatch(/activeSessionId/);
      expect(bottomBar).toMatch(/onOpenSettings/);
    });

    it("uses useSessionStore for sessions (same pattern as StatusBar)", () => {
      expect(bottomBar).toMatch(/useSessionStore/);
    });

    it("calls tauri.getVersion() (same pattern as StatusBar)", () => {
      expect(bottomBar).toMatch(/tauri\.getVersion/);
    });

    it("reuses ThemeToggle as a child component", () => {
      expect(bottomBar).toMatch(/<ThemeToggle/);
      expect(bottomBar).toMatch(/import\s+\{\s*ThemeToggle\s*\}/);
    });

    it("renders a <footer> with Geist bottom-bar classes", () => {
      expect(bottomBar).toMatch(/<footer[^>]*className="flex items-center justify-between px-4 py-1\.5 border-t bg-muted\/30 text-\[11px\]"/);
    });

    it("has a settings button with aria-label=设置 calling onOpenSettings", () => {
      expect(bottomBar).toMatch(/aria-label="设置"/);
      expect(bottomBar).toMatch(/onClick=\{onOpenSettings\}/);
    });

    it("uses IconSettings from @tabler/icons-react", () => {
      expect(bottomBar).toMatch(/IconSettings/);
    });

    it("uses IconPlugConnected for the version span", () => {
      expect(bottomBar).toMatch(/IconPlugConnected/);
    });

    it("shows session status dot logic (connected/connecting/fallback)", () => {
      expect(bottomBar).toMatch(/connected/);
      expect(bottomBar).toMatch(/connecting/);
      expect(bottomBar).toMatch(/bg-emerald-400/);
      expect(bottomBar).toMatch(/bg-amber-400/);
    });

    it("shows session count via sessions.size", () => {
      expect(bottomBar).toMatch(/sessions\.size/);
    });

    it("shows Badge with active?.status ?? 未连接", () => {
      expect(bottomBar).toMatch(/Badge/);
      expect(bottomBar).toMatch(/未连接/);
    });

    it("shows version span with Adit v{version}", () => {
      expect(bottomBar).toMatch(/Adit v\{version\}/);
    });
  });

  describe("Preserved — must NOT have been touched", () => {
    it("StatusBar.tsx file still exists (not deleted)", () => {
      const statusBarPath = resolve(__dirname, "StatusBar.tsx");
      expect(existsSync(statusBarPath)).toBe(true);
    });

    it("ThemeToggle.tsx file still exists (not deleted)", () => {
      const themeTogglePath = resolve(__dirname, "ThemeToggle.tsx");
      expect(existsSync(themeTogglePath)).toBe(true);
    });

    it("App.tsx keeps outer h-screen flex flex-col container", () => {
      expect(app).toMatch(/h-screen flex flex-col/);
    });

    it("App.tsx keeps ConnectionForm render", () => {
      expect(app).toMatch(/<ConnectionForm/);
    });

    it("App.tsx keeps showSettings state", () => {
      expect(app).toMatch(/showSettings/);
    });
  });
});
