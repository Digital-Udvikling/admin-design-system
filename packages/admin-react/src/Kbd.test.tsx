import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Kbd } from "./Kbd";

describe("Kbd", () => {
  it("renders a single chip with literal children", () => {
    const { container } = render(<Kbd>Esc</Kbd>);
    const chip = container.querySelector("kbd");
    expect(chip).not.toBeNull();
    expect(chip).toHaveAdminClass("kbd");
    expect(chip).toHaveTextContent("Esc");
  });

  it("parses keys into multiple chips inside a group", () => {
    const { container } = render(<Kbd keys="mod+s" />);
    const group = container.querySelector("span");
    expect(group).toHaveAdminClass("kbd-group");
    const chips = container.querySelectorAll("kbd");
    expect(chips).toHaveLength(2);
    expect(chips[0]).toHaveTextContent("Ctrl");
    expect(chips[1]).toHaveTextContent("S");
  });

  it("renders escape as Esc and arrow keys as arrows", () => {
    const { rerender, container } = render(<Kbd keys="escape" />);
    expect(container.querySelector("kbd")).toHaveTextContent("Esc");
    rerender(<Kbd keys="arrowup" />);
    expect(container.querySelector("kbd")).toHaveTextContent("↑");
  });

  it("renders only the first alternative when keys is an array", () => {
    render(<Kbd keys={["mod+s", "mod+enter"]} />);
    const chips = screen.getAllByText((_, el) => el?.tagName === "KBD");
    expect(chips).toHaveLength(2);
    expect(chips[0]).toHaveTextContent("Ctrl");
    expect(chips[1]).toHaveTextContent("S");
  });

  it("forwards className on the group wrapper", () => {
    const { container } = render(<Kbd keys="mod+s" className="custom" />);
    expect(container.querySelector("span")).toHaveClass("custom");
  });
});

// A Linux server renders Ctrl; an Apple client must hydrate that HTML without a
// mismatch, then switch to ⌘. Each side gets a fresh module graph for its platform.
describe("Kbd hydration", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  async function loadOn(platform: string) {
    vi.stubGlobal("navigator", { platform, userAgent: "" } as Navigator);
    vi.resetModules();
    const { act, createElement } = await import("react");
    const { Button } = await import("./Button");
    const { Kbd: PlatformKbd } = await import("./Kbd");
    const onSave = vi.fn();
    const tree = createElement(
      "div",
      null,
      createElement(PlatformKbd, { keys: "mod+k" }),
      createElement(Button, { hotkey: "mod+s", onClick: onSave }, "Save"),
    );
    return { act, tree, onSave };
  }

  it("hydrates a Linux server's Ctrl label on Apple, then shows ⌘", async () => {
    const server = await loadOn("Linux x86_64");
    const { renderToString } = await import("react-dom/server");
    const container = document.createElement("div");
    container.innerHTML = renderToString(server.tree);
    expect(container.querySelector("kbd")).toHaveTextContent("Ctrl");

    const client = await loadOn("MacIntel");
    const { hydrateRoot } = await import("react-dom/client");
    const onRecoverableError = vi.fn();
    const root = await client.act(async () =>
      hydrateRoot(container, client.tree, { onRecoverableError }),
    );
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(container.querySelector("kbd")).toHaveTextContent("⌘");
    expect(container.querySelector("button")).toHaveAttribute("aria-keyshortcuts", "Meta+S");

    // The binding switched with the label: ⌘S clicks, Ctrl+S no longer does.
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "s", ctrlKey: true }));
    expect(client.onSave).not.toHaveBeenCalled();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "s", metaKey: true }));
    expect(client.onSave).toHaveBeenCalledTimes(1);
    await client.act(async () => root.unmount());
  });
});
