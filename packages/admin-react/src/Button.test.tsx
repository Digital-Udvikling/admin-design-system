import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, forwardRef, useState } from "react";
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

  it("maps the danger-ghost variant to btn-danger-ghost", () => {
    render(<Button variant="danger-ghost">Delete</Button>);
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn).toHaveAdminClass("btn-danger-ghost");
    expect(btn).not.toHaveAdminClass("btn-danger");
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

  describe("as a link", () => {
    // Base UI fills in the children; a childless JSX <a /> trips the a11y lint.
    const anchor = (href: string) => createElement("a", { href });

    it("keeps link semantics: no role or type on <a href>", () => {
      render(
        <Button render={anchor("/orders/new")} nativeButton={false}>
          New order
        </Button>,
      );
      const link = screen.getByRole("link", { name: "New order" });
      expect(link).toHaveAttribute("href", "/orders/new");
      expect(link).not.toHaveAttribute("role");
      expect(link).not.toHaveAttribute("type");
    });

    it("lets an explicit role win", () => {
      render(
        <Button render={anchor("/x")} nativeButton={false} role="menuitem">
          Go
        </Button>,
      );
      expect(screen.getByRole("menuitem", { name: "Go" })).toBeInTheDocument();
    });

    it("keeps role=button on a non-link render", () => {
      render(
        <Button render={<div />} nativeButton={false}>
          Go
        </Button>,
      );
      const el = screen.getByRole("button", { name: "Go" });
      expect(el.tagName).toBe("DIV");
      expect(el).not.toHaveAttribute("type");
    });

    it("styles a disabled link through aria-disabled", () => {
      render(
        <Button render={anchor("/x")} nativeButton={false} disabled>
          Go
        </Button>,
      );
      expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("defaults type to button on a native button", () => {
    render(<Button>go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("passes the invoker commandfor/command attributes through to the DOM", () => {
    render(
      <Button commandfor="confirm" command="show-modal">
        Open
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Open" });
    expect(btn).toHaveAttribute("commandfor", "confirm");
    expect(btn).toHaveAttribute("command", "show-modal");
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

    it("loading: applies btn-loading, marks aria-busy and aria-disabled, and skips clicks and keys", async () => {
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
      expect(btn).toHaveAttribute("aria-disabled", "true");
      expect(btn).not.toHaveAttribute("disabled");
      await user.click(btn);
      btn.focus();
      await user.keyboard("{Enter}");
      expect(onClick).not.toHaveBeenCalled();
    });

    it("loading: keeps focus on the button that started it", async () => {
      const user = userEvent.setup();
      function Save() {
        const [loading, setLoading] = useState(false);
        return (
          <Button loading={loading} onClick={() => setLoading(true)}>
            Save
          </Button>
        );
      }
      render(<Save />);
      const btn = screen.getByRole("button", { name: "Save" });
      await user.tab();
      await user.keyboard("{Enter}");
      expect(btn).toHaveAttribute("aria-busy", "true");
      expect(btn).toHaveFocus();
    });

    it("disabled without loading still sets the native attribute", () => {
      render(<Button disabled>go</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("disabled with focusableWhenDisabled sets aria-disabled and stays focusable", async () => {
      const user = userEvent.setup();
      render(
        <Button disabled focusableWhenDisabled>
          go
        </Button>,
      );
      const btn = screen.getByRole("button");
      expect(btn).toHaveAttribute("aria-disabled", "true");
      expect(btn).not.toHaveAttribute("disabled");
      await user.tab();
      expect(btn).toHaveFocus();
    });

    it("loading: keeps the leading icon first, where the CSS swaps it for the spinner", () => {
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
      const btn = screen.getByRole("button");
      expect(btn.firstElementChild).toBe(screen.getByTestId("lead"));
      expect(btn.lastElementChild).toBe(screen.getByTestId("trail"));
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
