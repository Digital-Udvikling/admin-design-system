import type { ComponentProps, ReactNode } from "react";
import type { CardVariant } from "./Card";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export interface StatCardProps extends ComponentProps<"div"> {
  /** Tinted surface + matching border, shared with `<Card>`. The value picks up the accent (except `warning`). Defaults to the neutral surface. */
  variant?: CardVariant;
  /** Small annotation above the value (e.g. "Total Generations"). */
  label?: ReactNode;
  /** The headline metric. Rendered with `tabular-nums` so digits don't shift between values. */
  value?: ReactNode;
  /** Subordinate line under the value (e.g. "42 completed / 12 pending"). */
  detail?: ReactNode;
  /** Leading icon in the label row. */
  icon?: IconProp;
  compact?: boolean;
  bordered?: boolean;
}

/**
 * Compact KPI tile — `label / value / detail`. Renders a `.card` shell (so it
 * shares the surface, border, radius, shadow, and every card modifier) with an
 * inverted inner hierarchy: the value dominates, the label is a small
 * annotation. `compact`/`bordered` map to the shared `.card-compact`/
 * `.card-bordered` modifiers. For free-form tiles, use `<Card>`; for
 * label/value tables, use `<PropertyList>`.
 */
export function StatCard({
  variant = "default",
  label,
  value,
  detail,
  icon,
  compact,
  bordered,
  className,
  children,
  ...rest
}: StatCardProps) {
  // Match the vanilla bundle: the label row exists only when there's label
  // text. An icon alone never emits a label-less row.
  const hasLabel = label !== undefined;
  return (
    <div
      className={cn(
        [
          "card",
          "stat-card",
          variant !== "default" && `card-${variant}`,
          compact && "card-compact",
          bordered && "card-bordered",
        ],
        className,
      )}
      {...rest}
    >
      {hasLabel ? (
        <p className={cn("stat-card-label", undefined)}>
          {renderIcon(icon)}
          {label}
        </p>
      ) : null}
      {value !== undefined ? <p className={cn("stat-card-value", undefined)}>{value}</p> : null}
      {detail !== undefined ? <p className={cn("stat-card-detail", undefined)}>{detail}</p> : null}
      {children}
    </div>
  );
}
