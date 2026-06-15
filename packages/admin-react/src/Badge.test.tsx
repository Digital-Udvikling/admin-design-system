import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders", () => {
    render(<Badge>Beta</Badge>);
    const el = screen.getByText("Beta");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAdminClass("badge");
    expect(el).not.toHaveAdminClass("badge-neutral");
  });

  it("applies variant and size modifiers", () => {
    render(
      <Badge variant="success" size="lg">
        OK
      </Badge>,
    );
    const el = screen.getByText("OK");
    expect(el).toHaveAdminClass("badge", "badge-success", "badge-lg");
  });

  it("omits the size class when size is md", () => {
    render(<Badge variant="danger">Err</Badge>);
    const el = screen.getByText("Err");
    expect(el).not.toHaveAdminClass("badge-md");
  });

  it("adds the soft modifier only when soft is set", () => {
    const { rerender } = render(<Badge variant="info">Tag</Badge>);
    expect(screen.getByText("Tag")).not.toHaveAdminClass("badge-soft");

    rerender(
      <Badge variant="info" soft>
        Tag
      </Badge>,
    );
    expect(screen.getByText("Tag")).toHaveAdminClass("badge-info", "badge-soft");
  });

  it("renders a remove button that fires onRemove once", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <Badge variant="info" onRemove={onRemove}>
        Tag
      </Badge>,
    );
    const button = screen.getByRole("button", { name: "Remove" });
    expect(button).toHaveAdminClass("badge-remove");

    await user.click(button);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("omits the remove button without onRemove", () => {
    render(<Badge variant="info">Tag</Badge>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("sets the remove button accessible name from removeLabel", () => {
    render(
      <Badge variant="info" onRemove={() => {}} removeLabel="Remove Digital salg">
        Digital salg
      </Badge>,
    );
    expect(screen.getByRole("button", { name: "Remove Digital salg" })).toBeInTheDocument();
  });
});
