import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { AdminRoot } from "./AdminRoot";
import { Combobox, type ComboboxProps } from "./Combobox";
import { Dialog } from "./Dialog";
import { Field } from "./Field";
import { adminSelector } from "./test-setup";

const FRUITS = ["Apple", "Banana", "Cherry", "Pear"];

function Single(props: ComboboxProps<string>) {
  return (
    <Combobox items={FRUITS} {...props}>
      <Combobox.Control>
        <Combobox.Input aria-label="Fruit" placeholder="Search" />
        <Combobox.Clear />
        <Combobox.Trigger />
      </Combobox.Control>
      <Combobox.Popup>
        <Combobox.Empty>No fruit found</Combobox.Empty>
        <Combobox.List>
          {(item: string) => (
            <Combobox.Item key={item} value={item}>
              {item}
              <Combobox.ItemIndicator />
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Popup>
    </Combobox>
  );
}

function Multiple(props: ComboboxProps<string, true>) {
  return (
    <Combobox items={FRUITS} multiple {...props}>
      <Combobox.Control>
        <Combobox.Chips>
          <Combobox.Value>
            {(value: string[]) => (
              <>
                {value.map((fruit) => (
                  <Combobox.Chip key={fruit}>
                    {fruit}
                    <Combobox.ChipRemove aria-label={`Remove ${fruit}`} />
                  </Combobox.Chip>
                ))}
                <Combobox.Input aria-label="Fruits" />
              </>
            )}
          </Combobox.Value>
        </Combobox.Chips>
      </Combobox.Control>
      <Combobox.Popup>
        <Combobox.List>
          {(item: string) => (
            <Combobox.Item key={item} value={item}>
              {item}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Popup>
    </Combobox>
  );
}

const popup = () => document.querySelector(adminSelector("combobox-popup")) as HTMLElement | null;
const options = () => screen.queryAllByRole("option").map((o) => o.textContent);

describe("Combobox", () => {
  it("renders", () => {
    render(<Single />);
    const input = screen.getByRole("combobox", { name: "Fruit" });
    expect(input).toHaveAdminClass("combobox-input");
    expect(input.parentElement).toHaveAdminClass("combobox");
  });

  it("maps variant and size to classes on the control", () => {
    render(
      <Combobox items={FRUITS}>
        <Combobox.Control data-testid="sm" size="sm" variant="ghost">
          <Combobox.Input aria-label="sm" />
        </Combobox.Control>
        <Combobox.Control data-testid="md">
          <Combobox.Input aria-label="md" />
        </Combobox.Control>
      </Combobox>,
    );
    expect(screen.getByTestId("sm")).toHaveAdminClass("combobox", "combobox-sm", "combobox-ghost");
    expect(screen.getByTestId("md")).not.toHaveAdminClass("combobox-md");
    expect(screen.getByTestId("md")).not.toHaveAdminClass("combobox-bordered");
  });

  it("types onValueChange from the value, with an array under multiple", () => {
    <Combobox
      items={FRUITS}
      defaultValue="Apple"
      onValueChange={(value) => expectTypeOf(value).toEqualTypeOf<string | null>()}
    />;
    <Combobox<string, true>
      items={FRUITS}
      multiple
      onValueChange={(value) => expectTypeOf(value).toEqualTypeOf<string[]>()}
    />;
  });

  describe("interactions", () => {
    it("typing filters the items and shows Empty when nothing matches", async () => {
      const user = userEvent.setup();
      render(<Single />);
      const input = screen.getByRole("combobox", { name: "Fruit" });
      await user.type(input, "an");
      expect(options()).toEqual(["Banana"]);
      await user.type(input, "zz");
      expect(options()).toEqual([]);
      expect(within(popup()!).getByText("No fruit found")).toHaveAdminClass("combobox-empty");
    });

    it("uncontrolled: selects with the keyboard and fills the input", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Single onValueChange={onValueChange} />);
      const input = screen.getByRole("combobox", { name: "Fruit" });
      await user.click(input);
      await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
      expect(onValueChange).toHaveBeenLastCalledWith("Banana", expect.anything());
      expect(input).toHaveValue("Banana");
    });

    it("Escape closes the popup and keeps focus on the input", async () => {
      const user = userEvent.setup();
      render(<Single />);
      const input = screen.getByRole("combobox", { name: "Fruit" });
      await user.click(input);
      expect(input).toHaveAttribute("aria-expanded", "true");
      await user.keyboard("{Escape}");
      expect(input).toHaveAttribute("aria-expanded", "false");
      expect(input).toHaveFocus();
    });

    it("the trigger opens the popup", async () => {
      const user = userEvent.setup();
      render(<Single />);
      const trigger = document.querySelector(adminSelector("combobox-trigger")) as HTMLElement;
      expect(trigger.querySelector("svg")).not.toBeNull();
      await user.click(trigger);
      expect(options()).toEqual(FRUITS);
    });

    it("the clear button is named and empties the value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Single defaultValue="Pear" onValueChange={onValueChange} />);
      await user.click(screen.getByRole("button", { name: "Clear" }));
      expect(onValueChange).toHaveBeenLastCalledWith(null, expect.anything());
      expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveValue("");
    });

    it("controlled: follows value and reports changes", async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = useState<string | null>("Apple");
        return (
          <>
            <Single value={value} onValueChange={setValue} />
            <output data-testid="value">{value}</output>
          </>
        );
      }
      render(<Controlled />);
      const input = screen.getByRole("combobox", { name: "Fruit" });
      expect(input).toHaveValue("Apple");
      await user.click(input);
      await user.click(screen.getByRole("option", { name: "Cherry" }));
      expect(screen.getByTestId("value")).toHaveTextContent("Cherry");
      expect(input).toHaveValue("Cherry");
    });

    it("controlled: a parent that ignores the change keeps the value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Multiple value={["Apple"]} onValueChange={onValueChange} />);
      await user.click(screen.getByRole("combobox", { name: "Fruits" }));
      await user.click(screen.getByRole("option", { name: "Pear" }));
      expect(onValueChange).toHaveBeenLastCalledWith(["Apple", "Pear"], expect.anything());
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("button", { name: "Remove Pear" })).toBeNull();
      expect(screen.getByRole("button", { name: "Remove Apple" })).toBeInTheDocument();
    });

    it("multiple: adds chips, removes one by its button and the last by Backspace", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Multiple onValueChange={onValueChange} />);
      const input = screen.getByRole("combobox", { name: "Fruits" });
      await user.click(input);
      await user.click(screen.getByRole("option", { name: "Apple" }));
      await user.click(screen.getByRole("option", { name: "Pear" }));
      expect(onValueChange).toHaveBeenLastCalledWith(["Apple", "Pear"], expect.anything());
      await user.keyboard("{Escape}");

      const chips = document.querySelector(adminSelector("combobox-chips")) as HTMLElement;
      const chip = within(chips).getByText("Apple").closest(adminSelector("combobox-chip"));
      expect(chip).toHaveAdminClass("badge");
      expect(chip?.parentElement).toHaveAdminClass("combobox-chips");

      await user.click(screen.getByRole("button", { name: "Remove Apple" }));
      expect(onValueChange).toHaveBeenLastCalledWith(["Pear"], expect.anything());
      expect(screen.getByRole("button", { name: "Remove Pear" })).toHaveAdminClass("badge-remove");

      await user.click(input);
      await user.keyboard("{Backspace}");
      expect(onValueChange).toHaveBeenLastCalledWith([], expect.anything());
    });

    it("server search: a controlled inputValue drives items the parent fetched", async () => {
      const user = userEvent.setup();
      function Search() {
        const [query, setQuery] = useState("");
        const results = query === "" ? [] : FRUITS.filter((f) => f.startsWith(query));
        return (
          <Combobox items={results} filter={null} inputValue={query} onInputValueChange={setQuery}>
            <Combobox.Control>
              <Combobox.Input aria-label="Fruit" />
            </Combobox.Control>
            <Combobox.Popup>
              <Combobox.Status>{query === "" ? "Type to search" : null}</Combobox.Status>
              <Combobox.List>
                {(item: string) => (
                  <Combobox.Item key={item} value={item}>
                    {item}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox>
        );
      }
      render(<Search />);
      const input = screen.getByRole("combobox", { name: "Fruit" });
      await user.click(input);
      expect(within(popup()!).getByText(/Type to search/)).toHaveAdminClass("combobox-status");
      await user.type(input, "P");
      expect(options()).toEqual(["Pear"]);
    });

    it("takes its name from a Field label and its invalid state from the Field", () => {
      render(
        <Field label="Supplier" invalid>
          <Combobox items={FRUITS}>
            <Combobox.Control data-testid="control">
              <Combobox.Input />
            </Combobox.Control>
          </Combobox>
        </Field>,
      );
      expect(screen.getByRole("combobox", { name: "Supplier" })).toBeInTheDocument();
      expect(screen.getByTestId("control")).toHaveAttribute("data-invalid");
    });

    it("portals the popup into an ancestor <Dialog>", async () => {
      const user = userEvent.setup();
      render(
        <Dialog.Container open>
          <Single />
        </Dialog.Container>,
      );
      await user.click(screen.getByRole("combobox", { name: "Fruit" }));
      expect(document.querySelector("dialog")?.contains(popup())).toBe(true);
    });

    it("portals the popup into an ancestor <AdminRoot> on the shared popup layer", async () => {
      const user = userEvent.setup();
      render(
        <AdminRoot data-testid="root">
          <Single />
        </AdminRoot>,
      );
      await user.click(screen.getByRole("combobox", { name: "Fruit" }));
      expect(screen.getByTestId("root").contains(popup())).toBe(true);
      expect(popup()?.parentElement).toHaveAdminClass("popup-layer");
      expect(popup()?.parentElement).toHaveAttribute("data-align", "start");
    });

    it("marks items and the group label", async () => {
      const user = userEvent.setup();
      render(
        <Combobox>
          <Combobox.Control>
            <Combobox.Input aria-label="Fruit" />
          </Combobox.Control>
          <Combobox.Popup>
            <Combobox.List>
              <Combobox.Group>
                <Combobox.GroupLabel>Stone fruit</Combobox.GroupLabel>
                <Combobox.Item value="Cherry">Cherry</Combobox.Item>
              </Combobox.Group>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox>,
      );
      await user.click(screen.getByRole("combobox", { name: "Fruit" }));
      expect(screen.getByRole("option", { name: "Cherry" })).toHaveAdminClass("combobox-item");
      expect(screen.getByText("Stone fruit")).toHaveAdminClass("combobox-group-label");
    });
  });
});
