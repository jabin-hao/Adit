/**
 * T4 — 设置入口路由（底部按钮 → 中部临时 SettingsView + 返回）
 *
 * Characterization + proof test (vitest, reads source as text).
 *
 * Strategy (per plan `.omo/plans/layout-3column-geist.md` T4):
 *  1. Baseline characterization: pins CURRENT structure, passes on unchanged code.
 *  2. Failing-first proof: assertions for REFINED back button UI — must FAIL (red)
 *     if the back button is a minimal/basic stub, then PASS (green) after refinement.
 *
 * Test approach: source-text regex assertions on SettingsPage.tsx + App.tsx
 * (same pattern as src/App.test.tsx from T2 and src/styles/index.test.ts from T1).
 * Rendering SettingsPage via @testing-library/react is possible but would require
 * mocking useConfigStore, useAppTheme, and tauri — heavy and flaky. The spec
 * explicitly permits source-text regex assertions; this gives deterministic
 * structural proof of the refined back button UI and routing wiring.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const settingsPath = resolve(__dirname, "SettingsPage.tsx");
const settings = readFileSync(settingsPath, "utf8");

const appPath = resolve(__dirname, "..", "App.tsx");
const app = readFileSync(appPath, "utf8");

describe("src/pages/SettingsPage.tsx — T4 refined back button (must pass after refinement)", () => {
  describe("onBack prop (forward-declared by T2, kept by T4)", () => {
    it("declares optional onBack prop in interface", () => {
      expect(settings).toMatch(/onBack\?\s*:\s*\(\)\s*=>\s*void/);
    });

    it("destructures onBack in component params", () => {
      expect(settings).toMatch(/\{\s*onBack\s*\}/);
    });
  });

  describe("REFINED back button UI (T4 spec — the key assertions)", () => {
    it("imports IconArrowLeft from @tabler/icons-react", () => {
      expect(settings).toMatch(/IconArrowLeft/);
      expect(settings).toMatch(/@tabler\/icons-react/);
    });

    it("renders back button only when onBack is provided (conditional guard)", () => {
      // {onBack && (...)} — the button must be conditional
      expect(settings).toMatch(/\{onBack\s*&&\s*\(/);
    });

    it("back button uses variant=\"ghost\" (Geist tertiary style)", () => {
      expect(settings).toMatch(/<Button\s+variant="ghost"/);
    });

    it("back button uses size=\"sm\"", () => {
      // Match the back button specifically (not other buttons in the file)
      // The back button is the one inside {onBack && (...)} with onClick={onBack}
      expect(settings).toMatch(/<Button\s+variant="ghost"\s+size="sm"\s+onClick=\{onBack\}/);
    });

    it("back button has className with gap-1.5 and mb-4", () => {
      expect(settings).toMatch(/className="gap-1\.5\s+mb-4"/);
    });

    it("back button contains IconArrowLeft with size={15}", () => {
      expect(settings).toMatch(/<IconArrowLeft\s+size=\{15\}\s*\/?>/);
    });

    it("back button contains 返回 text", () => {
      expect(settings).toMatch(/返回/);
    });

    it("back button onClick is wired to onBack", () => {
      expect(settings).toMatch(/onClick=\{onBack\}/);
    });
  });

  describe("Preserved SettingsPage content (must NOT have been touched)", () => {
    it("keeps 外观 Card", () => {
      expect(settings).toMatch(/外观/);
    });

    it("keeps 终端 Card", () => {
      expect(settings).toMatch(/终端/);
    });

    it("keeps 关于 Card", () => {
      expect(settings).toMatch(/关于/);
    });

    it("keeps useConfigStore usage", () => {
      expect(settings).toMatch(/useConfigStore/);
    });

    it("keeps useAppTheme usage", () => {
      expect(settings).toMatch(/useAppTheme/);
    });

    it("keeps font_size / scrollback_lines inputs", () => {
      expect(settings).toMatch(/font_size/);
      expect(settings).toMatch(/scrollback_lines/);
    });
  });
});

describe("src/App.tsx — T4 routing wiring (showSettings toggle)", () => {
  it("declares showSettings state", () => {
    expect(app).toMatch(/showSettings/);
  });

  it("declares setShowSettings setter", () => {
    expect(app).toMatch(/setShowSettings/);
  });

  it("showSettings appears at least twice (state decl + render condition)", () => {
    const matches = app.match(/showSettings/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(2);
  });

  it("renders SettingsPage with onBack when showSettings is true", () => {
    expect(app).toMatch(/showSettings\s*\?/);
    expect(app).toMatch(/<SettingsPage[^>]*onBack/);
  });

  it("onBack wired to setShowSettings(false) (back button restores previous view)", () => {
    expect(app).toMatch(/setShowSettings\(false\)/);
  });

  it("settings button wired to setShowSettings(true) (opens settings view)", () => {
    expect(app).toMatch(/setShowSettings\(true\)/);
  });

  it("does NOT add settings back to static Tabs (no value=\"settings\")", () => {
    expect(app).not.toMatch(/value="settings"/);
  });
});
