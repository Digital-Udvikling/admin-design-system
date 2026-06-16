import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Drawer } from "./Drawer";

// happy-dom lacks the modal API; stub showModal/close so [open] can be observed.
beforeEach(() => {
  vi.spyOn(HTMLDialogElement.prototype, "showModal").mockImplementation(
    function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
  );
  vi.spyOn(HTMLDialogElement.prototype, "close").mockImplementation(
    function (this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Drawer", () => {
  it("renders a dialog carrying the dialog + drawer classes", () => {
    const { container } = render(
      <Drawer title="Filters">
        <p>Body</p>
      </Drawer>,
    );
    expect(container.querySelector("dialog")).toHaveAdminClass("dialog", "drawer");
  });

  it("applies side and size modifiers", () => {
    const { container } = render(
      <Drawer.Container side="start" size="lg">
        x
      </Drawer.Container>,
    );
    expect(container.querySelector("dialog")).toHaveAdminClass("drawer-start", "drawer-lg");
  });

  it("omits the side class for the default end side", () => {
    const { container } = render(<Drawer.Container>x</Drawer.Container>);
    const dialog = container.querySelector("dialog");
    expect(dialog).not.toHaveAdminClass("drawer-start");
    expect(dialog).not.toHaveAdminClass("drawer-bottom");
  });

  it("renders shorthand header with title and a close button", () => {
    render(
      <Drawer open title="Filters">
        Body
      </Drawer>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Filters" })).toHaveAdminClass(
      "dialog-title",
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("forwards classNames to slots", () => {
    render(
      <Drawer open title="Filters" classNames={{ title: "x-custom" }}>
        Body
      </Drawer>,
    );
    expect(screen.getByText("Filters")).toHaveClass("x-custom");
  });
});
