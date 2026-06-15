import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { Children, type ComponentProps, type ReactNode } from "react";
import { cn } from "./cn";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarShape = "circle" | "square";

export interface AvatarProps extends ComponentProps<"span"> {
  src?: string;
  alt?: string;
  /** Fallback text, typically 1–3 letters. Ignored when `children` is given. */
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
}

/**
 * Image avatar with an initials fallback. Initials show until the image loads
 * (and again, React-only, if it errors); the vanilla CSS layers the `<img>`
 * over the initials instead.
 */
export function Avatar({
  src,
  alt,
  initials,
  size = "md",
  shape = "circle",
  className,
  children,
  ...rest
}: AvatarProps) {
  const fallback: ReactNode = children ?? initials;
  return (
    <BaseAvatar.Root
      className={cn(
        ["avatar", size !== "md" && `avatar-${size}`, shape === "square" && "avatar-square"],
        className,
      )}
      {...rest}
    >
      {fallback !== undefined ? <BaseAvatar.Fallback>{fallback}</BaseAvatar.Fallback> : null}
      {src !== undefined ? <BaseAvatar.Image src={src} alt={alt} /> : null}
    </BaseAvatar.Root>
  );
}

export interface AvatarGroupProps extends ComponentProps<"div"> {
  /** Cap the visible avatars; the rest collapse into a trailing "+N" tile. */
  max?: number;
  /** Size for the surplus tile — match the avatars inside. Default `"md"`. */
  size?: AvatarSize;
}

/** Overlapping stack of avatars; later children paint on top. `max` caps the visible count. */
export function AvatarGroup({ max, size = "md", className, children, ...rest }: AvatarGroupProps) {
  const items = Children.toArray(children);
  const overflow = max !== undefined && items.length > max ? items.length - max : 0;
  const visible = overflow > 0 ? items.slice(0, max) : items;
  return (
    <div className={cn("avatar-group", className)} {...rest}>
      {visible}
      {overflow > 0 ? (
        <span
          className={cn(["avatar", size !== "md" && `avatar-${size}`, "avatar-more"], undefined)}
          aria-label={`+${overflow} more`}
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}
