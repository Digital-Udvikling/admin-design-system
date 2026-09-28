import {
  Children,
  Fragment,
  isValidElement,
  type ComponentProps,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { cn, type SlotClasses } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { hasNode } from "./slot";

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
  /** Renders as `<Alert.Title>`. `null`, `false` and `""` render nothing. */
  title?: ReactNode;
  /** Renders as `<Alert.Description>`. `null`, `false` and `""` render nothing. */
  description?: ReactNode;
  /** Trailing action. Renders as `<Alert.Action>` after children so reading order matches. */
  action?: ReactNode;
  /** Renders a trailing dismiss (×) button. The Alert stays stateless — the consumer hides or removes it. */
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  /** aria-label for the dismiss button. Default: "Dismiss". */
  dismissLabel?: string;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"title" | "description" | "action" | "dismiss">;
}

// Must match the block list in alert.css's stacking-gap rule.
const BLOCK_TAGS = new Set([
  "p",
  "div",
  "ul",
  "ol",
  "dl",
  "pre",
  "table",
  "form",
  "blockquote",
  "details",
]);

/** Flattens fragments so parts inside one are still found. */
function flattenChildren(children: ReactNode): ReactNode[] {
  return (
    Children.map(children, (child) =>
      isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
        ? flattenChildren(child.props.children)
        : child,
    ) ?? []
  );
}

function isPart(node: ReactNode) {
  return (
    isValidElement(node) &&
    (node.type === AlertTitle || node.type === AlertDescription || node.type === AlertAction)
  );
}

/** A part or a host block element: each is its own text-column cell. */
function isCell(node: ReactNode) {
  return (
    isPart(node) ||
    (isValidElement(node) && typeof node.type === "string" && BLOCK_TAGS.has(node.type))
  );
}

/**
 * Wraps each run of non-cell children in one `<div>`: every direct child of a grid alert is its
 * own cell, so inline markup would split across rows. `keepLead` leaves a leading `<svg>`/`<i>`
 * unwrapped for the icon column.
 */
function groupText(items: ReactNode[], keepLead: boolean): ReactNode[] {
  const out: ReactNode[] = [];
  let run: ReactNode[] = [];
  let runs = 0;
  // Keyed by run ordinal, so a part toggling before a run doesn't remount the run's children.
  const flush = () => {
    if (run.length > 0) out.push(<div key={`text-${runs++}`}>{run}</div>);
    run = [];
  };
  items.forEach((item, i) => {
    const lead =
      i === 0 && keepLead && isValidElement(item) && (item.type === "svg" || item.type === "i");
    if (lead || isCell(item)) {
      flush();
      out.push(item);
    } else {
      run.push(item);
    }
  });
  flush();
  return out;
}

function AlertRoot({
  variant,
  icon,
  title,
  description,
  action,
  onDismiss,
  dismissLabel = "Dismiss",
  classNames,
  className,
  role,
  children,
  ...rest
}: AlertProps) {
  const defaultRole = variant === "danger" || variant === "warning" ? "alert" : "status";
  const leading = renderIcon(icon);
  const hasTitle = hasNode(title);
  const hasDescription = hasNode(description);
  const hasAction = hasNode(action);
  const items = flattenChildren(children);
  // Alone, children flow as-is; beside any other slot they need grouping.
  const group =
    leading != null ||
    hasTitle ||
    hasDescription ||
    hasAction ||
    onDismiss != null ||
    items.some(isPart);
  return (
    <div
      role={role ?? defaultRole}
      className={cn(["alert", `alert-${variant}`], className)}
      {...rest}
    >
      {leading}
      {hasTitle ? <AlertTitle className={classNames?.title}>{title}</AlertTitle> : null}
      {hasDescription ? (
        <AlertDescription className={classNames?.description}>{description}</AlertDescription>
      ) : null}
      {group ? groupText(items, leading == null && !hasTitle && !hasDescription) : children}
      {hasAction ? <AlertAction className={classNames?.action}>{action}</AlertAction> : null}
      {onDismiss ? (
        <button
          type="button"
          className={cn("alert-dismiss", classNames?.dismiss)}
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

/** A `<div>`, so block content such as a list of field errors nests validly. */
export type AlertDescriptionProps = ComponentProps<"div">;
function AlertDescription({ className, ...rest }: AlertDescriptionProps) {
  return <div className={cn("alert-description", className)} {...rest} />;
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
