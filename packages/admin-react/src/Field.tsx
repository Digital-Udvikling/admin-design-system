import { Field as BaseField } from "@base-ui/react/field";
import { clsx } from "clsx";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

/**
 * Thin wrappers around Base UI's Field primitives that apply the design
 * system's class names. Compose for fully accessible labeled form fields:
 *
 *   <Field name="email">
 *     <FieldLabel>Email</FieldLabel>
 *     <Input type="email" required />
 *     <FieldDescription>We'll never share your email</FieldDescription>
 *     <FieldError match="valueMissing">Email is required</FieldError>
 *   </Field>
 */

export type FieldProps = ComponentPropsWithoutRef<typeof BaseField.Root>;

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { className, ...rest },
  ref,
) {
  return (
    <BaseField.Root
      ref={ref}
      className={clsx("field", typeof className === "string" ? className : undefined)}
      {...rest}
    />
  );
});

export type FieldLabelProps = ComponentPropsWithoutRef<typeof BaseField.Label>;

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { className, ...rest },
  ref,
) {
  return (
    <BaseField.Label
      ref={ref}
      className={clsx("field-label", typeof className === "string" ? className : undefined)}
      {...rest}
    />
  );
});

export type FieldDescriptionProps = ComponentPropsWithoutRef<typeof BaseField.Description>;

export const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ className, ...rest }, ref) {
    return (
      <BaseField.Description
        ref={ref}
        className={clsx(
          "field-description",
          typeof className === "string" ? className : undefined,
        )}
        {...rest}
      />
    );
  },
);

export type FieldErrorProps = ComponentPropsWithoutRef<typeof BaseField.Error>;

export const FieldError = forwardRef<HTMLDivElement, FieldErrorProps>(function FieldError(
  { className, ...rest },
  ref,
) {
  return (
    <BaseField.Error
      ref={ref}
      className={clsx("field-error", typeof className === "string" ? className : undefined)}
      {...rest}
    />
  );
});
