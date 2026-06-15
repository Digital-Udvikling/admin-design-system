import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export type ItemVariant = "default" | "outline" | "muted";
export type ItemSize = "sm" | "md" | "lg";

export interface ItemContainerProps extends ComponentProps<"div"> {
  variant?: ItemVariant;
  size?: ItemSize;
  /** Expand the first nested link to fill the whole row (and add hover/focus affordance). */
  asLink?: boolean;
}
/** The bare row primitive — just the `.item` shell, for layouts the default `<Item>` doesn't fit. */
function ItemContainer({
  variant = "default",
  size = "md",
  asLink,
  className,
  ...rest
}: ItemContainerProps) {
  return (
    <div
      className={cn(
        [
          "item",
          variant !== "default" && `item-${variant}`,
          size !== "md" && `item-${size}`,
          asLink && "item-link",
        ],
        className,
      )}
      {...rest}
    />
  );
}

export type ItemMediaProps = ComponentProps<"div">;
function ItemMedia({ className, ...rest }: ItemMediaProps) {
  return <div className={cn("item-media", className)} {...rest} />;
}

export type ItemContentProps = ComponentProps<"div">;
function ItemContent({ className, ...rest }: ItemContentProps) {
  return <div className={cn("item-content", className)} {...rest} />;
}

export type ItemTitleProps = ComponentProps<"div">;
function ItemTitle({ className, ...rest }: ItemTitleProps) {
  return <div className={cn("item-title", className)} {...rest} />;
}

export type ItemDescriptionProps = ComponentProps<"div">;
function ItemDescription({ className, ...rest }: ItemDescriptionProps) {
  return <div className={cn("item-description", className)} {...rest} />;
}

export type ItemActionsProps = ComponentProps<"div">;
function ItemActions({ className, ...rest }: ItemActionsProps) {
  return <div className={cn("item-actions", className)} {...rest} />;
}

export interface ItemProps extends Omit<ItemContainerProps, "title"> {
  /** Leading media (avatar, thumbnail). Takes precedence over `icon`. */
  media?: ReactNode;
  /** Leading icon, rendered inside `.item-media`. */
  icon?: IconProp;
  /** Primary line. */
  title?: ReactNode;
  /** Secondary line under the title. */
  description?: ReactNode;
  /** Trailing controls, pinned to the row's end. */
  actions?: ReactNode;
}

/** Opinionated row with media / title+description / actions shorthand. For other shapes, compose `<Item.Container>`. */
function ItemRoot({ media, icon, title, description, actions, children, ...rest }: ItemProps) {
  const leading = media ?? renderIcon(icon);
  const hasContent = title !== undefined || description !== undefined;
  return (
    <ItemContainer {...rest}>
      {leading != null ? <ItemMedia>{leading}</ItemMedia> : null}
      {hasContent ? (
        <ItemContent>
          {title !== undefined ? <ItemTitle>{title}</ItemTitle> : null}
          {description !== undefined ? <ItemDescription>{description}</ItemDescription> : null}
        </ItemContent>
      ) : null}
      {children}
      {actions !== undefined ? <ItemActions>{actions}</ItemActions> : null}
    </ItemContainer>
  );
}

export interface ItemGroupProps extends ComponentProps<"div"> {
  /** Wrap the stack in a rounded border. */
  bordered?: boolean;
}
/** Divided vertical stack of items. */
export function ItemGroup({ bordered, className, ...rest }: ItemGroupProps) {
  return (
    <div className={cn(["item-group", bordered && "item-group-bordered"], className)} {...rest} />
  );
}

export const Item = Object.assign(ItemRoot, {
  Container: ItemContainer,
  Media: ItemMedia,
  Content: ItemContent,
  Title: ItemTitle,
  Description: ItemDescription,
  Actions: ItemActions,
});
