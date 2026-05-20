import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders links and meta", () => {
    render(
      <Footer>
        <Footer.Links>
          <Footer.Link href="#docs">Docs</Footer.Link>
          <Footer.Link href="#support">Support</Footer.Link>
        </Footer.Links>
        <Footer.Meta>© Acme</Footer.Meta>
      </Footer>,
    );
    expect(screen.getByRole("link", { name: "Docs" })).toBeInTheDocument();
    expect(screen.getByText("© Acme")).toBeInTheDocument();
  });
});
