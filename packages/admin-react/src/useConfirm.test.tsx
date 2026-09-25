import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdminRoot } from "./AdminRoot";
import { adminSelector } from "./test-setup";
import { useConfirm, type ConfirmOptions } from "./useConfirm";

// happy-dom lacks the modal API: stub showModal/close like Dialog.test.tsx, and
// map Esc to a close request the way a browser does for `closedby="closerequest"`.
function closeOnEscape(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  const dialog = document.querySelector<HTMLDialogElement>("dialog[open]");
  if (dialog && dialog.getAttribute("closedby") !== "none") dialog.close();
}

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
  document.addEventListener("keydown", closeOnEscape);
});

afterEach(() => {
  document.removeEventListener("keydown", closeOnEscape);
  vi.restoreAllMocks();
});

function Trigger({
  options,
  onResult,
  label = "Open",
}: {
  options: ConfirmOptions;
  onResult: (confirmed: boolean) => void;
  label?: string;
}) {
  const confirm = useConfirm();
  return (
    <button type="button" onClick={async () => onResult(await confirm(options))}>
      {label}
    </button>
  );
}

function setup(options: ConfirmOptions = { title: "Delete project?" }) {
  const onResult = vi.fn();
  const user = userEvent.setup();
  const utils = render(
    <AdminRoot>
      <Trigger options={options} onResult={onResult} />
    </AdminRoot>,
  );
  return { ...utils, user, onResult };
}

describe("useConfirm", () => {
  it("renders nothing while idle", () => {
    setup();
    expect(document.querySelector("dialog")).toBeNull();
  });

  it("renders a small dialog with title, description and both buttons", async () => {
    const { user } = setup({ title: "Delete project?", description: "This cannot be undone." });
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = document.querySelector("dialog");
    expect(dialog).toHaveAdminClass("dialog", "dialog-sm");
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAttribute("closedby", "closerequest");
    expect(dialog).toHaveAttribute("role", "alertdialog");
    expect(screen.getByText("Delete project?")).toHaveAdminClass("dialog-title");
    expect(screen.getByText("This cannot be undone.")).toHaveAdminClass("dialog-description");
    const [cancel, confirm] = screen.getAllByRole("button").filter((b) => dialog?.contains(b));
    expect(cancel).toHaveTextContent("Cancel");
    expect(confirm).toHaveTextContent("Confirm");
    expect(confirm).toHaveAdminClass("btn-primary");
    expect(document.querySelector(adminSelector("dialog-close"))).toBeNull();
  });

  it("resolves true on Confirm and unmounts the dialog", async () => {
    const { user, onResult } = setup();
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(true));
    expect(document.querySelector("dialog")).toBeNull();
  });

  it("resolves false on Cancel", async () => {
    const { user, onResult } = setup();
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
    expect(document.querySelector("dialog")).toBeNull();
  });

  it("resolves false on Escape", async () => {
    const { user, onResult } = setup();
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
    expect(document.querySelector("dialog")).toBeNull();
  });

  it("uses custom labels", async () => {
    const { user, onResult } = setup({
      title: "Archive?",
      confirmLabel: "Archive",
      cancelLabel: "Keep",
    });
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("button", { name: "Keep" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Archive" }));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(true));
  });

  it("focuses Confirm by default", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveFocus();
  });

  it("renders a danger confirm button and focuses Cancel for variant danger", async () => {
    const { user } = setup({ title: "Delete project?", confirmLabel: "Delete", variant: "danger" });
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("button", { name: "Delete" })).toHaveAdminClass("btn", "btn-danger");
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  });

  it("queues concurrent calls and shows the next after the first resolves", async () => {
    const first = vi.fn();
    const second = vi.fn();
    const user = userEvent.setup();
    render(
      <AdminRoot>
        <Trigger label="First" options={{ title: "First?" }} onResult={first} />
        <Trigger label="Second" options={{ title: "Second?" }} onResult={second} />
      </AdminRoot>,
    );
    await user.click(screen.getByRole("button", { name: "First" }));
    // The modal is a stub, so the page behind it stays clickable.
    await user.click(screen.getByRole("button", { name: "Second" }));
    expect(document.querySelectorAll("dialog")).toHaveLength(1);
    expect(screen.getByText("First?")).toBeInTheDocument();
    expect(screen.queryByText("Second?")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(first).toHaveBeenCalledWith(true));
    expect(await screen.findByText("Second?")).toBeInTheDocument();
    expect(second).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(second).toHaveBeenCalledWith(false));
    expect(document.querySelector("dialog")).toBeNull();
  });

  it("resolves pending calls false when AdminRoot unmounts", async () => {
    const { user, onResult, unmount } = setup();
    await user.click(screen.getByRole("button", { name: "Open" }));
    unmount();
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
  });

  it("returns a stable function", () => {
    const { result, rerender } = renderHook(() => useConfirm(), { wrapper: AdminRoot });
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it("throws outside AdminRoot", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useConfirm())).toThrow(/inside <AdminRoot>/);
  });
});
