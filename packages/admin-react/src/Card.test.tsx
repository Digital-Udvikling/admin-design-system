import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders with all subparts", () => {
    render(
      <Card>
        <Card.Title>Title</Card.Title>
        <Card.Description>Description</Card.Description>
        <Card.Body>Body</Card.Body>
        <Card.Actions>Actions</Card.Actions>
      </Card>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
});
