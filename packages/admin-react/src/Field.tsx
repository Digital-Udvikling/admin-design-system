import { Field as BaseField } from "@base-ui/react/field";
import { clsx } from "clsx";
import type { ComponentProps } from "react";

/**
 * Thin wrappers around Base UI's Field primitives that apply the design
 * system's class names. Compose for fully accessible labeled form fields:
 *
 *   <Field name="email">
 *     <Field.Label>Email</Field.Label>
 *     <Input type="email" required />
 *     <Field.Description>We'll never share your email.</Field.Description>
 *     <Field.Error match="valueMissing">Email is required.</Field.Error>
 *   </Field>
 */

export type FieldProps = ComponentProps<typeof BaseField.Root>;

function FieldRoot({ className, ...rest }: FieldProps) {
  return (
    <BaseField.Root
      className={clsx("field", typeof className === "string" ? className : undefined)}
      {...rest}
    />
  );
}

export type FieldLabelProps = ComponentProps<typeof BaseField.Label> & {
  /** Renders a red asterisk after the label text via `data-required`. */
  required?: boolean;
};

function FieldLabel({ className, required, ...rest }: FieldLabelProps) {
  return (
    <BaseField.Label
      data-required={required ? "" : undefined}
      className={clsx("field-label", typeof className === "string" ? className : undefined)}
      {...rest}
    />
  );
}

export type FieldDescriptionProps = ComponentProps<typeof BaseField.Description>;

function FieldDescription({ className, ...rest }: FieldDescriptionProps) {
  return (
    <BaseField.Description
      className={clsx("field-description", typeof className === "string" ? className : undefined)}
      {...rest}
    />
  );
}

export type FieldErrorProps = ComponentProps<typeof BaseField.Error>;

function FieldError({ className, ...rest }: FieldErrorProps) {
  return (
    <BaseField.Error
      className={clsx("field-error", typeof className === "string" ? className : undefined)}
      {...rest}
    />
  );
}

export const Field = Object.assign(FieldRoot, {
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
});
