import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Code } from "./Code";

describe("Code", () => {
  it("renders an inline <code> chip", () => {
    render(<Code className="custom">prod-eu-db</Code>);
    const el = screen.getByText("prod-eu-db");
    expect(el.tagName).toBe("CODE");
    expect(el).toHaveAdminClass("code");
    expect(el).toHaveClass("custom");
  });
});
