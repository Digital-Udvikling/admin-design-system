import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

/**
 * Thin wrappers around Base UI's Field primitives that apply the design
 * system's class names.
 */

export type FieldContainerProps = ComponentProps<typeof BaseField.Root>;

/**
 * The bare `.field` container. Use this when the default layout doesn't fit —
 * multiple validity-keyed `<Field.Error>` messages, a control that needs to
 * sit between description and error, etc.
 */
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
  /**
   * Inline layout — control sits beside its label rather than above it.
   * Pairs with switches and single checkboxes. Applies `.field-row`.
   */
  inline?: boolean;
}

/**
 * Standard field: a `.field` container that lays out an optional label, the
 * control passed as `children`, an optional description, and an optional
 * single-message error. For anything outside that shape, use
 * `<Field.Container>` and compose by hand.
 */
function FieldRoot({
  label,
  description,
  error,
  required,
  inline,
  className,
  children,
  ...rest
}: FieldProps) {
  const labelEl = label !== undefined ? <FieldLabel required={required}>{label}</FieldLabel> : null;
  const descriptionEl =
    description !== undefined ? <FieldDescription>{description}</FieldDescription> : null;
  const errorEl = error !== undefined ? <FieldError match={true}>{error}</FieldError> : null;
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
