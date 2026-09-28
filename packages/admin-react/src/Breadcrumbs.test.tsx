import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "./Breadcrumbs";
import { adminSelector, RouterLink } from "./test-setup";

describe("Breadcrumbs", () => {
  it("renders a labelled nav landmark with items and separators between them", () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/users">Users</Breadcrumbs.Item>
        <Breadcrumbs.Item current>Detail</Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByText("Home").tagName).toBe("A");
    expect(screen.getByText("Detail")).toHaveAttribute("aria-current", "page");
    expect(nav.querySelectorAll(adminSelector("breadcrumb-separator"))).toHaveLength(2);
  });

  it("renders without an href as a non-link span", () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item current>Current</Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    const current = screen.getByText("Current");
    expect(current.tagName).toBe("SPAN");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("renders an icon at 1em so it follows the breadcrumb font size", () => {
    function Icon(props: { size?: number | string; "aria-hidden"?: boolean | "true" | "false" }) {
      return <svg data-testid="icon" width={props.size} height={props.size} />;
    }
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item href="/" icon={Icon}>
          Home
        </Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    expect(screen.getByTestId("icon")).toHaveAttribute("width", "1em");
  });

  it("accepts a custom aria-label", () => {
    render(
      <Breadcrumbs aria-label="Folder path">
        <Breadcrumbs.Item current>Root</Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    expect(screen.getByRole("navigation", { name: "Folder path" })).toBeInTheDocument();
  });

  it("render: an item renders onto a router link without href", () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item render={<RouterLink href="/orders" />}>Orders</Breadcrumbs.Item>
        <Breadcrumbs.Item current>1042</Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    const link = screen.getByRole("link", { name: "Orders" });
    expect(link).toHaveAttribute("data-router");
    expect(link).toHaveAdminClass("breadcrumb-item");
    expect(link.parentElement?.tagName).toBe("LI");
  });
});
