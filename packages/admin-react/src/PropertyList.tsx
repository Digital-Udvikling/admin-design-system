import type { ComponentProps, ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";
import { PropertyListValue } from "./PropertyList.client";
import { hasNode } from "./slot";

export interface PropertyListProps extends Omit<ComponentProps<"section">, "title"> {
  striped?: boolean;
  /** Tightens row height and padding for very dense panels. */
  compact?: boolean;
  /** Collapses the section when every value rendered the auto em-dash fallback. */
  hideIfAllEmpty?: boolean;
  /** Section heading rendered as `<h3 class="property-list-title">`; `null`, `false` and `""` render none. */
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
      {hasNode(title) ? (
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

export const PropertyList = Object.assign(PropertyListRoot, {
  Item: PropertyListItem,
  Label: PropertyListLabel,
  Value: PropertyListValue,
});
