import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Field } from "./Field";
import { Input } from "./Input";
import { Switch } from "./Switch";
import { adminSelector } from "./test-setup";

describe("Field", () => {
  describe("shorthand", () => {
    it("renders label, the contained control, description, and error in order", () => {
      const { container } = render(
        <Field label="Email" description="We will not share your email." error="Email is required.">
          <Input />
        </Field>,
      );
      expect(screen.getByText("Email")).toHaveAdminClass("field-label");
      expect(screen.getByText("We will not share your email.")).toHaveAdminClass(
        "field-description",
      );
      expect(screen.getByText("Email is required.")).toHaveAdminClass("field-error");
      const root = container.querySelector(adminSelector("field"));
      const children = Array.from(root?.children ?? []);
      const label = screen.getByText("Email");
      const input = screen.getByRole("textbox");
      const description = screen.getByText("We will not share your email.");
      const error = screen.getByText("Email is required.");
      expect(children.indexOf(label)).toBeLessThan(children.indexOf(input));
      expect(children.indexOf(input)).toBeLessThan(children.indexOf(description));
      expect(children.indexOf(description)).toBeLessThan(children.indexOf(error));
    });

    it("marks the label as required when the prop is set", () => {
      render(
        <Field label="Email" required>
          <Input required />
        </Field>,
      );
      expect(screen.getByText("Email")).toHaveAttribute("data-required");
    });

    it("forwards classNames to slots", () => {
      render(
        <Field
          label="Email"
          description="We will not share your email."
          classNames={{ description: "x-custom" }}
        >
          <Input />
        </Field>,
      );
      expect(screen.getByText("We will not share your email.")).toHaveClass("x-custom");
    });

    it("places the control before the label and applies field-row when inline", () => {
      const { container } = render(
        <Field inline label="Email me about new orders">
          <Switch />
        </Field>,
      );
      const root = container.querySelector(adminSelector("field"));
      expect(root).toHaveAdminClass("field", "field-row");
      const children = Array.from(root?.children ?? []);
      const switchEl = container.querySelector(adminSelector("switch"));
      const labelEl = screen.getByText("Email me about new orders");
      expect(switchEl).not.toBeNull();
      expect(children.indexOf(switchEl as Element)).toBeLessThan(children.indexOf(labelEl));
    });
  });

  describe("Container (composition)", () => {
    it("renders with all subparts", () => {
      render(
        <Field.Container>
          <Field.Label>Email</Field.Label>
          <Input />
          <Field.Description>We will not share your email.</Field.Description>
          <Field.Error match={true}>Email is required.</Field.Error>
        </Field.Container>,
      );
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("We will not share your email.")).toBeInTheDocument();
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("clicking the label focuses the associated Input", async () => {
      const user = userEvent.setup();
      render(
        <Field label="Email">
          <Input />
        </Field>,
      );
      await user.click(screen.getByText("Email"));
      expect(screen.getByRole("textbox")).toHaveFocus();
    });
  });
});
