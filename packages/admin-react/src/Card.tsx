import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { renderIcon, type IconProp } from "./icon";

export interface CardContainerProps extends ComponentProps<"div"> {
  bordered?: boolean;
  compact?: boolean;
}

/**
 * The bare `.card` container — no body, no title. Use this when you need to
 * compose the internals yourself (e.g. a media block above the body).
 */
function CardContainer({ bordered, compact, className, ...rest }: CardContainerProps) {
  return (
    <div
      className={clsx("card", bordered && "card-bordered", compact && "card-compact", className)}
      {...rest}
    />
  );
}

export interface CardProps extends Omit<ComponentProps<"div">, "title"> {
  bordered?: boolean;
  compact?: boolean;
  /** Leading icon for the title row. */
  icon?: IconProp;
  /** Renders as `<Card.Title>`. */
  title?: ReactNode;
  /** Renders as `<Card.Description>`. */
  description?: ReactNode;
  /** Renders as `<Card.Actions>`. */
  actions?: ReactNode;
}

/**
 * Standard card: a `.card` container with a single `.card-body` that lays out
 * an optional title (with icon), description, children, and actions. For
 * anything outside that shape, use `<Card.Container>` and compose by hand.
 */
function CardRoot({
  bordered,
  compact,
  icon,
  title,
  description,
  actions,
  className,
  children,
  ...rest
}: CardProps) {
  const hasTitle = icon !== undefined || title !== undefined;
  return (
    <CardContainer bordered={bordered} compact={compact} className={className} {...rest}>
      <CardBody>
        {hasTitle ? <CardTitle icon={icon}>{title}</CardTitle> : null}
        {description !== undefined ? <CardDescription>{description}</CardDescription> : null}
        {children}
        {actions !== undefined ? <CardActions>{actions}</CardActions> : null}
      </CardBody>
    </CardContainer>
  );
}

export type CardBodyProps = ComponentProps<"div">;
function CardBody({ className, ...rest }: CardBodyProps) {
  return <div className={clsx("card-body", className)} {...rest} />;
}

export interface CardTitleProps extends ComponentProps<"h3"> {
  /** Leading icon. */
  icon?: IconProp;
}
function CardTitle({ icon, className, children, ...rest }: CardTitleProps) {
  return (
    <h3 className={clsx("card-title", className)} {...rest}>
      {renderIcon(icon)}
      {children}
    </h3>
  );
}

export type CardDescriptionProps = ComponentProps<"p">;
function CardDescription({ className, ...rest }: CardDescriptionProps) {
  return <p className={clsx("card-description", className)} {...rest} />;
}

export type CardActionsProps = ComponentProps<"div">;
function CardActions({ className, ...rest }: CardActionsProps) {
  return <div className={clsx("card-actions", className)} {...rest} />;
}

export const Card = Object.assign(CardRoot, {
  Container: CardContainer,
  Body: CardBody,
  Title: CardTitle,
  Description: CardDescription,
  Actions: CardActions,
});
