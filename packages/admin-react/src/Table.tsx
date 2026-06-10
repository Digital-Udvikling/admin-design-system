import type { ComponentProps } from "react";
import { cn } from "./cn";

export type TableAlign = "left" | "right" | "center";

export interface TableProps extends ComponentProps<"table"> {
  striped?: boolean;
  bordered?: boolean;
  relaxed?: boolean;
  /** Pins `<thead>`; requires an overflowing ancestor (`overflow: auto` + `max-height` wrapper). */
  sticky?: boolean;
}

function TableRoot({ striped, bordered, relaxed, sticky, className, ...rest }: TableProps) {
  return (
    <table
      className={cn(
        [
          "table",
          striped && "table-striped",
          bordered && "table-bordered",
          relaxed && "table-relaxed",
          sticky && "table-sticky",
        ],
        className,
      )}
      {...rest}
    />
  );
}

export type TableHeadProps = ComponentProps<"thead">;
function TableHead({ className, ...rest }: TableHeadProps) {
  return <thead className={className} {...rest} />;
}

export type TableBodyProps = ComponentProps<"tbody">;
function TableBody({ className, ...rest }: TableBodyProps) {
  return <tbody className={className} {...rest} />;
}

export type TableFootProps = ComponentProps<"tfoot">;
function TableFoot({ className, ...rest }: TableFootProps) {
  return <tfoot className={className} {...rest} />;
}

export interface TableRowProps extends ComponentProps<"tr"> {
  /** Programmatic selection highlight — independent of the CSS rule tinting rows with a checked checkbox. */
  selected?: boolean;
  /** Applies `.table-row-link` so the first `<a>` in the row fills it; the consumer still supplies the anchor. */
  asLink?: boolean;
}
function TableRow({ selected, asLink, className, ...rest }: TableRowProps) {
  return (
    <tr
      className={cn(asLink && "table-row-link", className)}
      data-selected={selected || undefined}
      {...rest}
    />
  );
}

export interface TableHeaderCellProps extends Omit<ComponentProps<"th">, "align"> {
  align?: TableAlign;
  /** Narrow first-column gutter, mirroring the body cell `gutter` so the column lines up. */
  gutter?: boolean;
}
function TableHeaderCell({ align, gutter, className, scope, ...rest }: TableHeaderCellProps) {
  return (
    <th
      className={cn(["table-header-cell", gutter && "table-cell-gutter"], className)}
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
      className={cn(
        ["table-cell", gutter && "table-cell-gutter", numeric && "table-cell-numeric"],
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
