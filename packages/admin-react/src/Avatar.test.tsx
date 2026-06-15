import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarGroup } from "./Avatar";
import { adminSelector } from "./test-setup";

describe("Avatar", () => {
  it("renders initials", () => {
    render(<Avatar initials="OR" data-testid="avatar" />);
    const el = screen.getByTestId("avatar");
    expect(el).toHaveAdminClass("avatar");
    expect(el).toHaveTextContent("OR");
  });

  it("renders three-letter initials", () => {
    render(<Avatar initials="JFK" data-testid="avatar" />);
    expect(screen.getByTestId("avatar")).toHaveTextContent("JFK");
  });

  it("omits modifier classes by default", () => {
    render(<Avatar initials="OR" data-testid="avatar" />);
    const el = screen.getByTestId("avatar");
    expect(el).not.toHaveAdminClass("avatar-sm");
    expect(el).not.toHaveAdminClass("avatar-lg");
    expect(el).not.toHaveAdminClass("avatar-square");
  });

  it("applies size and shape modifier classes", () => {
    render(<Avatar initials="OR" size="lg" shape="square" data-testid="avatar" />);
    const el = screen.getByTestId("avatar");
    expect(el).toHaveAdminClass("avatar-lg");
    expect(el).toHaveAdminClass("avatar-square");
  });

  it("keeps the initials fallback while the image is unresolved", () => {
    render(<Avatar src="https://example.com/a.jpg" alt="Ada" initials="AD" data-testid="avatar" />);
    expect(screen.getByTestId("avatar")).toHaveTextContent("AD");
  });

  it("renders children over initials", () => {
    render(
      <Avatar initials="OR" data-testid="avatar">
        <span data-testid="custom">custom</span>
      </Avatar>,
    );
    const el = screen.getByTestId("avatar");
    expect(el).not.toHaveTextContent("OR");
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("passes className through verbatim", () => {
    render(<Avatar initials="OR" className="mine" data-testid="avatar" />);
    expect(screen.getByTestId("avatar")).toHaveClass("mine");
  });
});

describe("AvatarGroup", () => {
  it("renders", () => {
    render(
      <AvatarGroup data-testid="group">
        <Avatar initials="A" />
        <Avatar initials="B" />
      </AvatarGroup>,
    );
    expect(screen.getByTestId("group")).toHaveAdminClass("avatar-group");
  });

  it("collapses avatars beyond max into a +N tile", () => {
    const { container } = render(
      <AvatarGroup max={2}>
        <Avatar initials="AA" />
        <Avatar initials="BB" />
        <Avatar initials="CC" />
        <Avatar initials="DD" />
      </AvatarGroup>,
    );
    const more = container.querySelector(adminSelector("avatar-more"));
    expect(more).toHaveTextContent("+2");
    expect(more).toHaveAttribute("aria-label", "+2 more");
  });

  it("shows every avatar and no tile when the count is within max", () => {
    const { container } = render(
      <AvatarGroup max={5}>
        <Avatar initials="AA" />
        <Avatar initials="BB" />
      </AvatarGroup>,
    );
    expect(container.querySelector(adminSelector("avatar-more"))).toBeNull();
  });
});
