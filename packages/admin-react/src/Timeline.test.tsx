import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Timeline } from "./Timeline";
import { adminSelector } from "./test-setup";

describe("Timeline", () => {
  it("renders items with title, time, and a default dot", () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Order placed" time="14:28" />
      </Timeline>,
    );
    expect(container.querySelector("ol")).toHaveAdminClass("timeline");
    expect(screen.getByText("Order placed")).toHaveAdminClass("timeline-title");
    expect(screen.getByText("14:28")).toHaveAdminClass("timeline-time");
    expect(container.querySelector(adminSelector("timeline-dot"))).toBeInTheDocument();
  });

  it("renders a status modifier and a numbered marker", () => {
    const { container } = render(
      <Timeline numbered>
        <Timeline.Item status="success" marker="1" title="Step" />
      </Timeline>,
    );
    expect(container.querySelector("ol")).toHaveAdminClass("timeline-numbered");
    expect(container.querySelector(adminSelector("timeline-item"))).toHaveAdminClass(
      "timeline-item-success",
    );
    expect(container.querySelector(adminSelector("timeline-marker"))).toHaveTextContent("1");
  });

  it("uses an icon indicator when icon is set", () => {
    function Star(props: { size?: number | string }) {
      return <svg data-testid="star" {...props} />;
    }
    const { container } = render(
      <Timeline>
        <Timeline.Item icon={Star} title="x" />
      </Timeline>,
    );
    expect(screen.getByTestId("star")).toBeInTheDocument();
    expect(container.querySelector(adminSelector("timeline-dot"))).toBeNull();
  });
});
