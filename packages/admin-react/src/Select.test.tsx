import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

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
      expect(document.body.querySelector(".select-popup")).toBeNull();
      await user.click(trigger);
      const popup = document.body.querySelector(".select-popup") as HTMLElement;
      expect(popup).not.toBeNull();
      await user.click(within(popup).getByText("Pear"));
      const closedPopup = document.body.querySelector(".select-popup");
      expect(closedPopup === null || closedPopup.hasAttribute("data-closed")).toBe(true);
      expect(trigger).toHaveTextContent("pear");
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith("pear", expect.anything());
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
      const popup = document.body.querySelector(".select-popup") as HTMLElement;
      await user.click(within(popup).getByText("Apple"));
      expect(trigger).toHaveTextContent("apple");
      await user.click(trigger);
      const popup2 = document.body.querySelector(".select-popup") as HTMLElement;
      await user.click(within(popup2).getByText("Pear"));
      expect(trigger).toHaveTextContent("pear");
      expect(onValueChange.mock.calls.map((c) => c[0])).toEqual(["apple", "pear"]);
    });
  });
});
