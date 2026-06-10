import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forwardRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { __resetRegistry } from "./hotkey-registry";

describe("Button", () => {
  it("renders", () => {
    render(<Button>go</Button>);
    expect(screen.getByRole("button", { name: "go" })).toBeInTheDocument();
  });

  it("maps variant to the matching class", () => {
    render(<Button variant="muted">go</Button>);
    expect(screen.getByRole("button", { name: "go" })).toHaveAdminClass("btn-muted");
  });

  it("renders icon and iconTrailing component refs around children", () => {
    function IconLead(props: {
      size?: number | string;
      "aria-hidden"?: boolean | "true" | "false";
    }) {
      return <svg data-testid="lead" {...props} />;
    }
    function IconTrail(props: {
      size?: number | string;
      "aria-hidden"?: boolean | "true" | "false";
    }) {
      return <svg data-testid="trail" {...props} />;
    }
    render(
      <Button icon={IconLead} iconTrailing={IconTrail}>
        go
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn.firstElementChild).toBe(screen.getByTestId("lead"));
    expect(btn.lastElementChild).toBe(screen.getByTestId("trail"));
  });

  describe("auto-squares for icon-only", () => {
    function Icon(props: { "aria-hidden"?: boolean | "true" | "false" }) {
      return <svg data-testid="icon" {...props} />;
    }

    it("adds btn-square when there is an icon but no children", () => {
      render(<Button icon={Icon} aria-label="more" />);
      expect(screen.getByRole("button")).toHaveAdminClass("btn-square");
    });

    it("adds btn-square when there is a trailing icon but no children", () => {
      render(<Button iconTrailing={Icon} aria-label="more" />);
      expect(screen.getByRole("button")).toHaveAdminClass("btn-square");
    });

    it("does not add btn-square when children sit alongside the icon", () => {
      render(<Button icon={Icon}>Add</Button>);
      expect(screen.getByRole("button")).not.toHaveAdminClass("btn-square");
    });

    it("does not add btn-square when there is no icon", () => {
      render(<Button aria-label="empty" />);
      expect(screen.getByRole("button")).not.toHaveAdminClass("btn-square");
    });
  });

  it("renders forwardRef icon components (the shape `@tabler/icons-react` uses)", () => {
    const IconForwarded = forwardRef<SVGSVGElement, { size?: number | string }>((props, ref) => (
      <svg ref={ref} data-testid="forwarded" {...props} />
    ));
    render(<Button icon={IconForwarded}>go</Button>);
    expect(screen.getByTestId("forwarded")).toBeInTheDocument();
  });

  describe("interactions", () => {
    it("fires onClick when clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>go</Button>);
      await user.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not fire onClick when disabled", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          go
        </Button>,
      );
      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
      await user.click(btn);
      expect(onClick).not.toHaveBeenCalled();
    });

    it("loading: applies btn-loading, marks aria-busy, disables, and skips clicks", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Saving
        </Button>,
      );
      const btn = screen.getByRole("button", { name: "Saving" });
      expect(btn).toHaveAdminClass("btn-loading");
      expect(btn).toHaveAttribute("aria-busy", "true");
      expect(btn).toBeDisabled();
      await user.click(btn);
      expect(onClick).not.toHaveBeenCalled();
    });

    it("loading: suppresses the leading icon but keeps the trailing one", () => {
      function IconLead(props: { "aria-hidden"?: boolean | "true" | "false" }) {
        return <svg data-testid="lead" {...props} />;
      }
      function IconTrail(props: { "aria-hidden"?: boolean | "true" | "false" }) {
        return <svg data-testid="trail" {...props} />;
      }
      render(
        <Button loading icon={IconLead} iconTrailing={IconTrail}>
          Saving
        </Button>,
      );
      expect(screen.queryByTestId("lead")).not.toBeInTheDocument();
      expect(screen.getByTestId("trail")).toBeInTheDocument();
    });
  });

  describe("hotkey prop", () => {
    beforeEach(() => __resetRegistry());
    afterEach(() => __resetRegistry());

    function pressCtrlS() {
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "s",
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
          }),
        );
      });
    }

    it("renders a Kbd chip showing the chord", () => {
      render(<Button hotkey="mod+s">Save</Button>);
      const btn = screen.getByRole("button", { name: /Save/ });
      const chips = btn.querySelectorAll("kbd");
      expect(chips).toHaveLength(2);
      expect(chips[0]).toHaveTextContent("Ctrl");
      expect(chips[1]).toHaveTextContent("S");
    });

    it("sets aria-keyshortcuts in ARIA format", () => {
      render(<Button hotkey="mod+s">Save</Button>);
      const btn = screen.getByRole("button", { name: /Save/ });
      expect(btn).toHaveAttribute("aria-keyshortcuts", "Control+S");
    });

    it("dispatches a native click on the element when the chord fires", () => {
      const onClick = vi.fn();
      render(
        <Button hotkey="mod+s" onClick={onClick}>
          Save
        </Button>,
      );
      pressCtrlS();
      // isTrusted is false in jsdom, so assert the event type instead.
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick.mock.calls[0]?.[0].type).toBe("click");
    });

    it("clicks the underlying anchor when rendered as a link", () => {
      let clickedTag: string | undefined;
      const onClick = vi.fn((e) => {
        // Capture synchronously — React clears `currentTarget` after dispatch.
        clickedTag = (e.currentTarget as HTMLElement).tagName;
        e.preventDefault();
      });
      render(
        <Button
          hotkey="mod+s"
          nativeButton={false}
          render={(props) => (
            <a {...props} href="#target">
              {props.children}
            </a>
          )}
          onClick={onClick}
        >
          Open
        </Button>,
      );
      pressCtrlS();
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(clickedTag).toBe("A");
    });

    it("does not click when disabled", () => {
      const onClick = vi.fn();
      render(
        <Button hotkey="mod+s" disabled onClick={onClick}>
          Save
        </Button>,
      );
      pressCtrlS();
      expect(onClick).not.toHaveBeenCalled();
    });

    it("does not click when loading", () => {
      const onClick = vi.fn();
      render(
        <Button hotkey="mod+s" loading onClick={onClick}>
          Save
        </Button>,
      );
      pressCtrlS();
      expect(onClick).not.toHaveBeenCalled();
    });

    it("renders only the first alternative as the visual chip", () => {
      render(<Button hotkey={["mod+s", "mod+enter"]}>Save</Button>);
      const btn = screen.getByRole("button", { name: /Save/ });
      const chips = btn.querySelectorAll("kbd");
      expect(chips).toHaveLength(2);
      expect(chips[1]).toHaveTextContent("S");
    });

    it("fires for either alternative", () => {
      const onClick = vi.fn();
      render(
        <Button hotkey={["mod+s", "mod+enter"]} onClick={onClick}>
          Save
        </Button>,
      );
      pressCtrlS();
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Enter",
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
          }),
        );
      });
      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });
});
