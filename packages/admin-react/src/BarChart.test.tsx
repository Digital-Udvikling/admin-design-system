import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BarChart } from "./BarChart";
import { adminSelector } from "./test-setup";

describe("BarChart", () => {
  it("renders one bar per datum with role=img and a generated aria-label", () => {
    const { container } = render(
      <BarChart
        data={[
          { label: "Mon", value: 80 },
          { label: "Tue", value: 45 },
        ]}
      />,
    );
    const root = container.querySelector(adminSelector("chart"));
    expect(root).toHaveAdminClass("chart", "chart-bars");
    expect(root).toHaveAttribute("role", "img");
    expect(root?.getAttribute("aria-label")).toContain("Mon: 80");
    expect(container.querySelectorAll(adminSelector("chart-bar"))).toHaveLength(2);
  });

  it("computes --chart-max from the data and sets --value per bar", () => {
    const { container } = render(<BarChart data={[{ value: 20 }, { value: 60 }]} />);
    expect(container.querySelector(adminSelector("chart"))).toHaveAttribute(
      "style",
      expect.stringContaining("--chart-max: 60"),
    );
    const bars = container.querySelectorAll(adminSelector("chart-bar"));
    expect(bars[0]).toHaveAttribute("style", expect.stringContaining("--value: 20"));
    expect(bars[1]).toHaveAttribute("style", expect.stringContaining("--value: 60"));
  });

  it("honours an explicit max", () => {
    const { container } = render(<BarChart data={[{ value: 10 }]} max={50} />);
    expect(container.querySelector(adminSelector("chart"))).toHaveAttribute(
      "style",
      expect.stringContaining("--chart-max: 50"),
    );
  });

  it("applies orientation, size, showValues, inline, and variant modifiers", () => {
    const { container } = render(
      <BarChart
        data={[{ value: 1 }]}
        orientation="vertical"
        size="lg"
        showValues
        inline
        variant="success"
      />,
    );
    expect(container.querySelector(adminSelector("chart"))).toHaveAdminClass(
      "chart-bars-vertical",
      "chart-lg",
      "chart-values",
      "chart-inline",
      "chart-success",
    );
  });

  it("omits a label cell when the datum has no label", () => {
    const { container } = render(<BarChart data={[{ value: 5 }]} />);
    expect(container.querySelector(adminSelector("chart-bar-label"))).toBeNull();
  });

  it("sets --bar-color only when a datum carries an explicit colour", () => {
    const { container } = render(
      <BarChart data={[{ value: 5 }, { value: 7, color: "var(--color-red-500)" }]} />,
    );
    const bars = container.querySelectorAll(adminSelector("chart-bar"));
    expect(bars[0]?.getAttribute("style") ?? "").not.toContain("--bar-color");
    expect(bars[1]).toHaveAttribute("style", expect.stringContaining("--bar-color"));
  });

  it("lets a consumer override the aria-label", () => {
    const { container } = render(<BarChart data={[{ value: 1 }]} aria-label="custom" />);
    expect(container.querySelector(adminSelector("chart"))).toHaveAttribute("aria-label", "custom");
  });

  it("Container + Bar compose the bare primitive", () => {
    const { container } = render(
      <BarChart.Container aria-label="x">
        <BarChart.Bar value={5} label="A" />
      </BarChart.Container>,
    );
    expect(container.querySelector(adminSelector("chart-bar"))).toHaveAttribute(
      "style",
      expect.stringContaining("--value: 5"),
    );
    expect(container.querySelector(adminSelector("chart-bar-label"))?.textContent).toBe("A");
  });
});
