import { clsx } from "clsx";
import type { ComponentProps } from "react";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps extends ComponentProps<"div"> {
  variant?: AlertVariant;
}

function AlertRoot({ variant = "info", className, role, ...rest }: AlertProps) {
  const defaultRole = variant === "danger" || variant === "warning" ? "alert" : "status";
  return (
    <div
      role={role ?? defaultRole}
      className={clsx("alert", `alert-${variant}`, className)}
      {...rest}
    />
  );
}

export type AlertTitleProps = ComponentProps<"strong">;
function AlertTitle({ className, ...rest }: AlertTitleProps) {
  return <strong className={clsx("alert-title", className)} {...rest} />;
}

export type AlertDescriptionProps = ComponentProps<"p">;
function AlertDescription({ className, ...rest }: AlertDescriptionProps) {
  return <p className={clsx("alert-description", className)} {...rest} />;
}

export const Alert = Object.assign(AlertRoot, {
  Title: AlertTitle,
  Description: AlertDescription,
});
