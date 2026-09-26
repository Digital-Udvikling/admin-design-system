import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdminRoot } from "./AdminRoot";
import { CopyButton } from "./CopyButton";
import { Dialog } from "./Dialog";
import { useCopy } from "./useCopy";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// user-event installs its own clipboard stub on setup(); spy on it afterwards.
function setup() {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const writeText = vi.spyOn(navigator.clipboard, "writeText");
  return { user, writeText };
}

describe("CopyButton", () => {
  it("renders a ghost square icon button named Copy", () => {
    render(<CopyButton value="4005176923197" />);
    const button = screen.getByRole("button", { name: "Copy" });
    expect(button).toHaveAdminClass("btn", "btn-ghost", "btn-square");
    expect(button).toHaveAttribute("type", "button");
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("with children, is named by them and not square", () => {
    render(<CopyButton value="x">Copy link</CopyButton>);
    const button = screen.getByRole("button", { name: "Copy link" });
    expect(button).not.toHaveAdminClass("btn-square");
    expect(button).not.toHaveAttribute("aria-label");
  });

  it("copies the value, sets data-copied and announces, then resets after the timeout", async () => {
    const { user, writeText } = setup();
    render(
      <AdminRoot>
        <CopyButton value="PO-1042" />
      </AdminRoot>,
    );
    const button = screen.getByRole("button", { name: "Copy" });
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("");

    await user.click(button);
    expect(writeText).toHaveBeenCalledWith("PO-1042");
    expect(button).toHaveAttribute("data-copied");
    expect(status).toHaveTextContent("Copied");

    await act(() => vi.advanceTimersByTimeAsync(1200));
    expect(button).not.toHaveAttribute("data-copied");
    expect(status).toHaveTextContent("");
  });

  it("a second copy within the window restarts it", async () => {
    const { user } = setup();
    render(<CopyButton value="x" timeout={1000} />);
    const button = screen.getByRole("button", { name: "Copy" });

    await user.click(button);
    await act(() => vi.advanceTimersByTimeAsync(800));
    await user.click(button);
    await act(() => vi.advanceTimersByTimeAsync(800));
    expect(button).toHaveAttribute("data-copied");
    await act(() => vi.advanceTimersByTimeAsync(200));
    expect(button).not.toHaveAttribute("data-copied");
  });

  it("a rejected clipboard write leaves the button unchanged", async () => {
    const { user, writeText } = setup();
    writeText.mockRejectedValue(new Error("denied"));
    render(<CopyButton value="x" copiedLabel="Kopieret" />);
    const button = screen.getByRole("button", { name: "Copy" });

    await user.click(button);
    expect(button).not.toHaveAttribute("data-copied");
    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("onClick runs first and preventDefault skips the copy", async () => {
    const { user, writeText } = setup();
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(<CopyButton value="x" onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(writeText).not.toHaveBeenCalled();
  });

  it("renders its live region inside the enclosing dialog", () => {
    vi.spyOn(HTMLDialogElement.prototype, "showModal").mockImplementation(
      function (this: HTMLDialogElement) {
        this.setAttribute("open", "");
      },
    );
    render(
      <AdminRoot>
        <Dialog open title="API key">
          <CopyButton value="sk_live" copiedLabel="Key copied" />
        </Dialog>
      </AdminRoot>,
    );
    const dialog = document.querySelector("dialog");
    expect(dialog).not.toBeNull();
    expect(dialog?.querySelector("output")).not.toBeNull();
  });
});

describe("useCopy", () => {
  it("resolves false for empty text without touching the clipboard", async () => {
    const { writeText } = setup();
    const { result } = renderHook(() => useCopy());
    let ok = true;
    await act(async () => {
      ok = await result.current.copy("");
    });
    expect(ok).toBe(false);
    expect(writeText).not.toHaveBeenCalled();
    expect(result.current.copied).toBe(false);
  });

  it("resolves true and flips copied on success", async () => {
    setup();
    const { result } = renderHook(() => useCopy({ timeout: 500 }));
    let ok = false;
    await act(async () => {
      ok = await result.current.copy("x");
    });
    expect(ok).toBe(true);
    expect(result.current.copied).toBe(true);
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(result.current.copied).toBe(false);
  });
});
