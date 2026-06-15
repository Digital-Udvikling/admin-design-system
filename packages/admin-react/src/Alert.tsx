import type { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export type AlertVariant = "info" | "success" | "warning" | "danger";

function DismissIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export interface AlertProps extends Omit<ComponentProps<"div">, "title"> {
  variant: AlertVariant;
  /** Leading icon. Rendered as the first child so the CSS grid kicks in. */
  icon?: IconProp;
  /** Renders as `<Alert.Title>`. */
  title?: ReactNode;
  /** Renders as `<Alert.Description>`. */
  description?: ReactNode;
  /** Trailing action. Renders as `<Alert.Action>` after children so reading order matches. */
  action?: ReactNode;
  /** Renders a trailing dismiss (×) button. The Alert stays stateless — the consumer hides or removes it. */
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  /** aria-label for the dismiss button. Default: "Dismiss". */
  dismissLabel?: string;
}

function AlertRoot({
  variant,
  icon,
  title,
  description,
  action,
  onDismiss,
  dismissLabel = "Dismiss",
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
      {action !== undefined ? <AlertAction>{action}</AlertAction> : null}
      {onDismiss ? (
        <button
          type="button"
          className={cn("alert-dismiss", undefined)}
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <DismissIcon />
        </button>
      ) : null}
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

export type AlertActionProps = ComponentProps<"div">;
function AlertAction({ className, ...rest }: AlertActionProps) {
  return <div className={cn("alert-action", className)} {...rest} />;
}

export const Alert = Object.assign(AlertRoot, {
  Title: AlertTitle,
  Description: AlertDescription,
  Action: AlertAction,
});
