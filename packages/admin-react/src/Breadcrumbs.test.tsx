import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "./Breadcrumbs";

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
    // Two separators between three items.
    expect(nav.querySelectorAll(".breadcrumb-separator")).toHaveLength(2);
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

  it("accepts a custom aria-label", () => {
    render(
      <Breadcrumbs aria-label="Folder path">
        <Breadcrumbs.Item current>Root</Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    expect(screen.getByRole("navigation", { name: "Folder path" })).toBeInTheDocument();
  });
});
