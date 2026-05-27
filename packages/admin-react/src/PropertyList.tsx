import { useRef, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "./cn";

// Inline SVGs match Tabler's stroke conventions (24px viewBox, stroke-width 2,
// round caps + joins, currentColor). admin-react stays icon-library-agnostic;
// consumers don't need @tabler/icons-react or the Tabler webfont.
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
  /** Reveals a copy button on every item's value cell. Per-item `copyable`
   *  on `<PropertyList.Item>` opts in for individual rows. */
  copyable?: boolean;
  /** Collapses the whole section when every item rendered the auto em-dash
   *  fallback for an empty value. */
  hideIfAllEmpty?: boolean;
  /** Optional section heading rendered as `<h3 class="property-list-title">`
   *  above the items grid. */
  title?: ReactNode;
}

function PropertyListRoot({
  striped,
  copyable,
  hideIfAllEmpty,
  title,
  className,
  children,
  ...rest
}: PropertyListProps) {
  return (
    <section
      className={cn(
        [
          "property-list",
          striped && "property-list-striped",
          copyable && "property-list-copyable",
          hideIfAllEmpty && "property-list-hide-if-empty",
        ],
        className,
      )}
      {...rest}
    >
      {title !== undefined ? (
        <h3 className={cn("property-list-title", undefined)}>{title}</h3>
      ) : null}
      <dl className={cn("property-list-items", undefined)}>{children}</dl>
    </section>
  );
}

export interface PropertyListItemProps extends Omit<ComponentProps<"dd">, "title" | "label"> {
  label?: ReactNode;
  value?: ReactNode;
  /** Right-aligns the value cell + applies `tabular-nums`. Mirrors `Table.Cell.numeric`. */
  numeric?: boolean;
  /** Opts this row into the copy affordance regardless of list-level `copyable`. */
  copyable?: boolean;
  /** Overrides the text the copy button writes to the clipboard. */
  copyValue?: string;
}

function isEmptyValue(value: ReactNode): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

// Item is a thin wrapper that emits a <dt>/<dd> pair as siblings (no host
// element). In shorthand mode it generates the subparts; in children mode it
// renders them verbatim. Either way, no extra DOM wrapper is introduced.
function PropertyListItem({
  label,
  value,
  numeric,
  copyable,
  copyValue,
  children,
  ...rest
}: PropertyListItemProps) {
  if (children !== undefined) {
    return <>{children}</>;
  }
  const empty = isEmptyValue(value);
  return (
    <>
      <PropertyListLabel>{label}</PropertyListLabel>
      <PropertyListValue
        numeric={numeric}
        copyable={copyable}
        empty={empty}
        copyValue={copyValue ?? (typeof value === "string" ? value : undefined)}
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
  /** Marks the cell as carrying an auto-rendered em-dash. The list-level
   *  `hideIfAllEmpty` collapses the section when every value is empty. */
  empty?: boolean;
  /** Overrides the text the copy button writes to the clipboard. */
  copyValue?: string;
}

function PropertyListValue({
  numeric,
  copyable,
  empty,
  copyValue,
  className,
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
        className={cn("property-list-copy", undefined)}
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
