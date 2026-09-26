import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Item, ItemGroup } from "./Item";
import { adminSelector, RouterLink } from "./test-setup";

describe("Item", () => {
  it("renders media, title, description, and actions from shorthand", () => {
    const { container } = render(
      <Item
        media={<span data-testid="media">M</span>}
        title="Ada Lovelace"
        description="ada@example.com"
        actions={<button type="button">Edit</button>}
      />,
    );
    expect(container.querySelector(adminSelector("item"))).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toHaveAdminClass("item-title");
    expect(screen.getByText("ada@example.com")).toHaveAdminClass("item-description");
    expect(screen.getByTestId("media").parentElement).toHaveAdminClass("item-media");
    expect(screen.getByRole("button", { name: "Edit" }).parentElement).toHaveAdminClass(
      "item-actions",
    );
  });

  it("renders no wrapper for empty shorthand props", () => {
    const { container } = render(
      <Item media={false} title="" description={null} actions={false} data-testid="row" />,
    );
    expect(screen.getByTestId("row")).toBeEmptyDOMElement();
    expect(container.querySelector(adminSelector("item-content"))).toBeNull();
  });

  it("falls back to icon when media is empty", () => {
    const { container } = render(
      <Item media={false} icon={<svg data-testid="icon" />} title="x" />,
    );
    expect(screen.getByTestId("icon").parentElement).toHaveAdminClass("item-media");
    expect(container.querySelectorAll(adminSelector("item-media"))).toHaveLength(1);
  });

  it("forwards classNames to slots", () => {
    render(<Item title="Ada Lovelace" classNames={{ title: "x-custom" }} />);
    expect(screen.getByText("Ada Lovelace")).toHaveClass("x-custom");
  });

  it("applies variant, size, and asLink modifiers", () => {
    const { container } = render(<Item variant="outline" size="lg" asLink title="x" />);
    expect(container.querySelector(adminSelector("item"))).toHaveAdminClass(
      "item",
      "item-outline",
      "item-lg",
      "item-link",
    );
  });

  it("marks a selected row with data-selected", () => {
    const { container, rerender } = render(<Item selected title="x" />);
    const row = () => container.querySelector(adminSelector("item"));
    expect(row()).toHaveAttribute("data-selected");
    rerender(<Item title="x" />);
    expect(row()).not.toHaveAttribute("data-selected");
  });

  it("Item.Container renders the bare shell", () => {
    const { container } = render(<Item.Container>raw</Item.Container>);
    const root = container.querySelector(adminSelector("item"));
    expect(root).toHaveTextContent("raw");
    expect(root?.querySelector(adminSelector("item-content"))).toBeNull();
  });

  it("ItemGroup wraps a divided stack and adds the bordered modifier", () => {
    const { container } = render(
      <ItemGroup bordered>
        <Item title="A" />
        <Item title="B" />
      </ItemGroup>,
    );
    expect(container.querySelector(adminSelector("item-group"))).toHaveAdminClass(
      "item-group",
      "item-group-bordered",
    );
  });

  it("render: Item.Container renders as a router link", () => {
    render(
      <Item.Container selected render={<RouterLink href="/users/12" />}>
        <Item.Content>Ada</Item.Content>
      </Item.Container>,
    );
    const link = screen.getByRole("link", { name: "Ada" });
    expect(link).toHaveAttribute("data-router");
    expect(link).toHaveAdminClass("item");
    expect(link).toHaveAttribute("data-selected", "true");
  });
});
