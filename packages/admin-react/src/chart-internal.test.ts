import { describe, expect, it } from "vitest";
import {
  SERIES,
  buildAriaLabel,
  buildDonutSegments,
  computeMax,
  datumTitle,
  seriesColor,
} from "./chart-internal";

describe("computeMax", () => {
  it("returns the largest value", () => {
    expect(computeMax([{ value: 3 }, { value: 9 }, { value: 5 }])).toBe(9);
  });
  it("floors at 1 for empty data (no divide-by-zero)", () => {
    expect(computeMax([])).toBe(1);
  });
  it("returns an explicit override verbatim", () => {
    expect(computeMax([{ value: 99 }], 50)).toBe(50);
  });
});

describe("buildDonutSegments", () => {
  it("accumulates degrees across segments", () => {
    const out = buildDonutSegments([{ value: 1 }, { value: 3 }]);
    expect(out).toContain("0deg 90deg");
    expect(out).toContain("90deg 360deg");
  });
  it("returns a neutral fill for a zero total", () => {
    expect(buildDonutSegments([{ value: 0 }])).toContain("--color-surface-strong");
  });
});

describe("seriesColor", () => {
  it("prefers an explicit datum colour", () => {
    expect(seriesColor({ value: 1, color: "red" }, 0)).toBe("red");
  });
  it("cycles SERIES by index", () => {
    expect(seriesColor({ value: 1 }, 0)).toBe(SERIES[0]);
    expect(seriesColor({ value: 1 }, SERIES.length)).toBe(SERIES[0]);
  });
});

describe("buildAriaLabel / datumTitle", () => {
  it("summarises labelled data", () => {
    expect(buildAriaLabel("bar", [{ label: "Mon", value: 80 }])).toBe("Bar chart. Mon: 80.");
  });
  it("titles unlabelled data with just the value", () => {
    expect(datumTitle({ value: 5 })).toBe("5");
  });
});
