import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { Badge, type BadgeSize, type BadgeVariant } from "./Badge";
import { cn } from "./cn";
import type { IconProp } from "./icon";

export type IndicatorVertical = "top" | "middle" | "bottom";
export type IndicatorHorizontal = "start" | "center" | "end";
export type IndicatorPlacement = `${IndicatorVertical}-${IndicatorHorizontal}`;

export interface IndicatorProps extends ComponentProps<"div"> {
  /** Badge content (count, "!", text). Omit for a label-less status dot. */
  label?: ReactNode;
  /** Variant for both the badge and the dot. Defaults to `"neutral"`. */
  variant?: BadgeVariant;
  /** Badge size. Ignored when rendering a dot. Defaults to `"sm"`. */
  size?: BadgeSize;
  /** Leading icon for the badge. Implies the badge form (no dot fallback). */
  icon?: IconProp;
  /** Where the indicator sits relative to children. Default `"top-end"`. */
  placement?: IndicatorPlacement;
  /**
   * Pixels to pull the indicator toward the anchor's center — aligns it with
   * the visual corner of rounded anchors (e.g. `4` for `rounded-md`).
   */
  offset?: number;
}

export function Indicator({
  label,
  variant = "neutral",
  size = "sm",
  icon,
  placement = "top-end",
  offset,
  className,
  "aria-label": ariaLabel,
  style: styleProp,
  children,
  ...rest
}: IndicatorProps) {
  const [vertical, horizontal] = placement.split("-") as [IndicatorVertical, IndicatorHorizontal];
  const placementClasses = [
    "indicator-item",
    vertical !== "top" && `indicator-${vertical}`,
    horizontal !== "end" && `indicator-${horizontal}`,
  ];
  const hasContent = label !== undefined || icon !== undefined;
  const style =
    offset !== undefined
      ? ({ ...styleProp, "--indicator-offset": `${offset}px` } as CSSProperties)
      : styleProp;
  return (
    <div className={cn("indicator", className)} style={style} {...rest}>
      {hasContent ? (
        <Badge
          className={cn(placementClasses, undefined)}
          variant={variant}
          size={size}
          icon={icon}
          aria-label={ariaLabel}
        >
          {label}
        </Badge>
      ) : (
        <span
          className={cn(
            [
              ...placementClasses,
              "indicator-dot",
              variant !== "neutral" && `indicator-dot-${variant}`,
            ],
            undefined,
          )}
          role={ariaLabel !== undefined ? "status" : undefined}
          aria-label={ariaLabel}
        />
      )}
      {children}
    </div>
  );
}
