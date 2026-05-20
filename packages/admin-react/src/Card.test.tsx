import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("Card.Container composes the bare card primitive", () => {
    render(
      <Card.Container bordered compact>
        <Card.Body>
          <Card.Title>Title</Card.Title>
          <Card.Description>Description</Card.Description>
          Body
          <Card.Actions>Actions</Card.Actions>
        </Card.Body>
      </Card.Container>,
    );
    const root = screen.getByText("Title").closest(".card");
    expect(root).toHaveClass("card-bordered", "card-compact");
    expect(root?.querySelectorAll(".card-body")).toHaveLength(1);
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("Card always renders children inside a single card-body", () => {
    render(<Card>body content</Card>);
    const body = screen.getByText("body content");
    expect(body).toHaveClass("card-body");
    expect(body.parentElement).toHaveClass("card");
  });

  it("renders title/description/actions props as the matching subparts", () => {
    render(
      <Card title="Plan" description="Pro tier" actions={<button type="button">Upgrade</button>}>
        body content
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Plan" })).toHaveClass("card-title");
    expect(screen.getByText("Pro tier")).toHaveClass("card-description");
    expect(screen.getByText("body content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upgrade" }).parentElement).toHaveClass(
      "card-actions",
    );
  });
});
