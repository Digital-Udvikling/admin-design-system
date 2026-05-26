import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export type PaginationItem =
  | { type: "page"; page: number; selected: boolean }
  | { type: "previous"; page: number; disabled: boolean }
  | { type: "next"; page: number; disabled: boolean }
  | { type: "ellipsis"; key: "start" | "end" };

export interface PaginationProps extends Omit<ComponentProps<"nav">, "onChange"> {
  /** Current page, 1-based. */
  page: number;
  /** Total number of pages. */
  total: number;
  /** Called when a page number, prev, or next button is activated. */
  onPageChange: (page: number) => void;
  /** Pages shown either side of `page`. Default 1. */
  siblingCount?: number;
  /** Pages always shown at the start and end. Default 1. */
  boundaryCount?: number;
  /** Icon for the previous-page control. Defaults to a built-in chevron. */
  previousIcon?: IconProp;
  /** Icon for the next-page control. Defaults to a built-in chevron. */
  nextIcon?: IconProp;
  /** Override the renderer for one item — useful for routing libraries that
   *  expect their own Link component (Next.js, TanStack Router, etc.). */
  renderItem?: (item: PaginationItem) => ReactNode;
}

/**
 * Compute the items to render for a given `page` / `total`. Always returns:
 *   previous, ...numbers/ellipses, next
 * with `boundaryCount` items on each end and `siblingCount` items around `page`.
 * Pure: no React state, safe to call during render.
 */
export function getPaginationItems({
  page,
  total,
  siblingCount = 1,
  boundaryCount = 1,
}: {
  page: number;
  total: number;
  siblingCount?: number;
  boundaryCount?: number;
}): PaginationItem[] {
  if (total <= 0) {
    return [
      { type: "previous", page: 1, disabled: true },
      { type: "next", page: 1, disabled: true },
    ];
  }
  const clampedPage = Math.min(Math.max(1, page), total);
  const items: PaginationItem[] = [];
  items.push({ type: "previous", page: clampedPage - 1, disabled: clampedPage === 1 });

  const startPages = range(1, Math.min(boundaryCount, total));
  const endPages = range(Math.max(total - boundaryCount + 1, boundaryCount + 1), total);

  const siblingsStart = Math.max(
    Math.min(clampedPage - siblingCount, total - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(clampedPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? (endPages[0] as number) - 2 : total - 1,
  );

  const middle: (number | "ellipsis-start" | "ellipsis-end")[] = [];
  // Start ellipsis (or extra page when gap is exactly 1)
  if (siblingsStart > boundaryCount + 2) {
    middle.push("ellipsis-start");
  } else if (boundaryCount + 1 < total - boundaryCount) {
    middle.push(boundaryCount + 1);
  }

  middle.push(...range(siblingsStart, siblingsEnd));

  // End ellipsis (or extra page when gap is exactly 1)
  if (siblingsEnd < total - boundaryCount - 1) {
    middle.push("ellipsis-end");
  } else if (total - boundaryCount > boundaryCount) {
    middle.push(total - boundaryCount);
  }

  const seen = new Set<number>();
  const pushNumber = (n: number) => {
    if (n < 1 || n > total || seen.has(n)) return;
    seen.add(n);
    items.push({ type: "page", page: n, selected: n === clampedPage });
  };

  for (const n of startPages) pushNumber(n);
  for (const entry of middle) {
    if (entry === "ellipsis-start") {
      items.push({ type: "ellipsis", key: "start" });
    } else if (entry === "ellipsis-end") {
      items.push({ type: "ellipsis", key: "end" });
    } else {
      pushNumber(entry);
    }
  }
  for (const n of endPages) pushNumber(n);

  items.push({ type: "next", page: clampedPage + 1, disabled: clampedPage === total });
  return items;
}

function range(start: number, end: number): number[] {
  if (end < start) return [];
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

export function Pagination({
  page,
  total,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  previousIcon,
  nextIcon,
  renderItem,
  className,
  "aria-label": ariaLabel = "Pagination",
  ...rest
}: PaginationProps) {
  const items = getPaginationItems({ page, total, siblingCount, boundaryCount });
  const prev = previousIcon !== undefined ? renderIcon(previousIcon, 16) : <ChevronLeftIcon />;
  const next = nextIcon !== undefined ? renderIcon(nextIcon, 16) : <ChevronRightIcon />;
  return (
    <nav aria-label={ariaLabel} className={cn("pagination", className)} {...rest}>
      <ul>
        {items.map((item, i) => (
          <li key={paginationItemKey(item, i)} className={cn("page-item", undefined)}>
            {renderItem ? renderItem(item) : defaultRender(item, onPageChange, prev, next)}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function paginationItemKey(item: PaginationItem, index: number): string {
  switch (item.type) {
    case "previous":
      return "previous";
    case "next":
      return "next";
    case "ellipsis":
      return `ellipsis-${item.key}`;
    case "page":
      return `page-${item.page}`;
    default:
      return `${index}`;
  }
}

function defaultRender(
  item: PaginationItem,
  onPageChange: (n: number) => void,
  prev: ReactNode,
  next: ReactNode,
): ReactNode {
  switch (item.type) {
    case "previous":
      return (
        <button
          type="button"
          className={cn("page-link", undefined)}
          aria-label="Previous page"
          aria-disabled={item.disabled || undefined}
          disabled={item.disabled}
          onClick={() => onPageChange(item.page)}
        >
          {prev}
        </button>
      );
    case "next":
      return (
        <button
          type="button"
          className={cn("page-link", undefined)}
          aria-label="Next page"
          aria-disabled={item.disabled || undefined}
          disabled={item.disabled}
          onClick={() => onPageChange(item.page)}
        >
          {next}
        </button>
      );
    case "ellipsis":
      return (
        <span className={cn("page-ellipsis", undefined)} aria-hidden="true">
          …
        </span>
      );
    case "page":
      return (
        <button
          type="button"
          className={cn(["page-link", item.selected && "active"], undefined)}
          aria-current={item.selected ? "page" : undefined}
          aria-label={`Page ${item.page}`}
          onClick={() => onPageChange(item.page)}
        >
          {item.page}
        </button>
      );
  }
}
