import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Link } from "./Link";

describe("Link", () => {
  it("renders", () => {
    render(<Link href="/">Home</Link>);
    const el = screen.getByRole("link", { name: "Home" });
    expect(el).toBeInTheDocument();
    expect(el).toHaveAdminClass("link");
  });

  it("external adds the affordance class and new-tab attributes", () => {
    render(
      <Link href="https://example.com" external>
        Docs
      </Link>,
    );
    const el = screen.getByRole("link", { name: "Docs" });
    expect(el).toHaveAdminClass("link", "link-external");
    expect(el).toHaveAttribute("target", "_blank");
    expect(el).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not set new-tab attributes without external", () => {
    render(<Link href="/">Home</Link>);
    const el = screen.getByRole("link", { name: "Home" });
    expect(el).not.toHaveAttribute("target");
    expect(el).not.toHaveAttribute("rel");
  });

  it("consumer-supplied target/rel win over external defaults", () => {
    render(
      <Link href="https://example.com" external target="_self" rel="nofollow">
        Docs
      </Link>,
    );
    const el = screen.getByRole("link", { name: "Docs" });
    expect(el).toHaveAttribute("target", "_self");
    expect(el).toHaveAttribute("rel", "nofollow");
  });
});
