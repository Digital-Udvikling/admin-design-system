import { useRef, useState, type ComponentProps, type ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";

// Hand-rolled to Tabler's stroke conventions so admin-react stays icon-library-agnostic.
function CopyGlyph({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 7m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
      <path d="M15 7v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function CheckGlyph({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12l5 5l10 -10" />
    </svg>
  );
}

export interface PropertyListProps extends Omit<ComponentProps<"section">, "title"> {
  striped?: boolean;
  /** Tightens row height and padding for very dense panels. */
  compact?: boolean;
  /** Collapses the section when every value rendered the auto em-dash fallback. */
  hideIfAllEmpty?: boolean;
  /** Section heading rendered as `<h3 class="property-list-title">`. */
  title?: ReactNode;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"title" | "items">;
}

function PropertyListRoot({
  striped,
  compact,
  hideIfAllEmpty,
  title,
  className,
  classNames,
  children,
  ...rest
}: PropertyListProps) {
  return (
    <section
      className={cn(
        [
          "property-list",
          striped && "property-list-striped",
          compact && "property-list-compact",
          hideIfAllEmpty && "property-list-hide-if-empty",
        ],
        className,
      )}
      {...rest}
    >
      {title !== undefined ? (
        <h3 className={cn("property-list-title", classNames?.title)}>{title}</h3>
      ) : null}
      <dl className={cn("property-list-items", classNames?.items)}>{children}</dl>
    </section>
  );
}

export interface PropertyListItemProps extends Omit<ComponentProps<"dd">, "title" | "label"> {
  label?: ReactNode;
  value?: ReactNode;
  /** Right-aligns the value cell + applies `tabular-nums`. Mirrors `Table.Cell.numeric`. */
  numeric?: boolean;
  copyable?: boolean;
  /** Overrides the text the copy button writes to the clipboard. */
  copyValue?: string;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"label" | "copy">;
}

function isEmptyValue(value: ReactNode): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

// Emits a <dt>/<dd> sibling pair with no host element; children mode renders them verbatim.
function PropertyListItem({
  label,
  value,
  numeric,
  copyable,
  copyValue,
  classNames,
  children,
  ...rest
}: PropertyListItemProps) {
  if (children !== undefined) {
    return <>{children}</>;
  }
  const empty = isEmptyValue(value);
  return (
    <>
      <PropertyListLabel className={classNames?.label}>{label}</PropertyListLabel>
      <PropertyListValue
        numeric={numeric}
        copyable={copyable}
        empty={empty}
        copyValue={copyValue ?? (typeof value === "string" ? value : undefined)}
        classNames={classNames?.copy ? { copy: classNames.copy } : undefined}
        {...rest}
      >
        {empty ? "—" : value}
      </PropertyListValue>
    </>
  );
}

export type PropertyListLabelProps = ComponentProps<"dt">;
function PropertyListLabel({ className, ...rest }: PropertyListLabelProps) {
  return <dt className={cn("property-list-label", className)} {...rest} />;
}

export interface PropertyListValueProps extends ComponentProps<"dd"> {
  numeric?: boolean;
  copyable?: boolean;
  /** Marks an auto-rendered em-dash cell; drives the list-level `hideIfAllEmpty`. */
  empty?: boolean;
  /** Overrides the text the copy button writes to the clipboard. */
  copyValue?: string;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"copy">;
}

function PropertyListValue({
  numeric,
  copyable,
  empty,
  copyValue,
  className,
  classNames,
  children,
  ...rest
}: PropertyListValueProps) {
  const ddRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = copyValue ?? ddRef.current?.textContent?.trim() ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Permission denied or unsupported — fail silently.
    }
  }

  return (
    <dd
      ref={ddRef}
      className={cn(
        [
          "property-list-value",
          numeric && "property-list-value-numeric",
          copyable && "property-list-value-copyable",
          empty && "property-list-value-empty",
        ],
        className,
      )}
      {...rest}
    >
      {children}
      <button
        type="button"
        aria-label="Copy"
        className={cn("property-list-copy", classNames?.copy)}
        onClick={handleCopy}
        data-copied={copied ? "true" : undefined}
      >
        <CopyGlyph className={cn("property-list-copy-icon", undefined)} />
        <CheckGlyph className={cn("property-list-copy-icon-copied", undefined)} />
      </button>
    </dd>
  );
}

export const PropertyList = Object.assign(PropertyListRoot, {
  Item: PropertyListItem,
  Label: PropertyListLabel,
  Value: PropertyListValue,
});
