import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderAs } from "./render";
import { RouterLink } from "./test-setup";

describe("renderAs", () => {
  it("renders the tag when render is unset", () => {
    render(renderAs("span", undefined, { className: "ours", children: "x" }));
    expect(screen.getByText("x").tagName).toBe("SPAN");
    expect(screen.getByText("x")).toHaveClass("ours");
  });

  it("renders onto the element, appending its className and merging style", () => {
    render(
      renderAs("a", <RouterLink href="/orders" className="theirs" style={{ color: "red" }} />, {
        className: "ours",
        style: { color: "blue", margin: 0 },
        children: "Orders",
      }),
    );
    const link = screen.getByRole("link", { name: "Orders" });
    expect(link).toHaveAttribute("data-router");
    expect(link).toHaveAttribute("href", "/orders");
    expect(link).toHaveAttribute("class", "ours theirs");
    expect(link.style.color).toBe("red");
    expect(link.style.margin).toMatch(/^0(px)?$/);
  });

  it("lets the element's own props win and keeps its children when ours are empty", () => {
    render(
      renderAs(
        "a",
        <RouterLink href="/b" aria-current="step">
          Theirs
        </RouterLink>,
        {
          href: "/a",
          "aria-current": "page",
        },
      ),
    );
    const link = screen.getByRole("link", { name: "Theirs" });
    expect(link).toHaveAttribute("href", "/b");
    expect(link).toHaveAttribute("aria-current", "step");
  });

  it("runs both click handlers, the element's first", async () => {
    const calls: string[] = [];
    render(
      renderAs("a", <RouterLink href="#" onClick={() => calls.push("element")} />, {
        onClick: () => calls.push("ours"),
        children: "Go",
      }),
    );
    await userEvent.setup().click(screen.getByRole("link", { name: "Go" }));
    expect(calls).toEqual(["element", "ours"]);
  });

  it("merges refs from both sides", () => {
    const ours = createRef<HTMLAnchorElement>();
    const theirs = vi.fn();
    render(renderAs("a", <RouterLink href="#" ref={theirs} />, { ref: ours, children: "Go" }));
    expect(ours.current).toBeInstanceOf(HTMLAnchorElement);
    expect(theirs).toHaveBeenCalledWith(ours.current);
  });
});
