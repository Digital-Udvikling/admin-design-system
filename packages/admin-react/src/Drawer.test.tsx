import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
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

  it("renders no title for an icon without a title", () => {
    function Warn(props: { size?: number | string }) {
      return <svg data-testid="warn" {...props} />;
    }
    const { container } = render(<Drawer open icon={Warn} />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByTestId("warn")).not.toBeInTheDocument();
    expect(container.querySelector("dialog")).not.toHaveAttribute("aria-labelledby");
  });

  it("is labelled by its title and described by its description", () => {
    render(<Drawer open title="Filters" description="Narrow the list." />);
    const dialog = document.querySelector("dialog");
    expect(screen.getByRole("dialog", { name: "Filters", description: "Narrow the list." })).toBe(
      dialog,
    );
  });

  it("forwards classNames to slots", () => {
    render(
      <Drawer open title="Filters" classNames={{ title: "x-custom" }}>
        Body
      </Drawer>,
    );
    expect(screen.getByText("Filters")).toHaveClass("x-custom");
  });

  describe("open state", () => {
    const getDrawer = () => document.querySelector("dialog") as HTMLDialogElement;

    it("opens and closes as the open prop changes", () => {
      const { rerender } = render(<Drawer open={false} title="Filters" />);
      expect(getDrawer()).not.toHaveAttribute("open");
      rerender(<Drawer open title="Filters" />);
      expect(getDrawer()).toHaveAttribute("open");
      rerender(<Drawer open={false} title="Filters" />);
      expect(getDrawer()).not.toHaveAttribute("open");
    });

    it("round-trips through onOpenChange: the close button closes a controlled drawer", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      function Controlled() {
        const [open, setOpen] = useState(true);
        return (
          <Drawer
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next);
              setOpen(next);
            }}
            title="Filters"
          />
        );
      }
      render(<Controlled />);
      expect(getDrawer()).toHaveAttribute("open");
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(getDrawer()).not.toHaveAttribute("open");
    });

    it("a native close (Escape) reports onOpenChange(false)", () => {
      const onOpenChange = vi.fn();
      render(<Drawer open onOpenChange={onOpenChange} title="Filters" />);
      getDrawer().close();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
