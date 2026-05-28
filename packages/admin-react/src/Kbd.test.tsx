import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
    // Ctrl + S (not Enter, not a second Ctrl)
    expect(chips).toHaveLength(2);
    expect(chips[0]).toHaveTextContent("Ctrl");
    expect(chips[1]).toHaveTextContent("S");
  });

  it("forwards className on the group wrapper", () => {
    const { container } = render(<Kbd keys="mod+s" className="custom" />);
    expect(container.querySelector("span")).toHaveClass("custom");
  });
});
