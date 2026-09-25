import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";
import { __resetRegistry } from "./hotkey-registry";
import { Menu } from "./Menu";

// happy-dom's HTMLDialogElement lacks the modal API; stub it so `[open]` is observable.
function stubDialogModal() {
  vi.spyOn(HTMLDialogElement.prototype, "showModal").mockImplementation(
    function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
  );
}

function MenuWithDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Menu>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Popup>
        <Menu.Item onClick={() => setOpen(true)}>Delete…</Menu.Item>
        <Dialog open={open} onOpenChange={setOpen} title="Delete record?">
          <button type="button">Confirm</button>
        </Dialog>
      </Menu.Popup>
    </Menu>
  );
}

describe("Menu", () => {
  it("renders the trigger and subparts", () => {
    render(
      <Menu>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Popup>
          <Menu.Item>One</Menu.Item>
          <Menu.Separator />
          <Menu.Item>Two</Menu.Item>
        </Menu.Popup>
      </Menu>,
    );
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("styles the trigger as a button with variant, square without children", () => {
    render(
      <Menu>
        <Menu.Trigger variant="primary" size="sm">
          Actions
        </Menu.Trigger>
        <Menu.Trigger variant="default" aria-label="More" />
        <Menu.Trigger>Plain</Menu.Trigger>
      </Menu>,
    );
    expect(screen.getByText("Actions")).toHaveClass(
      "_ao-menu-trigger",
      "_ao-btn",
      "_ao-btn-primary",
      "_ao-btn-sm",
    );
    expect(screen.getByText("Actions")).not.toHaveClass("_ao-btn-square");
    const square = screen.getByLabelText("More");
    expect(square).toHaveClass("_ao-btn", "_ao-btn-square");
    expect(square).not.toHaveClass("_ao-btn-default");
    expect(screen.getByText("Plain")).not.toHaveClass("_ao-btn");
  });

  it("renders an icon-only trigger as a square button with the icon", () => {
    const Icon = (props: { size?: number | string }) => (
      <svg data-testid="icon" width={props.size} height={props.size} />
    );
    render(
      <Menu>
        <Menu.Trigger variant="ghost" icon={Icon} aria-label="More actions" />
        <Menu.Trigger variant="ghost" icon={Icon}>
          Export
        </Menu.Trigger>
      </Menu>,
    );
    const kebab = screen.getByLabelText("More actions");
    expect(kebab).toHaveClass("_ao-btn", "_ao-btn-ghost", "_ao-btn-square");
    expect(within(kebab).getByTestId("icon")).toHaveAttribute("width", "1em");
    expect(screen.getByText("Export")).not.toHaveClass("_ao-btn-square");
  });

  it("marks a danger item on both the button and anchor branches", () => {
    render(
      <Menu open>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Popup>
          <Menu.Item danger>Delete</Menu.Item>
          <Menu.Item href="#revoke" danger>
            Revoke
          </Menu.Item>
          <Menu.Item>Edit</Menu.Item>
        </Menu.Popup>
      </Menu>,
    );
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveClass(
      "_ao-menu-item",
      "_ao-menu-item-danger",
    );
    expect(screen.getByRole("menuitem", { name: "Revoke" })).toHaveClass("_ao-menu-item-danger");
    expect(screen.getByRole("menuitem", { name: "Edit" })).not.toHaveClass("_ao-menu-item-danger");
  });

  describe("interactions", () => {
    afterEach(() => vi.restoreAllMocks());

    it("opens on summary click and fires onClick on the item", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <Menu>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item onClick={onSelect}>Edit</Menu.Item>
            <Menu.Item>Delete</Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      const details = screen.getByText("Actions").closest("details");
      expect(details).not.toBeNull();
      expect(details).not.toHaveAttribute("open");
      await user.click(screen.getByText("Actions"));
      expect(details).toHaveAttribute("open");
      await user.click(within(details!).getByText("Edit"));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it("renders Menu.Item as an anchor when href is set", () => {
      render(
        <Menu>
          <Menu.Trigger>Resources</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item href="#docs">Docs</Menu.Item>
            <Menu.Item>Action</Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      const docs = screen.getByRole("menuitem", { name: "Docs" });
      expect(docs.tagName).toBe("A");
      expect(docs).toHaveAttribute("href", "#docs");
      expect(screen.getByRole("menuitem", { name: "Action" }).tagName).toBe("BUTTON");
    });

    it("renders checkable items with role and aria-checked", () => {
      render(
        <Menu open>
          <Menu.Trigger>View</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item checked>Show grid</Menu.Item>
            <Menu.Item checked={false}>Show ruler</Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      expect(screen.getByRole("menuitemcheckbox", { name: "Show grid" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
      expect(screen.getByRole("menuitemcheckbox", { name: "Show ruler" })).toHaveAttribute(
        "aria-checked",
        "false",
      );
    });

    it("closes after an item is activated and returns focus to the trigger", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <Menu>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item onClick={onSelect}>Edit</Menu.Item>
            <Menu.Item href="#docs">Docs</Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      const trigger = screen.getByText("Actions");
      const details = trigger.closest("details");
      await user.click(trigger);
      await user.click(screen.getByRole("menuitem", { name: "Edit" }));
      expect(onSelect).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(details).not.toHaveAttribute("open"));
      expect(trigger).toHaveFocus();

      await user.click(trigger);
      await user.click(screen.getByRole("menuitem", { name: "Docs" }));
      await waitFor(() => expect(details).not.toHaveAttribute("open"));
    });

    it("stays open under a dialog that an item opens inside the menu", async () => {
      stubDialogModal();
      const user = userEvent.setup();
      render(<MenuWithDialog />);
      const trigger = screen.getByText("Actions");
      const details = trigger.closest("details");
      await user.click(trigger);
      await user.click(screen.getByRole("menuitem", { name: "Delete…" }));
      const dialog = document.querySelector("dialog");
      expect(dialog).toHaveAttribute("open");
      // Past the deferred close: the dialog is still inside an open <details>, so it renders.
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(details).toHaveAttribute("open");
    });

    it("leaves an Escape inside that dialog to the dialog", async () => {
      stubDialogModal();
      const user = userEvent.setup();
      render(<MenuWithDialog />);
      const details = screen.getByText("Actions").closest("details");
      await user.click(screen.getByText("Actions"));
      await user.click(screen.getByRole("menuitem", { name: "Delete…" }));
      const confirm = within(document.querySelector("dialog")!).getByText("Confirm");
      confirm.focus();
      let prevented: boolean | undefined;
      const record = (event: KeyboardEvent) => (prevented = event.defaultPrevented);
      window.addEventListener("keydown", record);
      await user.keyboard("{Escape}");
      window.removeEventListener("keydown", record);
      expect(prevented).toBe(false);
      expect(details).toHaveAttribute("open");
    });

    it("names each group by its label", () => {
      render(
        <Menu open>
          <Menu.Trigger>View</Menu.Trigger>
          <Menu.Popup>
            <Menu.Group>
              <Menu.GroupLabel>Density</Menu.GroupLabel>
              <Menu.Item checked>Compact</Menu.Item>
            </Menu.Group>
            <Menu.Group>
              <Menu.GroupLabel>Theme</Menu.GroupLabel>
              <Menu.Item checked={false}>Dark</Menu.Item>
            </Menu.Group>
          </Menu.Popup>
        </Menu>,
      );
      expect(screen.getByRole("group", { name: "Density" })).toHaveClass("_ao-menu-group");
      expect(screen.getByRole("group", { name: "Theme" })).toBeInTheDocument();
    });

    it("stays open after a checkable item is toggled", async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();
      render(
        <Menu>
          <Menu.Trigger>View</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item checked={false} onClick={onToggle}>
              Show grid
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      const details = screen.getByText("View").closest("details");
      await user.click(screen.getByText("View"));
      await user.click(screen.getByRole("menuitemcheckbox", { name: "Show grid" }));
      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(details).toHaveAttribute("open");
    });

    it("ignores clicks on an aria-disabled item and stays open", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <Menu>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item aria-disabled="true" onClick={onSelect}>
              Archive
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      const details = screen.getByText("Actions").closest("details");
      await user.click(screen.getByText("Actions"));
      await user.click(screen.getByRole("menuitem", { name: "Archive" }));
      expect(onSelect).not.toHaveBeenCalled();
      expect(details).toHaveAttribute("open");
    });

    it("closes on Escape and refocuses the trigger", async () => {
      const user = userEvent.setup();
      render(
        <Menu>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item>Edit</Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      const trigger = screen.getByText("Actions");
      const details = trigger.closest("details");
      await user.click(trigger);
      screen.getByRole("menuitem", { name: "Edit" }).focus();
      await user.keyboard("{Escape}");
      expect(details).not.toHaveAttribute("open");
      expect(trigger).toHaveFocus();
    });

    it("leaves the menu open when the consumer prevents the Escape", async () => {
      const user = userEvent.setup();
      render(
        <Menu onKeyDown={(event) => event.preventDefault()}>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item>Edit</Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      const details = screen.getByText("Actions").closest("details");
      await user.click(screen.getByText("Actions"));
      screen.getByRole("menuitem", { name: "Edit" }).focus();
      await user.keyboard("{Escape}");
      expect(details).toHaveAttribute("open");
    });

    it("closes when the trigger is clicked a second time", async () => {
      const user = userEvent.setup();
      render(
        <Menu>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item>One</Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      const details = screen.getByText("Open").closest("details");
      await user.click(screen.getByText("Open"));
      expect(details).toHaveAttribute("open");
      await user.click(screen.getByText("Open"));
      expect(details).not.toHaveAttribute("open");
    });
  });

  describe("hotkey prop", () => {
    beforeEach(() => __resetRegistry());
    afterEach(() => __resetRegistry());

    it("renders Kbd chips and aria-keyshortcuts on the button item", () => {
      render(
        <Menu>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item hotkey="n">New</Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      const item = screen.getByRole("menuitem", { name: /New/ });
      expect(item).toHaveAttribute("aria-keyshortcuts", "N");
      const chips = item.querySelectorAll("kbd");
      expect(chips).toHaveLength(1);
      expect(chips[0]).toHaveTextContent("N");
    });

    it("fires onClick on the item when the chord is pressed", () => {
      const onSelect = vi.fn();
      render(
        <Menu open>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item hotkey="mod+n" onClick={onSelect}>
              New
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "n",
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
          }),
        );
      });
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it("keeps the hotkey working when a consumer passes a ref", () => {
      const onSelect = vi.fn();
      const ref = createRef<HTMLButtonElement>();
      render(
        <Menu open>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item ref={ref} hotkey="shift+k" onClick={onSelect}>
              Kill
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      expect(ref.current).toBe(screen.getByRole("menuitem", { name: /Kill/ }));
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "K",
            shiftKey: true,
            bubbles: true,
            cancelable: true,
          }),
        );
      });
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it("sets aria-keyshortcuts on anchor items too", () => {
      render(
        <Menu>
          <Menu.Trigger>Resources</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item href="#docs" hotkey="mod+d">
              Docs
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      const item = screen.getByRole("menuitem", { name: /Docs/ });
      expect(item.tagName).toBe("A");
      expect(item).toHaveAttribute("aria-keyshortcuts", "Control+D");
    });
  });
});
