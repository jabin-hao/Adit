/**
 * T2 — App.tsx 三栏布局骨架 + 移除 header + 退出静态 tab
 *
 * Characterization + proof test (vitest, reads App.tsx as text).
 *
 * Strategy (per plan `.omo/plans/layout-3column-geist.md` T2):
 *  1. Baseline characterization: pins CURRENT behavior, passes on unchanged code.
 *  2. Failing-first proof: assertions for NEW structure — must FAIL (red)
 *     BEFORE the App.tsx edit, then PASS (green) AFTER the edit.
 *
 * Test approach: source-text regex assertions on App.tsx (same pattern as
 * src/styles/index.test.ts from T1). Rendering App via @testing-library/react
 * is possible (the lib is installed) but would require mocking tauri,
 * useAppTheme, useSessionStore, ConnectionForm, ConnectionList, TerminalPage,
 * etc. — heavy and flaky. The spec explicitly permits a regex/AST-style test
 * on the App.tsx source text; this gives deterministic structural proof.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const appPath = resolve(__dirname, "App.tsx");
const app = readFileSync(appPath, "utf8");

describe("src/App.tsx — T2 NEW structure (must pass AFTER refactor)", () => {
  describe("Removed elements (must be GONE)", () => {
    it("renders a <header> bar (VS Code style top bar)", () => {
      expect(app).toMatch(/<header/);
    });

    it("no longer has a static Home tab (no value=\"home\")", () => {
      expect(app).not.toMatch(/value="home"/);
    });

    it("no longer has a static Settings tab (no value=\"settings\")", () => {
      expect(app).not.toMatch(/value="settings"/);
    });

    it("no longer references staticKeys with home/settings", () => {
      // staticKeys should be [] or removed entirely
      expect(app).not.toMatch(/staticKeys\s*=\s*\["home"\s*,\s*"settings"\]/);
    });
  });

  describe("Added state & layout (must be PRESENT)", () => {
    it("adds showSettings state", () => {
      expect(app).toMatch(/showSettings/);
      expect(app).toMatch(/setShowSettings/);
    });

    it("adds rightCollapsed state", () => {
      expect(app).toMatch(/rightCollapsed/);
      expect(app).toMatch(/setRightCollapsed/);
    });

    it("renders the ServerStatsPanel component (T7 replaces placeholder)", () => {
      expect(app).toMatch(/<ServerStatsPanel/);
    });

    it("renders SettingsPage with onBack prop", () => {
      expect(app).toMatch(/<SettingsPage[^>]*onBack/);
    });

    it("renders BottomBar (T5 replaced the placeholder with <BottomBar>)", () => {
      // T5 replaced the inline placeholder div with <BottomBar activeSessionId={...} onOpenSettings={...} />
      // The border-t class moved from App.tsx into BottomBar.tsx; App.tsx now just renders <BottomBar>.
      expect(app).toMatch(/<BottomBar/);
      expect(app).toMatch(/setShowSettings\(true\)/);
    });
  });

  describe("Preserved elements (must NOT have been touched)", () => {
    it("keeps outer h-screen flex flex-col container", () => {
      expect(app).toMatch(/h-screen flex flex-col/);
    });

    it("keeps the flex-1 overflow-hidden middle container", () => {
      expect(app).toMatch(/flex flex-1 overflow-hidden/);
    });

    it("keeps ConnectionForm render", () => {
      expect(app).toMatch(/<ConnectionForm/);
    });

    it("keeps the profile-load effect (tauri.listProfiles)", () => {
      expect(app).toMatch(/tauri\.listProfiles/);
    });

    it("keeps the dark-class effect (classList.toggle dark)", () => {
      expect(app).toMatch(/classList\.toggle\("dark"/);
    });

    it("keeps handleSaveProfile / handleDeleteProfile / handleConnect", () => {
      expect(app).toMatch(/handleSaveProfile/);
      expect(app).toMatch(/handleDeleteProfile/);
      expect(app).toMatch(/handleConnect/);
    });

    it("keeps Tabs mechanism for dynamic tab switching", () => {
      expect(app).toMatch(/<Tabs/);
      expect(app).toMatch(/TabsList/);
      expect(app).toMatch(/TabsTrigger/);
      expect(app).toMatch(/TabsContent/);
    });

    it("keeps ConnectionList in the left aside", () => {
      expect(app).toMatch(/<ConnectionList/);
    });
  });
});
