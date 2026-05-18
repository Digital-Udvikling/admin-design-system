import { clsx } from "clsx";
import type { ComponentProps } from "react";

export interface CardProps extends ComponentProps<"div"> {
  bordered?: boolean;
  compact?: boolean;
}

function CardRoot({ bordered, compact, className, ...rest }: CardProps) {
  return (
    <div
      className={clsx("card", bordered && "card-bordered", compact && "card-compact", className)}
      {...rest}
    />
  );
}

export type CardBodyProps = ComponentProps<"div">;
function CardBody({ className, ...rest }: CardBodyProps) {
  return <div className={clsx("card-body", className)} {...rest} />;
}

export type CardTitleProps = ComponentProps<"h3">;
function CardTitle({ className, children, ...rest }: CardTitleProps) {
  return (
    <h3 className={clsx("card-title", className)} {...rest}>
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
  Body: CardBody,
  Title: CardTitle,
  Description: CardDescription,
  Actions: CardActions,
});
