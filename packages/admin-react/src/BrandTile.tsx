import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export interface BrandTileProps extends ComponentProps<"span"> {
  /** 1–2 letter monogram. Ignored if `icon` is provided. */
  monogram?: string;
  /** Icon component or element. Takes precedence over `monogram`. */
  icon?: IconProp;
}

export function BrandTile({ monogram, icon, className, children, ...rest }: BrandTileProps) {
  return (
    <span className={cn("brand-tile", className)} aria-hidden {...rest}>
      {icon ? renderIcon(icon, 14) : (children ?? monogram)}
    </span>
  );
}
