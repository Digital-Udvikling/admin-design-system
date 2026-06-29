import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs";

describe("Tabs", () => {
  it("renders the list, tabs, and active panel", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
          <Tabs.Tab value="b">B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">First panel</Tabs.Panel>
        <Tabs.Panel value="b">Second panel</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("First panel")).toBeInTheDocument();
  });

  it("renders a tab icon before the label", () => {
    function IconLead(props: {
      size?: number | string;
      "aria-hidden"?: boolean | "true" | "false";
    }) {
      return <svg data-testid="lead" {...props} />;
    }
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a" icon={IconLead}>
            A
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">First panel</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "A" }).firstElementChild).toBe(
      screen.getByTestId("lead"),
    );
  });

  it("maps wrap to the matching class", () => {
    const { container } = render(
      <Tabs defaultValue="a" wrap>
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">First panel</Tabs.Panel>
      </Tabs>,
    );
    expect(container.firstChild).toHaveAdminClass("tabs-wrap");
  });

  describe("interactions", () => {
    it("uncontrolled: clicking switches the visible panel", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="a">
          <Tabs.List>
            <Tabs.Tab value="a">A</Tabs.Tab>
            <Tabs.Tab value="b">B</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="a">First panel</Tabs.Panel>
          <Tabs.Panel value="b">Second panel</Tabs.Panel>
        </Tabs>,
      );
      await user.click(screen.getByRole("tab", { name: "B" }));
      expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText("Second panel")).toBeInTheDocument();
    });

    it("controlled: parent drives value via onValueChange round-trip", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      function Controlled() {
        const [value, setValue] = useState<string>("a");
        return (
          <Tabs
            value={value}
            onValueChange={(next, details) => {
              onValueChange(next, details);
              setValue(next as string);
            }}
          >
            <Tabs.List>
              <Tabs.Tab value="a">A</Tabs.Tab>
              <Tabs.Tab value="b">B</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="a">First</Tabs.Panel>
            <Tabs.Panel value="b">Second</Tabs.Panel>
          </Tabs>
        );
      }

      render(<Controlled />);
      await user.click(screen.getByRole("tab", { name: "B" }));
      expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "true");
      expect(onValueChange.mock.calls[0]?.[0]).toBe("b");
    });

    it("controlled: ignores clicks when parent does not update value", async () => {
      const user = userEvent.setup();
      render(
        <Tabs value="a" onValueChange={() => {}}>
          <Tabs.List>
            <Tabs.Tab value="a">A</Tabs.Tab>
            <Tabs.Tab value="b">B</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="a">First</Tabs.Panel>
          <Tabs.Panel value="b">Second</Tabs.Panel>
        </Tabs>,
      );
      await user.click(screen.getByRole("tab", { name: "B" }));
      expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute("aria-selected", "true");
    });
  });
});
