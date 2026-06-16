import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps, ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";

export type FieldContainerProps = ComponentProps<typeof BaseField.Root>;

/** The bare `.field` container — for layouts the default `<Field>` doesn't fit. */
function FieldContainer({ className, ...rest }: FieldContainerProps) {
  return <BaseField.Root className={cn("field", className)} {...rest} />;
}

export interface FieldProps extends FieldContainerProps {
  /** Renders as `<Field.Label>`. */
  label?: ReactNode;
  /** Renders as `<Field.Description>`. */
  description?: ReactNode;
  /**
   * Single-message error. Renders as `<Field.Error match={true}>` — shown
   * whenever the contained control fails validation. For per-`ValidityState`
   * messages, use `<Field.Container>` and compose `<Field.Error>` directly.
   */
  error?: ReactNode;
  /** Marks the label with a red asterisk via `data-required`. */
  required?: boolean;
  /** Inline layout (`.field-row`) — control beside its label; pairs with switches and single checkboxes. */
  inline?: boolean;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"label" | "description" | "error">;
}

/** Standard field — label, control (`children`), description, error. For other shapes, compose `<Field.Container>` by hand. */
function FieldRoot({
  label,
  description,
  error,
  required,
  inline,
  className,
  classNames,
  children,
  ...rest
}: FieldProps) {
  const labelEl =
    label !== undefined ? (
      <FieldLabel required={required} className={classNames?.label}>
        {label}
      </FieldLabel>
    ) : null;
  const descriptionEl =
    description !== undefined ? (
      <FieldDescription className={classNames?.description}>{description}</FieldDescription>
    ) : null;
  const errorEl =
    error !== undefined ? (
      <FieldError match={true} className={classNames?.error}>
        {error}
      </FieldError>
    ) : null;
  return (
    <FieldContainer className={cn(inline && "field-row", className)} {...rest}>
      {inline ? (
        <>
          {children}
          {labelEl}
        </>
      ) : (
        <>
          {labelEl}
          {children}
        </>
      )}
      {descriptionEl}
      {errorEl}
    </FieldContainer>
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
      className={cn("field-label", className)}
      {...rest}
    />
  );
}

export type FieldDescriptionProps = ComponentProps<typeof BaseField.Description>;

function FieldDescription({ className, ...rest }: FieldDescriptionProps) {
  return <BaseField.Description className={cn("field-description", className)} {...rest} />;
}

export type FieldErrorProps = ComponentProps<typeof BaseField.Error>;

function FieldError({ className, ...rest }: FieldErrorProps) {
  return <BaseField.Error className={cn("field-error", className)} {...rest} />;
}

export const Field = Object.assign(FieldRoot, {
  Container: FieldContainer,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
});
