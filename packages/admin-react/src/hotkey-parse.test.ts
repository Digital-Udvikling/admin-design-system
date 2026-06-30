import { afterEach, describe, expect, it, vi } from "vitest";

// Platform is detected once at module load, so each branch stubs navigator and re-imports fresh.
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

describe("normalizeEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  async function load() {
    vi.stubGlobal("navigator", { platform: "Linux x86_64" } as Navigator);
    vi.resetModules();
    return import("./hotkey-parse");
  }

  it("normalizes a plain key press to its chord string", async () => {
    const { normalizeEvent } = await load();
    expect(normalizeEvent({ key: "K" } as KeyboardEvent)).toBe("k");
  });

  it("returns null for a bare modifier press", async () => {
    const { normalizeEvent } = await load();
    expect(normalizeEvent({ key: "Shift", shiftKey: true } as KeyboardEvent)).toBeNull();
  });

  it("returns null for a synthetic event with no key (autofill, IME)", async () => {
    const { normalizeEvent } = await load();
    expect(normalizeEvent({} as KeyboardEvent)).toBeNull();
  });
});
