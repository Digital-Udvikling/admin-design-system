import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";

// happy-dom's HTMLDialogElement lacks the modal API; stub showModal/close so
// tests can observe `[open]` and the "close" event like a browser.
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

function getDialog() {
  // happy-dom doesn't expose the `dialog` role unless `[open]` is set; query by tag.
  return document.querySelector("dialog") as HTMLDialogElement;
}

describe("Dialog", () => {
  it("renders the bare primitive via Dialog.Container", () => {
    render(
      <Dialog.Container open>
        <Dialog.Header>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>Body content</Dialog.Body>
        <Dialog.Footer>Footer content</Dialog.Footer>
      </Dialog.Container>,
    );
    const el = getDialog();
    expect(el).toHaveAdminClass("dialog");
    expect(screen.getByRole("heading", { level: 2, name: "Settings" })).toHaveAdminClass(
      "dialog-title",
    );
    expect(screen.getByText("Body content")).toHaveAdminClass("dialog-body");
    expect(screen.getByText("Footer content")).toHaveAdminClass("dialog-footer");
  });

  it("renders title/description/actions shorthand props", () => {
    render(
      <Dialog
        open
        title="Delete project?"
        description="This cannot be undone."
        actions={<button type="button">Delete</button>}
      >
        Body
      </Dialog>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Delete project?" })).toHaveAdminClass(
      "dialog-title",
    );
    expect(screen.getByText("This cannot be undone.")).toHaveAdminClass("dialog-description");
    expect(screen.getByText("Body")).toHaveAdminClass("dialog-body");
    expect(screen.getByRole("button", { name: "Delete" }).parentElement).toHaveAdminClass(
      "dialog-footer",
    );
  });

  describe("interactions", () => {
    it("calls showModal when open transitions false -> true", () => {
      const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
      const { rerender } = render(<Dialog open={false} title="x" />);
      expect(showModal).not.toHaveBeenCalled();
      rerender(<Dialog open={true} title="x" />);
      expect(showModal).toHaveBeenCalledTimes(1);
      expect(getDialog()).toHaveAttribute("open");
    });

    it("calls close when open transitions true -> false", () => {
      const close = vi.spyOn(HTMLDialogElement.prototype, "close");
      const { rerender } = render(<Dialog open={true} title="x" />);
      expect(getDialog()).toHaveAttribute("open");
      rerender(<Dialog open={false} title="x" />);
      expect(close).toHaveBeenCalledTimes(1);
      expect(getDialog()).not.toHaveAttribute("open");
    });

    it("native close event fires onOpenChange(false)", () => {
      const onOpenChange = vi.fn();
      render(<Dialog open={true} onOpenChange={onOpenChange} title="x" />);
      getDialog().close();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("CloseButton click closes the dialog and notifies onOpenChange", async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [open, setOpen] = useState(true);
        return <Dialog open={open} onOpenChange={setOpen} title="x" />;
      }
      render(<Controlled />);
      expect(getDialog()).toHaveAttribute("open");
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(getDialog()).not.toHaveAttribute("open");
    });

    it("applies size modifier classes", () => {
      const { rerender } = render(<Dialog size="sm" title="x" />);
      expect(getDialog()).toHaveAdminClass("dialog-sm");
      rerender(<Dialog size="lg" title="x" />);
      expect(getDialog()).toHaveAdminClass("dialog-lg");
      rerender(<Dialog size="md" title="x" />);
      const el = getDialog();
      expect(el).not.toHaveAdminClass("dialog-sm");
      expect(el).not.toHaveAdminClass("dialog-lg");
    });

    it("dismissible={false} omits the close button", () => {
      render(<Dialog open dismissible={false} title="x" />);
      expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    });

    it("forwards closedby to the dialog element with 'any' as default", () => {
      const { rerender } = render(<Dialog title="x" />);
      expect(getDialog()).toHaveAttribute("closedby", "any");
      rerender(<Dialog closedby="closerequest" title="x" />);
      expect(getDialog()).toHaveAttribute("closedby", "closerequest");
    });

    it("ignores open prop when undefined (uncontrolled mode)", () => {
      const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
      render(<Dialog title="x" />);
      expect(showModal).not.toHaveBeenCalled();
      expect(getDialog()).not.toHaveAttribute("open");
    });

    it("merges a consumer ref without breaking open/close", () => {
      const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
      const consumerRef = { current: null as HTMLDialogElement | null };
      const { rerender } = render(<Dialog.Container ref={consumerRef} open={false} />);
      expect(consumerRef.current?.tagName).toBe("DIALOG");
      rerender(<Dialog.Container ref={consumerRef} open={true} />);
      expect(showModal).toHaveBeenCalledTimes(1);
      expect(getDialog()).toHaveAttribute("open");
    });
  });
});
