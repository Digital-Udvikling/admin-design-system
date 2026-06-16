import type { ComponentProps, ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";
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
      {...rest}
    >
      <span className={cn("timeline-indicator", classNames?.indicator)}>{indicator}</span>
      <div className={cn("timeline-content", classNames?.content)}>
        {title !== undefined ? (
          <div className={cn("timeline-title", classNames?.title)}>{title}</div>
        ) : null}
        {time !== undefined ? (
          <div className={cn("timeline-time", classNames?.time)}>{time}</div>
        ) : null}
        {description !== undefined ? (
          <div className={cn("timeline-description", classNames?.description)}>{description}</div>
        ) : null}
        {children}
      </div>
    </li>
  );
}

export const Timeline = Object.assign(TimelineRoot, { Item: TimelineItem });
