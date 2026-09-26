import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdminRoot } from "./AdminRoot";
import { __resetRegistry } from "./hotkey-registry";
import { Menu } from "./Menu";
import { RouterLink } from "./test-setup";

function pressChord(init: KeyboardEventInit) {
  act(() => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init }),
    );
  });
}

function ActionsMenu(props: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <Menu>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Popup>
        <Menu.Item onClick={props.onEdit}>Edit</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Separator />
        <Menu.Item danger onClick={props.onDelete}>
          Delete
        </Menu.Item>
      </Menu.Popup>
    </Menu>
  );
}

describe("Menu", () => {
  it("renders the trigger and subparts", () => {
    render(<ActionsMenu />);
    expect(screen.getByRole("button", { name: "Actions" })).toHaveClass("_ao-menu-trigger");
    expect(screen.getByText("Actions").closest("._ao-menu")).not.toBeNull();
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
    expect(screen.getByLabelText("More")).toHaveClass("_ao-btn", "_ao-btn-square");
    expect(screen.getByLabelText("More")).not.toHaveClass("_ao-btn-default");
    expect(screen.getByText("Plain")).not.toHaveClass("_ao-btn");
    expect(screen.getByText("Plain").tagName).toBe("BUTTON");
  });

  it("renders an icon-only trigger as a square button with the icon", () => {
    const Icon = (props: { size?: string | number }) => (
      <svg data-testid="icon" data-size={props.size} />
    );
    render(
      <Menu>
        <Menu.Trigger variant="ghost" size="sm" icon={Icon} aria-label="Row actions" />
      </Menu>,
    );
    const trigger = screen.getByRole("button", { name: "Row actions" });
    expect(trigger).toHaveClass("_ao-btn-ghost", "_ao-btn-sm", "_ao-btn-square");
    expect(screen.getByTestId("icon")).toHaveAttribute("data-size", "1em");
  });

  it("keeps items mounted while closed", () => {
    render(<ActionsMenu />);
    const item = screen.getByRole("menuitem", { name: "Edit", hidden: true });
    expect(item).toHaveClass("_ao-menu-item");
    expect(item.tagName).toBe("BUTTON");
    expect(item).toHaveAttribute("type", "button");
  });

  it("marks a danger item on both the button and anchor branches", () => {
    render(
      <Menu defaultOpen>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Popup>
          <Menu.Item danger>Delete</Menu.Item>
          <Menu.Item href="#revoke" danger>
            Revoke
          </Menu.Item>
        </Menu.Popup>
      </Menu>,
    );
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveClass("_ao-menu-item-danger");
    expect(screen.getByRole("menuitem", { name: "Revoke" })).toHaveClass("_ao-menu-item-danger");
  });

  it("adds menu-popup-end when aligned to the end", () => {
    render(
      <Menu defaultOpen>
        <Menu.Trigger>Account</Menu.Trigger>
        <Menu.Popup align="end">
          <Menu.Item>Sign out</Menu.Item>
        </Menu.Popup>
      </Menu>,
    );
    expect(screen.getByRole("menu")).toHaveClass("_ao-menu-popup", "_ao-menu-popup-end");
  });

  it("portals the popup into an ancestor AdminRoot on the popup layer", () => {
    render(
      <AdminRoot>
        <Menu defaultOpen>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item>Edit</Menu.Item>
          </Menu.Popup>
        </Menu>
      </AdminRoot>,
    );
    const popup = screen.getByRole("menu");
    expect(popup.closest("._ao-admin-root")).not.toBeNull();
    expect(popup.parentElement).toHaveClass("_ao-popup-layer");
  });

  it("renders a menu-actions row", () => {
    render(
      <Menu defaultOpen>
        <Menu.Trigger>Status</Menu.Trigger>
        <Menu.Popup>
          <Menu.Actions>
            <button type="submit">Apply</button>
          </Menu.Actions>
        </Menu.Popup>
      </Menu>,
    );
    expect(screen.getByText("Apply").parentElement).toHaveClass("_ao-menu-actions");
  });

  describe("interactions", () => {
    it("opens on trigger click and fires onClick on the item", async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      render(<ActionsMenu onEdit={onEdit} />);
      await user.click(screen.getByRole("button", { name: "Actions" }));
      expect(screen.getByRole("menu")).toBeVisible();
      await user.click(screen.getByRole("menuitem", { name: "Edit" }));
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("closes after an item is activated and returns focus to the trigger", async () => {
      const user = userEvent.setup();
      render(<ActionsMenu />);
      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);
      await user.click(screen.getByRole("menuitem", { name: "Duplicate" }));
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
      await waitFor(() => expect(trigger).toHaveFocus());
    });

    it("opens from the keyboard and moves between items with the arrow keys", async () => {
      const user = userEvent.setup();
      render(<ActionsMenu />);
      screen.getByRole("button", { name: "Actions" }).focus();
      await user.keyboard("{ArrowDown}");
      await waitFor(() => expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus());
      await user.keyboard("{ArrowDown}");
      expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
    });

    it("jumps to an item by typing its label", async () => {
      const user = userEvent.setup();
      render(<ActionsMenu />);
      screen.getByRole("button", { name: "Actions" }).focus();
      await user.keyboard("{ArrowDown}");
      await waitFor(() => expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus());
      await user.keyboard("de");
      await waitFor(() => expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus());
    });

    it("closes on Escape and refocuses the trigger", async () => {
      const user = userEvent.setup();
      render(<ActionsMenu />);
      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);
      expect(screen.getByRole("menu")).toBeVisible();
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
      await waitFor(() => expect(trigger).toHaveFocus());
    });

    it("closes when the trigger is clicked a second time", async () => {
      const user = userEvent.setup();
      render(<ActionsMenu />);
      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.click(trigger);
      await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
    });

    it("controlled: open drives the popup and onOpenChange reports requests", async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <span data-testid="state">{String(open)}</span>
            <Menu open={open} onOpenChange={setOpen}>
              <Menu.Trigger>Actions</Menu.Trigger>
              <Menu.Popup>
                <Menu.Item>Edit</Menu.Item>
              </Menu.Popup>
            </Menu>
          </>
        );
      }
      render(<Controlled />);
      await user.click(screen.getByRole("button", { name: "Actions" }));
      expect(screen.getByTestId("state")).toHaveTextContent("true");
      expect(screen.getByRole("menu")).toBeVisible();
      await user.keyboard("{Escape}");
      expect(screen.getByTestId("state")).toHaveTextContent("false");
    });

    it("controlled: stays closed when the parent ignores the change", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Menu open={false} onOpenChange={onOpenChange}>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item>Edit</Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      await user.click(screen.getByRole("button", { name: "Actions" }));
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
      expect(screen.queryByRole("menu")).toBeNull();
    });

    it("renders Menu.Item as an anchor when href is set", async () => {
      const user = userEvent.setup();
      render(
        <Menu>
          <Menu.Trigger>Resources</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item href="#docs">Docs</Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      await user.click(screen.getByRole("button", { name: "Resources" }));
      const link = screen.getByRole("menuitem", { name: "Docs" });
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "#docs");
      await user.click(link);
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    });

    it("renders a link item onto a router link with render", async () => {
      const user = userEvent.setup();
      render(
        <Menu>
          <Menu.Trigger>Resources</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item render={<RouterLink href="/docs" />} danger>
              Docs
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      await user.click(screen.getByRole("button", { name: "Resources" }));
      const link = screen.getByRole("menuitem", { name: "Docs" });
      expect(link).toHaveAttribute("data-router");
      expect(link).toHaveAttribute("href", "/docs");
      expect(link).toHaveAdminClass("menu-item", "menu-item-danger");
    });

    it("ignores clicks on an aria-disabled link item", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Menu defaultOpen>
          <Menu.Trigger>Resources</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item href="#changelog" aria-disabled="true" onClick={onClick}>
              Changelog
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      await user.click(screen.getByRole("menuitem", { name: "Changelog" }));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("does not activate a disabled button item", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Menu defaultOpen>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item disabled onClick={onClick}>
              Duplicate
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      await user.click(screen.getByRole("menuitem", { name: "Duplicate" }));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("names each group by its label", () => {
      render(
        <Menu defaultOpen>
          <Menu.Trigger>Resources</Menu.Trigger>
          <Menu.Popup>
            <Menu.Group>
              <Menu.GroupLabel>Internal</Menu.GroupLabel>
              <Menu.Item href="#docs">Docs</Menu.Item>
            </Menu.Group>
          </Menu.Popup>
        </Menu>,
      );
      expect(screen.getByRole("group", { name: "Internal" })).toHaveClass("_ao-menu-group");
      expect(screen.getByText("Internal")).toHaveClass("_ao-menu-group-label");
    });
  });

  describe("checkable items", () => {
    it("uncontrolled: toggles aria-checked and stays open", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(
        <Menu defaultOpen>
          <Menu.Trigger>View</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item defaultChecked={false} onCheckedChange={onCheckedChange}>
              Show ruler
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      const item = screen.getByRole("menuitemcheckbox", { name: "Show ruler" });
      expect(item).toHaveAttribute("aria-checked", "false");
      expect(item.querySelector("._ao-menu-item-indicator")).not.toBeNull();
      await user.click(item);
      expect(item).toHaveAttribute("aria-checked", "true");
      expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
      expect(screen.getByRole("menu")).toBeVisible();
    });

    it("controlled: checked follows the parent's state", async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [checked, setChecked] = useState(true);
        return (
          <Menu defaultOpen>
            <Menu.Trigger>View</Menu.Trigger>
            <Menu.Popup>
              <Menu.Item checked={checked} onCheckedChange={setChecked}>
                Show grid
              </Menu.Item>
            </Menu.Popup>
          </Menu>
        );
      }
      render(<Controlled />);
      const item = screen.getByRole("menuitemcheckbox", { name: "Show grid" });
      expect(item).toHaveAttribute("aria-checked", "true");
      await user.click(item);
      expect(item).toHaveAttribute("aria-checked", "false");
    });

    it("controlled: stays put when the parent ignores the change", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(
        <Menu defaultOpen>
          <Menu.Trigger>View</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item checked onCheckedChange={onCheckedChange}>
              Show grid
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      const item = screen.getByRole("menuitemcheckbox", { name: "Show grid" });
      await user.click(item);
      expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything());
      expect(item).toHaveAttribute("aria-checked", "true");
    });

    it("radio items: uncontrolled group picks one value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Menu defaultOpen>
          <Menu.Trigger>View</Menu.Trigger>
          <Menu.Popup>
            <Menu.RadioGroup defaultValue="comfortable" onValueChange={onValueChange}>
              <Menu.GroupLabel>Density</Menu.GroupLabel>
              <Menu.RadioItem value="comfortable">Comfortable</Menu.RadioItem>
              <Menu.RadioItem value="compact">Compact</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu>,
      );
      expect(screen.getByRole("group", { name: "Density" })).toHaveClass("_ao-menu-group");
      const compact = screen.getByRole("menuitemradio", { name: "Compact" });
      expect(compact).toHaveClass("_ao-menu-item");
      await user.click(compact);
      expect(compact).toHaveAttribute("aria-checked", "true");
      expect(screen.getByRole("menuitemradio", { name: "Comfortable" })).toHaveAttribute(
        "aria-checked",
        "false",
      );
      expect(onValueChange).toHaveBeenCalledWith("compact", expect.anything());
    });

    it("radio items: controlled value stays put when the parent ignores the change", async () => {
      const user = userEvent.setup();
      render(
        <Menu defaultOpen>
          <Menu.Trigger>View</Menu.Trigger>
          <Menu.Popup>
            <Menu.RadioGroup value="comfortable" onValueChange={() => {}}>
              <Menu.RadioItem value="comfortable">Comfortable</Menu.RadioItem>
              <Menu.RadioItem value="compact">Compact</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu>,
      );
      await user.click(screen.getByRole("menuitemradio", { name: "Compact" }));
      expect(screen.getByRole("menuitemradio", { name: "Comfortable" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
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
      const item = screen.getByRole("menuitem", { name: /New/, hidden: true });
      expect(item).toHaveAttribute("aria-keyshortcuts", "N");
      const chips = item.querySelectorAll("kbd");
      expect(chips).toHaveLength(1);
      expect(chips[0]).toHaveTextContent("N");
    });

    it("fires onClick while the menu is closed", () => {
      const onSelect = vi.fn();
      render(
        <Menu>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item hotkey="mod+n" onClick={onSelect}>
              New
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      pressChord({ key: "n", ctrlKey: true });
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("menu")).toBeNull();
    });

    it("skips a disabled item's hotkey", () => {
      const onSelect = vi.fn();
      render(
        <Menu>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item hotkey="mod+n" disabled onClick={onSelect}>
              New
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      pressChord({ key: "n", ctrlKey: true });
      expect(onSelect).not.toHaveBeenCalled();
    });

    it("keeps the hotkey working when a consumer passes a ref", () => {
      const onSelect = vi.fn();
      const ref = createRef<HTMLButtonElement>();
      render(
        <Menu defaultOpen>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item ref={ref} hotkey="shift+k" onClick={onSelect}>
              Kill
            </Menu.Item>
          </Menu.Popup>
        </Menu>,
      );
      expect(ref.current).toBe(screen.getByRole("menuitem", { name: /Kill/ }));
      pressChord({ key: "K", shiftKey: true });
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
      const item = screen.getByRole("menuitem", { name: /Docs/, hidden: true });
      expect(item.tagName).toBe("A");
      expect(item).toHaveAttribute("aria-keyshortcuts", "Control+D");
    });
  });
});
