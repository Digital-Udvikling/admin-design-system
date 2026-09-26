import type { ComponentProps, ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { renderAs, type RenderElement } from "./render";
import { hasNode } from "./slot";

export type CardVariant =
  | "default"
  | "muted"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";

export interface CardContainerProps extends ComponentProps<"div"> {
  /** Tinted surface + matching border. Defaults to the neutral surface. */
  variant?: CardVariant;
  bordered?: boolean;
  compact?: boolean;
  /** Pins direct-child header/actions and scrolls the body. Set the height yourself. */
  scroll?: boolean;
  /** Element to render in place of the `<div>`; a router link makes the whole card clickable. */
  render?: RenderElement;
}

/**
 * The bare `.card` container — no body, no title. Use this when you need to
 * compose the internals yourself (e.g. a media block above the body).
 */
function CardContainer({
  variant = "default",
  bordered,
  compact,
  scroll,
  render,
  className,
  ...rest
}: CardContainerProps) {
  return renderAs("div", render, {
    className: cn(
      [
        "card",
        variant !== "default" && `card-${variant}`,
        bordered && "card-bordered",
        compact && "card-compact",
        scroll && "card-scroll",
      ],
      className,
    ),
    ...rest,
  });
}

export interface CardProps extends Omit<ComponentProps<"div">, "title"> {
  /** Tinted surface + matching border. Defaults to the neutral surface. */
  variant?: CardVariant;
  bordered?: boolean;
  compact?: boolean;
  /** Full-bleed media rendered as `<Card.Media>` above the body. */
  media?: ReactNode;
  /** Leading icon for the title row; ignored without a `title`. */
  icon?: IconProp;
  /** Renders as `<Card.Title>`. */
  title?: ReactNode;
  /** Renders as `<Card.Description>`. */
  description?: ReactNode;
  /** Trailing header controls (close, edit, …). Renders as `<Card.Toolbar>`. */
  toolbar?: ReactNode;
  /** Renders as `<Card.Actions>`. */
  actions?: ReactNode;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<
    "media" | "body" | "header" | "toolbar" | "title" | "description" | "actions"
  >;
}

/**
 * Standard card: a `.card` container with a single `.card-body` that lays out
 * an optional title (with icon), description, children, and actions. For
 * anything outside that shape, use `<Card.Container>` and compose by hand.
 */
function CardRoot({
  variant,
  bordered,
  compact,
  media,
  icon,
  title,
  description,
  toolbar,
  actions,
  className,
  classNames,
  children,
  ...rest
}: CardProps) {
  // An icon alone would be an empty heading, so the title row needs a title.
  const titleEl = hasNode(title) ? (
    <CardTitle icon={icon} className={classNames?.title}>
      {title}
    </CardTitle>
  ) : null;
  return (
    <CardContainer
      variant={variant}
      bordered={bordered}
      compact={compact}
      className={className}
      {...rest}
    >
      {hasNode(media) ? <CardMedia className={classNames?.media}>{media}</CardMedia> : null}
      <CardBody className={classNames?.body}>
        {hasNode(toolbar) ? (
          <CardHeader className={classNames?.header}>
            {titleEl}
            <CardToolbar className={classNames?.toolbar}>{toolbar}</CardToolbar>
          </CardHeader>
        ) : (
          titleEl
        )}
        {hasNode(description) ? (
          <CardDescription className={classNames?.description}>{description}</CardDescription>
        ) : null}
        {children}
        {hasNode(actions) ? (
          <CardActions className={classNames?.actions}>{actions}</CardActions>
        ) : null}
      </CardBody>
    </CardContainer>
  );
}

export type CardMediaProps = ComponentProps<"div">;
function CardMedia({ className, ...rest }: CardMediaProps) {
  return <div className={cn("card-media", className)} {...rest} />;
}

export type CardBodyProps = ComponentProps<"div">;
function CardBody({ className, ...rest }: CardBodyProps) {
  return <div className={cn("card-body", className)} {...rest} />;
}

export type CardHeaderProps = ComponentProps<"div">;
function CardHeader({ className, ...rest }: CardHeaderProps) {
  return <div className={cn("card-header", className)} {...rest} />;
}

export type CardToolbarProps = ComponentProps<"div">;
function CardToolbar({ className, ...rest }: CardToolbarProps) {
  return <div className={cn("card-toolbar", className)} {...rest} />;
}

export interface CardTitleProps extends ComponentProps<"h3"> {
  /** Leading icon. */
  icon?: IconProp;
}
function CardTitle({ icon, className, children, ...rest }: CardTitleProps) {
  return (
    <h3 className={cn("card-title", className)} {...rest}>
      {renderIcon(icon)}
      {children}
    </h3>
  );
}

export type CardDescriptionProps = ComponentProps<"p">;
function CardDescription({ className, ...rest }: CardDescriptionProps) {
  return <p className={cn("card-description", className)} {...rest} />;
}

export type CardActionsProps = ComponentProps<"div">;
function CardActions({ className, ...rest }: CardActionsProps) {
  return <div className={cn("card-actions", className)} {...rest} />;
}

export const Card = Object.assign(CardRoot, {
  Container: CardContainer,
  Media: CardMedia,
  Body: CardBody,
  Header: CardHeader,
  Toolbar: CardToolbar,
  Title: CardTitle,
  Description: CardDescription,
  Actions: CardActions,
});
