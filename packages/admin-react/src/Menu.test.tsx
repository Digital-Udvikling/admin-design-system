import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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
});
