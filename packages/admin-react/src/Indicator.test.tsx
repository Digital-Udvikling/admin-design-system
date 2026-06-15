import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Indicator } from "./Indicator";
import { adminSelector } from "./test-setup";

describe("Indicator", () => {
  it("renders the wrapper with a badge and children", () => {
    render(
      <Indicator label="3" variant="danger">
        <button type="button">Inbox</button>
      </Indicator>,
    );
    expect(screen.getByText("Inbox").parentElement).toHaveAdminClass("indicator");
    const badge = screen.getByText("3");
    expect(badge).toHaveAdminClass("indicator-item", "badge", "badge-danger", "badge-sm");
  });

  it("omits modifier classes for the default top-end placement", () => {
    const { container } = render(
      <Indicator label="1">
        <span>anchor</span>
      </Indicator>,
    );
    const item = container.querySelector(adminSelector("indicator-item"));
    expect(item).not.toHaveAdminClass("indicator-top");
    expect(item).not.toHaveAdminClass("indicator-end");
  });

  it("adds vertical and horizontal modifier classes for non-default placements", () => {
    const { container } = render(
      <Indicator label="!" placement="bottom-start">
        <span>anchor</span>
      </Indicator>,
    );
    const item = container.querySelector(adminSelector("indicator-item"));
    expect(item).toHaveAdminClass("indicator-item", "indicator-bottom", "indicator-start");
  });

  it("renders a label-less dot with variant + aria-label, not a badge", () => {
    render(
      <Indicator variant="success" aria-label="Online">
        <span>avatar</span>
      </Indicator>,
    );
    const dot = screen.getByLabelText("Online");
    expect(dot).toHaveAdminClass("indicator-item", "indicator-dot", "indicator-dot-success");
    expect(dot).not.toHaveAdminClass("badge");
    expect(dot.textContent).toBe("");
  });

  it("renders a neutral dot without a color modifier class", () => {
    const { container } = render(
      <Indicator aria-label="Idle">
        <span>avatar</span>
      </Indicator>,
    );
    const dot = container.querySelector(adminSelector("indicator-dot"));
    expect(dot).toHaveAdminClass("indicator-dot");
    expect(dot).not.toHaveAdminClass("indicator-dot-neutral");
  });

  it("clamps a numeric label above max to `${max}+`", () => {
    render(
      <Indicator label={128} max={99}>
        <span>anchor</span>
      </Indicator>,
    );
    expect(screen.getByText("99+")).toHaveAdminClass("badge");
  });

  it("leaves a numeric label at or below max unclamped", () => {
    render(
      <Indicator label={5} max={99}>
        <span>anchor</span>
      </Indicator>,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("sets --indicator-offset on the wrapper when offset is provided", () => {
    const { container } = render(
      <Indicator label="3" offset={4}>
        <span>anchor</span>
      </Indicator>,
    );
    const wrapper = container.querySelector(adminSelector("indicator"));
    expect(wrapper).toHaveAttribute("style", expect.stringContaining("--indicator-offset: 4px"));
  });
});
