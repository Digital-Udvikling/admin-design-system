import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartLegend } from "./ChartLegend";

describe("ChartLegend", () => {
  it("renders", () => {
    render(
      <ChartLegend
        data={[
          { label: "Paid", value: 60 },
          { label: "Refunded", value: 40, color: "var(--color-danger)" },
        ]}
      />,
    );
    const root = screen.getByRole("list");
    expect(root).toHaveAdminClass("chart-legend");
    const [paid, refunded] = screen.getAllByRole("listitem");
    expect(paid).toHaveAdminClass("chart-legend-item");
    expect(paid).toHaveAttribute("title", "Paid: 60");
    expect(refunded).toHaveAttribute(
      "style",
      expect.stringContaining("--legend-color: var(--color-danger)"),
    );
  });
});
