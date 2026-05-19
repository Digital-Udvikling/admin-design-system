import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Field } from "./Field";
import { Input } from "./Input";

describe("Field", () => {
  it("renders with all subparts", () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Input />
        <Field.Description>We will not share your email.</Field.Description>
        <Field.Error match={true}>Email is required.</Field.Error>
      </Field>,
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("We will not share your email.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
  });

  describe("interactions", () => {
    it("clicking the label focuses the associated Input", async () => {
      const user = userEvent.setup();
      render(
        <Field>
          <Field.Label>Email</Field.Label>
          <Input />
        </Field>,
      );
      await user.click(screen.getByText("Email"));
      expect(screen.getByRole("textbox")).toHaveFocus();
    });
  });
});
