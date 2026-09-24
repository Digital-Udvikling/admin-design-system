import type { CSSProperties, ComponentProps } from "react";
import { cn } from "./cn";

export type ContainerSize = "sm" | "md" | "lg" | "fluid";

export interface ContainerProps extends ComponentProps<"div"> {
  /** Width preset. `md` (default) ≈ 90rem; `fluid` removes the max-width. */
  size?: ContainerSize;
  /** Tighter vertical rhythm and block padding for dense screens. */
  compact?: boolean;
  /** Custom cap as a CSS length (e.g. `"40rem"`), set as `--container-max`. Overrides `size`. */
  maxWidth?: string;
}

/**
 * Page content region: a centered, max-width column that owns the vertical
 * gap between stacked sections. Place inside `<AppShell.Main>`, which has no
 * padding of its own. Not the `.Container` escape hatch (`Card.Container`).
 */
export function Container({
  size = "md",
  compact,
  maxWidth,
  className,
  style,
  ...rest
}: ContainerProps) {
  const rootStyle =
    maxWidth !== undefined ? ({ ...style, "--container-max": maxWidth } as CSSProperties) : style;

  return (
    <div
      className={cn(
        ["container", size !== "md" && `container-${size}`, compact && "container-compact"],
        className,
      )}
      style={rootStyle}
      {...rest}
    />
  );
}
