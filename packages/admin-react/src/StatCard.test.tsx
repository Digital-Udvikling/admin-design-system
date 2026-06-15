import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatCard } from "./StatCard";
import { adminSelector } from "./test-setup";

describe("StatCard", () => {
  it("renders label, value, and detail", () => {
    const { container } = render(
      <StatCard label="Total Generations" value="1,234" detail="42 completed / 12 pending" />,
    );

    const root = container.querySelector(adminSelector("stat-card"));
    expect(root).toBeInTheDocument();

    const label = screen.getByText("Total Generations");
    const value = screen.getByText("1,234");
    const detail = screen.getByText("42 completed / 12 pending");

    expect(label).toHaveAdminClass("stat-card-label");
    expect(value).toHaveAdminClass("stat-card-value");
    expect(detail).toHaveAdminClass("stat-card-detail");
  });

  it("renders a card shell and maps modifiers to the shared card classes", () => {
    const { container } = render(<StatCard compact bordered value="0" />);
    const root = container.querySelector(adminSelector("stat-card"));
    expect(root).toHaveAdminClass("card", "stat-card", "card-compact", "card-bordered");
  });

  it("applies the shared card variant class on the root", () => {
    const { container } = render(<StatCard variant="success" value="0" />);
    const root = container.querySelector(adminSelector("stat-card"));
    expect(root).toHaveAdminClass("card-success");
  });

  it("renders a leading icon inside the label row", () => {
    function StarIcon() {
      return <svg data-testid="star-icon" />;
    }
    render(<StatCard label="Stars" value="42" icon={StarIcon} />);

    const icon = screen.getByTestId("star-icon");
    const label = screen.getByText("Stars");
    expect(label).toContainElement(icon);
  });

  it("omits the label row when neither label nor icon is provided", () => {
    const { container } = render(<StatCard value="42" detail="vs last week" />);
    expect(container.querySelector(adminSelector("stat-card-label"))).toBeNull();
  });

  it("derives trend intent from direction when intent is omitted", () => {
    const { container } = render(
      <StatCard value="128" trend={{ value: "+12%", direction: "up" }} />,
    );
    const trend = container.querySelector(adminSelector("stat-card-trend"));
    expect(trend).toHaveTextContent("+12%");
    expect(trend).toHaveAttribute("data-trend", "up");
    expect(trend).toHaveAttribute("data-intent", "positive");
  });

  it("keeps trend tone independent of caret direction", () => {
    const { container } = render(
      <StatCard value="0.42%" trend={{ value: "-0.18", direction: "down", intent: "positive" }} />,
    );
    const trend = container.querySelector(adminSelector("stat-card-trend"));
    expect(trend).toHaveAttribute("data-trend", "down");
    expect(trend).toHaveAttribute("data-intent", "positive");
  });
});
