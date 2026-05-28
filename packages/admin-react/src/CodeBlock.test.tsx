import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders children inside a <pre>", () => {
    render(<CodeBlock>hello world</CodeBlock>);
    const el = screen.getByText("hello world");
    expect(el.tagName).toBe("PRE");
    expect(el).toHaveAdminClass("code-block");
    expect(el).not.toHaveAdminClass("code-block-nowrap");
  });

  it("applies nowrap modifier", () => {
    render(<CodeBlock nowrap>2024-01-01 12:00:00 INFO startup</CodeBlock>);
    const el = screen.getByText("2024-01-01 12:00:00 INFO startup");
    expect(el).toHaveAdminClass("code-block", "code-block-nowrap");
  });

  it("passes className through verbatim alongside the admin classes", () => {
    render(<CodeBlock className="custom-extra">data</CodeBlock>);
    const el = screen.getByText("data");
    expect(el).toHaveAdminClass("code-block");
    expect(el.className).toContain("custom-extra");
  });
});
