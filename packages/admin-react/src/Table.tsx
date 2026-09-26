import type { ComponentProps, MouseEventHandler } from "react";
import { cn } from "./cn";

export type TableAlign = "left" | "right" | "center";
export type TableDensity = "compact" | "default" | "relaxed";
export type TableSort = "ascending" | "descending" | "none";

export interface TableProps extends ComponentProps<"table"> {
  striped?: boolean;
  bordered?: boolean;
  /** Cell padding. Default `"default"`. */
  density?: TableDensity;
  /** @deprecated Use `density="relaxed"`. Kept for the class-name contract. */
  relaxed?: boolean;
  /** Pins `<thead>`; requires a scrolling ancestor such as `Table.Scroll` with a `max-height`. */
  sticky?: boolean;
  /**
   * Pins the first column against horizontal scroll; requires an overflow-x ancestor such as `Table.Scroll`.
   * Put an `asLink` row's link in a later column; the pinned cell stays outside the row's hit area.
   */
  pinCol?: boolean;
}

function TableRoot({
  striped,
  bordered,
  density,
  relaxed,
  sticky,
  pinCol,
  className,
  ...rest
}: TableProps) {
  const resolvedDensity = density ?? (relaxed ? "relaxed" : "default");
  return (
    <table
      className={cn(
        [
          "table",
          striped && "table-striped",
          bordered && "table-bordered",
          resolvedDensity === "compact" && "table-compact",
          resolvedDensity === "relaxed" && "table-relaxed",
          sticky && "table-sticky",
          pinCol && "table-pin-col",
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
/** Footer rows are semibold by default; the first row gets a strong top divider against the body. */
function TableFoot({ className, ...rest }: TableFootProps) {
  return <tfoot className={className} {...rest} />;
}

export interface TableRowProps extends ComponentProps<"tr"> {
  /** Programmatic selection highlight — independent of the CSS rule tinting rows with a checked checkbox. */
  selected?: boolean;
  /**
   * Applies `.table-row-link`: the row's first `<a>` fills it.
   * The consumer still supplies the anchor; other links and controls in the row stay clickable.
   */
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
  /**
   * Makes the column sortable: wraps the children in a `table-sort` button whose indicator
   * shows this direction, and sets `aria-sort` unless `"none"`. Ordering the rows is yours.
   */
  sort?: TableSort;
  /** Click handler for the `sort` button. */
  onSort?: MouseEventHandler<HTMLButtonElement>;
}
/** Column header by default; `scope="row"` renders a row header styled as a body cell (`table-cell`). */
function TableHeaderCell({
  align,
  gutter,
  sort,
  onSort,
  className,
  scope,
  children,
  ...rest
}: TableHeaderCellProps) {
  return (
    <th
      className={cn(
        [scope === "row" ? "table-cell" : "table-header-cell", gutter && "table-cell-gutter"],
        className,
      )}
      data-align={align && align !== "left" ? align : undefined}
      scope={scope ?? "col"}
      aria-sort={sort && sort !== "none" ? sort : undefined}
      {...rest}
    >
      {sort ? (
        <button type="button" className={cn("table-sort", undefined)} onClick={onSort}>
          {children}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export interface TableCellProps extends Omit<ComponentProps<"td">, "align"> {
  align?: TableAlign;
  /** Narrow first-column gutter for row-level status icons. */
  gutter?: boolean;
  /** `text-right` + `tabular-nums` for currency/totals columns. */
  numeric?: boolean;
  /** Trailing row-actions column: shrinks to its controls, right-aligned, no block padding. */
  actions?: boolean;
}
function TableCell({ align, gutter, numeric, actions, className, ...rest }: TableCellProps) {
  return (
    <td
      className={cn(
        [
          "table-cell",
          gutter && "table-cell-gutter",
          numeric && "table-cell-numeric",
          actions && "table-cell-actions",
        ],
        className,
      )}
      data-align={align && align !== "left" ? align : undefined}
      {...rest}
    />
  );
}

export interface TableEmptyProps extends ComponentProps<"td"> {
  /** Columns to span — set to the table's column count. */
  colSpan?: number;
}
/** A centered "no results" row; renders its own `<tr>`, so drop it inside `<Table.Body>`. */
function TableEmpty({ colSpan, className, children, ...rest }: TableEmptyProps) {
  return (
    <tr>
      <td className={cn("table-empty", className)} colSpan={colSpan} {...rest}>
        {children}
      </td>
    </tr>
  );
}

/** A name is required: the region is focusable so keyboard users can scroll it, and a screen reader announces it. */
export type TableScrollProps = ComponentProps<"section"> &
  ({ "aria-label": string } | { "aria-labelledby": string });
/**
 * Scroll region for wide tables and the scrolling ancestor `sticky` and `pinCol` need; set
 * `max-height` for `sticky`. Renders a named `<section>` (a region) with `tabIndex={0}`, so it
 * scrolls by keyboard when it holds nothing focusable.
 */
function TableScroll({ className, ...rest }: TableScrollProps) {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scroll container must be focusable to scroll by keyboard (WCAG 2.1.1)
    <section tabIndex={0} className={cn("table-scroll", className)} {...rest} />
  );
}

export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Foot: TableFoot,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
  Empty: TableEmpty,
  Scroll: TableScroll,
});
