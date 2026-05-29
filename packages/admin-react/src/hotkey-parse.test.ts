import { afterEach, describe, expect, it, vi } from "vitest";

// `mod` resolution and the chord display glyphs are decided once at module load
// from `navigator.platform`, so each platform branch is exercised by stubbing
// navigator and re-importing the module fresh.
describe("hotkey-parse mod resolution", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  async function loadWith(platform: string) {
    vi.stubGlobal("navigator", { platform } as Navigator);
    vi.resetModules();
    return import("./hotkey-parse");
  }

  it("resolves mod to ctrl on non-Apple platforms", async () => {
    const { parseChord, canonicalize } = await loadWith("Linux x86_64");
    expect(canonicalize(parseChord("mod+s"))).toBe("ctrl+s");
  });

  it("resolves mod to meta on Apple platforms", async () => {
    const { parseChord, canonicalize } = await loadWith("MacIntel");
    expect(canonicalize(parseChord("mod+s"))).toBe("meta+s");
  });

  it("renders the Ctrl label off Apple and the ⌘ glyph on Apple", async () => {
    const off = await loadWith("Win32");
    expect(off.formatChord(off.parseChord("mod+s"))).toEqual(["Ctrl", "S"]);

    const apple = await loadWith("MacIntel");
    expect(apple.formatChord(apple.parseChord("mod+s"))).toEqual(["⌘", "S"]);
  });
});
