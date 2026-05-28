import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export interface StatCardProps extends Omit<ComponentProps<"div">, "label"> {
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
 * Compact KPI tile — `label / value / detail`. Outer chrome matches `<Card>`
 * (border, radius, shadow) but the inner shape inverts the visual hierarchy:
 * value dominates, label is the small annotation. For free-form tiles, use
 * `<Card>`; for label/value tables, use `<PropertyList>`.
 */
export function StatCard({
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
  const hasLabel = icon !== undefined || label !== undefined;
  return (
    <div
      className={cn(
        ["stat-card", compact && "stat-card-compact", bordered && "stat-card-bordered"],
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
