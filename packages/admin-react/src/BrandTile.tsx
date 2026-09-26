import type { CSSProperties, ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export type BrandTileVariant = "accent" | "info" | "success" | "warning" | "danger";
export type BrandTileSize = "md" | "lg";

export interface BrandTileProps extends ComponentProps<"span"> {
  /** Fill colour. `accent` is `--color-system-accent`. */
  variant?: BrandTileVariant;
  /** A `-muted` fill with a coloured glyph instead of the solid fill. */
  soft?: boolean;
  size?: BrandTileSize;
  /** 1–2 letter monogram. Ignored if `icon` or `src` is provided. */
  monogram?: string;
  /** Icon component or element. Takes precedence over `monogram`, yields to `src`. */
  icon?: IconProp;
  /** Logo image source. Wins over `icon` and `monogram`, flipping the tile to a bordered surface. */
  src?: string;
  /** Alt text for the image tile. Defaults to `""` (decorative). */
  alt?: string;
  /**
   * CSS color (e.g. `var(--color-purple-600)`) applied as `--color-system-accent`
   * to the tile. See
   * [Theming › System accent](https://digital-udvikling.github.io/admin-design-system/basics/theming/#system-accent).
   */
  systemAccent?: string;
}

/**
 * Brand/system mark for the navbar — monogram, icon, or shop logo. Precedence
 * is `src` > `icon` > `monogram`. Monogram/icon tiles are `aria-hidden`; image
 * tiles expose `alt` to assistive tech instead.
 */
export function BrandTile({
  variant = "accent",
  soft = false,
  size = "md",
  monogram,
  icon,
  src,
  alt = "",
  systemAccent,
  className,
  style,
  children,
  ...rest
}: BrandTileProps) {
  const tileStyle =
    systemAccent !== undefined
      ? ({ ...style, "--color-system-accent": systemAccent } as CSSProperties)
      : style;
  const classes = cn(
    [
      "brand-tile",
      variant !== "accent" && `brand-tile-${variant}`,
      soft && "brand-tile-soft",
      size === "lg" && "brand-tile-lg",
    ],
    className,
  );

  if (src) {
    return (
      <span className={classes} style={tileStyle} {...rest}>
        <img src={src} alt={alt} />
      </span>
    );
  }

  return (
    <span className={classes} style={tileStyle} aria-hidden {...rest}>
      {icon ? renderIcon(icon) : (children ?? monogram)}
    </span>
  );
}
