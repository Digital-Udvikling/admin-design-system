import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Donut } from "./Donut";
import { adminSelector } from "./test-setup";

describe("Donut", () => {
  it("renders a figure + masked ring with role=img and a conic string", () => {
    const { container } = render(
      <Donut
        data={[
          { label: "A", value: 60 },
          { label: "B", value: 40 },
        ]}
      />,
    );
    const root = container.querySelector(adminSelector("chart"));
    expect(root).toHaveAttribute("role", "img");
    expect(container.querySelector(adminSelector("chart-donut-figure"))).not.toBeNull();
    const ring = container.querySelector(adminSelector("chart-donut"));
    expect(ring).toHaveAttribute("style", expect.stringContaining("--donut-segments"));
    expect(ring?.getAttribute("style")).toContain("deg");
  });

  it("renders the pie modifier and ignores thickness", () => {
    const { container } = render(<Donut pie thickness="40%" data={[{ value: 1 }]} />);
    const ring = container.querySelector(adminSelector("chart-donut"));
    expect(ring).toHaveAdminClass("chart-donut-pie");
    expect(ring?.getAttribute("style") ?? "").not.toContain("--donut-thickness");
  });

  it("applies explicit thickness when not a pie", () => {
    const { container } = render(<Donut thickness="40%" data={[{ value: 1 }]} />);
    expect(container.querySelector(adminSelector("chart-donut"))).toHaveAttribute(
      "style",
      expect.stringContaining("--donut-thickness: 40%"),
    );
  });

  it("renders a center label and a legend when asked", () => {
    const { container } = render(
      <Donut
        centerLabel="100"
        legend
        data={[
          { label: "A", value: 1 },
          { label: "B", value: 1 },
        ]}
      />,
    );
    expect(container.querySelector(adminSelector("chart-donut-center"))?.textContent).toBe("100");
    expect(container.querySelectorAll(adminSelector("chart-legend-item"))).toHaveLength(2);
  });

  it("omits center label and legend by default", () => {
    const { container } = render(<Donut data={[{ value: 1 }]} />);
    expect(container.querySelector(adminSelector("chart-donut-center"))).toBeNull();
    expect(container.querySelector(adminSelector("chart-legend"))).toBeNull();
  });
});
