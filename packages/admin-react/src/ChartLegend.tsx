import type { ComponentProps } from "react";
import { cn } from "./cn";
import { type ChartDatum, datumTitle, mergeStyle, seriesColor } from "./chart-internal";

export interface ChartLegendProps extends ComponentProps<"ul"> {
  data: ChartDatum[];
}

/**
 * Shared legend for `<Donut>` and `<StackedBar>` — one swatch + label per
 * datum. Each row carries its own `title`, which is where the donut's
 * per-slice read-out lives (a conic-gradient slice has no element to hang a
 * `title` on). The swatch colour mirrors `seriesColor`, so legend and chart
 * stay in sync.
 */
export function ChartLegend({ data, className, ...rest }: ChartLegendProps) {
  return (
    <ul className={cn("chart-legend", className)} {...rest}>
      {data.map((d, i) => (
        <li
          key={d.label ?? i}
          className={cn("chart-legend-item", undefined)}
          style={mergeStyle({ "--legend-color": seriesColor(d, i) })}
          title={datumTitle(d)}
        >
          {d.label ?? d.value}
        </li>
      ))}
    </ul>
  );
}
