import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export type BrandTileVariant = "solid" | "soft" | "info" | "success" | "danger";

export interface BrandTileProps extends ComponentProps<"span"> {
  /** Tint treatment. `solid` is the accent fill; the rest are `*-muted` fills with a colored glyph. */
  variant?: BrandTileVariant;
  size?: "md" | "lg";
  /** 1–2 letter monogram. Ignored if `icon` or `src` is provided. */
  monogram?: string;
  /** Icon component or element. Takes precedence over `monogram`, yields to `src`. */
  icon?: IconProp;
  /** Logo image source. Wins over `icon` and `monogram`, flipping the tile to a bordered surface. */
  src?: string;
  /** Alt text for the image tile. Defaults to `""` (decorative). */
  alt?: string;
}

/**
 * Brand/system mark for the navbar — monogram, icon, or shop logo. Precedence
 * is `src` > `icon` > `monogram`. Monogram/icon tiles are `aria-hidden`; image
 * tiles expose `alt` to assistive tech instead.
 */
export function BrandTile({
  variant = "solid",
  size = "md",
  monogram,
  icon,
  src,
  alt = "",
  className,
  children,
  ...rest
}: BrandTileProps) {
  const classes = cn(
    [
      "brand-tile",
      variant !== "solid" && `brand-tile-${variant}`,
      size === "lg" && "brand-tile-lg",
    ],
    className,
  );

  if (src) {
    return (
      <span className={classes} {...rest}>
        <img src={src} alt={alt} />
      </span>
    );
  }

  return (
    <span className={classes} aria-hidden {...rest}>
      {icon ? renderIcon(icon) : (children ?? monogram)}
    </span>
  );
}
