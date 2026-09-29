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
      expect(screen.getByText("Email")).toHaveAttribute("data-required", "");
    });

    it("leaves data-required off when the prop is unset, so the CSS follows the control", () => {
      render(
        <Field label="Email">
          <Input required />
        </Field>,
      );
      expect(screen.getByText("Email")).not.toHaveAttribute("data-required");
    });

    it("renders data-required=false when the prop is false, the asterisk opt-out", () => {
      render(
        <Field label="Email" required={false}>
          <Input required />
        </Field>,
      );
      expect(screen.getByText("Email")).toHaveAttribute("data-required", "false");
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

    it("marks the field invalid when error is set, so the control reddens", () => {
      const { container } = render(
        <Field label="Username" error="Username is already taken.">
          <Input />
        </Field>,
      );
      expect(container.querySelector(adminSelector("field"))).toHaveAttribute("data-invalid");
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByText("Username is already taken.")).toHaveAdminClass("field-error");
    });

    it("leaves the field valid when error is unset", () => {
      const { container } = render(
        <Field label="Username">
          <Input />
        </Field>,
      );
      expect(container.querySelector(adminSelector("field"))).not.toHaveAttribute("data-invalid");
      expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
    });

    it("lets an explicit invalid override the error-derived state", () => {
      const { container } = render(
        <Field label="Username" error="Checking…" invalid={false}>
          <Input />
        </Field>,
      );
      expect(container.querySelector(adminSelector("field"))).not.toHaveAttribute("data-invalid");
      expect(screen.getByText("Checking…")).toBeInTheDocument();
    });

    it.each([null, false, ""])(
      "renders no slot and stays valid for %j shorthand props",
      (empty) => {
        const { container } = render(
          <Field label={empty} description={empty} error={empty}>
            <Input />
          </Field>,
        );
        const root = container.querySelector(adminSelector("field"));
        expect(root).not.toHaveAttribute("data-invalid");
        expect(root?.children).toHaveLength(1);
      },
    );

    it("sets data-disabled on the label of a disabled field, the hook the CSS dims", () => {
      render(
        <Field label="Email" disabled>
          <Input />
        </Field>,
      );
      expect(screen.getByText("Email")).toHaveAttribute("data-disabled");
      expect(screen.getByRole("textbox")).toBeDisabled();
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
      expect(root).not.toHaveAdminClass("field-row-reverse");
    });

    it("applies field-row-reverse when inline and reverse", () => {
      const { container } = render(
        <Field inline reverse label="Email me about new orders">
          <Switch />
        </Field>,
      );
      expect(container.querySelector(adminSelector("field"))).toHaveAdminClass(
        "field-row",
        "field-row-reverse",
      );
    });

    it("ignores reverse without inline", () => {
      const { container } = render(
        <Field reverse label="Name">
          <Input />
        </Field>,
      );
      expect(container.querySelector(adminSelector("field"))).not.toHaveAdminClass(
        "field-row-reverse",
      );
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
    it("Field.Error without match appears only once the control fails validation", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Field.Container validationMode="onChange">
          <Field.Label>Username</Field.Label>
          <Input minLength={3} />
          <Field.Error>Must be at least 3 characters.</Field.Error>
        </Field.Container>,
      );
      expect(screen.queryByText("Must be at least 3 characters.")).toBeNull();
      await user.type(screen.getByRole("textbox"), "ab");
      expect(screen.getByText("Must be at least 3 characters.")).toBeInTheDocument();
      expect(container.querySelector(adminSelector("field"))).toHaveAttribute("data-invalid");
      await user.type(screen.getByRole("textbox"), "c");
      expect(screen.queryByText("Must be at least 3 characters.")).toBeNull();
    });

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
