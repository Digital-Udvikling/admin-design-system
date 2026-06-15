import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Item, ItemGroup } from "./Item";
import { adminSelector } from "./test-setup";

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

  it("applies variant, size, and asLink modifiers", () => {
    const { container } = render(<Item variant="outline" size="lg" asLink title="x" />);
    expect(container.querySelector(adminSelector("item"))).toHaveAdminClass(
      "item",
      "item-outline",
      "item-lg",
      "item-link",
    );
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
});
