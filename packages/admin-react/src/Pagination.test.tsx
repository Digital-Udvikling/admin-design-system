import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Pagination, getPaginationItems } from "./Pagination";

describe("getPaginationItems", () => {
  it("returns every page when total fits without ellipses", () => {
    const items = getPaginationItems({ page: 3, total: 5 });
    const pages = items.filter((i) => i.type === "page").map((i) => (i as { page: number }).page);
    expect(pages).toEqual([1, 2, 3, 4, 5]);
    expect(items.find((i) => i.type === "ellipsis")).toBeUndefined();
  });

  it("inserts a start ellipsis when current is far from page 1", () => {
    const items = getPaginationItems({ page: 18, total: 20 });
    const types = items.map((i) => i.type);
    expect(types).toContain("ellipsis");
    const pages = items.filter((i) => i.type === "page").map((i) => (i as { page: number }).page);
    expect(pages[0]).toBe(1);
    expect(pages.at(-1)).toBe(20);
  });

  it("inserts end ellipsis when current is near page 1", () => {
    const items = getPaginationItems({ page: 2, total: 20 });
    const ellipses = items.filter((i) => i.type === "ellipsis");
    expect(ellipses).toHaveLength(1);
    expect((ellipses[0] as { key: string }).key).toBe("end");
  });

  it("disables previous on page 1 and next on the last page", () => {
    const first = getPaginationItems({ page: 1, total: 10 });
    expect((first.find((i) => i.type === "previous") as { disabled: boolean }).disabled).toBe(true);
    expect((first.find((i) => i.type === "next") as { disabled: boolean }).disabled).toBe(false);

    const last = getPaginationItems({ page: 10, total: 10 });
    expect((last.find((i) => i.type === "next") as { disabled: boolean }).disabled).toBe(true);
  });
});

describe("Pagination", () => {
  it("renders a labelled nav with current page marked", () => {
    render(<Pagination page={3} total={5} onPageChange={() => {}} />);
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute("aria-current", "page");
  });

  it("calls onPageChange when a page button is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} total={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole("button", { name: "Page 5" }));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it("marks previous aria-disabled on page 1 and ignores activation", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} total={5} onPageChange={onPageChange} />);
    const prev = screen.getByRole("button", { name: "Previous page" });
    expect(prev).toHaveAttribute("aria-disabled", "true");
    expect(prev).not.toBeDisabled();
    await user.click(prev);
    prev.focus();
    await user.keyboard("{Enter}");
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("keeps focus on previous when paging back to page 1", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [page, setPage] = useState(2);
      return <Pagination page={page} total={5} onPageChange={setPage} />;
    }

    render(<Controlled />);
    const prev = screen.getByRole("button", { name: "Previous page" });
    prev.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
    // happy-dom keeps focus on a disabled button, so `not.toBeDisabled` is the real guard.
    expect(prev).toHaveAttribute("aria-disabled", "true");
    expect(prev).not.toBeDisabled();
    expect(prev).toHaveFocus();
  });

  it("sizes the built-in chevrons and custom icons to 1em", () => {
    function Icon(props: { size?: number | string; "aria-hidden"?: boolean | "true" | "false" }) {
      return <svg data-testid="icon" width={props.size} height={props.size} />;
    }
    render(<Pagination page={2} total={3} onPageChange={() => {}} previousIcon={Icon} />);
    const chevron = screen.getByRole("button", { name: "Next page" }).querySelector("svg");
    expect(chevron).toHaveAttribute("width", "1em");
    expect(chevron).toHaveAttribute("height", "1em");
    expect(screen.getByTestId("icon")).toHaveAttribute("width", "1em");
  });

  it("renders ellipses for large totals", () => {
    render(<Pagination page={10} total={50} onPageChange={() => {}} />);
    const nav = screen.getByRole("navigation");
    expect(within(nav).getAllByText("…")).not.toHaveLength(0);
  });

  it("round-trips through a controlled parent", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [page, setPage] = useState(1);
      return <Pagination page={page} total={5} onPageChange={setPage} />;
    }

    render(<Controlled />);
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  });

  it("forwards classNames to slots", () => {
    render(
      <Pagination page={3} total={5} onPageChange={() => {}} classNames={{ link: "x-custom" }} />,
    );
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveClass("x-custom");
  });

  it("uses the renderItem slot when provided", () => {
    render(
      <Pagination
        page={2}
        total={3}
        onPageChange={() => {}}
        renderItem={(item) => {
          if (item.type === "page") {
            return (
              <a data-testid={`link-${item.page}`} href={`?page=${item.page}`}>
                {item.page}
              </a>
            );
          }
          return null;
        }}
      />,
    );
    expect(screen.getByTestId("link-1")).toHaveAttribute("href", "?page=1");
    expect(screen.getByTestId("link-2")).toHaveAttribute("href", "?page=2");
    expect(screen.getByTestId("link-3")).toHaveAttribute("href", "?page=3");
  });

  it("passes renderItem the default classes, ARIA and content to spread", () => {
    render(
      <Pagination
        page={1}
        total={10}
        onPageChange={() => {}}
        classNames={{ link: "x-link" }}
        renderItem={(item, { children, ...props }) =>
          item.type === "ellipsis" ? (
            <span data-testid="ellipsis" {...props}>
              {children}
            </span>
          ) : (
            <a {...props} href={`?p=${item.page}`}>
              {children}
            </a>
          )
        }
      />,
    );
    const current = screen.getByRole("link", { name: "Page 1" });
    expect(current).toHaveAdminClass("pagination-link");
    expect(current).not.toHaveAdminClass("active");
    expect(current).toHaveClass("x-link");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveTextContent("1");

    const prev = screen.getByRole("link", { name: "Previous page" });
    expect(prev).toHaveAdminClass("pagination-link");
    expect(prev).toHaveAttribute("aria-disabled", "true");
    expect(prev.querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("link", { name: "Next page" })).not.toHaveAttribute("aria-disabled");

    const ellipsis = screen.getByTestId("ellipsis");
    expect(ellipsis).toHaveAdminClass("pagination-ellipsis");
    expect(ellipsis).toHaveAttribute("aria-hidden", "true");
    expect(ellipsis).toHaveTextContent("…");
  });
});
