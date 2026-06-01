import type { ComponentProps } from "react";
import { ChartLegend } from "./ChartLegend";
import { cn } from "./cn";
import {
  type ChartDatum,
  buildAriaLabel,
  datumTitle,
  mergeStyle,
  seriesColor,
} from "./chart-internal";

export type StackedBarTrackProps = ComponentProps<"div">;

/** The bare proportion track — compose `<StackedBar.Segment>` children by hand. */
function Track({ className, ...rest }: StackedBarTrackProps) {
  return <div className={cn("chart-stack", className)} {...rest} />;
}

export interface SegmentProps extends Omit<ComponentProps<"div">, "color"> {
  /** Auto-fills value / title / colour from a datum. */
  datum?: ChartDatum;
  /** Index into the SERIES palette (used when the datum has no `color`). */
  index?: number;
  /** Raw value when composing without a datum. */
  value?: number;
  /** Explicit segment colour (`--segment-color`). */
  color?: string;
}

/**
 * One proportion segment, sized by `flex: var(--value)`. Multi-series by
 * default: takes its colour from `seriesColor` (SERIES cycle or `datum.color`).
 */
function Segment({ datum, index = 0, value, color, className, style, ...rest }: SegmentProps) {
  const v = datum?.value ?? value ?? 0;
  const segColor = datum !== undefined ? seriesColor(datum, index) : color;
  const vars: Record<string, string | number> = { "--value": v };
  if (segColor !== undefined) vars["--segment-color"] = segColor;
  const title = datum !== undefined ? datumTitle(datum) : undefined;
  return (
    <div
      className={cn("chart-segment", className)}
      style={mergeStyle(vars, style)}
      title={title}
      {...rest}
    />
  );
}

export interface StackedBarProps extends Omit<ComponentProps<"div">, "color"> {
  data: ChartDatum[];
  /** Render a legend from the data labels. */
  legend?: boolean;
  inline?: boolean;
}

/**
 * Single horizontal proportion bar — a "60% A / 30% B / 10% C" breakdown.
 * Segments are sized by their flex ratios (no max needed) and coloured from the
 * SERIES palette by default. Generates an overridable `aria-label`.
 */
function StackedBarRoot({
  data,
  legend,
  inline,
  className,
  "aria-label": ariaLabel,
  ...rest
}: StackedBarProps) {
  return (
    <div
      // A chart is a single composite image, so role="img" + aria-label is the
      // correct ARIA pattern — there is no <img> tag to prefer here.
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="img"
      className={cn(["chart", inline && "chart-inline"], className)}
      aria-label={ariaLabel ?? buildAriaLabel("stack", data)}
      {...rest}
    >
      <Track>
        {data.map((d, i) => (
          <Segment key={d.label ?? i} datum={d} index={i} />
        ))}
      </Track>
      {legend ? <ChartLegend data={data} /> : null}
    </div>
  );
}

export const StackedBar = Object.assign(StackedBarRoot, {
  Track,
  Segment,
  Legend: ChartLegend,
});
