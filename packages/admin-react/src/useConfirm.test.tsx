import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdminRoot } from "./AdminRoot";
import { adminSelector } from "./test-setup";
import { useConfirm, usePrompt, type ConfirmOptions, type PromptOptions } from "./useConfirm";

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
    expect(
      screen.getByRole("alertdialog", {
        name: "Delete project?",
        description: "This cannot be undone.",
      }),
    ).toBe(dialog);
    expect(screen.getByText("Delete project?")).toHaveAdminClass("dialog-title");
    expect(screen.getByText("This cannot be undone.")).toHaveAdminClass("dialog-description");
    const [cancel, confirm] = screen.getAllByRole("button").filter((b) => dialog?.contains(b));
    expect(cancel).toHaveTextContent("Cancel");
    expect(confirm).toHaveTextContent("Confirm");
    expect(confirm).toHaveAdminClass("btn-primary");
    expect(document.querySelector(adminSelector("dialog-close"))).toBeNull();
  });

  it("renders no description for an empty one", async () => {
    const { user } = setup({ title: "Delete project?", description: "" });
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(document.querySelector(adminSelector("dialog-description"))).toBeNull();
    expect(document.querySelector("dialog")).not.toHaveAttribute("aria-describedby");
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

function PromptTrigger({
  options,
  onResult,
  label = "Rename",
}: {
  options: PromptOptions;
  onResult: (value: string | null) => void;
  label?: string;
}) {
  const prompt = usePrompt();
  return (
    <button type="button" onClick={async () => onResult(await prompt(options))}>
      {label}
    </button>
  );
}

function setupPrompt(options: PromptOptions = { title: "Rename project", label: "Name" }) {
  const onResult = vi.fn();
  const user = userEvent.setup();
  const utils = render(
    <AdminRoot>
      <PromptTrigger options={options} onResult={onResult} />
    </AdminRoot>,
  );
  return { ...utils, user, onResult };
}

describe("usePrompt", () => {
  it("renders a small dialog with a labelled, focused input", async () => {
    const { user } = setupPrompt({
      title: "Rename project",
      description: "Shown in the sidebar.",
      label: "Name",
      placeholder: "Project name",
    });
    await user.click(screen.getByRole("button", { name: "Rename" }));
    const dialog = document.querySelector("dialog");
    expect(dialog).toHaveAdminClass("dialog", "dialog-sm");
    expect(dialog).toHaveAttribute("closedby", "closerequest");
    expect(screen.getByRole("dialog", { name: "Rename project" })).toBe(dialog);
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveAdminClass("input");
    expect(input).toHaveAttribute("placeholder", "Project name");
    expect(input).toHaveFocus();
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveAdminClass("btn-primary");
  });

  it("resolves the typed value on Confirm", async () => {
    const { user, onResult } = setupPrompt();
    await user.click(screen.getByRole("button", { name: "Rename" }));
    await user.type(screen.getByRole("textbox", { name: "Name" }), "Billing");
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith("Billing"));
    expect(document.querySelector("dialog")).toBeNull();
  });

  it("submits on Enter", async () => {
    const { user, onResult } = setupPrompt();
    await user.click(screen.getByRole("button", { name: "Rename" }));
    await user.type(screen.getByRole("textbox", { name: "Name" }), "Billing{Enter}");
    await waitFor(() => expect(onResult).toHaveBeenCalledWith("Billing"));
  });

  it("starts from defaultValue", async () => {
    const { user, onResult } = setupPrompt({ title: "Rename", label: "Name", defaultValue: "Ops" });
    await user.click(screen.getByRole("button", { name: "Rename" }));
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Ops");
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith("Ops"));
  });

  it("resolves null on Cancel and on Escape", async () => {
    const { user, onResult } = setupPrompt();
    await user.click(screen.getByRole("button", { name: "Rename" }));
    await user.type(screen.getByRole("textbox", { name: "Name" }), "Billing");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(onResult).toHaveBeenLastCalledWith(null));

    await user.click(screen.getByRole("button", { name: "Rename" }));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(onResult).toHaveBeenCalledTimes(2));
    expect(onResult).toHaveBeenLastCalledWith(null);
    expect(document.querySelector("dialog")).toBeNull();
  });

  it("keeps an empty required prompt open", async () => {
    const { user, onResult } = setupPrompt({ title: "Rename", label: "Name", required: true });
    await user.click(screen.getByRole("button", { name: "Rename" }));
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toBeRequired();
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onResult).not.toHaveBeenCalled();
    expect(document.querySelector("dialog")).toHaveAttribute("open");
    await user.type(input, "Billing");
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith("Billing"));
  });

  it("renders a danger confirm button for variant danger", async () => {
    const { user } = setupPrompt({
      title: "Delete project?",
      label: "Type the project name",
      confirmLabel: "Delete",
      variant: "danger",
    });
    await user.click(screen.getByRole("button", { name: "Rename" }));
    expect(screen.getByRole("button", { name: "Delete" })).toHaveAdminClass("btn", "btn-danger");
  });

  it("shares the queue with useConfirm", async () => {
    const confirmed = vi.fn();
    const prompted = vi.fn();
    const user = userEvent.setup();
    render(
      <AdminRoot>
        <Trigger label="Confirm first" options={{ title: "Sure?" }} onResult={confirmed} />
        <PromptTrigger options={{ title: "Rename", label: "Name" }} onResult={prompted} />
      </AdminRoot>,
    );
    await user.click(screen.getByRole("button", { name: "Confirm first" }));
    await user.click(screen.getByRole("button", { name: "Rename" }));
    expect(document.querySelectorAll("dialog")).toHaveLength(1);
    expect(screen.queryByRole("textbox")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(confirmed).toHaveBeenCalledWith(true));
    await user.type(await screen.findByRole("textbox", { name: "Name" }), "Ops{Enter}");
    await waitFor(() => expect(prompted).toHaveBeenCalledWith("Ops"));
  });

  it("resolves pending calls null when AdminRoot unmounts", async () => {
    const { user, onResult, unmount } = setupPrompt();
    await user.click(screen.getByRole("button", { name: "Rename" }));
    unmount();
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(null));
  });

  it("returns a stable function", () => {
    const { result, rerender } = renderHook(() => usePrompt(), { wrapper: AdminRoot });
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it("throws outside AdminRoot", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => usePrompt())).toThrow(
      /usePrompt\(\) must be called inside <AdminRoot>/,
    );
  });
});
