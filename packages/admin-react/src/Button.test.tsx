import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders", () => {
    render(<Button>go</Button>);
    expect(screen.getByRole("button", { name: "go" })).toBeInTheDocument();
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
