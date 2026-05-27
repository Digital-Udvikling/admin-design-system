import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";
import { adminSelector } from "./test-setup";

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
    const root = screen.getByText("Title").closest(adminSelector("card"));
    expect(root).toHaveAdminClass("card-bordered", "card-compact");
    expect(root?.querySelectorAll(adminSelector("card-body"))).toHaveLength(1);
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("Card always renders children inside a single card-body", () => {
    render(<Card>body content</Card>);
    const body = screen.getByText("body content");
    expect(body).toHaveAdminClass("card-body");
    expect(body.parentElement).toHaveAdminClass("card");
  });

  it("wraps title and toolbar in a header when toolbar is set", () => {
    render(
      <Card
        title="Settings"
        toolbar={
          <>
            <button type="button">Edit</button>
            <button type="button" aria-label="Close">
              ×
            </button>
          </>
        }
      >
        body content
      </Card>,
    );
    const title = screen.getByRole("heading", { level: 3, name: "Settings" });
    const header = title.closest(adminSelector("card-header"));
    expect(header).toHaveAdminClass("card-header");
    const toolbar = screen.getByRole("button", { name: "Edit" }).parentElement;
    expect(toolbar).toHaveAdminClass("card-toolbar");
    expect(toolbar?.parentElement).toBe(header);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("renders title/description/actions props as the matching subparts", () => {
    render(
      <Card title="Plan" description="Pro tier" actions={<button type="button">Upgrade</button>}>
        body content
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Plan" })).toHaveAdminClass("card-title");
    expect(screen.getByText("Pro tier")).toHaveAdminClass("card-description");
    expect(screen.getByText("body content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upgrade" }).parentElement).toHaveAdminClass(
      "card-actions",
    );
  });
});
