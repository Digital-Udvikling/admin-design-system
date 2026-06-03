import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Prose } from "./Prose";

describe("Prose", () => {
  it("renders children inside a .prose container", () => {
    const { container } = render(
      <Prose>
        <h2>Heading</h2>
        <p>Body copy.</p>
      </Prose>,
    );
    const root = container.firstElementChild;
    expect(root).toHaveAdminClass("prose");
    expect(root).toHaveTextContent("Heading");
    expect(root).toHaveTextContent("Body copy.");
  });

  it("renders backend HTML via dangerouslySetInnerHTML", () => {
    const { container } = render(
      <Prose dangerouslySetInnerHTML={{ __html: "<p>From the server</p>" }} />,
    );
    const root = container.firstElementChild;
    expect(root).toHaveAdminClass("prose");
    expect(root?.querySelector("p")).toHaveTextContent("From the server");
  });

  it("passes the consumer className through verbatim alongside the prefixed base", () => {
    const { container } = render(<Prose className="custom" />);
    const root = container.firstElementChild;
    expect(root).toHaveAdminClass("prose");
    expect(root).toHaveClass("custom");
  });
});
