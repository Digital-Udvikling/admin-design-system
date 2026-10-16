import { AdminRoot } from "@aortl/admin-react";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandPalette, useCommandPalette, useCommands, type Command, type Source } from ".";

function setup(props: Parameters<typeof CommandPalette>[0] = {}, extra?: React.ReactNode) {
  const user = userEvent.setup();
  const utils = render(
    <AdminRoot>
      <CommandPalette.Trigger />
      <CommandPalette {...props} />
      {extra}
    </AdminRoot>,
  );
  const input = () => screen.getByRole("combobox");
  const options = () => screen.queryAllByRole("option").map((o) => o.textContent);
  const highlighted = () =>
    screen.queryAllByRole("option").find((o) => o.getAttribute("aria-selected") === "true")
      ?.textContent;
  return { user, input, options, highlighted, ...utils };
}

const dialog = () => document.querySelector("dialog")!;

/** A source whose searches resolve when the test says so. */
function deferredSource(overrides: Partial<Source> = {}) {
  const pending: { query: string; resolve: (items: Command[]) => void }[] = [];
  const source: Source = {
    id: "remote",
    group: "Remote",
    debounce: 0,
    search: (query) => new Promise((resolve) => pending.push({ query, resolve })),
    ...overrides,
  };
  const resolveLatest = (items: Command[]) =>
    act(async () => {
      await waitFor(() => expect(pending.length).toBeGreaterThan(0));
      pending.at(-1)!.resolve(items);
    });
  return { source, pending, resolveLatest };
}

describe("CommandPalette", () => {
  it("renders closed, and the trigger opens it", async () => {
    const { user } = setup();
    expect(dialog().open).toBe(false);
    await user.click(screen.getByRole("button", { name: /search/i }));
    expect(dialog().open).toBe(true);
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("opens and closes with the hotkey", async () => {
    const { user } = setup();
    await user.keyboard("{Control>}k{/Control}");
    expect(dialog().open).toBe(true);
    await user.keyboard("{Control>}k{/Control}");
    expect(dialog().open).toBe(false);
  });

  it("filters as the user types and runs the top result on Enter", async () => {
    const perform = vi.fn();
    const { user, options } = setup({
      commands: [
        { id: "a", title: "Archive order" },
        { id: "b", title: "Book delivery", perform },
      ],
    });
    await user.keyboard("{Control>}k{/Control}");
    await user.keyboard("book");
    expect(options()).toEqual(["Book delivery"]);
    await user.keyboard("{Enter}");
    expect(perform).toHaveBeenCalledOnce();
    expect(dialog().open).toBe(false);
  });

  it("navigates to an href through onNavigate, or a new tab on Mod+Enter", async () => {
    const onNavigate = vi.fn();
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    const { user } = setup({
      commands: [{ id: "o", title: "Orders", href: "/orders" }],
      onNavigate,
    });
    await user.keyboard("{Control>}k{/Control}orders{Control>}{Enter}{/Control}");
    expect(open).toHaveBeenCalledWith("/orders", "_blank", "noopener");
    expect(dialog().open).toBe(true);
    await user.keyboard("{Enter}");
    expect(onNavigate).toHaveBeenCalledWith("/orders");
    open.mockRestore();
  });

  it("enters a nested page; Backspace and Escape step back out of it", async () => {
    const { user, options } = setup({
      commands: [
        {
          id: "theme",
          title: "Change theme",
          children: [
            { id: "light", title: "Light" },
            { id: "dark", title: "Dark" },
          ],
        },
      ],
    });
    await user.keyboard("{Control>}k{/Control}theme{Enter}");
    expect(options()).toEqual(["Light", "Dark"]);
    expect(screen.getByRole("button", { name: "Change theme" })).toBeInTheDocument();
    const crumb = () => screen.queryByRole("button", { name: "Change theme" });
    await user.keyboard("{Backspace}");
    expect(crumb()).toBeNull();
    await user.keyboard("theme{Enter}{Escape}");
    expect(dialog().open).toBe(true);
    expect(crumb()).toBeNull();
  });

  it("opens straight into a page", async () => {
    function OpenTheme() {
      const palette = useCommandPalette();
      return <button onClick={() => palette.open({ page: "theme" })}>Theme</button>;
    }
    const { user, options } = setup(
      { commands: [{ id: "theme", title: "Theme", children: [{ id: "dark", title: "Dark" }] }] },
      <OpenTheme />,
    );
    await user.click(screen.getByRole("button", { name: "Theme" }));
    expect(options()).toEqual(["Dark"]);
  });

  it("follows the top result as async results arrive, and Enter waits for them", async () => {
    const onNavigate = vi.fn();
    const { source, resolveLatest } = deferredSource({ priority: 10 });
    const { user, highlighted } = setup({
      commands: [{ id: "s", title: "Order settings", href: "/settings" }],
      sources: [source],
      onNavigate,
    });
    await user.keyboard("{Control>}k{/Control}order{Enter}");
    expect(onNavigate).not.toHaveBeenCalled();
    await resolveLatest([{ id: "o1", title: "Order 123456", href: "/orders/123456" }]);
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith("/orders/123456"));
    expect(highlighted()).toBeUndefined();
  });

  it("keeps an arrowed-to item highlighted when results arrive above it", async () => {
    const { source, resolveLatest } = deferredSource({ priority: 10 });
    const { user, highlighted } = setup({
      commands: [
        { id: "a", title: "Order settings" },
        { id: "b", title: "Order rules" },
      ],
      sources: [source],
    });
    await user.keyboard("{Control>}k{/Control}order{ArrowDown}");
    expect(highlighted()).toBe("Order rules");
    await resolveLatest([{ id: "o1", title: "Order 123456" }]);
    await screen.findByText("Order 123456");
    expect(highlighted()).toBe("Order rules");
  });

  it("shows a source that fails as unavailable", async () => {
    const { user } = setup({
      sources: [
        { id: "x", group: "Orders", debounce: 0, search: async () => Promise.reject(new Error()) },
      ],
    });
    await user.keyboard("{Control>}k{/Control}1");
    const group = await screen.findByRole("group", { name: "Orders" });
    expect(within(group).getByText("Unavailable")).toBeInTheDocument();
  });

  it("lists page commands from useCommands, then recents after a run", async () => {
    const perform = vi.fn();
    function Page() {
      useCommands([{ id: "refund", title: "Refund this order", perform }]);
      return null;
    }
    const { user } = setup({}, <Page />);
    await user.keyboard("{Control>}k{/Control}");
    expect(
      within(screen.getByRole("group", { name: "This page" })).getByRole("option"),
    ).toHaveTextContent("Refund this order");
    await user.keyboard("{Enter}");
    expect(perform).toHaveBeenCalledOnce();
    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("group", { name: "Recent" })).toHaveTextContent("Refund this order");
  });

  it("runs a command's shortcut while open", async () => {
    const perform = vi.fn();
    const { user } = setup({
      commands: [{ id: "x", title: "Export", shortcut: "mod+e", perform }],
    });
    await user.keyboard("{Control>}e{/Control}");
    expect(perform).not.toHaveBeenCalled();
    await user.keyboard("{Control>}k{/Control}{Control>}e{/Control}");
    expect(perform).toHaveBeenCalledOnce();
  });

  it("hydrates over server markup when page commands registered first", async () => {
    const tree = (
      <AdminRoot>
        <CommandPalette />
      </AdminRoot>
    );
    const container = document.body.appendChild(document.createElement("div"));
    container.innerHTML = renderToString(tree);
    function Page() {
      useCommands([{ id: "refund", title: "Refund this order" }]);
      return null;
    }
    render(<Page />);
    const errors: unknown[] = [];
    await act(async () => {
      hydrateRoot(container, tree, { onRecoverableError: (error) => errors.push(error) });
    });
    expect(errors).toEqual([]);
    container.remove();
  });
});
