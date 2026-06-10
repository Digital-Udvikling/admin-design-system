import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminRoot } from "./AdminRoot";
import { Dialog } from "./Dialog";
import { Select } from "./Select";
import { adminSelector } from "./test-setup";

describe("Select", () => {
  it("renders trigger and subparts", () => {
    render(
      <Select>
        <Select.Trigger aria-label="fruit">
          <Select.Value placeholder="Pick" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Popup>
          <Select.Group>
            <Select.GroupLabel>Fruits</Select.GroupLabel>
            <Select.Item value="apple">
              <Select.ItemIndicator />
              <Select.ItemText>Apple</Select.ItemText>
            </Select.Item>
          </Select.Group>
        </Select.Popup>
      </Select>,
    );
    expect(screen.getByRole("combobox", { name: "fruit" })).toBeInTheDocument();
  });

  describe("interactions", () => {
    it("uncontrolled: opens popup, selects an item, closes popup, fires onValueChange", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Select onValueChange={onValueChange}>
          <Select.Trigger aria-label="fruit">
            <Select.Value placeholder="Pick" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Popup>
            <Select.Item value="apple">
              <Select.ItemText>Apple</Select.ItemText>
            </Select.Item>
            <Select.Item value="pear">
              <Select.ItemText>Pear</Select.ItemText>
            </Select.Item>
          </Select.Popup>
        </Select>,
      );
      const trigger = screen.getByRole("combobox", { name: "fruit" });
      expect(document.body.querySelector(adminSelector("select-popup"))).toBeNull();
      await user.click(trigger);
      const popup = document.body.querySelector(adminSelector("select-popup")) as HTMLElement;
      expect(popup).not.toBeNull();
      await user.click(within(popup).getByText("Pear"));
      const closedPopup = document.body.querySelector(adminSelector("select-popup"));
      expect(closedPopup === null || closedPopup.hasAttribute("data-closed")).toBe(true);
      expect(trigger).toHaveTextContent("pear");
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith("pear", expect.anything());
    });

    it("portals the popup into an ancestor <Dialog> instead of document.body", async () => {
      // A modal <dialog> sits in the top layer; popups portaled to document.body
      // paint behind it regardless of z-index, so the wrapper portals into the dialog.
      const user = userEvent.setup();
      render(
        <Dialog.Container open>
          <Select>
            <Select.Trigger aria-label="fruit">
              <Select.Value placeholder="Pick" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Popup>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Popup>
          </Select>
        </Dialog.Container>,
      );
      await user.click(screen.getByRole("combobox", { name: "fruit" }));
      const dialog = document.querySelector("dialog") as HTMLDialogElement;
      const popup = document.querySelector(adminSelector("select-popup")) as HTMLElement | null;
      expect(popup).not.toBeNull();
      expect(dialog.contains(popup)).toBe(true);
    });

    it("portals the popup into an ancestor <AdminRoot> when there's no Dialog", async () => {
      // The scoped bundle wraps every rule in @scope (._ao-admin-root); a popup
      // portaled to document.body falls outside the scope and renders unstyled.
      const user = userEvent.setup();
      render(
        <AdminRoot data-testid="root">
          <Select>
            <Select.Trigger aria-label="fruit">
              <Select.Value placeholder="Pick" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Popup>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Popup>
          </Select>
        </AdminRoot>,
      );
      await user.click(screen.getByRole("combobox", { name: "fruit" }));
      const root = screen.getByTestId("root");
      const popup = document.querySelector(adminSelector("select-popup")) as HTMLElement | null;
      expect(popup).not.toBeNull();
      expect(root.contains(popup)).toBe(true);
    });

    it("controlled: value prop drives the trigger via onValueChange round-trip", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      function Controlled() {
        const [value, setValue] = useState<string | null>(null);
        return (
          <Select
            value={value}
            onValueChange={(next, details) => {
              onValueChange(next, details);
              setValue(next as string | null);
            }}
          >
            <Select.Trigger aria-label="fruit">
              <Select.Value placeholder="Pick" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Popup>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
              <Select.Item value="pear">
                <Select.ItemText>Pear</Select.ItemText>
              </Select.Item>
            </Select.Popup>
          </Select>
        );
      }

      render(<Controlled />);
      const trigger = screen.getByRole("combobox", { name: "fruit" });
      expect(trigger).toHaveTextContent("Pick");
      await user.click(trigger);
      const popup = document.body.querySelector(adminSelector("select-popup")) as HTMLElement;
      await user.click(within(popup).getByText("Apple"));
      expect(trigger).toHaveTextContent("apple");
      await user.click(trigger);
      const popup2 = document.body.querySelector(adminSelector("select-popup")) as HTMLElement;
      await user.click(within(popup2).getByText("Pear"));
      expect(trigger).toHaveTextContent("pear");
      expect(onValueChange.mock.calls.map((c) => c[0])).toEqual(["apple", "pear"]);
    });
  });
});
