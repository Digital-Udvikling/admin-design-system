import type { CSSProperties } from "react";

/** A single data point. Only `value` is required. */
export interface ChartDatum {
  /** Category name. When present, renders a label (and feeds the aria-label). */
  label?: string;
  /** The magnitude. Bars normalise it against the chart max; donut/stack sum it. */
  value: number;
  /** Per-segment colour override (any CSS colour). Defaults to the SERIES cycle. */
  color?: string;
}

export type ChartSize = "sm" | "md" | "lg";
export type ChartType = "bar" | "stack" | "donut" | "pie";

/**
 * Multi-series palette — references EXISTING Flexoki palette tokens, NOT a new
 * token layer. Cycled by index (`SERIES[i % len]`); a datum's own `color`
 * overrides. Vanilla authors copy the same sequence (it's documented), so both
 * bundles render identical colours. Single-series charts ignore this entirely
 * and follow `currentColor`.
 */
export const SERIES = [
  "var(--color-blue-500)",
  "var(--color-orange-400)",
  "var(--color-green-500)",
  "var(--color-purple-400)",
  "var(--color-cyan-500)",
  "var(--color-magenta-400)",
  "var(--color-yellow-500)",
  "var(--color-red-400)",
] as const;

/** Resolve a segment's colour: explicit `datum.color` wins, else cycle SERIES. */
export function seriesColor(datum: ChartDatum, index: number): string {
  return datum.color ?? SERIES[index % SERIES.length]!;
}

/** Largest value, floored at 1 so the bar calc never divides by zero. */
export function computeMax(data: ChartDatum[], explicit?: number): number {
  if (explicit !== undefined) return explicit;
  return Math.max(1, ...data.map((d) => d.value));
}

/**
 * Build the cumulative `conic-gradient` stop string for a donut/pie:
 * `<color> <from>deg <to>deg, …`. Degrees accumulate across segments. A
 * non-positive total yields a single neutral fill so the ring isn't blank.
 */
export function buildDonutSegments(data: ChartDatum[]): string {
  const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0);
  if (total <= 0) return "var(--color-surface-strong) 0 100%";
  let acc = 0;
  const stops: string[] = [];
  for (let i = 0; i < data.length; i++) {
    const datum = data[i]!;
    const from = (acc / total) * 360;
    acc += Math.max(0, datum.value);
    const to = (acc / total) * 360;
    stops.push(`${seriesColor(datum, i)} ${from}deg ${to}deg`);
  }
  return stops.join(", ");
}

const TYPE_NOUN: Record<ChartType, string> = {
  bar: "Bar chart",
  stack: "Proportion bar",
  donut: "Donut chart",
  pie: "Pie chart",
};

/**
 * Auto-generated summary for the chart root's `aria-label`. Callers that pass
 * their own `aria-label` skip this. Example: "Bar chart. Mon: 80, Tue: 52."
 */
export function buildAriaLabel(type: ChartType, data: ChartDatum[]): string {
  const parts = data.map((d) => (d.label !== undefined ? `${d.label}: ${d.value}` : `${d.value}`));
  return `${TYPE_NOUN[type]}. ${parts.join(", ")}.`;
}

/** Native `title` text for a bar/segment/legend row. */
export function datumTitle(datum: ChartDatum): string {
  return datum.label !== undefined ? `${datum.label}: ${datum.value}` : `${datum.value}`;
}

/** Merge admin custom-property vars with an incoming `style` (incoming wins). */
export function mergeStyle(
  vars: Record<string, string | number>,
  incoming?: CSSProperties,
): CSSProperties {
  return { ...(vars as CSSProperties), ...incoming };
}
