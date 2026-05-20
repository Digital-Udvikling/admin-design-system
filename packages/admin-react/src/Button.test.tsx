import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forwardRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders", () => {
    render(<Button>go</Button>);
    expect(screen.getByRole("button", { name: "go" })).toBeInTheDocument();
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
  });
});
