import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export type TimelineStatus = "default" | "info" | "success" | "warning" | "danger" | "current";

export interface TimelineProps extends ComponentProps<"ol"> {
  /** Turn the rail into a numbered step list. */
  numbered?: boolean;
}
function TimelineRoot({ numbered, className, ...rest }: TimelineProps) {
  return <ol className={cn(["timeline", numbered && "timeline-numbered"], className)} {...rest} />;
}

export interface TimelineItemProps extends Omit<ComponentProps<"li">, "title"> {
  /** Accent for the indicator. `current` highlights a numbered marker. */
  status?: TimelineStatus;
  /** Indicator icon, replacing the default dot. */
  icon?: IconProp;
  /** Marker content for the numbered variant (number or letter). Takes precedence over `icon`. */
  marker?: ReactNode;
  title?: ReactNode;
  /** Timestamp line. */
  time?: ReactNode;
  description?: ReactNode;
}
function TimelineItem({
  status = "default",
  icon,
  marker,
  title,
  time,
  description,
  className,
  children,
  ...rest
}: TimelineItemProps) {
  let indicator: ReactNode;
  if (marker !== undefined) {
    indicator = <span className={cn("timeline-marker", undefined)}>{marker}</span>;
  } else if (icon != null) {
    indicator = renderIcon(icon);
  } else {
    indicator = <span className={cn("timeline-dot", undefined)} />;
  }
  return (
    <li
      className={cn(
        ["timeline-item", status !== "default" && `timeline-item-${status}`],
        className,
      )}
      {...rest}
    >
      <span className={cn("timeline-indicator", undefined)}>{indicator}</span>
      <div className={cn("timeline-content", undefined)}>
        {title !== undefined ? (
          <div className={cn("timeline-title", undefined)}>{title}</div>
        ) : null}
        {time !== undefined ? <div className={cn("timeline-time", undefined)}>{time}</div> : null}
        {description !== undefined ? (
          <div className={cn("timeline-description", undefined)}>{description}</div>
        ) : null}
        {children}
      </div>
    </li>
  );
}

export const Timeline = Object.assign(TimelineRoot, { Item: TimelineItem });
