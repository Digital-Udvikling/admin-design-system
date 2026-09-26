import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageCenter } from "./PageCenter";

describe("PageCenter", () => {
  it("renders a main landmark around its child", () => {
    render(
      <PageCenter>
        <p>Sign in</p>
      </PageCenter>,
    );
    const main = screen.getByRole("main");
    expect(main).toHaveAdminClass("page-center");
    expect(main).not.toHaveAdminClass("page-center-lg");
    expect(main).toContainElement(screen.getByText("Sign in"));
  });

  it("size lg adds the wider cap", () => {
    render(<PageCenter size="lg" />);
    expect(screen.getByRole("main")).toHaveAdminClass("page-center", "page-center-lg");
  });
});
