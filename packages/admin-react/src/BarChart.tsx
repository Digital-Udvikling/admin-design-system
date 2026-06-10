import type { ComponentProps } from "react";
import { cn } from "./cn";
import {
  type ChartDatum,
  type ChartSize,
  buildAriaLabel,
  computeMax,
  datumTitle,
  mergeStyle,
} from "./chart-internal";

export type BarChartVariant = "info" | "success" | "warning" | "danger";
export type BarChartOrientation = "horizontal" | "vertical";

export interface BarChartContainerProps extends ComponentProps<"div"> {
  orientation?: BarChartOrientation;
  size?: ChartSize;
  /** Show per-bar value labels (`.chart-values`). */
  showValues?: boolean;
  /** Inline-flex, em-sized micro-viz for table cells. */
  inline?: boolean;
  /** Single-series fill colour. Per-bar `color` still overrides individual bars. */
  variant?: BarChartVariant;
}

/** Bare grid, no bars — compose `<BarChart.Bar>` by hand. Sets `role="img"`; pass `aria-label`. */
function BarChartContainer({
  orientation = "horizontal",
  size = "md",
  showValues,
  inline,
  variant = "info",
  className,
  ...rest
}: BarChartContainerProps) {
  return (
    <div
      // A chart is a single composite image — role="img" + aria-label, with no <img> to prefer.
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="img"
      className={cn(
        [
          "chart",
          "chart-bars",
          orientation === "vertical" && "chart-bars-vertical",
          size !== "md" && `chart-${size}`,
          showValues && "chart-values",
          inline && "chart-inline",
          variant !== "info" && `chart-${variant}`,
        ],
        className,
      )}
      {...rest}
    />
  );
}

export interface BarProps extends Omit<ComponentProps<"div">, "color"> {
  /** Auto-fills label / value / title / colour from a datum. */
  datum?: ChartDatum;
  /** Raw value when composing without a datum. */
  value?: number;
  /** Category label when composing without a datum. */
  label?: string;
  /** Explicit bar colour (`--bar-color`). Overrides the single-series fill. */
  color?: string;
}

/**
 * One bar. The value cell always renders (CSS hides it without `.chart-values`);
 * fill stays `currentColor` — single-series bars never cycle SERIES.
 */
function Bar({ datum, value, label, color, className, style, ...rest }: BarProps) {
  const v = datum?.value ?? value ?? 0;
  const lab = datum?.label ?? label;
  const barColor = datum?.color ?? color;
  const vars: Record<string, string | number> = { "--value": v };
  if (barColor !== undefined) vars["--bar-color"] = barColor;
  const title = datum !== undefined ? datumTitle(datum) : undefined;
  return (
    <div className={cn("chart-bar", className)} style={mergeStyle(vars, style)} {...rest}>
      {lab !== undefined ? <span className={cn("chart-bar-label", undefined)}>{lab}</span> : null}
      <div className={cn("chart-bar-track", undefined)}>
        <div className={cn("chart-bar-fill", undefined)} title={title} />
      </div>
      <span className={cn("chart-bar-value", undefined)}>{v}</span>
    </div>
  );
}

export interface BarChartProps extends ComponentProps<"div"> {
  data: ChartDatum[];
  /** Override the computed max (the 100% reference). Defaults to the largest value. */
  max?: number;
  orientation?: BarChartOrientation;
  size?: ChartSize;
  showValues?: boolean;
  inline?: boolean;
  variant?: BarChartVariant;
}

/** Single-series bar chart. For hand-composed layouts use `<BarChart.Container>` + `<BarChart.Bar>`. */
function BarChartRoot({
  data,
  max,
  orientation = "horizontal",
  size = "md",
  showValues,
  inline,
  variant = "info",
  style,
  "aria-label": ariaLabel,
  ...rest
}: BarChartProps) {
  const resolvedMax = computeMax(data, max);
  return (
    <BarChartContainer
      orientation={orientation}
      size={size}
      showValues={showValues}
      inline={inline}
      variant={variant}
      style={mergeStyle({ "--chart-max": resolvedMax }, style)}
      aria-label={ariaLabel ?? buildAriaLabel("bar", data)}
      {...rest}
    >
      {data.map((d, i) => (
        <Bar key={d.label ?? i} datum={d} />
      ))}
    </BarChartContainer>
  );
}

export const BarChart = Object.assign(BarChartRoot, {
  Container: BarChartContainer,
  Bar,
});
