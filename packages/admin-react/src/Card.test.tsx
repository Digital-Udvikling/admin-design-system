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

  it("applies the variant class on the card root", () => {
    render(<Card variant="danger" title="Danger zone" />);
    const root = screen
      .getByRole("heading", { level: 3, name: "Danger zone" })
      .closest(adminSelector("card"));
    expect(root).toHaveAdminClass("card-danger");
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

  it("wraps the media prop and places it before the body", () => {
    render(
      <Card media={<img src="cover.jpg" alt="Cover" />} title="Promo">
        body content
      </Card>,
    );
    const media = screen.getByRole("img", { name: "Cover" }).parentElement;
    expect(media).toHaveAdminClass("card-media");
    const body = screen.getByText("body content");
    expect(body).toHaveAdminClass("card-body");
    expect(media?.nextElementSibling).toBe(body);
  });

  it("Card.Media renders the media wrapper", () => {
    render(
      <Card.Media>
        <img src="cover.jpg" alt="Cover" />
      </Card.Media>,
    );
    expect(screen.getByRole("img", { name: "Cover" }).parentElement).toHaveAdminClass("card-media");
  });

  it("Card.Container composes the scroll region", () => {
    render(
      <Card.Container scroll>
        <Card.Header>
          <Card.Title>Activity</Card.Title>
        </Card.Header>
        <Card.Body>rows</Card.Body>
      </Card.Container>,
    );
    const root = screen.getByText("Activity").closest(adminSelector("card"));
    expect(root).toHaveAdminClass("card-scroll");
  });
});
