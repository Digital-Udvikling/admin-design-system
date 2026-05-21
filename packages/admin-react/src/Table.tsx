import { clsx } from "clsx";
import type { ComponentProps } from "react";

export type TableAlign = "left" | "right" | "center";

export interface TableProps extends ComponentProps<"table"> {
  striped?: boolean;
  bordered?: boolean;
  relaxed?: boolean;
  /** Pins `<thead>` while the surrounding scroll container scrolls.
   *  Requires an overflowing ancestor — wrap the table in
   *  `<div style="overflow:auto; max-height: …">`. */
  sticky?: boolean;
}

function TableRoot({ striped, bordered, relaxed, sticky, className, ...rest }: TableProps) {
  return (
    <table
      className={clsx(
        "table",
        striped && "table-striped",
        bordered && "table-bordered",
        relaxed && "table-relaxed",
        sticky && "table-sticky",
        className,
      )}
      {...rest}
    />
  );
}

export type TableHeadProps = ComponentProps<"thead">;
function TableHead({ className, ...rest }: TableHeadProps) {
  return <thead className={clsx(className)} {...rest} />;
}

export type TableBodyProps = ComponentProps<"tbody">;
function TableBody({ className, ...rest }: TableBodyProps) {
  return <tbody className={clsx(className)} {...rest} />;
}

export type TableFootProps = ComponentProps<"tfoot">;
function TableFoot({ className, ...rest }: TableFootProps) {
  return <tfoot className={clsx(className)} {...rest} />;
}

export interface TableRowProps extends ComponentProps<"tr"> {
  /** Visually marks the row as selected. Independent of the CSS rule that
   *  tints rows containing a checked checkbox — use this for programmatic
   *  selection (single-select on row click, server-driven highlight, …). */
  selected?: boolean;
  /** Applies `.table-row-link` so the first `<a>` inside the row expands to
   *  fill the row. The consumer still supplies the anchor — this just adds
   *  the CSS hook so the hit-area covers the whole row. */
  asLink?: boolean;
}
function TableRow({ selected, asLink, className, ...rest }: TableRowProps) {
  return (
    <tr
      className={clsx(asLink && "table-row-link", className)}
      data-selected={selected || undefined}
      {...rest}
    />
  );
}

export interface TableHeaderCellProps extends Omit<ComponentProps<"th">, "align"> {
  align?: TableAlign;
  /** Narrow first-column gutter — mirrors the body cell `gutter` modifier so
   *  the column lines up. Use for status-icon columns and select-all
   *  checkboxes. */
  gutter?: boolean;
}
function TableHeaderCell({ align, gutter, className, scope, ...rest }: TableHeaderCellProps) {
  return (
    <th
      className={clsx("table-header-cell", gutter && "table-cell-gutter", className)}
      data-align={align && align !== "left" ? align : undefined}
      scope={scope ?? "col"}
      {...rest}
    />
  );
}

export interface TableCellProps extends Omit<ComponentProps<"td">, "align"> {
  align?: TableAlign;
  /** Narrow first-column gutter for row-level status icons. */
  gutter?: boolean;
  /** `text-right` + `tabular-nums` for currency/totals columns. */
  numeric?: boolean;
}
function TableCell({ align, gutter, numeric, className, ...rest }: TableCellProps) {
  return (
    <td
      className={clsx(
        "table-cell",
        gutter && "table-cell-gutter",
        numeric && "table-cell-numeric",
        className,
      )}
      data-align={align && align !== "left" ? align : undefined}
      {...rest}
    />
  );
}

export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Foot: TableFoot,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
});
