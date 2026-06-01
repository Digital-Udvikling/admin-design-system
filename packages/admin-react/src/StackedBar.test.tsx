import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StackedBar } from "./StackedBar";
import { adminSelector } from "./test-setup";

describe("StackedBar", () => {
  it("renders a track with one segment per datum and role=img", () => {
    const { container } = render(
      <StackedBar
        data={[
          { label: "Done", value: 60 },
          { label: "Pending", value: 40 },
        ]}
      />,
    );
    expect(container.querySelector(adminSelector("chart"))).toHaveAttribute("role", "img");
    expect(container.querySelector(adminSelector("chart-stack"))).not.toBeNull();
    const segments = container.querySelectorAll(adminSelector("chart-segment"));
    expect(segments).toHaveLength(2);
    expect(segments[0]).toHaveAttribute("style", expect.stringContaining("--value: 60"));
    expect(segments[0]).toHaveAttribute("style", expect.stringContaining("--segment-color"));
    expect(segments[0]).toHaveAttribute("title", "Done: 60");
  });

  it("toggles the legend", () => {
    const { container, rerender } = render(<StackedBar data={[{ label: "A", value: 1 }]} />);
    expect(container.querySelector(adminSelector("chart-legend"))).toBeNull();
    rerender(<StackedBar legend data={[{ label: "A", value: 1 }]} />);
    expect(container.querySelector(adminSelector("chart-legend"))).not.toBeNull();
  });

  it("generates an overridable aria-label", () => {
    const { container } = render(<StackedBar data={[{ label: "A", value: 1 }]} />);
    expect(container.querySelector(adminSelector("chart"))?.getAttribute("aria-label")).toContain(
      "A: 1",
    );
  });

  it("Track + Segment compose the bare primitive", () => {
    const { container } = render(
      <StackedBar.Track>
        <StackedBar.Segment value={30} color="var(--color-blue-500)" />
      </StackedBar.Track>,
    );
    const segment = container.querySelector(adminSelector("chart-segment"));
    expect(segment).toHaveAttribute("style", expect.stringContaining("--value: 30"));
    expect(segment).toHaveAttribute("style", expect.stringContaining("--segment-color"));
  });
});
