import type { ComponentProps, ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { hasNode } from "./slot";

export type TimelineStatus = "default" | "info" | "success" | "warning" | "danger" | "current";

export interface TimelineProps extends ComponentProps<"ol"> {
  /** Turn the rail into a numbered step list. */
  numbered?: boolean;
  /** `horizontal` lays items out as side-by-side columns instead of a vertical rail. */
  orientation?: "vertical" | "horizontal";
}
function TimelineRoot({ numbered, orientation = "vertical", className, ...rest }: TimelineProps) {
  return (
    <ol
      className={cn(
        [
          "timeline",
          numbered && "timeline-numbered",
          orientation === "horizontal" && "timeline-horizontal",
        ],
        className,
      )}
      {...rest}
    />
  );
}

export interface TimelineItemProps extends Omit<ComponentProps<"li">, "title"> {
  /** Accent for the dot, icon or marker. `current` fills with the primary ink and sets `aria-current="step"`. */
  status?: TimelineStatus;
  /** Indicator icon, replacing the default dot. */
  icon?: IconProp;
  /** Marker content for the numbered variant (number or letter). Takes precedence over `icon`. */
  marker?: ReactNode;
  title?: ReactNode;
  /** Timestamp line. */
  time?: ReactNode;
  description?: ReactNode;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<
    "indicator" | "marker" | "dot" | "content" | "title" | "time" | "description"
  >;
}
function TimelineItem({
  status = "default",
  icon,
  marker,
  title,
  time,
  description,
  className,
  classNames,
  children,
  ...rest
}: TimelineItemProps) {
  let indicator: ReactNode;
  if (marker !== undefined) {
    indicator = <span className={cn("timeline-marker", classNames?.marker)}>{marker}</span>;
  } else if (icon != null) {
    indicator = renderIcon(icon);
  } else {
    indicator = <span className={cn("timeline-dot", classNames?.dot)} />;
  }
  return (
    <li
      className={cn(
        ["timeline-item", status !== "default" && `timeline-item-${status}`],
        className,
      )}
      aria-current={status === "current" ? "step" : undefined}
      {...rest}
    >
      <span className={cn("timeline-indicator", classNames?.indicator)}>{indicator}</span>
      <div className={cn("timeline-content", classNames?.content)}>
        {hasNode(title) ? (
          <div className={cn("timeline-title", classNames?.title)}>{title}</div>
        ) : null}
        {hasNode(time) ? <div className={cn("timeline-time", classNames?.time)}>{time}</div> : null}
        {hasNode(description) ? (
          <div className={cn("timeline-description", classNames?.description)}>{description}</div>
        ) : null}
        {children}
      </div>
    </li>
  );
}

export const Timeline = Object.assign(TimelineRoot, { Item: TimelineItem });
