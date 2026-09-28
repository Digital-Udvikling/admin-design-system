import type { ComponentProps, MouseEventHandler } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { renderAs, type RenderElement } from "./render";

export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger" | "primary";
export type BadgeSize = "sm" | "md" | "lg";

function RemoveIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export interface BadgeProps extends ComponentProps<"span"> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Leading icon. */
  icon?: IconProp;
  /** Tinted fill with accent text instead of the solid status fill. */
  soft?: boolean;
  /** Renders a trailing remove button. */
  onRemove?: MouseEventHandler<HTMLButtonElement>;
  /** aria-label for the remove button. Default: "Remove". */
  removeLabel?: string;
  /** Element to render in place of the `<span>`. Don't combine with `onRemove`: a button can't sit inside a link. */
  render?: RenderElement;
}

export function Badge({
  variant = "neutral",
  size = "md",
  icon,
  soft = false,
  onRemove,
  removeLabel = "Remove",
  render,
  className,
  children,
  ...rest
}: BadgeProps) {
  return renderAs("span", render, {
    className: cn(
      [
        "badge",
        variant !== "neutral" && `badge-${variant}`,
        size !== "md" && `badge-${size}`,
        soft && "badge-soft",
      ],
      className,
    ),
    ...rest,
    children: (
      <>
        {renderIcon(icon)}
        {children}
        {onRemove ? (
          <button
            type="button"
            className={cn("badge-remove", undefined)}
            aria-label={removeLabel}
            onClick={onRemove}
          >
            <RemoveIcon />
          </button>
        ) : null}
      </>
    ),
  });
}
