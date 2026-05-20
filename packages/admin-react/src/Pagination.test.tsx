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

  it("disables previous on page 1", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} total={5} onPageChange={onPageChange} />);
    const prev = screen.getByRole("button", { name: "Previous page" });
    expect(prev).toBeDisabled();
    await user.click(prev);
    expect(onPageChange).not.toHaveBeenCalled();
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
});
