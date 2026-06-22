/**
 * T1 — Geist 设计 token 对齐 `src/styles/index.css`
 *
 * Characterization + proof test (vitest, reads index.css as text).
 *
 * Strategy (per plan `.omo/plans/layout-3column-geist.md` T1):
 *  1. Baseline characterization: pins CURRENT behavior, passes on unchanged code.
 *  2. Failing-first proof: assertions for NEW Geist values — must FAIL (red)
 *     BEFORE the index.css edit, then PASS (green) AFTER the edit.
 *
 * The NEW-value block is the active set (T1 implemented). The OLD-value block
 * is kept as a regression guard comment so reviewers can see what changed.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const cssPath = resolve(__dirname, "index.css");
const css = readFileSync(cssPath, "utf8");

describe("src/styles/index.css — Geist token alignment (T1)", () => {
  describe("NEW Geist values (must pass after T1 edit)", () => {
    it("loads Geist Sans + Geist Mono fonts via @import", () => {
      expect(css).toMatch(/@fontsource-variable\/geist/);
      expect(css).toMatch(/@fontsource-variable\/geist-mono/);
    });

    it("body font-family references Geist Sans", () => {
      expect(css).toMatch(/Geist Sans/);
    });

    it("code/pre/.font-mono reference Geist Mono", () => {
      expect(css).toMatch(/Geist Mono/);
    });

    it(":root --primary is near-black oklch(0.205 0 0)", () => {
      expect(css).toMatch(/--primary:\s*oklch\(0\.205 0 0\)/);
    });

    it(":root --accent is blue-700 oklch(0.576 0.2508 258)", () => {
      expect(css).toMatch(/--accent:\s*oklch\(0\.576 0\.2508 258\)/);
    });

    it(":root --ring mirrors --accent", () => {
      expect(css).toMatch(/--ring:\s*oklch\(0\.576 0\.2508 258\)/);
    });

    it(":root --background / --card / --popover are pure white", () => {
      expect(css).toMatch(/--background:\s*oklch\(1 0 0\)/);
      expect(css).toMatch(/--card:\s*oklch\(1 0 0\)/);
      expect(css).toMatch(/--popover:\s*oklch\(1 0 0\)/);
    });

    it(":root adds --background-200 at oklch(0.98 0 0)", () => {
      expect(css).toMatch(/--background-200:\s*oklch\(0\.98 0 0\)/);
    });

    it(":root --muted is oklch(0.953 0 0)", () => {
      expect(css).toMatch(/--muted:\s*oklch\(0\.953 0 0\)/);
    });

    it(":root --muted-foreground is oklch(0.43 0 0)", () => {
      expect(css).toMatch(/--muted-foreground:\s*oklch\(0\.43 0 0\)/);
    });

    it(":root --border / --input are oklch(0.916 0 0)", () => {
      expect(css).toMatch(/--border:\s*oklch\(0\.916 0 0\)/);
      expect(css).toMatch(/--input:\s*oklch\(0\.916 0 0\)/);
    });

    it(":root --destructive is oklch(0.58 0.248 25)", () => {
      expect(css).toMatch(/--destructive:\s*oklch\(0\.58 0\.248 25\)/);
    });

    it(":root --radius is 6px", () => {
      expect(css).toMatch(/--radius:\s*6px/);
    });

    it("@theme inline radii: sm 6px, md 12px, lg 16px, xl 16px", () => {
      expect(css).toMatch(/--radius-sm:\s*6px/);
      expect(css).toMatch(/--radius-md:\s*12px/);
      expect(css).toMatch(/--radius-lg:\s*16px/);
      expect(css).toMatch(/--radius-xl:\s*16px/);
    });

    it("@theme inline adds --ease-geist cubic-bezier", () => {
      expect(css).toMatch(/--ease-geist:\s*cubic-bezier\(0\.175, 0\.885, 0\.32, 1\.1\)/);
    });

    it(".dark --primary is oklch(0.985 0 0)", () => {
      // match within .dark block — ensure presence
      expect(css).toMatch(/--primary:\s*oklch\(0\.985 0 0\)/);
    });

    it(".dark --accent / --ring are blue-600 oklch(0.65 0.2508 258)", () => {
      expect(css).toMatch(/--accent:\s*oklch\(0\.65 0\.2508 258\)/);
      expect(css).toMatch(/--ring:\s*oklch\(0\.65 0\.2508 258\)/);
    });

    it(".dark --background / --card / --popover are oklch(0.205 0 0)", () => {
      // multiple occurrences expected (background/card/popover)
      const darkBlock = css.match(/\.dark\s*\{([^}]*)\}/s);
      expect(darkBlock).not.toBeNull();
      const dark = darkBlock![1];
      expect(dark).toMatch(/--background:\s*oklch\(0\.205 0 0\)/);
      expect(dark).toMatch(/--card:\s*oklch\(0\.205 0 0\)/);
      expect(dark).toMatch(/--popover:\s*oklch\(0\.205 0 0\)/);
    });

    it(".dark --background-200 is oklch(0.269 0 0)", () => {
      const darkBlock = css.match(/\.dark\s*\{([^}]*)\}/s);
      expect(darkBlock).not.toBeNull();
      expect(darkBlock![1]).toMatch(/--background-200:\s*oklch\(0\.269 0 0\)/);
    });

    it(".dark --muted is oklch(0.269 0 0) and --muted-foreground oklch(0.708 0 0)", () => {
      const darkBlock = css.match(/\.dark\s*\{([^}]*)\}/s);
      expect(darkBlock).not.toBeNull();
      const dark = darkBlock![1];
      expect(dark).toMatch(/--muted:\s*oklch\(0\.269 0 0\)/);
      expect(dark).toMatch(/--muted-foreground:\s*oklch\(0\.708 0 0\)/);
    });

    it(".dark --border / --input are oklch(0.37 0 0)", () => {
      const darkBlock = css.match(/\.dark\s*\{([^}]*)\}/s);
      expect(darkBlock).not.toBeNull();
      const dark = darkBlock![1];
      expect(dark).toMatch(/--border:\s*oklch\(0\.37 0 0\)/);
      expect(dark).toMatch(/--input:\s*oklch\(0\.37 0 0\)/);
    });

    it(".dark --destructive is oklch(0.396 0.141 25)", () => {
      const darkBlock = css.match(/\.dark\s*\{([^}]*)\}/s);
      expect(darkBlock).not.toBeNull();
      expect(darkBlock![1]).toMatch(/--destructive:\s*oklch\(0\.396 0\.141 25\)/);
    });

    it("defines .focus-ring:focus-visible two-layer ring", () => {
      expect(css).toMatch(/\.focus-ring:focus-visible\s*\{[^}]*box-shadow:\s*0 0 0 2px var\(--background\),\s*0 0 0 4px var\(--accent\)/);
    });
  });

  describe("Regression guard — OLD values must be GONE (proves the edit landed)", () => {
    it("no longer uses old --primary oklch(0.55 0.2 255)", () => {
      expect(css).not.toMatch(/--primary:\s*oklch\(0\.55 0\.2 255\)/);
    });

    it("no longer uses old --radius 0.625rem", () => {
      expect(css).not.toMatch(/--radius:\s*0\.625rem/);
    });

    it("no longer uses Inter as body font-family", () => {
      // body may still mention Inter as a fallback? Plan replaces it; ensure not primary.
      expect(css).not.toMatch(/font-family:\s*"Inter"/);
    });
  });

  describe("Preserved rules (must NOT have been touched)", () => {
    it("keeps @variant dark rule", () => {
      expect(css).toMatch(/@variant dark/);
    });

    it("keeps .xterm rule", () => {
      expect(css).toMatch(/\.xterm/);
    });

    it("keeps scrollbar rules", () => {
      expect(css).toMatch(/::-webkit-scrollbar/);
    });
  });
});