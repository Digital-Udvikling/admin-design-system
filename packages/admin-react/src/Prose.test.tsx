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

  it("emits no size class at md and prose-lg at lg", () => {
    const { container, rerender } = render(<Prose />);
    expect(container.firstElementChild).not.toHaveAdminClass("prose-lg");
    rerender(<Prose size="lg" />);
    expect(container.firstElementChild).toHaveAdminClass("prose");
    expect(container.firstElementChild).toHaveAdminClass("prose-lg");
  });

  it("renders a nested Prose at its own size", () => {
    const { getByTestId } = render(
      <Prose size="lg">
        <Prose.Exclude>
          <Prose data-testid="nested">
            <p>Specimen</p>
          </Prose>
        </Prose.Exclude>
      </Prose>,
    );
    const nested = getByTestId("nested");
    expect(nested).toHaveAdminClass("prose");
    expect(nested).not.toHaveAdminClass("prose-lg");
  });

  it("renders Prose.Exclude as the .prose-exclude escape", () => {
    const { getByRole } = render(
      <Prose>
        <p>Body copy.</p>
        <Prose.Exclude>
          <table>
            <tbody>
              <tr>
                <td>Cell</td>
              </tr>
            </tbody>
          </table>
        </Prose.Exclude>
      </Prose>,
    );
    expect(getByRole("table").parentElement).toHaveAdminClass("prose-exclude");
  });
});
