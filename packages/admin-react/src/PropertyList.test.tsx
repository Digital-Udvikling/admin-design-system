import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PropertyList } from "./PropertyList";
import { adminSelector } from "./test-setup";

describe("PropertyList", () => {
  it("renders title, labels, and values with shorthand props", () => {
    render(
      <PropertyList title="Status & ansvar">
        <PropertyList.Item label="Lifecyklus" value="A" />
        <PropertyList.Item label="Status" value="20" />
      </PropertyList>,
    );
    const root = screen
      .getByRole("heading", { level: 3, name: "Status & ansvar" })
      .closest(adminSelector("property-list"));
    expect(root).toHaveAdminClass("property-list");
    expect(screen.getByRole("heading", { level: 3, name: "Status & ansvar" })).toHaveAdminClass(
      "property-list-title",
    );
    expect(screen.getByText("Lifecyklus")).toHaveAdminClass("property-list-label");
    expect(screen.getByText("A")).toHaveAdminClass("property-list-value");
  });

  it("emits modifier classes on the root", () => {
    render(
      <PropertyList striped compact hideIfAllEmpty data-testid="root">
        <PropertyList.Item label="X" value="Y" />
      </PropertyList>,
    );
    expect(screen.getByTestId("root")).toHaveAdminClass(
      "property-list",
      "property-list-striped",
      "property-list-compact",
      "property-list-hide-if-empty",
    );
  });

  it("PropertyList.Item forwards numeric and copyable modifiers to the value cell", () => {
    render(
      <PropertyList>
        <PropertyList.Item label="Total" value="$129" numeric data-testid="numeric" />
        <PropertyList.Item label="EAN" value="4005176923197" copyable data-testid="copyable" />
      </PropertyList>,
    );
    expect(screen.getByTestId("numeric")).toHaveAdminClass(
      "property-list-value",
      "property-list-value-numeric",
    );
    expect(screen.getByTestId("copyable")).toHaveAdminClass(
      "property-list-value",
      "property-list-value-copyable",
    );
  });

  it("renders an em-dash for null/undefined/empty shorthand values and marks the value as empty", () => {
    render(
      <PropertyList>
        <PropertyList.Item label="Null" value={null} data-testid="null" />
        <PropertyList.Item label="Undefined" data-testid="undef" />
        <PropertyList.Item label="Empty" value="" data-testid="empty" />
        <PropertyList.Item label="Whitespace" value="   " data-testid="ws" />
        <PropertyList.Item label="Filled" value="x" data-testid="filled" />
      </PropertyList>,
    );
    for (const id of ["null", "undef", "empty", "ws"]) {
      const value = screen.getByTestId(id);
      expect(value).toHaveAdminClass("property-list-value-empty");
      expect(value.textContent).toContain("—");
    }
    expect(screen.getByTestId("filled")).not.toHaveAdminClass("property-list-value-empty");
  });

  it("clicking the copy button writes the value to the clipboard and flips data-copied", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(
      <PropertyList>
        <PropertyList.Item label="EAN" value="4005176923197" copyable data-testid="value" />
      </PropertyList>,
    );

    const button = screen.getByRole("button", { name: "Copy" });
    expect(button).not.toHaveAttribute("data-copied");
    button.click();
    await Promise.resolve();
    expect(writeText).toHaveBeenCalledWith("4005176923197");
    await screen.findByRole("button", { name: "Copy" });
    expect(button).toHaveAttribute("data-copied", "true");
  });

  it("children form: Item renders user-supplied Label and Value subparts directly with no wrapper", () => {
    render(
      <PropertyList data-testid="root">
        <PropertyList.Item>
          <PropertyList.Label>Custom</PropertyList.Label>
          <PropertyList.Value>rich</PropertyList.Value>
        </PropertyList.Item>
      </PropertyList>,
    );
    const dl = screen.getByTestId("root").querySelector("dl");
    expect(dl?.children).toHaveLength(2);
    expect(screen.getByText("Custom")).toHaveAdminClass("property-list-label");
    expect(screen.getByText("rich")).toHaveAdminClass("property-list-value");
  });

  it("forwards classNames to slots", () => {
    render(
      <PropertyList title="Heading" classNames={{ title: "x-custom" }}>
        <PropertyList.Item label="X" value="Y" />
      </PropertyList>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Heading" })).toHaveClass("x-custom");
  });

  it("title prop is optional — list renders without a heading", () => {
    render(
      <PropertyList data-testid="root">
        <PropertyList.Item label="X" value="Y" />
      </PropertyList>,
    );
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByTestId("root").querySelector("dl")).toBeInTheDocument();
  });
});
