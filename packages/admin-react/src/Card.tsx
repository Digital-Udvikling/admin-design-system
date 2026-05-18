import { clsx } from "clsx";
import { forwardRef, type HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  compact?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { bordered, compact, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx("card", bordered && "card-bordered", compact && "card-compact", className)}
      {...rest}
    />
  );
});

export type CardBodyProps = HTMLAttributes<HTMLDivElement>;

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={clsx("card-body", className)} {...rest} />;
});

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { className, ...rest },
  ref,
) {
  return <h3 ref={ref} className={clsx("card-title", className)} {...rest} />;
});

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, ...rest }, ref) {
    return <p ref={ref} className={clsx("card-description", className)} {...rest} />;
  },
);

export type CardActionsProps = HTMLAttributes<HTMLDivElement>;

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(function CardActions(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={clsx("card-actions", className)} {...rest} />;
});
