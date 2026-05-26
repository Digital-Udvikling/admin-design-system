import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps extends Omit<ComponentProps<"div">, "title"> {
  variant?: AlertVariant;
  /** Leading icon. Rendered as the first child so the CSS grid kicks in. */
  icon?: IconProp;
  /** Renders as `<Alert.Title>`. */
  title?: ReactNode;
  /** Renders as `<Alert.Description>`. */
  description?: ReactNode;
}

function AlertRoot({
  variant = "info",
  icon,
  title,
  description,
  className,
  role,
  children,
  ...rest
}: AlertProps) {
  const defaultRole = variant === "danger" || variant === "warning" ? "alert" : "status";
  return (
    <div
      role={role ?? defaultRole}
      className={cn(["alert", `alert-${variant}`], className)}
      {...rest}
    >
      {renderIcon(icon)}
      {title !== undefined ? <AlertTitle>{title}</AlertTitle> : null}
      {description !== undefined ? <AlertDescription>{description}</AlertDescription> : null}
      {children}
    </div>
  );
}

export type AlertTitleProps = ComponentProps<"strong">;
function AlertTitle({ className, ...rest }: AlertTitleProps) {
  return <strong className={cn("alert-title", className)} {...rest} />;
}

export type AlertDescriptionProps = ComponentProps<"p">;
function AlertDescription({ className, ...rest }: AlertDescriptionProps) {
  return <p className={cn("alert-description", className)} {...rest} />;
}

export const Alert = Object.assign(AlertRoot, {
  Title: AlertTitle,
  Description: AlertDescription,
});
