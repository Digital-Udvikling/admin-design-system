import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __resetRegistry } from "./hotkey-registry";
import { Menu } from "./Menu";

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

  describe("interactions", () => {
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
