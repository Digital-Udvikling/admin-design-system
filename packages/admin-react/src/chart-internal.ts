import type { CSSProperties } from "react";

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
 * Multi-series palette of existing Flexoki tokens, not a new token layer. The
 * documented vanilla sequence copies this exactly — both bundles must match.
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

export function seriesColor(datum: ChartDatum, index: number): string {
  return datum.color ?? SERIES[index % SERIES.length]!;
}

/** Largest value, floored at 1 so the bar calc never divides by zero. */
export function computeMax(data: ChartDatum[], explicit?: number): number {
  if (explicit !== undefined) return explicit;
  return Math.max(1, ...data.map((d) => d.value));
}

/** Cumulative `conic-gradient` stops. A non-positive total yields a neutral fill so the ring isn't blank. */
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

/** Chart-root `aria-label` summary, e.g. "Bar chart. Mon: 80, Tue: 52." */
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
