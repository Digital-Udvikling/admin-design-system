import type { ComponentProps, ReactNode } from "react";
import { ChartLegend } from "./ChartLegend";
import { cn } from "./cn";
import {
  type ChartDatum,
  type ChartSize,
  buildAriaLabel,
  buildDonutSegments,
  mergeStyle,
} from "./chart-internal";

export interface DonutFigureProps extends ComponentProps<"div"> {
  size?: ChartSize;
}

/** Square positioning context that overlays the centre label on the ring. */
function Figure({ size = "md", className, ...rest }: DonutFigureProps) {
  return (
    <div
      className={cn(["chart-donut-figure", size !== "md" && `chart-${size}`], className)}
      {...rest}
    />
  );
}

export interface DonutRingProps extends Omit<ComponentProps<"div">, "color"> {
  data: ChartDatum[];
  /** Solid pie — no hole. */
  pie?: boolean;
  /** Ring width as a % of diameter (default "33%"). Ignored when `pie`. */
  thickness?: string;
}

/** The masked conic-gradient ring. Builds `--donut-segments` from the data. */
function Ring({ data, pie, thickness, className, style, ...rest }: DonutRingProps) {
  const vars: Record<string, string | number> = { "--donut-segments": buildDonutSegments(data) };
  if (thickness !== undefined && !pie) vars["--donut-thickness"] = thickness;
  return (
    <div
      className={cn(["chart-donut", pie && "chart-donut-pie"], className)}
      style={mergeStyle(vars, style)}
      {...rest}
    />
  );
}

/** Centred overlay (a total, a label). Not a child of the ring — masks clip subtrees. */
function Center({ className, ...rest }: ComponentProps<"div">) {
  return <div className={cn("chart-donut-center", className)} {...rest} />;
}

export interface DonutProps extends Omit<ComponentProps<"div">, "color"> {
  data: ChartDatum[];
  size?: ChartSize;
  /** Ring width as a % of diameter (default "33%"). Ignored when `pie`. */
  thickness?: string;
  /** Solid pie — no hole. */
  pie?: boolean;
  /** Centred overlay content (a total, a label). */
  centerLabel?: ReactNode;
  /** Render a legend from the data labels. */
  legend?: boolean;
  inline?: boolean;
}

/**
 * Donut (or `pie`) breakdown. Builds the cumulative conic-gradient string from
 * `data`, overlays an optional `centerLabel`, and generates an overridable
 * `aria-label`. Per-slice read-outs live on the optional `legend` rows — a
 * conic slice has no element to carry a `title`. Resize by overriding
 * `--chart-size` (it inherits to the figure) or via `size`.
 */
function DonutRoot({
  data,
  size = "md",
  thickness,
  pie,
  centerLabel,
  legend,
  inline,
  className,
  "aria-label": ariaLabel,
  ...rest
}: DonutProps) {
  return (
    <div
      // A chart is a single composite image, so role="img" + aria-label is the
      // correct ARIA pattern — there is no <img> tag to prefer here.
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="img"
      className={cn(["chart", inline && "chart-inline"], className)}
      aria-label={ariaLabel ?? buildAriaLabel(pie ? "pie" : "donut", data)}
      {...rest}
    >
      <Figure size={size}>
        <Ring data={data} pie={pie} thickness={thickness} />
        {centerLabel !== undefined ? <Center>{centerLabel}</Center> : null}
      </Figure>
      {legend ? <ChartLegend data={data} /> : null}
    </div>
  );
}

export const Donut = Object.assign(DonutRoot, {
  Figure,
  Ring,
  Center,
  Legend: ChartLegend,
});
